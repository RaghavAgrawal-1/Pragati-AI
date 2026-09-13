from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.blueprint import (
    BlueprintEnhanceRequest,
    BlueprintGenerateRequest,
    BlueprintResponse,
    MatchedContractor,
)
from app.services.blueprint_engine import (
    audit_and_enhance_blueprint,
    generate_blueprint_plan,
    match_contractors_for_location,
)

router = APIRouter(prefix="/api/blueprint", tags=["AI Blueprint & Location Matching"])


@router.post("/generate", response_model=BlueprintResponse)
def generate_blueprint(req: BlueprintGenerateRequest, db: Session = Depends(get_db)):
    """Generate architectural blueprint layout, SVG diagram, BOQ, and matched local contractors."""
    return generate_blueprint_plan(db, req)


@router.post("/enhance")
def enhance_blueprint(req: BlueprintEnhanceRequest, db: Session = Depends(get_db)):
    """Audit existing blueprint and return structural, green-building, and cost-reduction add-ons."""
    return audit_and_enhance_blueprint(db, req)


@router.get("/contractor-match", response_model=list[MatchedContractor])
def get_contractor_matches(
    location: str = Query(..., description="City or State e.g. Jaipur, Mumbai, Ahmedabad"),
    sector: str = Query(default="Residential", description="Project type / sector"),
    db: Session = Depends(get_db),
):
    """Find verified contractors with high trust scores matching a location and project type."""
    return match_contractors_for_location(db, location, sector)
