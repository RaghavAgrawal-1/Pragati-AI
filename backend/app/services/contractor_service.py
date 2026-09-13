import json
from sqlalchemy.orm import Session
from app.models.contractor import Contractor
from app.schemas.contractor import ContractorCreate, ContractorReviewCreate, WorkUpdateCreate


def compute_contractor_scores(c: Contractor) -> None:
    """Dynamically computes Trust Score, Grade, and Badges based on performance telemetry."""
    total = max(c.total_projects, 1)
    on_time_pct = (c.on_time_projects / total) * 100.0

    # Weighted calculation
    score = (on_time_pct * 0.45) + (c.average_progress_pct * 0.25) + ((c.market_rating_avg / 5.0) * 20.0)
    score -= (c.delayed_projects * 3.5)

    # Experience bonus
    years_in_business = 2026 - (c.established_year or 2018)
    if years_in_business > 15:
        score += 8.0
    elif years_in_business > 5:
        score += 4.0

    c.trust_score = round(max(30.0, min(99.0, score)), 1)

    if c.trust_score >= 90.0:
        c.rating_grade = "A+"
        c.badge = "TIER_1_PREFERRED"
    elif c.trust_score >= 80.0:
        c.rating_grade = "A"
        c.badge = "ON_TIME_EXCELLENCE" if on_time_pct >= 75.0 else "VERIFIED_PARTNER"
    elif c.trust_score >= 70.0:
        c.rating_grade = "B+"
        c.badge = "VERIFIED_PARTNER"
    else:
        c.rating_grade = "B"
        c.badge = "UNDER_MONITORING"


def seed_premier_contractors_if_empty(db: Session) -> None:
    """Pre-seeds the national contractor trust directory with India's flagship EPC leaders."""
    if db.query(Contractor).first() is not None:
        return

    premier_data = [
        {
            "company_name": "Larsen & Toubro (L&T) Construction",
            "registration_no": "CIN-L99999MH1946PLC004768",
            "contractor_class": "Class-1 Super / Mega Infrastructure",
            "sector_specialization": "High-Speed Rail & Mega Expressways",
            "headquarters": "Mumbai, Maharashtra",
            "contact_email": "infra@larsentoubro.com",
            "contact_phone": "+91-22-67525656",
            "established_year": 1946,
            "total_projects": 32,
            "on_time_projects": 30,
            "delayed_projects": 2,
            "average_progress_pct": 94.5,
            "market_rating_avg": 4.9,
            "market_reviews_count": 142,
            "verified_by": "MoSPI & PM GatiShakti Verified Tier-1",
            "key_achievements": "Mumbai-Ahmedabad Bullet Train C4 package ahead of schedule; 14 bridge river spans launched in record 90 days; Zero fatal safety incidents.",
        },
        {
            "company_name": "Afcons Infrastructure Ltd",
            "registration_no": "CIN-U45200MH1976PLC019335",
            "contractor_class": "Class-1 Super / Mega Infrastructure",
            "sector_specialization": "Tunnels, Marine & Metro Viaducts",
            "headquarters": "Mumbai, Maharashtra",
            "contact_email": "tenders@afcons.com",
            "contact_phone": "+91-22-67191000",
            "established_year": 1959,
            "total_projects": 21,
            "on_time_projects": 19,
            "delayed_projects": 2,
            "average_progress_pct": 91.2,
            "market_rating_avg": 4.8,
            "market_reviews_count": 89,
            "verified_by": "MoSPI & PM GatiShakti Verified Tier-1",
            "key_achievements": "Atal Tunnel Rohtang breakthrough; underwater metro tunnel under Hooghly River; Chenab bridge approach arch viaduct.",
        },
        {
            "company_name": "Tata Projects Ltd",
            "registration_no": "CIN-U45203TG1979PLC050528",
            "contractor_class": "Class-1 Super / Mega Infrastructure",
            "sector_specialization": "Urban Transit, Power Transmission & Smart Cities",
            "headquarters": "Hyderabad & Mumbai",
            "contact_email": "contactus@tataprojects.com",
            "contact_phone": "+91-40-66238801",
            "established_year": 1979,
            "total_projects": 24,
            "on_time_projects": 21,
            "delayed_projects": 3,
            "average_progress_pct": 89.0,
            "market_rating_avg": 4.7,
            "market_reviews_count": 115,
            "verified_by": "MoSPI & PM GatiShakti Verified Tier-1",
            "key_achievements": "New Parliament Building delivery; DFC Eastern Corridor heavy freight track doubling; automated ballastless track laying.",
        },
        {
            "company_name": "Dilip Buildcon Ltd (DBL)",
            "registration_no": "CIN-L45201MP2006PLC018689",
            "contractor_class": "Class-A Highway & Expressway EPC",
            "sector_specialization": "National Highways, Mining & Cable Stayed Bridges",
            "headquarters": "Bhopal, Madhya Pradesh",
            "contact_email": "contracts@dilipbuildcon.co.in",
            "contact_phone": "+91-755-4029999",
            "established_year": 2006,
            "total_projects": 19,
            "on_time_projects": 16,
            "delayed_projects": 3,
            "average_progress_pct": 86.4,
            "market_rating_avg": 4.6,
            "market_reviews_count": 78,
            "verified_by": "NHAI Enlisted National Contractor",
            "key_achievements": "Zuari Bridge Goa 8-lane cable-stayed link; continuous 24-hour bituminous concrete paving national record holder.",
        },
        {
            "company_name": "NCC Limited",
            "registration_no": "CIN-L72200TG1990PLC011146",
            "contractor_class": "Class-A Highway & Rail Transit",
            "sector_specialization": "Water Supply, Highways & Institutional Buildings",
            "headquarters": "Hyderabad, Telangana",
            "contact_email": "info@nccltd.in",
            "contact_phone": "+91-40-23268888",
            "established_year": 1990,
            "total_projects": 16,
            "on_time_projects": 13,
            "delayed_projects": 3,
            "average_progress_pct": 82.5,
            "market_rating_avg": 4.4,
            "market_reviews_count": 52,
            "verified_by": "CPWD & State PWD Approved",
            "key_achievements": "Bangalore Metro Phase 2 elevated viaduct package; Nagpur AIIMS institutional complex delivered within budget.",
        },
        {
            "company_name": "KNR Constructions Ltd",
            "registration_no": "CIN-L74210DL1995PLC130833",
            "contractor_class": "Class-A Expressway & Irrigation",
            "sector_specialization": "HAM / EPC Roadways & Flyovers",
            "headquarters": "Hyderabad, Telangana",
            "contact_email": "info@knrcl.com",
            "contact_phone": "+91-40-40268761",
            "established_year": 1995,
            "total_projects": 14,
            "on_time_projects": 13,
            "delayed_projects": 1,
            "average_progress_pct": 88.5,
            "market_rating_avg": 4.6,
            "market_reviews_count": 41,
            "verified_by": "NHAI Qualified Class-A Partner",
            "key_achievements": "Trichy-Kallagam NH section commissioned 6 months ahead of schedule with early completion bonus.",
        },
    ]

    for item in premier_data:
        contractor = Contractor(**item)
        compute_contractor_scores(contractor)
        db.add(contractor)

    db.commit()


def register_new_contractor(db: Session, req: ContractorCreate) -> Contractor:
    """Registers a new contractor/builder wishing to join infrastructure projects."""
    initial_achievements = req.experience_summary or (
        f"Registered new infrastructure participant. Initial work commitment: {req.initial_project_name or 'Regional EPC Subcontract'}."
    )
    contractor = Contractor(
        company_name=req.company_name,
        registration_no=req.registration_no,
        contractor_class=req.contractor_class,
        sector_specialization=req.sector_specialization,
        headquarters=req.headquarters,
        contact_email=req.contact_email,
        contact_phone=req.contact_phone,
        established_year=req.established_year or 2020,
        total_projects=1 if req.initial_project_name else 0,
        on_time_projects=1 if req.initial_project_name else 0,
        delayed_projects=0,
        average_progress_pct=25.0 if req.initial_project_name else 0.0,
        trust_score=75.0,
        rating_grade="B+",
        badge="VERIFIED_PARTNER",
        status="ACTIVE_VERIFIED",
        verified_by="PM GatiShakti Registered Entrant",
        market_reviews_count=1,
        market_rating_avg=4.5,
        key_achievements=initial_achievements,
    )
    compute_contractor_scores(contractor)
    db.add(contractor)
    db.commit()
    db.refresh(contractor)
    return contractor


def update_contractor_work(db: Session, contractor_id: int, update: WorkUpdateCreate) -> Contractor:
    """Updates contractor's ongoing work, recalculating on-time metrics and trust scores."""
    c = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not c:
        return None

    if update.is_completed:
        c.total_projects += 1
        if update.completed_on_time:
            c.on_time_projects += 1
        else:
            c.delayed_projects += 1

    c.average_progress_pct = round((c.average_progress_pct + update.physical_progress_pct) / 2.0, 1)
    
    # Append to key achievements
    update_note = f"Updated milestone: {update.milestone_name} ({update.physical_progress_pct}% on {update.project_name})."
    if c.key_achievements:
        c.key_achievements = f"{c.key_achievements} • {update_note}"
    else:
        c.key_achievements = update_note

    compute_contractor_scores(c)
    db.commit()
    db.refresh(c)
    return c


def add_contractor_review(db: Session, contractor_id: int, review: ContractorReviewCreate) -> Contractor:
    """Adds citizen or authority review, recalculating market score and on-time validation."""
    c = db.query(Contractor).filter(Contractor.id == contractor_id).first()
    if not c:
        return None

    new_count = c.market_reviews_count + 1
    c.market_rating_avg = round(((c.market_rating_avg * c.market_reviews_count) + review.rating) / new_count, 2)
    c.market_reviews_count = new_count

    if review.delivery_on_time and review.rating >= 4.0:
        c.on_time_projects += 1
        c.total_projects = max(c.total_projects, c.on_time_projects)

    compute_contractor_scores(c)
    db.commit()
    db.refresh(c)
    return c
