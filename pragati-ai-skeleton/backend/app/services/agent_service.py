from app.services.risk_engine import (
    calculate_cost_risk,
    calculate_progress_risk,
    calculate_status_risk,
    get_recommendations,
)


def analyze_project(project):
    risk_score = 0
    reasons = []

    # -------------------------
    # Cost Risk Analysis
    # -------------------------
    cost_result = calculate_cost_risk(project)
    risk_score += cost_result["score"]
    if cost_result["reason"]:
        reasons.append(cost_result["reason"])

    # -------------------------
    # Progress Risk Analysis
    # -------------------------
    progress_result = calculate_progress_risk(project)
    risk_score += progress_result["score"]
    if progress_result["reason"]:
        reasons.append(progress_result["reason"])

    # -------------------------
    # Status Risk Analysis
    # -------------------------
    status_result = calculate_status_risk(project)
    risk_score += status_result["score"]
    if status_result["reason"]:
        reasons.append(status_result["reason"])

    # -------------------------
    # Final Risk Decision
    # -------------------------
    if risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "project": project.project_name,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommendations": get_recommendations(risk_level),
    }