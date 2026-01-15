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

## How to Run (Docker)

1. **Start the services**:
   ```bash
   docker-compose up --build
   ```
2. **Access the App**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

3. **Database Migration**:
   The database tables need to be created. You can run Alembic migrations inside the container:
   ```bash
   docker-compose exec backend alembic revision --autogenerate -m "Initial migration"
   docker-compose exec backend alembic upgrade head
   ```
   *Note: Ensure you initialized alembic first if strictly following migration path, but for Phase 0, we can also use `table=True` in SQLModel which we did, but SQLAlchemy still needs to create them. A script `app/prestart.sh` or manual migration is needed.*
   
   *Alternative check:* The code uses `SQLModel` which can create tables via `create_all`, but we set up for Alembic.

## Local Manual Run

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Ensure Postgres is running and update `.env`.
4. Run migrations (or simple table creation script).
5. `uvicorn app.main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Testing
1. `cd backend`
2. `pytest`
