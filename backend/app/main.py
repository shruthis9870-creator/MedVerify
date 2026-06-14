from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.alerts import router as alerts_router
from app.api.health import router as health_router
from app.api.whatsapp import router as whatsapp_router
from app.api.reports import router as reports_router
from app.api.dashboard import router as dashboard_router
from app.api.routing import router as routing_router

from app.core.config import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(whatsapp_router)
app.include_router(alerts_router)
app.include_router(reports_router)
app.include_router(dashboard_router)
app.include_router(routing_router)


@app.get("/")
def root():
    return {"message": "Healthcare AI API is running"}
