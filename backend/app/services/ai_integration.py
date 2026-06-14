"""
AI Integration Helper for WhatsApp Flow
Connects AI/OCR service to WhatsApp conversation flow
"""

import re
from typing import Dict, Any, List, Optional
from app.services.ocr_service import ocr_service, triage_service, summarization_service

class AIFlowIntegration:
    """Handles AI integration in WhatsApp flows"""
    
    @staticmethod
    async def process_image_message(image_bytes: bytes, user_id: str, session: Dict) -> Dict:
        """
        Process an image message (prescription/report)
        
        Returns:
            {
                "response_text": str,
                "should_create_alert": bool,
                "alert_severity": str,
                "alert_reason": str,
                "ocr_text": str
            }
        """
        # Extract text from image
        ocr_result = ocr_service.extract_text_from_image(image_bytes)
        extracted_text = ocr_result["extracted_text"]
        
        # Store in session
        session["ocr_text"] = extracted_text
        session["has_report"] = True
        
        response = {
            "response_text": "",
            "should_create_alert": False,
            "alert_severity": None,
            "alert_reason": None,
            "ocr_text": extracted_text
        }
        
        # Check for emergency keywords
        if ocr_result["contains_emergency_keywords"]:
            response["should_create_alert"] = True
            response["alert_severity"] = "HIGH"
            response["alert_reason"] = f"Emergency keywords detected in uploaded report: {extracted_text[:100]}"
            response["response_text"] = "⚠️ *URGENT*: Our system has detected concerning keywords in your report. Please seek immediate medical attention or call emergency services.\n\nWould you like me to help you find the nearest hospital?"
        else:
            response["response_text"] = f"✅ *Report received!*\n\nI've extracted the following information:\n\n```\n{extracted_text[:200]}...\n```\n\nWhat would you like to do?\n1. Get a summary\n2. Ask questions about the report\n3. Continue with symptom assessment"
        
        return response
    
    @staticmethod
    async def process_symptom_message(symptoms: List[str], session: Dict) -> Dict:
        """
        Process symptom messages from user
        
        Returns:
            {
                "severity": str,
                "recommendation": str,
                "reason": str,
                "should_create_alert": bool,
                "next_flow": str,
                "response_text": str
            }
        """
        # Analyze symptoms
        triage_result = triage_service.analyze_symptoms(symptoms)
        
        # Store in session
        session["symptoms"] = symptoms
        session["triage_severity"] = triage_result["severity"]
        
        response = {
            "severity": triage_result["severity"],
            "recommendation": triage_result["recommendation"],
            "reason": triage_result["reason"],
            "should_create_alert": False,
            "next_flow": "continue",
            "response_text": ""
        }
        
        # Determine response based on severity
        if triage_result["severity"] == "HIGH":
            response["should_create_alert"] = True
            response["next_flow"] = "emergency"
            response["response_text"] = f"⚠️ *HIGH SEVERITY DETECTED*\n\n{triage_result['reason']}\n\n{triage_result['recommendation']}\n\nDo you need me to:\n1. Call emergency services\n2. Find nearest hospital\n3. Contact a family member"
        
        elif triage_result["severity"] == "MEDIUM":
            response["next_flow"] = "symptom_details"
            response["response_text"] = f"🟡 *Medium Severity*\n\n{triage_result['reason']}\n\n{triage_result['recommendation']}\n\nCan you tell me:\n- How long have you had these symptoms?\n- Any other symptoms?\n- Do you have any existing medical conditions?"
        
        else:  # LOW severity
            response["next_flow"] = "routine_advice"
            response["response_text"] = f"🟢 *Low Severity*\n\n{triage_result['reason']}\n\n{triage_result['recommendation']}\n\nWould you like to:\n1. Get home care advice\n2. Schedule a teleconsultation\n3. Find a nearby doctor"
        
        return response
    
    @staticmethod
    async def generate_report_summary(ocr_text: str) -> Dict:
        """
        Generate summary of medical report
        """
        summary = summarization_service.summarize(ocr_text)
        
        # Format response for WhatsApp
        response_text = f"📋 *REPORT SUMMARY*\n\n"
        response_text += f"*Key Findings:*\n"
        for finding in summary["key_findings"][:5]:
            response_text += f"• {finding}\n"
        
        if summary["abnormalities"]:
            response_text += f"\n*⚠️ Abnormalities Detected:*\n"
            for abnormality in summary["abnormalities"]:
                response_text += f"• {abnormality}\n"
        
        if summary["medications"]:
            response_text += f"\n*💊 Medications Mentioned:*\n"
            for med in summary["medications"][:5]:
                response_text += f"• {med}\n"
        
        response_text += f"\n*Full Analysis:*\n{summary['summary'][:300]}"
        
        return {
            "summary": summary,
            "response_text": response_text
        }
    
    @staticmethod
    def extract_symptoms_from_text(text: str) -> List[str]:
        """
        Extract symptom keywords from natural language text
        """
        symptom_keywords = [
            "fever", "cough", "headache", "chest pain", "nausea", 
            "vomiting", "diarrhea", "fatigue", "shortness of breath",
            "sore throat", "runny nose", "body ache", "chills",
            "dizziness", "weakness", "loss of appetite", "dehydration"
        ]
        
        text_lower = text.lower()
        found_symptoms = []
        
        for symptom in symptom_keywords:
            if symptom in text_lower:
                found_symptoms.append(symptom)
        
        return found_symptoms if found_symptoms else ["general discomfort"]