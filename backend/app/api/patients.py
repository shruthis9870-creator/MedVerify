from fastapi import APIRouter, Depends

from app.core.security import require_roles
from app.services.auth_service import auth_service

router = APIRouter(
    prefix="/patients",
    tags=["patients"],
    dependencies=[Depends(require_roles("doctor", "admin"))],
)


@router.get("")
def list_patients():
    patients = auth_service.list_patients()

    return {
        "patients": patients,
        "count": len(patients),
    }
