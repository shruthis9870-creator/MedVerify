from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.orchestrator import redis_client
from app.api.alerts import router as alerts_router
from app.api.health import router as health_router
from app.api.whatsapp import router as whatsapp_router
from app.core.config import settings
from app.services.orchestrator import session_manager

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(whatsapp_router)
app.include_router(alerts_router)


@app.get("/")
def root():
    return {"message": "Healthcare AI API is running"}

@app.get("/test")
def test():
    from app.models.message import IncomingMessage
    from app.services.orchestrator import orchestrator

    msg = IncomingMessage(
        user_id="demo_user",
        text="hi",
        channel="web"
    )

    response = orchestrator.handle_message(msg)

    return {
        "reply": response.message
    }
@app.get("/redis-test")
def redis_test():
    import time

    start = time.time()

    try:
        redis_client.ping()
        return {
            "status": "connected",
            "time": time.time() - start
        }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e),
            "time": time.time() - start
        }

@app.get("/redis-test")
def redis_test():
    import time

    start = time.time()

    try:
        session_manager.redis.ping()

        return {
            "status": "connected",
            "time": time.time() - start
        }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e),
            "time": time.time() - start
        } 
@app.get("/session-test/{user_id}/{message}")
def session_test(user_id: str, message: str):

    from app.models.message import IncomingMessage
    from app.services.orchestrator import orchestrator

    incoming = IncomingMessage(
        user_id=user_id,
        text=message,
        channel="web"
    )

    response = orchestrator.handle_message(incoming)

    return {
        "reply": response.message
    }