"""
AI/OCR Routes for MedVerify
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
    """Health check endpoint"""
    # Try to import OCR service to check if it's available
    try:
        from app.services.ocr_service import ocr_service
        easyocr_available = ocr_service.reader is not None
    except:
        easyocr_available = False
    
    return {
        "status": "healthy",
        "service": "ai-ocr",
        "easyocr_available": easyocr_available,
        "message": "AI/OCR service is running"
    }


@router.post("/ai-ocr/triage/analyze")
async def analyze_symptoms(request: SymptomRequest):
    """
    Analyze symptoms and determine severity
    """
    symptoms_lower = [s.lower() for s in request.symptoms]
    
    emergency_symptoms = ["chest pain", "difficulty breathing", "shortness of breath",
                         "severe bleeding", "unconscious", "heart attack", "stroke"]
    high_urgency = [s for s in symptoms_lower if s in emergency_symptoms]
    
    if high_urgency:
        return {
            "severity": "HIGH",
            "reason": f"{', '.join(high_urgency)} detected",
            "recommendation": "Seek immediate medical attention. Call emergency services.",
            "symptoms_analyzed": request.symptoms
        }
    
    medium_symptoms = ["fever", "vomiting", "diarrhea", "severe headache", "injury", "cough"]
    medium_urgency = [s for s in symptoms_lower if s in medium_symptoms]
    
    if medium_urgency:
        return {
            "severity": "MEDIUM",
            "reason": f"{', '.join(medium_urgency)} reported",
            "recommendation": "Consult a physician within 24-48 hours",
            "symptoms_analyzed": request.symptoms
        }
    
    return {
        "severity": "LOW",
        "reason": "Non-urgent symptoms reported",
        "recommendation": "Monitor symptoms. Schedule routine appointment if needed.",
        "symptoms_analyzed": request.symptoms
    }


@router.post("/ai-ocr/report/summarize")
async def summarize_report(request: SummarizeRequest):
    """Summarize extracted medical report text"""
    text = request.text.lower()
    
    findings = []
    if "bp" in text or "blood pressure" in text:
        findings.append("Blood pressure mentioned")
    if "sugar" in text or "glucose" in text:
        findings.append("Blood sugar mentioned")
    if "medication" in text or "prescribed" in text:
        findings.append("Medications prescribed")
    if "fever" in text:
        findings.append("Fever mentioned")
    if "cough" in text:
        findings.append("Cough mentioned")
    
    abnormalities = []
    if "abnormal" in text:
        abnormalities.append("Abnormal results detected")
    if "high" in text and "blood" in text:
        abnormalities.append("High blood levels detected")
    if "low" in text and "blood" in text:
        abnormalities.append("Low blood levels detected")
    
    return {
        "summary": f"📋 Medical Report Analysis:\n\n{request.text[:300]}..." if len(request.text) > 300 else f"📋 Medical Report Analysis:\n\n{request.text}",
        "key_findings": findings if findings else ["No specific findings extracted"],
        "abnormalities": abnormalities if abnormalities else ["No obvious abnormalities detected"],
        "medications": []
    }


@router.post("/ai-ocr/ocr/extract")
async def extract_ocr(file: UploadFile = File(...)):
    """
    Extract text from medical image/prescription using EasyOCR
    
    Upload an image file (JPG, PNG, etc.)
    Returns extracted text with confidence score and emergency detection
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
        
        # Import and use the real OCR service
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