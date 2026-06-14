"""
AI/OCR Service for MedVerify
Extracts text from medical images and analyzes symptoms
"""

import os
import re
import base64
from typing import List, Dict, Any, Optional
from io import BytesIO

# Try to import EasyOCR (fallback if not installed)
try:
    import easyocr
    import numpy as np
    import cv2
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False
    print("EasyOCR not available. Using mock OCR.")

class OCRService:
    """OCR Service for extracting text from medical documents"""
    
    def __init__(self):
        self.reader = None
        if EASYOCR_AVAILABLE:
            print("Loading EasyOCR model...")
            self.reader = easyocr.Reader(['en'], gpu=False)
            print("EasyOCR loaded successfully!")
    
    def extract_text_from_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Extract text from medical image/prescription
        
        Returns:
            {
                "extracted_text": str,
                "word_count": int,
                "confidence": float,
                "contains_emergency_keywords": bool
            }
        """
        if not image_bytes:
            return {
                "extracted_text": "",
                "word_count": 0,
                "confidence": 0,
                "contains_emergency_keywords": False,
                "error": "No image data"
            }
        
        # Use EasyOCR if available
        if self.reader:
            try:
                nparr = np.frombuffer(image_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if img is None:
                    return self._mock_extraction("Could not decode image")
                
                results = self.reader.readtext(img)
                texts = [text for bbox, text, conf in results]
                full_text = " ".join(texts)
                avg_conf = sum(conf for bbox, text, conf in results) / len(results) if results else 0
                
                return self._format_result(full_text, len(texts), avg_conf)
                
            except Exception as e:
                return self._mock_extraction(f"OCR error: {str(e)}")
        
        # Fallback to mock OCR
        return self._mock_extraction("")
    
    def _mock_extraction(self, error_msg: str = "") -> Dict[str, Any]:
        """Mock OCR for testing when EasyOCR not available"""
        mock_text = "Patient: John Doe. Diagnosis: Fever and cough. Prescribed: Paracetamol 500mg twice daily."
        return self._format_result(mock_text, 12, 0.85, error_msg)
    
    def _format_result(self, text: str, word_count: int, confidence: float, error: str = "") -> Dict[str, Any]:
        emergency_keywords = [
            "chest pain", "difficulty breathing", "severe bleeding",
            "heart attack", "stroke", "unconscious", "emergency",
            "critical", "immediate", "urgent"
        ]
        contains_emergency = any(kw in text.lower() for kw in emergency_keywords)
        
        result = {
            "extracted_text": text,
            "word_count": word_count,
            "confidence": round(confidence, 3),
            "contains_emergency_keywords": contains_emergency
        }
        if error:
            result["error"] = error
        return result

class TriageService:
    """Symptom triage service"""
    
    # Severity levels based on symptoms
    HIGH_SEVERITY_SYMPTOMS = [
        "chest pain", "difficulty breathing", "shortness of breath",
        "severe bleeding", "unconscious", "heart attack", "stroke",
        "severe allergic reaction", "cannot breathe", "trouble breathing"
    ]
    
    MEDIUM_SEVERITY_SYMPTOMS = [
        "fever", "vomiting", "diarrhea", "severe headache", 
        "injury", "cough", "nausea", "dehydration", "infection"
    ]
    
    @classmethod
    def analyze_symptoms(cls, symptoms: List[str], duration: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze symptoms and determine severity
        
        Returns:
            {
                "severity": "HIGH" | "MEDIUM" | "LOW",
                "reason": str,
                "recommendation": str,
                "symptoms_analyzed": List[str]
            }
        """
        import time
        
        symptoms_lower = [s.lower().strip() for s in symptoms]
        
        # Check for HIGH severity
        high_symptoms = [s for s in symptoms_lower if s in cls.HIGH_SEVERITY_SYMPTOMS]
        if high_symptoms:
            return {
                "severity": "HIGH",
                "reason": f"Detected: {', '.join(high_symptoms)}",
                "recommendation": "⚠️ Seek immediate medical attention. Call emergency services or go to nearest ER.",
                "symptoms_analyzed": symptoms,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
        
        # Check for MEDIUM severity
        medium_symptoms = [s for s in symptoms_lower if s in cls.MEDIUM_SEVERITY_SYMPTOMS]
        if medium_symptoms:
            return {
                "severity": "MEDIUM",
                "reason": f"Reported: {', '.join(medium_symptoms)}",
                "recommendation": "🏥 Consult a physician within 24-48 hours. Monitor symptoms closely.",
                "symptoms_analyzed": symptoms,
                "timestamp": time.strftime("%Y-%4m-%dT%H:%M:%SZ", time.gmtime())
            }
        
        # LOW severity
        return {
            "severity": "LOW",
            "reason": "Non-urgent symptoms reported",
            "recommendation": "💊 Monitor symptoms at home. Schedule a routine appointment if needed.",
            "symptoms_analyzed": symptoms,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

class SummarizationService:
    """Medical report summarization service"""
    
    @classmethod
    def summarize(cls, text: str) -> Dict[str, Any]:
        """
        Summarize medical report text
        
        Returns:
            {
                "summary": str,
                "key_findings": List[str],
                "abnormalities": List[str],
                "medications": List[str]
            }
        """
        text_lower = text.lower()
        
        # Extract key findings
        findings = []
        if "bp" in text_lower or "blood pressure" in text_lower:
            findings.append("Blood pressure mentioned")
        if "sugar" in text_lower or "glucose" in text_lower:
            findings.append("Blood sugar mentioned")
        if "medication" in text_lower or "prescribed" in text_lower:
            findings.append("Medications prescribed")
        if "fever" in text_lower or "temperature" in text_lower:
            findings.append("Fever/temperature mentioned")
        if "cough" in text_lower:
            findings.append("Cough reported")
        
        # Detect abnormalities
        abnormalities = []
        if "abnormal" in text_lower:
            abnormalities.append("Abnormal results detected")
        if "high" in text_lower or "elevated" in text_lower:
            abnormalities.append("Elevated values detected")
        if "low" in text_lower and not "follow low" in text_lower:
            abnormalities.append("Low values detected")
        
        # Extract medications (simple regex)
        medication_pattern = r'(\w+\s?\w*)\s?(?:mg|mcg|g|ml|tablet|capsule|injection)'
        medications = re.findall(medication_pattern, text_lower)
        
        summary = f"📋 Medical Report Summary:\n\n{text[:300]}..."
        if len(text) > 300:
            summary += "\n\n(Full text available for detailed review)"
        
        return {
            "summary": summary,
            "key_findings": findings if findings else ["No specific findings extracted"],
            "abnormalities": abnormalities if abnormalities else ["No obvious abnormalities detected"],
            "medications": list(set(medications))[:5]  # Unique medications, max 5
        }

# Singleton instances
ocr_service = OCRService()
triage_service = TriageService()
summarization_service = SummarizationService()