from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


def _cors_origins() -> list[str]:
    raw_origins = settings.cors_allowed_origins.strip()

    if raw_origins == "*":
        return ["*"]

    return [
        origin.strip()
        for origin in raw_origins.replace(";", ",").split(",")
        if origin.strip()
    ]


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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
