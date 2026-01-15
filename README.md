# Auth Phase 0 (FastAPI + Next.js)

This project implements a production-ready Authentication system with FastAPI (Backend) and Next.js (Frontend).

## Features
- **Registration**: Multi-step flow (Personal Info -> Email Verification -> Password Creation).
- **Login**: Email/Password with HttpOnly Cookies.
- **Dashboard**: Protected route.
- **Security**: JWT Access/Refresh tokens, bcrypt, secure cookies.
- **Tech Stack**: FastAPI, SQLAlchemy (Async), Pydantic v2, Next.js App Router, Zustand, Tailwind CSS.

## Prerequisites
- Docker & Docker Compose
- OR Python 3.11+ and Node.js 18+ and PostgreSQL

## How to Run (Local - Recommended)

### Backend
1. **Prerequisites**: Ensure PostgreSQL is running and a database named `app` exists.
   ```bash
   # Example: Create DB if you have psql installed
   createdb -h localhost -U postgres app
   ```
2. **Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Configuration**:
   - Check `backend/.env` to ensure `POSTGRES_*` credentials match your local setup.
4. **Migrations**:
   ```bash
   # If you have alembic set up
   alembic upgrade head
   ```
5. **Run**:
   ```bash
   uvicorn app.main:app --reload
   ```
   API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend
1. **Setup**:
   ```bash
   cd frontend
   npm install
   ```
2. **Run**:
   ```bash
   npm run dev
   ```
   App: [http://localhost:3000](http://localhost:3000)

## How to Run (Docker - Optional)
If you prefer using Docker:
1. `docker-compose up --build`
2. Frontend: http://localhost:3000
3. Backend: http://localhost:8000/docs

## Testing
1. `cd backend`
2. `pytest`
