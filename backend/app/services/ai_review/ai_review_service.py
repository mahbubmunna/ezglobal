import json
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.db.models.applications import Application, Document
from app.modules.ai_review.schemas import AIReviewSummary
from .document_processor import process_document
from .validation_engine import validate_application_documents
from .llm_client import LLMClient

async def run_ai_review(session: AsyncSession, application_id: int):
    # 1. Update status to reviewing
    app = await session.get(Application, application_id)
    if not app:
        return None
        
    app.status = "ai_reviewing"
    session.add(app)
    await session.commit()
    
    # 2. Extract Document Text (Document Processor)
    stmt = select(Document).where(Document.application_id == application_id)
    doc_result = await session.execute(stmt)
    documents = doc_result.scalars().all()
    
    extracted_texts = []
    for doc in documents:
        # Re-process if not processed
        if doc.review_status == "uploaded":
            doc = await process_document(session, doc)
        
        if doc.raw_text:
            text_snippet = doc.raw_text[:2000] # Truncate to save context
            extracted_texts.append(f"--- Document Type: {doc.document_type_detected} (File: {doc.document_type}) ---\n{text_snippet}\n")
            
    # 3. Deterministic Validation (Validation Engine)
    validation_res = await validate_application_documents(session, application_id)
    
    # 4. Generate AI Feedback (LLM Generator)
    llm = LLMClient()
    prompt = f"""
I have a business setup application with the following document validation results:
Missing Required Documents: {validation_res.missing_documents}
Invalid/Unreadable Files: {validation_res.invalid_files}

Here is the extracted text from the successfully uploaded documents:
{''.join(extracted_texts)}

Please generate a structured review summary IN JSON FORMAT.
Do NOT return the schema. Return actual data conforming to the schema.
- Include the missing documents directly from the validation results in the `missing_documents` array.
- Evaluate the extracted text and include any document-specific errors or missing information in the `document_issues` array.
- Provide step-by-step instructions in the `general_recommendations` array for how the user should fix their application.
"""

    ai_summary = await llm.generate_structured_response(prompt, AIReviewSummary)
    
    # Force the deterministic missing documents and invalid files into the AI schema so the UI doesn't lose them
    ai_summary.missing_documents = list(set(ai_summary.missing_documents + validation_res.missing_documents))
    
    # 5. Update Status based on result
    if ai_summary.missing_documents or ai_summary.document_issues or validation_res.invalid_files:
        app.status = "needs_fix"
    else:
        app.status = "ready"
        
    app.ai_review_summary = ai_summary.model_dump()
    session.add(app)
    await session.commit()
    
    return app
