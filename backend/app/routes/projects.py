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