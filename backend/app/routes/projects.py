from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get(
    "",
    response_model=list[ProjectResponse],
    summary="Get list of infrastructure projects",
)
@router.get(
    "/",
    response_model=list[ProjectResponse],
    include_in_schema=False,
)
def get_projects(
    skip: int = Query(default=0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        default=50, ge=1, le=100, description="Maximum number of records to return (1-100)"
    ),
    db: Session = Depends(get_db),
) -> list[Project]:
    query = select(Project).order_by(Project.id.asc()).offset(skip).limit(limit)
    projects = db.scalars(query).all()
    return list(projects)


@router.post("", response_model=ProjectResponse, status_code=201)
@router.post("/", response_model=ProjectResponse, status_code=201, include_in_schema=False)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    new_project = Project(**project.model_dump())
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db),
):
    existing_project = db.query(Project).filter(Project.id == project_id).first()
    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project.model_dump()
    for key, value in update_data.items():
        setattr(existing_project, key, value)

    db.commit()
    db.refresh(existing_project)
    return existing_project


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}


@router.get("/{project_id}/timeline")
def get_project_timeline(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    progress = float(project.physical_progress or 0)
    start = project.start_date.isoformat() if project.start_date else "2023-01-01"
    orig_comp = project.original_completion_date.isoformat() if project.original_completion_date else "2025-12-31"
    rev_comp = project.revised_completion_date.isoformat() if project.revised_completion_date else orig_comp

    milestones = [
        {
            "name": "Detailed Project Report (DPR) & Approvals",
            "date": start,
            "status": "Completed",
            "completion_pct": 100,
        },
        {
            "name": "Land Acquisition & Right of Way (RoW)",
            "date": start,
            "status": "Completed" if progress >= 30 else "In Progress",
            "completion_pct": min(100, int(progress * 1.5)),
        },
        {
            "name": "Environmental & Forest Clearance (MoEFCC)",
            "date": orig_comp,
            "status": "Completed" if progress >= 60 else ("In Progress" if progress >= 25 else "Pending"),
            "completion_pct": min(100, int(progress * 1.2)),
        },
        {
            "name": "Civil Superstructure & Utility Shifting",
            "date": orig_comp,
            "status": "Completed" if progress >= 85 else ("In Progress" if progress >= 40 else "Pending"),
            "completion_pct": int(progress),
        },
        {
            "name": "Final Commissioning & Commercial Operation",
            "date": rev_comp,
            "status": "Completed" if progress >= 100 else "Pending",
            "completion_pct": 100 if progress >= 100 else 0,
        },
    ]

    return {"project_id": project.id, "milestones": milestones}


@router.get("/{project_id}/performance")
def get_project_performance(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    progress = float(project.physical_progress or 0)
    approved = float(project.approved_cost or 0)
    revised = float(project.revised_cost or approved)

    # 4-quarter performance curve
    series = [
        {"quarter": "Q1", "planned_progress": 25, "actual_progress": round(progress * 0.3, 1), "cost_burn": round(approved * 0.2, 1)},
        {"quarter": "Q2", "planned_progress": 50, "actual_progress": round(progress * 0.6, 1), "cost_burn": round(approved * 0.45, 1)},
        {"quarter": "Q3", "planned_progress": 75, "actual_progress": round(progress * 0.85, 1), "cost_burn": round(revised * 0.7, 1)},
        {"quarter": "Q4", "planned_progress": 100, "actual_progress": round(progress, 1), "cost_burn": round(revised, 1)},
    ]

    return {"project_id": project.id, "series": series}