"""
AI/OCR Routes for MedVerify
All endpoints use real services from ocr_service.py - no static data
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["AI/OCR"])

# Request/Response Models
class SymptomRequest(BaseModel):
    symptoms: List[str]
    duration: Optional[str] = None
    age: Optional[int] = None

class SummarizeRequest(BaseModel):
    text: str


@router.get("/ai-ocr/health")
async def health_check():
    """
    Health check endpoint - returns real status from OCR service
    """
    try:
        from app.services.ocr_service import ocr_service
        easyocr_available = ocr_service.reader is not None
        return {
            "status": "healthy",
            "service": "ai-ocr",
            "easyocr_available": easyocr_available,
            "message": "AI/OCR service is running with EasyOCR" if easyocr_available else "AI/OCR service running (EasyOCR not loaded)"
        }
    except ImportError:
        return {
            "status": "degraded",
            "service": "ai-ocr",
            "easyocr_available": False,
            "message": "OCR service module not found"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "ai-ocr",
            "error": str(e),
            "message": "Service error"
        }


@router.post("/ai-ocr/triage/analyze")
async def analyze_symptoms(request: SymptomRequest):
    """
    Analyze symptoms and determine severity
    Uses real triage service from ocr_service.py
    """
    try:
        from app.services.ocr_service import triage_service
        
        # Call the real service (no static data)
        result = triage_service.analyze_symptoms(
            request.symptoms, 
            request.duration
        )
        
        return {
            "severity": result.get("severity", "LOW"),
            "reason": result.get("reason", "Symptoms analyzed"),
            "recommendation": result.get("recommendation", "Consult a physician if symptoms persist"),
            "symptoms_analyzed": request.symptoms,
            "duration": request.duration
        }
        
    except ImportError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Triage service not available: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Triage analysis failed: {str(e)}"
        )


@router.post("/ai-ocr/report/summarize")
async def summarize_report(request: SummarizeRequest):
    """
    Summarize extracted medical report text
    Uses real summarization service from ocr_service.py
    """
    try:
        from app.services.ocr_service import summarization_service
        
        # Call the real service (no static data)
        result = summarization_service.summarize(request.text)
        
        return {
            "summary": result.get("summary", "Unable to generate summary"),
            "key_findings": result.get("key_findings", []),
            "abnormalities": result.get("abnormalities", []),
            "medications": result.get("medications", [])
        }
        
    except ImportError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Summarization service not available: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Summarization failed: {str(e)}"
        )


@router.post("/ai-ocr/ocr/extract")
async def extract_ocr(file: UploadFile = File(...)):
    """
    Extract text from medical image/prescription using EasyOCR
    Uses real OCR service from ocr_service.py
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail=f"File must be an image. Got: {file.content_type}"
        )
    
    try:
        # Read the image file
        contents = await file.read()
        
        # Validate file size (max 10MB)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size: 10MB"
            )
        
        # Use the real OCR service
        from app.services.ocr_service import ocr_service
        result = ocr_service.extract_text_from_image(contents)
        
        # Check if OCR failed
        if "error" in result:
            return {
                "success": False,
                "filename": file.filename,
                "error": result["error"],
                "extracted_text": "",
                "word_count": 0,
                "confidence": 0,
                "contains_emergency_keywords": False
            }
        
        return {
            "success": True,
            "filename": file.filename,
            "file_size_bytes": len(contents),
            "extracted_text": result.get("extracted_text", ""),
            "word_count": result.get("word_count", 0),
            "confidence": result.get("confidence", 0),
            "contains_emergency_keywords": result.get("contains_emergency_keywords", False)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"OCR processing failed: {str(e)}"
        )