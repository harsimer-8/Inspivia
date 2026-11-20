from __future__ import annotations

import logging
import re
import zlib
from pathlib import Path
from typing import Iterable

from sqlalchemy import Engine, MetaData, create_engine, text
from sqlalchemy.orm import sessionmaker

from app.config import Settings

logger = logging.getLogger(__name__)
_MIGRATION_FILE = re.compile(r"^V(?P<version>\d+)__(?P<description>.+)\.sql$")
_MIGRATION_LOCK = 7_140_029_613


def build_engine(settings: Settings) -> Engine:
    return create_engine(settings.database_url(), pool_pre_ping=True, pool_size=5, max_overflow=10)


def session_factory(engine: Engine) -> sessionmaker:
    return sessionmaker(bind=engine, expire_on_commit=False)


def migration_directory() -> Path:
    candidates = (
        Path(__file__).parent.parent / "migrations",
        Path(__file__).parent.parent / "src" / "main" / "resources" / "db" / "migration",
    )
    for candidate in candidates:
        if candidate.is_dir():
            return candidate
    raise RuntimeError("Database migration directory is missing")


def migration_files(directory: Path | None = None) -> Iterable[tuple[int, str, Path]]:
    root = directory or migration_directory()
    files = []
    for path in root.glob("V*__*.sql"):
        match = _MIGRATION_FILE.match(path.name)
        if match:
            files.append((int(match.group("version")), match.group("description"), path))
    return sorted(files, key=lambda item: item[0])


def split_sql_statements(source: str) -> list[str]:
    """Split migration SQL without breaking quoted text, identifiers, or comments."""
    statements: list[str] = []
    current: list[str] = []
    quote: str | None = None
    dollar_quote: str | None = None
    line_comment = False
    block_depth = 0
    has_sql = False
    index = 0

    while index < len(source):
        char = source[index]
        following = source[index + 1] if index + 1 < len(source) else ""

        if line_comment:
            current.append(char)
            line_comment = char != "\n"
            index += 1
            continue
        if block_depth:
            if char == "/" and following == "*":
                current.extend((char, following))
                block_depth += 1
                index += 2
            elif char == "*" and following == "/":
                current.extend((char, following))
                block_depth -= 1
                index += 2
            else:
                current.append(char)
                index += 1
            continue
        if dollar_quote is not None:
            if source.startswith(dollar_quote, index):
                current.append(dollar_quote)
                index += len(dollar_quote)
                dollar_quote = None
            else:
                current.append(char)
                index += 1
            continue
        if quote is not None:
            current.append(char)
            if char == "\\" and following:
                current.append(following)
                index += 2
                continue
            if char == quote:
                if following == quote:
                    current.append(following)
                    index += 2
                    continue
                quote = None
            index += 1
            continue

        if char == "-" and following == "-":
            current.extend((char, following))
            line_comment = True
            index += 2
        elif char == "/" and following == "*":
            current.extend((char, following))
            block_depth = 1
            index += 2
        elif char in {"'", '"'}:
            current.append(char)
            quote = char
            has_sql = True
            index += 1
        elif char == "$":
            match = re.match(r"\$(?:[A-Za-z_][A-Za-z_0-9]*)?\$", source[index:])
            if match:
                dollar_quote = match.group()
                current.append(dollar_quote)
                has_sql = True
                index += len(dollar_quote)
            else:
                current.append(char)
                has_sql = True
                index += 1
        elif char == ";":
            current.append(char)
            if has_sql:
                statements.append("".join(current))
            current = []
            has_sql = False
            index += 1
        else:
            current.append(char)
            if not char.isspace():
                has_sql = True
            index += 1

    if has_sql:
        statements.append("".join(current))
    if quote is not None or dollar_quote is not None or block_depth:
        raise ValueError("Unterminated quoted value or comment in migration SQL")
    return statements


def run_migrations(engine: Engine, directory: Path | None = None) -> None:
    """Apply the unchanged Flyway-style SQL files and maintain Flyway-compatible history."""
    with engine.begin() as connection:
        connection.execute(text("SELECT pg_advisory_xact_lock(:lock_id)"), {"lock_id": _MIGRATION_LOCK})
        connection.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS flyway_schema_history (
                    installed_rank INTEGER PRIMARY KEY,
                    version VARCHAR(50),
                    description VARCHAR(200) NOT NULL,
                    type VARCHAR(20) NOT NULL,
                    script VARCHAR(1000) NOT NULL,
                    checksum INTEGER,
                    installed_by VARCHAR(100) NOT NULL DEFAULT current_user,
                    installed_on TIMESTAMP NOT NULL DEFAULT now(),
                    execution_time INTEGER NOT NULL,
                    success BOOLEAN NOT NULL
                )
                """
            )
        )
        rows = connection.execute(
            text("SELECT version, success FROM flyway_schema_history WHERE version IS NOT NULL")
        ).all()
        applied = {str(version): bool(success) for version, success in rows}
        failed = sorted(version for version, success in applied.items() if not success)
        if failed:
            raise RuntimeError(f"Database contains failed migrations: {', '.join(failed)}")

    for version, description, path in migration_files(directory):
        version_text = str(version)
        with engine.begin() as connection:
            connection.execute(text("SELECT pg_advisory_xact_lock(:lock_id)"), {"lock_id": _MIGRATION_LOCK})
            exists = connection.execute(
                text("SELECT success FROM flyway_schema_history WHERE version = :version"),
                {"version": version_text},
            ).scalar_one_or_none()
            if exists is not None:
                if not exists:
                    raise RuntimeError(f"Database migration V{version_text} previously failed")
                continue
            sql = path.read_text(encoding="utf-8")
            try:
                for statement in split_sql_statements(sql):
                    connection.exec_driver_sql(statement)
                rank = connection.execute(
                    text("SELECT COALESCE(MAX(installed_rank), 0) + 1 FROM flyway_schema_history")
                ).scalar_one()
                checksum = zlib.crc32(path.read_bytes())
                if checksum >= 2**31:
                    checksum -= 2**32
                connection.execute(
                    text(
                        """
                        INSERT INTO flyway_schema_history
                            (installed_rank, version, description, type, script, checksum,
                             installed_by, execution_time, success)
                        VALUES (:rank, :version, :description, 'SQL', :script, :checksum,
                                current_user, 0, TRUE)
                        """
                    ),
                    {
                        "rank": rank,
                        "version": version_text,
                        "description": description.replace("_", " "),
                        "script": path.name,
                        "checksum": checksum,
                    },
                )
            except Exception:
                logger.exception("Database migration V%s failed", version_text)
                raise RuntimeError(f"Database migration V{version_text} failed; details are in server logs") from None
        logger.info("Applied database migration V%s", version_text)


def reflect_schema(engine: Engine) -> MetaData:
    metadata = MetaData()
    metadata.reflect(bind=engine, schema="public")
    return metadata
