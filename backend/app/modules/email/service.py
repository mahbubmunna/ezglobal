from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from pathlib import Path

# Config setup
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=True
)

class EmailService:
    async def send_email(self, email_to: str, subject: str, body: str):
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=body,
            subtype=MessageType.html
        )
        
        fm = FastMail(conf)
        await fm.send_message(message)

    async def send_otp_email(self, email_to: str, otp: str):
        subject = "Your Verification Code - EZGlobal"
        body = f"""
        <html>
            <body>
                <p>Hello,</p>
                <p>Your verification code is: <strong>{otp}</strong></p>
                <p>This code will expire in 10 minutes.</p>
                <br>
                <p>Best Regards,</p>
                <p>EZGlobal Team</p>
            </body>
        </html>
        """
        await self.send_email(email_to, subject, body)

email_service = EmailService()
