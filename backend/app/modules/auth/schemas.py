from typing import Optional
from pydantic import BaseModel, EmailStr

class RegisterStart(BaseModel):
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str

class SetPasswordRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    is_verified: bool
    model_config = ConfigDict(from_attributes=True)
