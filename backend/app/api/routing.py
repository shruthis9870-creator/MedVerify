from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.security import require_roles
from app.services.routing_service import routing_service

router = APIRouter(
    prefix="/routing",
    tags=["routing"],
    dependencies=[Depends(require_roles("admin"))],
)


class AssignmentStatusUpdate(BaseModel):
    status: str


@router.get("/assignments")
def get_routing_assignments():
    return routing_service.list_assignments()


@router.post("/assignments/{assignment_id}/status")
def update_assignment_status(assignment_id: str, payload: AssignmentStatusUpdate):
    assignment = routing_service.update_status(assignment_id, payload.status)

    if assignment is None:
        raise HTTPException(status_code=404, detail="Routing assignment not found")

    return {
        "ok": True,
        "assignment": assignment,
    }
