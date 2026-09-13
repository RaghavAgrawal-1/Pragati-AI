from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import Project
from app.services.risk_engine import (
    calculate_cost_risk,
    calculate_progress_risk,
    calculate_status_risk,
)

router = APIRouter(tags=["Alerts & Warnings"])

RESOLVED_WARNINGS: set[int] = set()
ACKNOWLEDGED_WARNINGS: set[int] = set()


class ResolveRequest(BaseModel):
    note: str | None = None


def generate_warning_for_project(project: Project):
    cost_res = calculate_cost_risk(project)
    prog_res = calculate_progress_risk(project)
    stat_res = calculate_status_risk(project)

    total_score = cost_res["score"] + prog_res["score"] + stat_res["score"]

    if total_score >= 70:
        severity = "CRITICAL"
    elif total_score >= 40:
        severity = "HIGH"
    elif total_score >= 20:
        severity = "MEDIUM"
    else:
        severity = "LOW"

    reasons = [r for r in [cost_res["reason"], prog_res["reason"], stat_res["reason"]] if r]
    if not reasons:
        reasons = ["Scheduled monitoring checkpoint active"]

    driver = reasons[0]

    if "Cost" in driver or cost_res["score"] >= 30:
        recommendation = "Audit revised cost components and contract variation clauses."
    elif "Progress" in driver or prog_res["score"] >= 30:
        recommendation = "Expedite milestone contractor deployment and inspect critical path."
    elif "Status" in driver or stat_res["score"] >= 30:
        recommendation = "Convene inter-ministerial review committee to remove site bottlenecks."
    else:
        recommendation = "Maintain regular bi-weekly physical inspection cadence."

    status = "Active"
    if project.id in RESOLVED_WARNINGS:
        status = "Resolved"
    elif project.id in ACKNOWLEDGED_WARNINGS:
        status = "Acknowledged"

    approved = float(project.approved_cost or 0)
    revised = float(project.revised_cost or approved)
    cost_prob = round(min(100.0, max(10.0, ((revised - approved) / (approved or 1)) * 100)), 1)
    progress = float(project.physical_progress or 0)
    time_prob = round(min(100.0, max(15.0, (100.0 - progress) * 0.8)), 1)

    return {
        "id": project.id,
        "project_id": project.id,
        "project": project.project_name,
        "project_name": project.project_name,
        "severity": severity,
        "score": total_score,
        "driver": driver,
        "reason": " • ".join(reasons),
        "message": f"{driver} — {recommendation}",
        "recommendation": recommendation,
        "costProbability": cost_prob,
        "timeProbability": time_prob,
        "status": status,
        "detected_at": project.updated_at.isoformat() if project.updated_at else datetime.now(timezone.utc).isoformat(),
        "created_at": project.created_at.isoformat() if project.created_at else datetime.now(timezone.utc).isoformat(),
    }


@router.get("/api/warnings")
@router.get("/warnings")
@router.get("/api/alerts")
def get_warnings(
    limit: int = 100,
    db: Session = Depends(get_db),
):
    projects = db.query(Project).order_by(Project.id.asc()).limit(150).all()
    all_warnings = [generate_warning_for_project(p) for p in projects]

    # Filter out purely low severity to show meaningful alerts
    actionable = [w for w in all_warnings if w["severity"] in ["CRITICAL", "HIGH", "MEDIUM"]]
    actionable.sort(key=lambda w: (0 if w["status"] == "Resolved" else 1, w["score"]), reverse=True)

    counts = {
        "critical": sum(1 for w in actionable if w["severity"] == "CRITICAL" and w["status"] != "Resolved"),
        "high": sum(1 for w in actionable if w["severity"] == "HIGH" and w["status"] != "Resolved"),
        "medium": sum(1 for w in actionable if w["severity"] == "MEDIUM" and w["status"] != "Resolved"),
        "resolved": sum(1 for w in actionable if w["status"] == "Resolved"),
    }

    return {
        "items": actionable[:limit],
        "counts": counts,
        "total": len(actionable),
    }


@router.get("/api/warnings/{warning_id}")
@router.get("/warnings/{warning_id}")
def get_warning_details(
    warning_id: int,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == warning_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Warning not found")

    return generate_warning_for_project(project)


@router.post("/api/warnings/{warning_id}/acknowledge")
@router.post("/warnings/{warning_id}/acknowledge")
def acknowledge_warning(warning_id: int):
    ACKNOWLEDGED_WARNINGS.add(warning_id)
    return {"message": "Warning acknowledged successfully", "id": warning_id, "status": "Acknowledged"}


@router.post("/api/warnings/{warning_id}/resolve")
@router.post("/warnings/{warning_id}/resolve")
def resolve_warning(
    warning_id: int,
    payload: ResolveRequest | None = None,
):
    RESOLVED_WARNINGS.add(warning_id)
    return {
        "message": "Warning resolved successfully",
        "id": warning_id,
        "status": "Resolved",
        "note": payload.note if payload else None,
    }
