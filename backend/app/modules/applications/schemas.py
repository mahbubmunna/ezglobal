from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import date, datetime

class StakeholderBase(BaseModel):
    roles: List[str] = []
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    nationality: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    uae_resident: bool = False
    passport_number: Optional[str] = None
    passport_expiry_date: Optional[date] = None
    emirates_id_number: Optional[str] = None
    unified_number: Optional[str] = None
    is_ubo: bool = False
    ownership_percentage: Optional[float] = None

class StakeholderCreate(StakeholderBase):
    pass

class StakeholderResponse(StakeholderBase):
    id: int
    application_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    document_type: str
    file_path: str
    stakeholder_id: Optional[int] = None

class DocumentResponse(DocumentBase):
    id: int
    application_id: int
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    legal_type: Optional[str] = None
    license_type: Optional[str] = None
    trade_name_1: Optional[str] = None
    trade_name_2: Optional[str] = None
    trade_name_3: Optional[str] = None
    activities: List[str] = []
    jurisdiction: Optional[str] = None
    free_zone_name: Optional[str] = None
    wait_for_ejari: Optional[bool] = None
    ejari_number: Optional[str] = None
    package_type: Optional[str] = None
    status: str = "Draft"

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdateStep1(BaseModel):
    legal_type: Optional[str] = None
    license_type: Optional[str] = None
    trade_name_1: Optional[str] = None
    trade_name_2: Optional[str] = None
    trade_name_3: Optional[str] = None
    activities: List[str] = []
    jurisdiction: Optional[str] = None
    free_zone_name: Optional[str] = None

class ApplicationUpdateStep3(BaseModel):
    wait_for_ejari: Optional[bool] = None
    ejari_number: Optional[str] = None
    package_type: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    ai_review_notes: Optional[str] = None
    ai_review_summary: Optional[dict] = None
    stakeholders: List[StakeholderResponse] = []
    documents: List[DocumentResponse] = []

    class Config:
        from_attributes = True
