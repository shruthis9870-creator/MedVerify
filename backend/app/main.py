from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.api.ai_ocr import router as ai_ocr_router
from app.api.alerts import router as alerts_router
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.patients import router as patients_router
from app.api.reports import router as reports_router
from app.api.routing import router as routing_router
from app.api.whatsapp import router as whatsapp_router
from app.core.config import settings

app = FastAPI(title="MedVerify Backend")

STATIC_DIR = Path(__file__).resolve().parents[1] / "static"
STATIC_INDEX = STATIC_DIR / "index.html"
FRONTEND_ROUTE_PREFIXES = {
    "active-cases",
    "admin-dashboard",
    "ai-recommendations",
    "alerts",
    "ambulance-tracking",
    "about",
    "dashboard",
    "daily-stats",
    "decision-panel",
    "doctor-login",
    "doctor-signin",
    "edit-profile",
    "emergency",
    "export-data",
    "help",
    "notifications",
    "patient",
    "patient-history",
    "patient-login",
    "patient-signin",
    "patients",
    "pending-reports",
    "performance",
    "profile",
    "reports",
    "role",
    "settings",
    "signin",
    "support",
    "timeline",
}


def _cors_origins() -> list[str]:
    raw_origins = settings.cors_allowed_origins.strip()

    if raw_origins == "*":
        return ["*"]

    return [
        origin.strip()
        for origin in raw_origins.replace(";", ",").split(",")
        if origin.strip()
    ]


def _static_file_for(path: str) -> Path | None:
    candidate = (STATIC_DIR / path).resolve()
    static_root = STATIC_DIR.resolve()

    if not candidate.is_relative_to(static_root):
        return None

    if candidate.is_file():
        return candidate

    return None


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.get("/health")
def health():
    return {"status": "healthy", "service": "MedVerify Backend"}


# Register API routes
app.include_router(ai_ocr_router)
app.include_router(auth_router)
app.include_router(alerts_router)
app.include_router(dashboard_router)
app.include_router(patients_router)
app.include_router(reports_router)
app.include_router(routing_router)
app.include_router(whatsapp_router)


@app.get("/{path:path}", include_in_schema=False)
def serve_frontend(path: str):
    static_file = _static_file_for(path)
    if static_file is not None:
        return FileResponse(static_file)

    first_segment = path.split("/", 1)[0]
    if first_segment in FRONTEND_ROUTE_PREFIXES and STATIC_INDEX.exists():
        return FileResponse(STATIC_INDEX)

    raise HTTPException(status_code=404, detail="Not Found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
