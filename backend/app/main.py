from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/")
def root():
    return {"message": "Welcome to Ez global API"}

from app.modules.auth.routes import router as auth_router
from app.modules.applications.routes import router as applications_router
from app.modules.admin.routes import router as admin_router
from app.modules.ai_review.routes import router as ai_review_router

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(applications_router, prefix=f"{settings.API_V1_STR}/applications", tags=["applications"])
app.include_router(admin_router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(ai_review_router, prefix=f"{settings.API_V1_STR}/applications", tags=["ai_review"])

