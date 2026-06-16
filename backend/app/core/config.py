from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[3]
BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(
            PROJECT_ROOT / ".env",
            BACKEND_ROOT / ".env",
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Healthcare AI API"
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_url: str | None = None
    allow_in_memory_store: bool = False
    twilio_account_sid: str | None = None
    twilio_auth_token: str | None = None
    twilio_phone_number: str | None = None
    twilio_whatsapp_from: str | None = None
    twilio_validate_webhook_signature: bool = True
    twilio_webhook_public_url: str | None = None
    allow_unsigned_twilio_webhook: bool = False
    cors_allowed_origins: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "http://localhost:3000,"
        "http://127.0.0.1:3000"
    )
    cors_allowed_origin_regex: str | None = r"https://.*\.vercel\.app"
    easyocr_model_dir: str = str(BACKEND_ROOT / ".easyocr")
    allow_dev_otp: bool = False
    admin_allowed_emails: str = ""
    admin_bootstrap_users: str = ""


settings = Settings()
