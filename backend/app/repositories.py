from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from sqlalchemy import Engine, and_, delete, insert, select, update

from app.models import MIGRATION_OWNED_TABLES, SchemaModel


class SqlRepository:
    """Bounded CRUD adapter for an explicitly migration-owned table."""

    def __init__(self, engine: Engine, model: SchemaModel):
        if model.name not in MIGRATION_OWNED_TABLES:
            raise ValueError(f"Table '{model.name}' is not an allowed backend model")
        self.engine = engine
        self.model = model
        self.table = model.table

    def get(self, identity: Any) -> dict[str, Any] | None:
        conditions = self._identity_conditions(identity)
        with self.engine.connect() as connection:
            row = connection.execute(select(self.table).where(and_(*conditions))).mappings().one_or_none()
            return dict(row) if row is not None else None

    def create(self, values: Mapping[str, Any]) -> dict[str, Any]:
        self._validate_columns(values)
        with self.engine.begin() as connection:
            result = connection.execute(insert(self.table).values(**dict(values)).returning(self.table))
            return dict(result.mappings().one())

    def update(self, identity: Any, values: Mapping[str, Any]) -> dict[str, Any] | None:
        self._validate_columns(values)
        conditions = self._identity_conditions(identity)
        with self.engine.begin() as connection:
            result = connection.execute(
                update(self.table).where(and_(*conditions)).values(**dict(values)).returning(self.table)
            )
            row = result.mappings().one_or_none()
            return dict(row) if row is not None else None

    def delete(self, identity: Any) -> bool:
        conditions = self._identity_conditions(identity)
        with self.engine.begin() as connection:
            result = connection.execute(delete(self.table).where(and_(*conditions)))
            return result.rowcount == 1

    def list(self, *, filters: Mapping[str, Any] | None = None, offset: int = 0, limit: int = 100) -> list[dict[str, Any]]:
        if offset < 0 or not 1 <= limit <= 500:
            raise ValueError("offset must be non-negative and limit must be between 1 and 500")
        filters = filters or {}
        self._validate_columns(filters)
        statement = select(self.table)
        if filters:
            statement = statement.where(
                and_(*(self.table.c[name] == value for name, value in filters.items()))
            )
        with self.engine.connect() as connection:
            rows = connection.execute(statement.offset(offset).limit(limit)).mappings().all()
            return [dict(row) for row in rows]

    def _identity_conditions(self, identity: Any) -> list[Any]:
        keys = tuple(self.table.primary_key.columns)
        if not keys:
            raise ValueError(f"Table '{self.model.name}' has no primary key")
        if len(keys) == 1:
            values = (identity,)
        elif isinstance(identity, Mapping):
            if set(identity) != {column.name for column in keys}:
                raise ValueError("Composite identity must provide every primary-key column")
            values = tuple(identity[column.name] for column in keys)
        elif isinstance(identity, (tuple, list)) and len(identity) == len(keys):
            values = tuple(identity)
        else:
            raise ValueError(f"Table '{self.model.name}' requires a composite identity")
        return [column == value for column, value in zip(keys, values, strict=True)]

    def _validate_columns(self, values: Mapping[str, Any]) -> None:
        unknown = set(values) - set(self.table.columns.keys())
        if unknown:
            raise ValueError(f"Unknown column(s) for {self.model.name}: {', '.join(sorted(unknown))}")


class RepositoryRegistry:
    def __init__(self, engine: Engine, metadata: Any):
        self.engine = engine
        self.metadata = metadata

    def for_table(self, table_name: str) -> SqlRepository:
        if table_name not in MIGRATION_OWNED_TABLES:
            raise ValueError("Unknown or non-migration-owned table")
        model = SchemaModel.from_metadata(self.metadata, table_name)
        return SqlRepository(self.engine, model)
