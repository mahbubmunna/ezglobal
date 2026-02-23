from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
import os
import shutil
from datetime import datetime

from app.db.session import get_db
from app.modules.auth.dependencies import get_current_active_user
from app.db.models.users import User
from app.db.models.applications import Application, Stakeholder, Document
from app.modules.applications import schemas

router = APIRouter()

UPLOAD_DIR = "uploads/documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=schemas.ApplicationResponse)
async def create_application(
    data: schemas.ApplicationCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    db_app = Application(
        user_id=current_user.id,
        **data.model_dump(exclude_unset=True)
    )
    session.add(db_app)
    await session.commit()
    await session.refresh(db_app)
    
    response_data = db_app.model_dump()
    response_data["stakeholders"] = []
    response_data["documents"] = []
    return response_data

@router.get("/{app_id}", response_model=schemas.ApplicationResponse)
async def get_application(
    app_id: int,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    # Fetch application
    result = await session.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    db_app = result.scalars().first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Fetch stakeholders
    st_result = await session.execute(select(Stakeholder).where(Stakeholder.application_id == app_id))
    stakeholders = st_result.scalars().all()
    
    # Fetch documents
    doc_result = await session.execute(select(Document).where(Document.application_id == app_id))
    documents = doc_result.scalars().all()
    
    response_data = db_app.model_dump()
    response_data["stakeholders"] = [st.model_dump() for st in stakeholders]
    response_data["documents"] = [doc.model_dump() for doc in documents]
    return response_data

@router.put("/{app_id}/step1", response_model=schemas.ApplicationResponse)
async def update_application_step1(
    app_id: int,
    data: schemas.ApplicationUpdateStep1,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    result = await session.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    db_app = result.scalars().first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_app, key, value)
        
    db_app.updated_at = datetime.utcnow()
    session.add(db_app)
    await session.commit()
    
    return await get_application(app_id, current_user, session)

@router.post("/{app_id}/stakeholders", response_model=List[schemas.StakeholderResponse])
async def update_stakeholders(
    app_id: int,
    stakeholders_data: List[schemas.StakeholderCreate],
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    result = await session.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    db_app = result.scalars().first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    # First, delete existing stakeholders for this application (replace operation)
    await session.execute(delete(Stakeholder).where(Stakeholder.application_id == app_id))
    
    new_stakeholders = []
    for st_data in stakeholders_data:
        db_st = Stakeholder(application_id=app_id, **st_data.model_dump())
        session.add(db_st)
        new_stakeholders.append(db_st)
        
    await session.commit()
    
    # Fetch fresh to return
    st_result = await session.execute(select(Stakeholder).where(Stakeholder.application_id == app_id))
    return st_result.scalars().all()

@router.put("/{app_id}/step3", response_model=schemas.ApplicationResponse)
async def update_application_step3(
    app_id: int,
    data: schemas.ApplicationUpdateStep3,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    result = await session.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    db_app = result.scalars().first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_app, key, value)
        
    db_app.updated_at = datetime.utcnow()
    session.add(db_app)
    await session.commit()
    
    return await get_application(app_id, current_user, session)

@router.post("/{app_id}/documents", response_model=schemas.DocumentResponse)
async def upload_document(
    app_id: int,
    document_type: Annotated[str, Form(...)],
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Annotated[AsyncSession, Depends(get_db)],
    file: UploadFile = File(...),
    stakeholder_id: Annotated[int, Form()] = None
):
    result = await session.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Application not found")
        
    # Ensure unique filename
    filename = f"app_{app_id}_{datetime.now().timestamp()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_doc = Document(
        application_id=app_id,
        stakeholder_id=stakeholder_id,
        document_type=document_type,
        file_path=file_path
    )
    session.add(db_doc)
    await session.commit()
    await session.refresh(db_doc)
    
    return db_doc

@router.post("/{app_id}/submit", response_model=schemas.ApplicationResponse)
async def submit_application(
    app_id: int,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Annotated[AsyncSession, Depends(get_db)]
):
    result = await session.execute(select(Application).where(Application.id == app_id, Application.user_id == current_user.id))
    db_app = result.scalars().first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    st_result = await session.execute(select(Stakeholder).where(Stakeholder.application_id == app_id))
    stakeholders = st_result.scalars().all()
    
    # Validate UBOs
    total_ubo = sum(st.ownership_percentage or 0 for st in stakeholders if st.is_ubo)
    if abs(total_ubo - 100.0) > 0.01:
        raise HTTPException(status_code=400, detail=f"Total UBO percentage must be 100%. Current: {total_ubo}%")
        
    db_app.status = "Submitted"
    db_app.updated_at = datetime.utcnow()
    session.add(db_app)
    await session.commit()
    
    return await get_application(app_id, current_user, session)
