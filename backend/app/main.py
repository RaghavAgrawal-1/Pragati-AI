import sys
from pathlib import Path
# Add project root to Python path so ML modules can be imported
PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.routes.vision import router as vision_router
from app.routes.assistant import router as assistant_router
from app.routes.predictions import router as predictions_router
from app.routes.alerts import router as alerts_router
from app.routes.interventions import router as interventions_router
from app.routes.analytics import router as analytics_router
from app.routes.contractors import router as contractors_router
from app.routes.blueprint import router as blueprint_router

from app.api.auth import router as auth_router
from app.core.config import settings
from app.db.database import engine
from app.routes.agent import router as agent_router
from app.routes.dashboard import router as dashboard_router
from app.routes.projects import router as projects_router


app = FastAPI(
    title=settings.app_name,
    description="AI-powered infrastructure project monitoring and early warning platform",
    version=settings.app_version,
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# API ROUTES
# ---------------------------------------------------------

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(agent_router)
app.include_router(dashboard_router)
app.include_router(vision_router)
app.include_router(assistant_router)
app.include_router(predictions_router)
app.include_router(alerts_router)
app.include_router(interventions_router)
app.include_router(analytics_router)
app.include_router(contractors_router)
app.include_router(blueprint_router)


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

@app.get("/health", tags=["System"])
def health_check():
    return {
        "status": "ok",
        "service": settings.app_name,
    }


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