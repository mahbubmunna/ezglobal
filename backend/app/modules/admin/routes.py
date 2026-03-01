from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel

from app.db.session import get_db
from app.modules.auth.dependencies import get_current_admin_user
from app.db.models.users import User
from app.db.models.applications import Application, Stakeholder, Document
from app.modules.applications import schemas as app_schemas

router = APIRouter()

class ApplicationStatusUpdate(BaseModel):
    status: str
    ai_review_notes: Optional[str] = None

@router.get("/applications", response_model=List[app_schemas.ApplicationResponse])
async def get_all_applications(
    current_admin: Annotated[User, Depends(get_current_admin_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
    status: Optional[str] = None
):
    query = select(Application).order_by(Application.created_at.desc())
    if status is not None:
        query = query.where(Application.status == status)
        
    result = await session.execute(query)
    db_apps = result.scalars().all()
    
    response_list = []
    for app in db_apps:
        st_result = await session.execute(select(Stakeholder).where(Stakeholder.application_id == app.id))
        stakeholders = st_result.scalars().all()
        
        doc_result = await session.execute(select(Document).where(Document.application_id == app.id))
        documents = doc_result.scalars().all()
        
        app_data = app.model_dump()
        app_data["stakeholders"] = [st.model_dump() for st in stakeholders]
        app_data["documents"] = [doc.model_dump() for doc in documents]
        response_list.append(app_data)
        
    return response_list

@router.get("/applications/{app_id}", response_model=app_schemas.ApplicationResponse)
async def get_application_details(
    app_id: int,
    current_admin: Annotated[User, Depends(get_current_admin_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    result = await session.execute(select(Application).where(Application.id == app_id))
    db_app = result.scalars().first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    st_result = await session.execute(select(Stakeholder).where(Stakeholder.application_id == app_id))
    stakeholders = st_result.scalars().all()
    
    doc_result = await session.execute(select(Document).where(Document.application_id == app_id))
    documents = doc_result.scalars().all()
    
    app_data = db_app.model_dump()
    app_data["stakeholders"] = [st.model_dump() for st in stakeholders]
    app_data["documents"] = [doc.model_dump() for doc in documents]
    
    return app_data

@router.put("/applications/{app_id}/status")
async def update_application_status(
    app_id: int,
    status_update: ApplicationStatusUpdate,
    current_admin: Annotated[User, Depends(get_current_admin_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    result = await session.execute(select(Application).where(Application.id == app_id))
    db_app = result.scalars().first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    db_app.status = status_update.status
    if status_update.ai_review_notes is not None:
        db_app.ai_review_notes = status_update.ai_review_notes
        
    session.add(db_app)
    await session.commit()
    await session.refresh(db_app)
    return {"message": "Application status updated", "new_status": db_app.status}
