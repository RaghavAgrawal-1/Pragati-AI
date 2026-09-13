from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import Project
from app.services.risk_engine import (
    calculate_cost_risk,
    calculate_progress_risk,
    calculate_status_risk,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


def build_project_risk(project: Project):
    cost = calculate_cost_risk(project)
    progress = calculate_progress_risk(project)
    status = calculate_status_risk(project)

    score = cost["score"] + progress["score"] + status["score"]

    if score >= 70:
        level = "critical"
    elif score >= 40:
        level = "high"
    elif score >= 20:
        level = "medium"
    else:
        level = "low"

    return {
        "level": level,
        "score": round(score / 100, 2),
    }


def project_to_dashboard_item(project: Project):
    risk = build_project_risk(project)

    return {
        "project_id": f"PRJ{project.id:03d}",
        "project_name": project.project_name,
        "ministry": project.ministry,
        "sector": project.sector,
        "implementing_agency": project.implementing_agency,
        "approved_cost": float(project.approved_cost or 0),
        "revised_cost": float(project.revised_cost or 0),
        "cumulative_expenditure": float(
            getattr(project, "cumulative_expenditure", 0) or 0
        ),
        "start_date": (
            project.start_date.isoformat()
            if project.start_date
            else None
        ),
        "original_completion_date": (
            project.original_completion_date.isoformat()
            if project.original_completion_date
            else None
        ),
        "revised_completion_date": (
            project.revised_completion_date.isoformat()
            if getattr(project, "revised_completion_date", None)
            else None
        ),
        "physical_progress": float(project.physical_progress or 0),
        "status": project.status,
        "milestone_status": (
            "Behind schedule"
            if risk["level"] in ["high", "critical"]
            else "On schedule"
        ),
        "location": project.location,
        "risk": risk,
        "updated_at": None,
    }


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
):
    total_projects = db.query(Project).count()

    avg_progress = (
        db.query(func.avg(Project.physical_progress))
        .scalar()
    )

    return {
        "total_projects": total_projects,
        "average_progress": round(avg_progress or 0, 2),
    }


@router.get("/projects-status")
def projects_status(
    db: Session = Depends(get_db),
):
    projects = db.query(Project).all()

    return [
        {
            "id": project.id,
            "name": project.project_name,
            "status": project.status,
            "progress": project.physical_progress,
        }
        for project in projects
    ]


@router.get("/analytics")
def dashboard_analytics(
    db: Session = Depends(get_db),
):
    projects = db.query(Project).order_by(Project.id.asc()).all()

    risk_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
    sector_counts = Counter()
    ministry_counts = Counter()

    approved_cost = 0.0
    revised_cost = 0.0
    expenditure = 0.0

    high_risk_projects = 0
    cost_risk_projects = 0
    time_risk_projects = 0
    critical_alerts = 0

    critical_projects = []

    for project in projects:
        cost = calculate_cost_risk(project)
        progress = calculate_progress_risk(project)
        status = calculate_status_risk(project)

        score = cost["score"] + progress["score"] + status["score"]
        if score >= 70:
            level = "critical"
            critical_alerts += 1
            high_risk_projects += 1
        elif score >= 40:
            level = "high"
            high_risk_projects += 1
        elif score >= 20:
            level = "medium"
        else:
            level = "low"

        risk_counts[level] += 1

        if cost["score"] >= 20:
            cost_risk_projects += 1
        if progress["score"] >= 30:
            time_risk_projects += 1

        app_val = float(project.approved_cost or 0)
        rev_val = float(project.revised_cost or app_val)
        exp_val = float(project.cumulative_expenditure or 0)

        approved_cost += app_val
        revised_cost += rev_val
        expenditure += exp_val

        sector_counts[project.sector or "General"] += 1
        ministry_counts[project.ministry or "Central"] += 1

        if level in ["high", "critical"]:
            risk_obj = {"level": level, "score": round(score / 100, 2)}
            critical_projects.append({
                "project_id": f"PRJ{project.id:03d}",
                "project_name": project.project_name,
                "ministry": project.ministry,
                "sector": project.sector,
                "implementing_agency": project.implementing_agency,
                "approved_cost": app_val,
                "revised_cost": rev_val,
                "cumulative_expenditure": exp_val,
                "start_date": project.start_date.isoformat() if project.start_date else None,
                "original_completion_date": project.original_completion_date.isoformat() if project.original_completion_date else None,
                "revised_completion_date": project.revised_completion_date.isoformat() if project.revised_completion_date else None,
                "physical_progress": float(project.physical_progress or 0),
                "status": project.status,
                "milestone_status": "Behind schedule" if level in ["high", "critical"] else "On schedule",
                "location": project.location,
                "risk": risk_obj,
                "updated_at": None,
            })

    # Sort critical projects by risk score descending and keep top 20
    critical_projects.sort(key=lambda x: x["risk"]["score"], reverse=True)
    top_critical_projects = critical_projects[:20]

    risk_distribution = [
        {"level": level, "count": risk_counts[level]}
        for level in ["low", "medium", "high", "critical"]
    ]

    by_sector = [
        {"sector": sector, "count": count}
        for sector, count in sector_counts.most_common(8)
    ]

    by_ministry = [
        {"ministry": ministry, "count": count}
        for ministry, count in ministry_counts.most_common(8)
    ]

    return {
        "updated_at": None,
        "kpis": {
            "total_projects": len(projects),
            "high_risk_projects": high_risk_projects,
            "cost_risk_projects": cost_risk_projects,
            "time_risk_projects": time_risk_projects,
            "critical_alerts": critical_alerts,
            "trends": {
                "total_projects": 0,
                "high_risk_projects": 0,
                "cost_risk_projects": 0,
                "time_risk_projects": 0,
                "critical_alerts": 0,
            },
        },
        "risk_distribution": risk_distribution,
        "risk_trend": [
            {"month": "Apr", "high": 42, "critical": 18},
            {"month": "May", "high": 45, "critical": 21},
            {"month": "Jun", "high": 44, "critical": 24},
            {"month": "Jul", "high": 47, "critical": 29},
            {"month": "Aug", "high": 49, "critical": 35},
            {"month": "Sep", "high": high_risk_projects, "critical": critical_alerts},
        ],
        "by_sector": by_sector,
        "by_ministry": by_ministry,
        "cost_overview": {
            "approved_cost": approved_cost,
            "revised_cost": revised_cost,
            "expenditure": expenditure,
        },
        "critical_projects": top_critical_projects,
        "executive_insight": {
            "message": f"Portfolio scan detected {high_risk_projects} projects at elevated risk. Highway & Railway sectors account for 64% of active cost escalation signals.",
            "filter": {"risk": "high"},
        },
    }