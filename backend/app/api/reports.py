from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status

from app.core.security import get_current_user, require_roles
from app.services.alert_service import alert_service
from app.services.report_service import report_service

UPLOADS_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_REPORT_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
}
MAX_REPORT_BYTES = 15 * 1024 * 1024

router = APIRouter(
    prefix="/reports",
    tags=["reports"],
)


@router.get("")
def reports(_current_user: dict = Depends(require_roles("doctor", "admin"))):

    return {
        "reports": report_service.list_reports()
    }


def _ensure_patient_report_access(current_user: dict, patient_id: str) -> None:
    if current_user.get("role") in {"doctor", "admin"}:
        return

    if current_user.get("role") == "patient" and current_user.get("patientId") == patient_id:
        return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to access reports for this patient.",
    )


def _safe_upload_name(filename: str | None) -> str:
    raw_name = Path(filename or "medical-report").name
    safe_name = "".join(
        char if char.isalnum() or char in {".", "-", "_"} else "_"
        for char in raw_name
    ).strip("._")

    return safe_name or "medical-report"


@router.get("/patient/{patient_id}")
def get_patient_reports(
    patient_id: str,
    current_user: dict = Depends(get_current_user),
):
    _ensure_patient_report_access(current_user, patient_id)

    reports = report_service.list_patient_reports(patient_id)

    return {
        "patient_id": patient_id,
        "reports": reports,
        "count": len(reports),
    }


@router.post("/patient/{patient_id}/upload")
async def upload_patient_report(
    patient_id: str,
    request: Request,
    file: UploadFile = File(...),
    patient_name: str | None = Form(default=None),
    current_user: dict = Depends(get_current_user),
):
    _ensure_patient_report_access(current_user, patient_id)

    if file.content_type not in ALLOWED_REPORT_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF, JPG, and PNG report uploads are supported.",
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded report file is empty.",
        )

    if len(content) > MAX_REPORT_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Report file is too large. Maximum size is 15 MB.",
        )

    safe_name = _safe_upload_name(file.filename)
    stored_name = f"{uuid4()}-{safe_name}"
    destination = UPLOADS_DIR / stored_name
    destination.write_bytes(content)

    media_url = str(request.url_for("uploads", path=stored_name))
    report = report_service.create_report(
        patient_id=patient_id,
        media_urls=[media_url],
        metadata={
            "filename": safe_name,
            "content_type": file.content_type,
            "size_bytes": len(content),
            "patient_name": patient_name,
            "uploaded_by": current_user.get("userId"),
            "uploaded_by_role": current_user.get("role"),
        },
    )
    attached_alerts = alert_service.attach_patient_reports_to_open_alerts(patient_id)

    return {
        "ok": True,
        "report": report,
        "attached_alerts": attached_alerts,
    }
