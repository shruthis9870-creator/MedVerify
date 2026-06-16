from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.alerts import router as alerts_router
from app.api.ai_ocr import router as ai_ocr_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(alerts_router)      # Add this line
app.include_router(ai_ocr_router)

@app.get("/")
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0", "ocr_loaded": True}
# Add this at the bottom of app/api/alerts.py
# Pre-populate with demo alert if empty
if not alerts_db:
    alerts_db.append(AlertResponse(
        alert_id="alert_demo_001",
        patient_id="+919876543210",
        patient_name="Demo Patient",
        severity="HIGH",
        reason="Chest pain detected (demo)",
        source="whatsapp_symptom",
        recommendation="Seek immediate medical attention",
        status="open",
        created_at=datetime.utcnow().isoformat()
    ))