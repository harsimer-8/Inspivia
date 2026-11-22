from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

from app.config import Settings

logger = logging.getLogger(__name__)


class EmailService:
    """Best-effort SMTP helper; message delivery failures do not block callers."""

    def __init__(self, settings: Settings):
        self.settings = settings

    def send_verification_email(self, to_email: str, token: str) -> None:
        link = f"{self.settings.frontend_base_url.rstrip('/')}/auth/verify-email?token={token}"
        self._send(
            to_email,
            "Verify your Inspivia account",
            f"Welcome to Inspivia! Please verify your email by clicking the link:\n{link}",
        )

    def send_password_reset_email(self, to_email: str, token: str) -> None:
        link = f"{self.settings.frontend_base_url.rstrip('/')}/auth/reset-password?token={token}"
        self._send(
            to_email,
            "Reset your Inspivia password",
            f"You requested a password reset. Click the link below to set a new password:\n{link}",
        )

    def send_notification_email(self, to_email: str, subject: str, body: str) -> None:
        self._send(to_email, subject, body)

    def _send(self, to_email: str, subject: str, body: str) -> None:
        message = EmailMessage()
        message["From"] = self.settings.mail_from
        message["To"] = to_email
        message["Subject"] = subject
        message.set_content(body)
        try:
            with smtplib.SMTP(
                self.settings.mail_host, self.settings.mail_port, timeout=10
            ) as smtp:
                if self.settings.mail_username:
                    smtp.login(self.settings.mail_username, self.settings.mail_password)
                smtp.send_message(message)
        except Exception as error:
            logger.warning("Email delivery failed (%s); continuing without blocking", type(error).__name__)
