from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.users import User, UserCreate, UserUpdate
from app.core.security import get_password_hash

async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    return result.scalars().first()

async def create_user(session: AsyncSession, user_create: UserCreate) -> User:
    db_user = User(
        email=user_create.email,
        hashed_password=get_password_hash(user_create.password),
        first_name=user_create.first_name,
        middle_name=user_create.middle_name,
        last_name=user_create.last_name,
        is_verified=user_create.is_verified
    )
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user

async def update_user(session: AsyncSession, db_user: User, user_update: UserUpdate) -> User:
    user_data = user_update.model_dump(exclude_unset=True)
    for key, value in user_data.items():
        if key == "password":
            setattr(db_user, "hashed_password", get_password_hash(value))
        else:
            setattr(db_user, key, value)
    
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user
