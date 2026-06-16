from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.alerts import router as alerts_router
from app.api.ai_ocr import router as ai_ocr_router
import os

app = FastAPI(title="MedVerify Backend")

# CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(alerts_router)
app.include_router(ai_ocr_router)

# Health check
@app.get("/")
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0", "ocr_loaded": True}

# Serve dashboard static files (if exists)
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/dashboard", StaticFiles(directory=static_dir, html=True), name="dashboard")
    
    @app.get("/dashboard")
    async def serve_dashboard():
        return FileResponse(os.path.join(static_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)