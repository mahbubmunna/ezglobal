import asyncio
import sys
import os

# Ensure the app module can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import select
from app.db.session import AsyncSessionLocal
from app.db.models.users import User
from app.core.security import get_password_hash

async def create_admin():
    async with AsyncSessionLocal() as session:
        email = "admin@ezglobal.com"
        password = "AdminPassword123!"
        
        # Check if admin exists
        stmt = select(User).where(User.email == email)
        result = await session.execute(stmt)
        admin_user = result.scalar_one_or_none()
        
        if admin_user:
            print(f"User {email} already exists! Updating password...")
            admin_user.hashed_password = get_password_hash(password)
            admin_user.role = "admin"
            admin_user.is_verified = True
            session.add(admin_user)
            await session.commit()
            print("Admin password updated successfully.")
        else:
            print(f"Creating new admin user {email}...")
            new_admin = User(
                email=email,
                first_name="Super",
                last_name="Admin",
                is_verified=True,
                role="admin",
                hashed_password=get_password_hash(password)
            )
            session.add(new_admin)
            await session.commit()
            print("Admin user created successfully.")

if __name__ == "__main__":
    asyncio.run(create_admin())
