from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.project import Project


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db)
):

    total_projects = db.query(Project).count()

    avg_progress = (
        db.query(func.avg(Project.physical_progress))
        .scalar()
    )

    return {
        "total_projects": total_projects,
        "average_progress": round(avg_progress or 0, 2)
    }


@router.get("/projects-status")
def projects_status(
    db: Session = Depends(get_db)
):

    projects = db.query(Project).all()

    return [
        {
            "id": project.id,
            "name": project.project_name,
            "status": project.status,
            "progress": project.physical_progress
        }
        for project in projects
    ]