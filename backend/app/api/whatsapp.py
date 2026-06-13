from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import Response
from twilio.request_validator import RequestValidator
from twilio.twiml.messaging_response import MessagingResponse

from app.core.config import settings
from app.models.message import IncomingMessage
from app.models.response import BotResponse
from app.services.alert_service import alert_service
from app.services.orchestrator import orchestrator
from app.services.report_service import report_service

router = APIRouter()


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

    if media_urls:
        report_service.create_report(
            patient_id=from_number,
            media_urls=media_urls,
            metadata=incoming_message.metadata,
        )
        alert_service.attach_patient_reports_to_open_alerts(from_number)

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
