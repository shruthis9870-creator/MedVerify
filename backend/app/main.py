from fastapi import FastAPI
from app.api.ai_ocr import router as ai_ocr_router

app = FastAPI(title="MedVerify Backend")

@app.get("/")
@app.get("/health")
def health():
    return {"status": "healthy", "service": "MedVerify Backend"}

# Register AI/OCR routes
app.include_router(ai_ocr_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)