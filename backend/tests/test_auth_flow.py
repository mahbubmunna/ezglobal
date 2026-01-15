import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_registration_flow(client: AsyncClient):
    email = "test@example.com"
    password = "securepassword123"
    
    # 1. Start Registration
    response = await client.post("/api/v1/auth/register/start", json={
        "first_name": "Test",
        "last_name": "User",
        "email": email
    })
    assert response.status_code == 200
    assert response.json()["message"] == "OTP sent to email"
    
    # 2. Verify OTP (We need to check logic, but we can't easily peek console. 
    # For now in test environment, we might need to mock OTP service or just assume correct if we can peek DB.
    # But we will use the full flow test which does it properly.
    assert True
    # Wait, getting code from DB:

@pytest.mark.asyncio
async def test_full_flow(client: AsyncClient, db_session):
    from sqlalchemy import select
    from app.db.models.otp import OTP
    
    email = "flow@example.com"
    
    # 1. Start
    res1 = await client.post("/api/v1/auth/register/start", json={
        "first_name": "Flow",
        "last_name": "User",
        "email": email
    })
    assert res1.status_code == 200
    
    # 2. Get OTP from DB
    result = await db_session.execute(select(OTP).where(OTP.email == email))
    otp_record = result.scalars().first()
    assert otp_record is not None
    code = otp_record.code
    
    # 3. Verify OTP
    res2 = await client.post("/api/v1/auth/register/verify-otp", json={
        "email": email,
        "code": code
    })
    assert res2.status_code == 200
    
    # 4. Set Password
    res3 = await client.post("/api/v1/auth/register/set-password", json={
        "email": email,
        "password": "password123"
    })
    assert res3.status_code == 200
    assert "access_token" in res3.cookies
    
    # 5. Get Me (using cookies from client state)
    res4 = await client.get("/api/v1/auth/me")
    assert res4.status_code == 200
    assert res4.json()["email"] == email
    
    # 6. Logout
    res5 = await client.post("/api/v1/auth/logout")
    assert res5.status_code == 200
    assert "access_token" not in res5.cookies # Or cookies are cleared/expired. 
    # httpx client handles cookie jar. delete_cookie sets expiry to past.
    
    # 7. Get Me should fail
    res6 = await client.get("/api/v1/auth/me")
    assert res6.status_code == 401
