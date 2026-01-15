from typing import Annotated
from fastapi import Depends, HTTPException, status, Request
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.db.session import get_db
from app.modules.users.service import get_user_by_email
from app.db.models.users import User

async def get_token_from_cookie(request: Request) -> str:
    token = request.cookies.get("access_token")
    if not token:
        # Fallback to header if needed or just fail
        # But we format cookie as "Bearer <token>" in set_cookie?
        # In routes: response.set_cookie(key="access_token", value=f"Bearer {access_token}", ...)
        # So we need to strip "Bearer " prefix if present.
        # But wait, usually cookie is just the token.
        # I set it as f"Bearer {access_token}". 
        # So I need to parse it or just set raw token.
        # It's cleaner to set raw token in cookie.
        # Let's check routes.py.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    
    if token.startswith("Bearer "):
        token = token.split(" ")[1]
    return token

async def get_current_user(token: Annotated[str, Depends(get_token_from_cookie)], session: Annotated[AsyncSession, Depends(get_db)]) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_email(session, email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if not current_user.is_verified:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
