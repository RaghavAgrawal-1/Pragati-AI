from app.services.risk_engine import (
    calculate_cost_risk,
    calculate_progress_risk,
    calculate_status_risk,
    get_recommendations,
)

from app.services.ml_adapter import project_to_ml_features
from ml.ml_service import predict_project_risk


def analyze_project(project):
    risk_score = 0
    reasons = []

    # -------------------------
    # Rule-Based Cost Risk
    # -------------------------
    cost_result = calculate_cost_risk(project)
    risk_score += cost_result["score"]

    if cost_result["reason"]:
        reasons.append(cost_result["reason"])

    # -------------------------
    # Rule-Based Progress Risk
    # -------------------------
    progress_result = calculate_progress_risk(project)
    risk_score += progress_result["score"]

    if progress_result["reason"]:
        reasons.append(progress_result["reason"])

    # -------------------------
    # Rule-Based Status Risk
    # -------------------------
    status_result = calculate_status_risk(project)
    risk_score += status_result["score"]

    if status_result["reason"]:
        reasons.append(status_result["reason"])

    # -------------------------
    # Rule-Based Risk Level
    # -------------------------
    if risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # -------------------------
    # ML Prediction
    # -------------------------
    ml_features = project_to_ml_features(project)
    ml_prediction = predict_project_risk(ml_features)

    # -------------------------
    # Final Response
    # -------------------------
    return {
        "project": project.project_name,

        # Existing rule-based analysis
        "risk_score": risk_score,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommendations": get_recommendations(risk_level),

        # ML prediction
        "ml_prediction": ml_prediction,
    }