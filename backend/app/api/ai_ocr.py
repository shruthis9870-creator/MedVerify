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
    return {
        "status": "healthy",
        "service": "ai-ocr",
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
    
    return {
        "summary": f"Medical report analysis: {request.text[:200]}...",
        "key_findings": findings if findings else ["No specific findings extracted"],
        "abnormalities": ["Possible abnormal values detected"] if "abnormal" in text else [],
        "medications": []
    }

@router.post("/ai-ocr/ocr/extract")
async def extract_ocr(file: UploadFile = File(...)):
    """
    Extract text from medical image/prescription
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # For now, return a placeholder
    return {
        "success": True,
        "filename": file.filename,
        "extracted_text": "Sample extracted text from medical image",
        "word_count": 5,
        "confidence": 0.85,
        "contains_emergency_keywords": False
    }