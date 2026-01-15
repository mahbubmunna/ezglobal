from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class OTP(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    code: str
    purpose: str = "registration"  # registration, password_reset, etc.
    expires_at: datetime
    is_used: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
