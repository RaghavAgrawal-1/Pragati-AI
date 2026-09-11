from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.analysis import ProjectAnalysis
from app.models.project import Project
from app.services.agent_service import analyze_project

router = APIRouter(prefix="/api/agent", tags=["AI Agent"])


# -------------------------------
# Analyze Project using AI Agent
# -------------------------------

@router.post("/analyze/{project_id}")
def analyze(
    project_id: int,
    db: Session = Depends(get_db)
):
    # Fetch project
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Run AI analysis
    result = analyze_project(project)

    # Save AI result
    recs = result.get("recommendations", result.get("recommendation", []))
    analysis = ProjectAnalysis(
        project_id=project.id,
        risk_score=result.get("risk_score", 0),
        risk_level=result.get("risk_level", "UNKNOWN"),
        explanation=", ".join(result.get("reasons", [])),
        recommendations=", ".join(recs) if isinstance(recs, list) else str(recs),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "message": "AI analysis completed",
        "analysis_id": analysis.id,
        "project_id": project.id,
        "result": result
    }


# -------------------------------
# Get Analysis History
# -------------------------------

@router.get("/history/{project_id}")
def get_analysis_history(
    project_id: int,
    db: Session = Depends(get_db)
):
    # Check project exists
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    analyses = (
        db.query(ProjectAnalysis)
        .filter(ProjectAnalysis.project_id == project_id)
        .order_by(ProjectAnalysis.created_at.desc())
        .all()
    )

    return {
        "project_id": project_id,
        "total_analysis": len(analyses),
        "history": analyses
    }