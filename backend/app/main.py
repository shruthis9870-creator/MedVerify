from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Add these lines after creating the FastAPI app
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/dashboard", StaticFiles(directory=static_dir, html=True), name="dashboard")

@app.get("/dashboard")
async def serve_dashboard():
    return FileResponse(os.path.join(static_dir, "index.html"))