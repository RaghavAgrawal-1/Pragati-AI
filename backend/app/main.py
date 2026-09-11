import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from app.routes.agent import router as agent_router

from app.routes.dashboard import router as dashboard_router

from app.core.config import settings
from app.db.database import engine
from app.routes.projects import router as projects_router

app = FastAPI(
    title=settings.app_name,
    description="AI-powered infrastructure project monitoring and early warning platform",
    version=settings.app_version,
)

app.include_router(projects_router)
app.include_router(agent_router)
app.include_router(dashboard_router)


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "service": settings.app_name}


@app.get("/health/db", tags=["System"])
def database_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "database": "connected",
        }

    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "error",
                "database": "disconnected",
                "error": str(e),
            },
        )