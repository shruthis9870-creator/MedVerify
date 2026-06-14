from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import Response
from twilio.request_validator import RequestValidator
from twilio.twiml.messaging_response import MessagingResponse
import httpx

from app.core.config import settings
from app.models.message import IncomingMessage
from app.models.response import BotResponse
from app.services.alert_service import alert_service
from app.services.orchestrator import orchestrator
from app.services.report_service import report_service
from app.services.ai_integration import AIFlowIntegration

router = APIRouter()

# Initialize AI integration
ai_integration = AIFlowIntegration()


def _verify_twilio_signature(request: Request, form_values: dict[str, str]) -> None:
    if settings.allow_unsigned_twilio_webhook or not settings.twilio_validate_webhook_signature:
        return

    signature = request.headers.get("X-Twilio-Signature")

    if not signature:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing Twilio webhook signature.",
        )

    if not settings.twilio_auth_token:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Twilio webhook signature verification is not configured.",
        )

    public_url = settings.twilio_webhook_public_url or str(request.url)
    validator = RequestValidator(settings.twilio_auth_token)

    if not validator.validate(public_url, form_values, signature):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Twilio webhook signature.",
        )


@router.post("/webhook/whatsapp")
async def whatsapp_webhook(request: Request):
    form = await request.form()
    form_values = {
        key: str(value)
        for key, value in form.items()
    }
    _verify_twilio_signature(request, form_values)

    from_number = str(form.get("From", "")).strip()
    body = str(form.get("Body", "")).strip()

    try:
        num_media = int(form.get("NumMedia", 0) or 0)
    except ValueError:
        num_media = 0

    media_urls: list[str] = []
    for i in range(num_media):
        media_url = form.get(f"MediaUrl{i}")
        if media_url:
            media_urls.append(str(media_url))

    incoming_message = IncomingMessage(
        user_id=from_number,
        text=body,
        channel="whatsapp",
        num_media=max(num_media, 0),
        media_urls=media_urls,
        metadata={
            "message_sid": form.get("MessageSid"),
            "profile_name": form.get("ProfileName"),
            "wa_id": form.get("WaId"),
        },
    )

    # ============================================
    # AI INTEGRATION: Process images (prescriptions/reports)
    # ============================================
    if media_urls:
        # Create report as before
        report = report_service.create_report(
            patient_id=from_number,
            media_urls=media_urls,
            metadata=incoming_message.metadata,
        )
        
        # NEW: Process with AI/OCR
        try:
            # Download the image from the media URL
            async with httpx.AsyncClient() as client:
                media_response = await client.get(media_urls[0])
                image_bytes = media_response.content
            
            # Extract text using AI OCR
            ocr_result = await ai_integration.process_image_message(
                image_bytes, from_number, {}
            )
            
            # If emergency keywords detected, create HIGH severity alert
            if ocr_result.get("should_create_alert"):
                alert_service.create_alert(
                    user_id=from_number,
                    severity="HIGH",
                    reason=ocr_result.get("alert_reason", "Emergency keywords detected in uploaded report"),
                    payload={
                        "source": "whatsapp_image",
                        "report_id": report.get("report_id") if report else None,
                        "ocr_text": ocr_result.get("ocr_text", ""),
                    },
                )
            
            # Store OCR text in session for later use
            print(f"OCR extracted: {ocr_result.get('ocr_text', '')[:100]}...")
            
        except Exception as ai_error:
            print(f"AI processing error: {ai_error}")
            # Continue without AI if fails
        
        alert_service.attach_patient_reports_to_open_alerts(from_number)

    # ============================================
    # AI INTEGRATION: Process symptom messages
    # ============================================
    bot_response = None
    
    # Check if this is a symptom message
    if body:
        symptoms = ai_integration.extract_symptoms_from_text(body)
        
        if symptoms:
            try:
                ai_result = await ai_integration.process_symptom_message(symptoms, {})
                
                # Create alert based on severity
                if ai_result.get("should_create_alert"):
                    alert_service.create_alert(
                        user_id=from_number,
                        severity=ai_result.get("severity", "MEDIUM"),
                        reason=ai_result.get("reason", "Symptoms detected"),
                        payload={
                            "source": "whatsapp_symptom",
                            "symptoms": symptoms,
                        },
                    )
                
                # For HIGH severity, override the normal flow
                if ai_result.get("severity") == "HIGH":
                    bot_response = BotResponse(
                        response_type="text",
                        message=ai_result.get("response_text", "⚠️ Please seek immediate medical attention."),
                        next_flow="emergency",
                    )
                    
            except Exception as ai_error:
                print(f"AI symptom error: {ai_error}")

    # ============================================
    # Normal flow (orchestrator) if AI didn't override
    # ============================================
    if bot_response is None:
        try:
            bot_response = orchestrator.handle_message(incoming_message)
        except Exception as exc:
            print("WHATSAPP WEBHOOK ERROR:", exc)
            bot_response = BotResponse(
                response_type="text",
                message="Something went wrong on our side. Please try again in a moment.",
                next_flow="start",
            )

    twilio_response = MessagingResponse()
    twilio_response.message(bot_response.message)

    return Response(
        content=str(twilio_response),
        media_type="application/xml",
    )
