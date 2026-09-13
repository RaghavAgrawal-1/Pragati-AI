from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contractor import Contractor
from app.schemas.contractor import (
    ContractorCreate,
    ContractorResponse,
    ContractorReviewCreate,
    WorkUpdateCreate,
)
from app.services.contractor_service import (
    add_contractor_review,
    register_new_contractor,
    seed_premier_contractors_if_empty,
    update_contractor_work,
)

router = APIRouter(prefix="/api/contractors", tags=["Contractor Trust Registry"])


@router.get("", response_model=list[ContractorResponse])
@router.get("/", response_model=list[ContractorResponse])
def get_contractors(
    search: str | None = Query(default=None, description="Search by contractor name or registration"),
    sector: str | None = Query(default=None, description="Filter by sector"),
    grade: str | None = Query(default=None, description="Filter by grade (A+, A, B+, B)"),
    sort_by: str = Query(default="trust_score", description="Sort by trust_score, on_time, or name"),
    db: Session = Depends(get_db),
):
    """Retrieve all enrolled contractors and builders with dynamic trust metrics."""
    seed_premier_contractors_if_empty(db)

    query = db.query(Contractor)

    if search:
        pattern = f"%{search.strip()}%"
        query = query.filter(
            (Contractor.company_name.ilike(pattern))
            | (Contractor.registration_no.ilike(pattern))
            | (Contractor.headquarters.ilike(pattern))
        )

    if sector and sector != "ALL":
        query = query.filter(Contractor.sector_specialization.ilike(f"%{sector}%"))

    if grade and grade != "ALL":
        query = query.filter(Contractor.rating_grade == grade)

    contractors = query.all()

    if sort_by == "on_time":
        contractors.sort(key=lambda c: (c.on_time_projects / max(c.total_projects, 1)), reverse=True)
    elif sort_by == "name":
        contractors.sort(key=lambda c: c.company_name.lower())
    else:  # default trust_score
        contractors.sort(key=lambda c: c.trust_score, reverse=True)

    return contractors


@router.get("/summary")
def get_contractor_summary(db: Session = Depends(get_db)):
    """Macro statistics on national infrastructure contractor ecosystem."""
    seed_premier_contractors_if_empty(db)
    contractors = db.query(Contractor).all()

    total_contractors = len(contractors)
    total_projects = sum(c.total_projects for c in contractors)
    total_on_time = sum(c.on_time_projects for c in contractors)
    avg_on_time_pct = round((total_on_time / max(total_projects, 1)) * 100.0, 1)
    tier1_count = sum(1 for c in contractors if c.badge == "TIER_1_PREFERRED")
    avg_trust = round(sum(c.trust_score for c in contractors) / max(total_contractors, 1), 1)

    return {
        "total_contractors": total_contractors,
        "total_projects_monitored": total_projects,
        "overall_on_time_delivery_rate": avg_on_time_pct,
        "tier1_preferred_count": tier1_count,
        "average_trust_score": avg_trust,
    }


@router.get("/{contractor_id}", response_model=ContractorResponse)
def get_contractor_by_id(contractor_id: int, db: Session = Depends(get_db)):
    """Retrieve detailed profile and trust audit dossier of a specific contractor."""
    contractor = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return contractor


@router.post("/register", response_model=ContractorResponse, status_code=201)
def register_contractor(req: ContractorCreate, db: Session = Depends(get_db)):
    """Onboarding endpoint for new contractors/builders entering infrastructure works."""
    existing = (
        db.query(Contractor)
        .filter(
            (Contractor.company_name.ilike(req.company_name))
            | (Contractor.registration_no.ilike(req.registration_no))
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="A contractor with this company name or registration number already exists")

    return register_new_contractor(db, req)


@router.post("/{contractor_id}/update-work", response_model=ContractorResponse)
def post_work_update(contractor_id: int, update: WorkUpdateCreate, db: Session = Depends(get_db)):
    """Update progress milestones on ongoing or completed works to build trust score."""
    updated = update_contractor_work(db, contractor_id, update)
    if not updated:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return updated


@router.post("/{contractor_id}/review", response_model=ContractorResponse)
def submit_review(contractor_id: int, review: ContractorReviewCreate, db: Session = Depends(get_db)):
    """Submit citizen or authority performance review and feedback."""
    updated = add_contractor_review(db, contractor_id, review)
    if not updated:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return updated
