from fastapi import APIRouter

from app.services.report_service import report_service

router = APIRouter(
    prefix="/reports",
    tags=["reports"]
)


@router.get("")
def reports():

    return {
        "reports": report_service.list_reports()
    }