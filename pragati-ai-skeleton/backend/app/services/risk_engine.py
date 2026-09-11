# app/services/risk_engine.py


def calculate_cost_risk(project):
    if not project.approved_cost or float(project.approved_cost) <= 0 or not project.revised_cost:
        return {
            "score": 0,
            "reason": "Cost data unavailable or initial approved cost is zero"
        }

    approved = float(project.approved_cost)
    revised = float(project.revised_cost)

    increase = ((revised - approved) / approved) * 100

    # No cost escalation
    if increase <= 0:
        return {
            "score": 0,
            "reason": "No cost escalation detected"
        }

    if increase > 20:
        score = 40
    elif increase > 10:
        score = 30
    elif increase > 5:
        score = 20
    else:
        score = 10

    return {
        "score": score,
        "reason": f"Cost increased by {round(increase, 2)}%"
    }


def calculate_progress_risk(project):
    if project.physical_progress is None:
        return {
            "score": 0,
            "reason": "Progress data unavailable"
        }

    progress = float(project.physical_progress)

    if progress < 30:
        score = 40
    elif progress < 50:
        score = 30
    elif progress < 70:
        score = 15
    else:
        score = 5

    return {
        "score": score,
        "reason": f"Current progress is {progress}%"
    }


def calculate_status_risk(project):
    if not project.status:
        return {
            "score": 0,
            "reason": "Status unavailable"
        }

    status = project.status.lower()

    if status in ["delayed", "stopped", "critical"]:
        return {
            "score": 30,
            "reason": f"Project status is {project.status}"
        }
    elif status in ["running", "ongoing", "in progress"]:
        return {
            "score": 5,
            "reason": f"Project status is {project.status}"
        }

    return {
        "score": 10,
        "reason": f"Project status is {project.status}"
    }


def generate_risk_report(project):
    cost = calculate_cost_risk(project)
    progress = calculate_progress_risk(project)
    status = calculate_status_risk(project)

    total_score = cost["score"] + progress["score"] + status["score"]

    if total_score >= 70:
        level = "HIGH"
    elif total_score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    factors = [cost["reason"], progress["reason"], status["reason"]]

    return {
        "risk_score": total_score,
        "risk_level": level,
        "factors": factors,
        "recommendations": get_recommendations(level)
    }


def get_recommendations(level):
    if level == "HIGH":
        return [
            "Increase project monitoring",
            "Review budget allocation",
            "Analyze delay reasons",
            "Conduct stakeholder review meeting"
        ]
    elif level == "MEDIUM":
        return [
            "Track milestones regularly",
            "Review resource utilization",
            "Monitor expenditure growth"
        ]

    return [
        "Project performing normally",
        "Continue regular monitoring"
    ]