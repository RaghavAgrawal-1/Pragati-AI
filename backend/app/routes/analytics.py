from collections import Counter
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import Project
from app.services.risk_engine import (
    calculate_cost_risk,
    calculate_progress_risk,
    calculate_status_risk,
)

router = APIRouter(tags=["Analytics & Benchmarking"])


@router.get("/api/analytics/portfolio")
@router.get("/analytics/portfolio")
def get_portfolio_analytics(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    total_projects = len(projects)

    approved = sum(float(p.approved_cost or 0) for p in projects)
    revised = sum(float(p.revised_cost or 0) for p in projects)
    expenditure = sum(float(p.cumulative_expenditure or 0) for p in projects)
    avg_progress = (
        sum(float(p.physical_progress or 0) for p in projects) / total_projects
        if total_projects > 0
        else 0
    )

    by_sector = [
        {"sector": s, "count": c}
        for s, c in Counter(p.sector or "General" for p in projects).most_common()
    ]
    by_ministry = [
        {"ministry": m, "count": c}
        for m, c in Counter(p.ministry or "Central" for p in projects).most_common()
    ]
    by_status = [
        {"status": s, "count": c}
        for s, c in Counter(p.status or "Ongoing" for p in projects).most_common()
    ]

    return {
        "total_projects": total_projects,
        "total_approved_cost": approved,
        "total_revised_cost": revised,
        "total_expenditure": expenditure,
        "average_progress": round(avg_progress, 2),
        "by_sector": by_sector,
        "by_ministry": by_ministry,
        "by_status": by_status,
    }


@router.get("/api/analytics/cost")
@router.get("/analytics/cost")
def get_cost_analytics(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    escalated = []
    for p in projects:
        app = float(p.approved_cost or 0)
        rev = float(p.revised_cost or app)
        if app > 0:
            pct = round(((rev - app) / app) * 100, 2)
            escalated.append({
                "id": p.id,
                "project_name": p.project_name,
                "ministry": p.ministry,
                "sector": p.sector,
                "approved_cost": app,
                "revised_cost": rev,
                "escalation_pct": pct,
                "cost_overrun_inr": max(0.0, rev - app),
            })

    escalated.sort(key=lambda x: x["escalation_pct"], reverse=True)

    critical_count = sum(1 for x in escalated if x["escalation_pct"] > 20)
    high_count = sum(1 for x in escalated if 10 < x["escalation_pct"] <= 20)
    medium_count = sum(1 for x in escalated if 5 < x["escalation_pct"] <= 10)
    normal_count = sum(1 for x in escalated if x["escalation_pct"] <= 5)

    return {
        "total_analyzed": len(escalated),
        "critical_escalations": critical_count,
        "high_escalations": high_count,
        "medium_escalations": medium_count,
        "normal_projects": normal_count,
        "top_escalated_projects": escalated[:15],
    }


@router.get("/api/analytics/benchmark")
@router.get("/analytics/benchmark")
def get_benchmark_analytics(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    agency_data: dict[str, dict] = {}
    for p in projects:
        agency = p.implementing_agency or "Other"
        if agency not in agency_data:
            agency_data[agency] = {
                "agency": agency,
                "project_count": 0,
                "total_progress": 0.0,
                "delayed_count": 0,
                "total_cost": 0.0,
            }
        d = agency_data[agency]
        d["project_count"] += 1
        d["total_progress"] += float(p.physical_progress or 0)
        if str(p.status).lower() in ["delayed", "critical", "stopped"]:
            d["delayed_count"] += 1
        d["total_cost"] += float(p.revised_cost or p.approved_cost or 0)

    benchmarks = []
    for ag, val in agency_data.items():
        cnt = val["project_count"]
        benchmarks.append({
            "agency": ag,
            "project_count": cnt,
            "avg_progress": round(val["total_progress"] / cnt, 1),
            "delay_rate_pct": round((val["delayed_count"] / cnt) * 100, 1),
            "total_outlay_cr": round(val["total_cost"], 1),
        })

    benchmarks.sort(key=lambda x: x["delay_rate_pct"])

    return {
        "agencies_benchmarked": len(benchmarks),
        "rankings": benchmarks,
    }


@router.get("/api/risk")
@router.get("/risk")
def get_portfolio_risk(db: Session = Depends(get_db)):
    projects = db.query(Project).limit(100).all()

    results = []
    for p in projects:
        cost = calculate_cost_risk(p)
        prog = calculate_progress_risk(p)
        stat = calculate_status_risk(p)
        score = min(100, cost["score"] + prog["score"] + stat["score"])
        level = "HIGH" if score >= 70 else ("MEDIUM" if score >= 40 else "LOW")
        reasons = [r for r in [cost["reason"], prog["reason"], stat["reason"]] if r]

        results.append({
            "id": p.id,
            "project_id": p.id,
            "name": p.project_name,
            "riskScore": score,
            "riskLevel": level,
            "costRisk": min(100, cost["score"] * 2.5),
            "timeRisk": min(100, prog["score"] * 2.5),
            "reasons": reasons,
        })

    return {
        "items": results,
        "total": len(results),
        "high_risk_count": sum(1 for r in results if r["riskLevel"] == "HIGH"),
        "medium_risk_count": sum(1 for r in results if r["riskLevel"] == "MEDIUM"),
        "low_risk_count": sum(1 for r in results if r["riskLevel"] == "LOW"),
    }


@router.get("/api/risk/{project_id}")
@router.get("/risk/{project_id}")
def get_project_risk(project_id: int, db: Session = Depends(get_db)):
    p = db.query(Project).filter(Project.id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    cost = calculate_cost_risk(p)
    prog = calculate_progress_risk(p)
    stat = calculate_status_risk(p)
    score = min(100, cost["score"] + prog["score"] + stat["score"])
    level = "HIGH" if score >= 70 else ("MEDIUM" if score >= 40 else "LOW")

    return {
        "id": p.id,
        "project_name": p.project_name,
        "risk_score": score,
        "risk_level": level,
        "cost_score": cost["score"],
        "cost_reason": cost["reason"],
        "progress_score": prog["score"],
        "progress_reason": prog["reason"],
        "status_score": stat["score"],
        "status_reason": stat["reason"],
    }
