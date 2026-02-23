from datetime import datetime, date
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column, JSON, String

class ApplicationBase(SQLModel):
    user_id: int = Field(foreign_key="user.id")
    legal_type: Optional[str] = None
    license_type: Optional[str] = None
    trade_name_1: Optional[str] = None
    trade_name_2: Optional[str] = None
    trade_name_3: Optional[str] = None
    activities: List[str] = Field(default=[], sa_column=Column(JSON))
    jurisdiction: Optional[str] = None
    free_zone_name: Optional[str] = None
    wait_for_ejari: Optional[bool] = None
    ejari_number: Optional[str] = None
    package_type: Optional[str] = None
    status: str = Field(default="Draft")

class Application(ApplicationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class StakeholderBase(SQLModel):
    application_id: int = Field(foreign_key="application.id")
    roles: List[str] = Field(default=[], sa_column=Column(JSON))
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    nationality: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    uae_resident: bool = False
    passport_number: Optional[str] = None
    passport_expiry_date: Optional[date] = None
    emirates_id_number: Optional[str] = None
    unified_number: Optional[str] = None
    is_ubo: bool = False
    ownership_percentage: Optional[float] = None

class Stakeholder(StakeholderBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentBase(SQLModel):
    application_id: int = Field(foreign_key="application.id")
    stakeholder_id: Optional[int] = Field(default=None, foreign_key="stakeholder.id")
    document_type: str
    file_path: str

class Document(DocumentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
