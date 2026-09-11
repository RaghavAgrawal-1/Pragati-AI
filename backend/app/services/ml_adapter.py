from datetime import date

from app.models.project import Project


def calculate_planned_duration_days(project: Project) -> int:
    """
    Calculate planned project duration from
    start date and original completion date.
    """

    if not project.start_date or not project.original_completion_date:
        return 0

    return max(
        0,
        (project.original_completion_date - project.start_date).days
    )


def project_to_ml_features(project: Project) -> dict:
    """
    Convert a database Project object into the
    feature format expected by ml_service.py.
    """

    planned_duration_days = calculate_planned_duration_days(project)

    return {
        # Categorical features
        "sector": project.sector or "Unknown",
        "line_ministry": project.ministry or "Unknown",
        "project_type": project.project_type or "Unknown",
        "implementing_agency": project.implementing_agency or "Unknown",
        "location": project.location or "Unknown",
        "status": project.status or "Unknown",

        # Cost features
        "approved_cost_cr": float(project.approved_cost or 0),

        # Numerical features
        "physical_progress_pct": float(
            project.physical_progress or 0
        ),

        "milestones_total": int(
            project.milestones_total or 0
        ),

        "milestones_completed": int(
            project.milestones_completed or 0
        ),

        "planned_duration_days": planned_duration_days,

        # Date features
        "start_date": (
            project.start_date.isoformat()
            if project.start_date
            else date.today().isoformat()
        ),

        "original_completion_date": (
            project.original_completion_date.isoformat()
            if project.original_completion_date
            else date.today().isoformat()
        ),
    }