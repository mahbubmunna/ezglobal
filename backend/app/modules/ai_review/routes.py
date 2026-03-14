from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db.session import get_db
from app.db.models.applications import Application
from app.services.ai_review.ai_review_service import run_ai_review

router = APIRouter()

@router.post("/{application_id}/review")
async def trigger_ai_review(
    application_id: int,
    session: AsyncSession = Depends(get_db)
):
    app_db = await session.get(Application, application_id)
    if not app_db:
        raise HTTPException(status_code=404, detail="Application not found")
        
    try:
        updated_app = await run_ai_review(session, application_id)
        if not updated_app:
            raise HTTPException(status_code=500, detail="Failed to run AI Review")
            
        return {
            "message": "AI Review complete",
            "status": updated_app.status,
            "summary": updated_app.ai_review_summary
        }
    except Exception as e:
        app_db.status = "needs_fix"
        app_db.ai_review_summary = {"error": f"Internal Review Error: {str(e)}"}
        session.add(app_db)
        await session.commit()
        raise HTTPException(status_code=500, detail=str(e))
