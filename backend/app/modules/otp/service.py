import random
import string
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.otp import OTP

OTP_EXPIRY_MINUTES = 10

def generate_otp_code(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))

async def create_otp(session: AsyncSession, email: str, purpose: str = "registration") -> OTP:
    # Invalidate previous OTPs for this email/purpose
    # Or just let them exist but create a new one. 
    # Better to maybe cleaner to ignore old ones or have them expire.
    # We will just create a new one.
    
    code = generate_otp_code()
    expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
    
    otp = OTP(
        email=email,
        code=code,
        purpose=purpose,
        expires_at=expires_at
    )
    session.add(otp)
    await session.commit()
    await session.refresh(otp)
    return otp

async def verify_otp(session: AsyncSession, email: str, code: str, purpose: str) -> bool:
    statement = select(OTP).where(
        OTP.email == email,
        OTP.code == code,
        OTP.purpose == purpose,
        OTP.is_used == False,
        OTP.expires_at > datetime.utcnow()
    )
    result = await session.execute(statement)
    otp = result.scalars().first()
    
    if otp:
        otp.is_used = True
        session.add(otp)
        await session.commit()
        return True
    return False
