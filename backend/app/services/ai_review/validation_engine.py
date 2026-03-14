import json
import os
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.db.models.applications import Document
from app.modules.ai_review.schemas import ValidationResult

RULES_PATH = os.path.join(os.path.dirname(__file__), "document_rules.json")
try:
    with open(RULES_PATH, 'r') as f:
        DOCUMENT_RULES = json.load(f)
except Exception:
    DOCUMENT_RULES = {}

async def validate_application_documents(session: AsyncSession, application_id: int) -> ValidationResult:
    stmt = select(Document).where(Document.application_id == application_id)
    result = await session.execute(stmt)
    documents = result.scalars().all()
    
    missing = []
    invalid = []
    warnings = []
    
    uploaded_types = [doc.document_type for doc in documents]
    
    for req_type, rule in DOCUMENT_RULES.items():
        if rule.get("required") is True:
            if req_type not in uploaded_types:
                missing.append(req_type)
                
    for doc in documents:
        if doc.review_status == "needs_fix" and not doc.raw_text:
            invalid.append(f"File {os.path.basename(doc.file_path or 'unknown')} is missing or unreadable.")
            continue
            
        if not doc.raw_text or len(doc.raw_text.strip()) < 10:
            if doc.file_path and doc.file_path.lower().endswith(('.jpg', '.jpeg', '.png', '.pdf')):
                warning_msg = f"{doc.document_type} appears to be empty or unreadable."
                invalid.append(warning_msg)
                doc.review_status = "needs_fix"
                session.add(doc)
                
    await session.commit()
    
    return ValidationResult(
        missing_documents=missing,
        invalid_files=invalid,
        warnings=warnings
    )
