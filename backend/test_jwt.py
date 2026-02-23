import asyncio
import sys
import os
from jose import jwt, JWTError
sys.path.append(os.getcwd())

from app.core.config import settings

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzE3NjA0MDEsInN1YiI6Im1obXVubmE4OEBnbWFpbC5jb20iLCJ0eXBlIjoiYWNjZXNzIn0.CJ4OiZ5V2qM6GdDuqaozt_bDmUzjurWspc4MPP7G210"

print(f"Secret: {settings.SECRET_KEY}")
print(f"Algorithm: {settings.ALGORITHM}")

try:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    print(f"Decoded payload: {payload}")
except JWTError as e:
    print(f"JWTError: {e}")
except Exception as e:
    print(f"Other Error: {type(e).__name__} {e}")
