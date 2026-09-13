from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.intervention import Intervention
from app.models.project import Project

router = APIRouter(tags=["Interventions"])


class InterventionCreate(BaseModel):
    project_name: str
    issue: str
    action: str
    owner: str = "Project Director"
    priority: str = "High"
    deadline: str = "30 Sep 2026"
    bottleneck_category: str = "Land Acquisition"
    project_id: int | None = None


class InterventionUpdate(BaseModel):
    status: str | None = None
    action: str | None = None
    owner: str | None = None
    priority: str | None = None
    deadline: str | None = None


SEED_INTERVENTIONS = [
    {
        "project_name": "Delhi-Varanasi High-Speed Rail Corridor",
        "issue": "Pending Section 19 notification under RFCTLARR Act across 4 districts (340 hectares)",
        "action": "Convene Special Task Force with State Revenue Dept for expedited land compensation awards.",
        "owner": "Divisional Commissioner & NHSRCL GM",
        "priority": "Critical",
        "deadline": "25 Sep 2026",
        "status": "In Progress",
        "bottleneck_category": "Land Acquisition",
    },
    {
        "project_name": "Western Dedicated Freight Corridor (Dadri-JNPT)",
        "issue": "Stage-II Forest Clearance pending with MoEFCC for 18.4 hectares diversion",
        "action": "Submit Net Present Value (NPV) receipt and revised compensatory afforestation compliance.",
        "owner": "Chief Conservator of Forests & DFCCIL Director",
        "priority": "Critical",
        "deadline": "18 Sep 2026",
        "status": "Open",
        "bottleneck_category": "Environmental Clearance",
    },
    {
        "project_name": "Bharatmala Pariyojana NH-44 Six-Laning",
        "issue": "High-tension 220kV power transmission line crossing obstructing package 3 bridge pier",
        "action": "Escalate to State Electricity Transmission Corp (TRANSCO) for fast-tracked line shutdown.",
        "owner": "NHAI Project Director",
        "priority": "High",
        "deadline": "30 Sep 2026",
        "status": "Assigned",
        "bottleneck_category": "Utility Shifting",
    },
    {
        "project_name": "Khurda Road-Bolangir New Broad Gauge Line",
        "issue": "Contractor cashflow distress and stalled earthwork on Km 82-105",
        "action": "Release milestone mobilization advance against bank guarantee and inspect sub-contractor payments.",
        "owner": "East Coast Railway Chief Engineer",
        "priority": "High",
        "deadline": "05 Oct 2026",
        "status": "In Progress",
        "bottleneck_category": "Contractor Liquidity",
    },
    {
        "project_name": "Mumbai Coastal Road Project (Versova-Dahisar)",
        "issue": "Inter-agency coordination delay with Maritime Board for temporary jetty construction",
        "action": "Auto-generate PM GatiShakti Network Planning Group (NPG) inter-ministerial agenda note.",
        "owner": "Municipal Additional Commissioner",
        "priority": "Medium",
        "deadline": "10 Oct 2026",
        "status": "Open",
        "bottleneck_category": "Inter-Agency Coordination",
    },
]


def ensure_seeded_interventions(db: Session):
    count = db.query(Intervention).count()
    if count == 0:
        for seed in SEED_INTERVENTIONS:
            item = Intervention(
                project_name=seed["project_name"],
                issue=seed["issue"],
                action=seed["action"],
                owner=seed["owner"],
                priority=seed["priority"],
                deadline=seed["deadline"],
                status=seed["status"],
                bottleneck_category=seed["bottleneck_category"],
            )
            db.add(item)
        db.commit()


@router.get("/api/interventions")
@router.get("/interventions")
def get_interventions(
    status: str | None = None,
    priority: str | None = None,
    db: Session = Depends(get_db),
):
    ensure_seeded_interventions(db)

    query = db.query(Intervention)
    if status and status.upper() != "ALL":
        query = query.filter(Intervention.status.ilike(status))
    if priority and priority.upper() != "ALL":
        query = query.filter(Intervention.priority.ilike(priority))

    items = query.order_by(Intervention.id.desc()).all()

    return {
        "items": [
            {
                "id": i.id,
                "project_id": i.project_id,
                "project": i.project_name,
                "project_name": i.project_name,
                "issue": i.issue,
                "action": i.action,
                "owner": i.owner,
                "priority": i.priority,
                "deadline": i.deadline,
                "status": i.status,
                "bottleneck_category": i.bottleneck_category,
                "created_at": i.created_at.isoformat() if i.created_at else None,
            }
            for i in items
        ],
        "total": len(items),
    }


@router.post("/api/interventions", status_code=201)
@router.post("/interventions", status_code=201)
def create_intervention(
    payload: InterventionCreate,
    db: Session = Depends(get_db),
):
    new_int = Intervention(
        project_name=payload.project_name,
        issue=payload.issue,
        action=payload.action,
        owner=payload.owner,
        priority=payload.priority,
        deadline=payload.deadline,
        status="Open",
        bottleneck_category=payload.bottleneck_category,
        project_id=payload.project_id,
    )
    db.add(new_int)
    db.commit()
    db.refresh(new_int)

    return {
        "id": new_int.id,
        "project": new_int.project_name,
        "issue": new_int.issue,
        "action": new_int.action,
        "owner": new_int.owner,
        "priority": new_int.priority,
        "deadline": new_int.deadline,
        "status": new_int.status,
        "bottleneck_category": new_int.bottleneck_category,
    }


@router.patch("/api/interventions/{intervention_id}")
@router.patch("/interventions/{intervention_id}")
@router.put("/api/interventions/{intervention_id}")
@router.put("/interventions/{intervention_id}")
def update_intervention(
    intervention_id: int,
    payload: InterventionUpdate,
    db: Session = Depends(get_db),
):
    item = db.query(Intervention).filter(Intervention.id == intervention_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Intervention not found")

    if payload.status is not None:
        item.status = payload.status
    if payload.action is not None:
        item.action = payload.action
    if payload.owner is not None:
        item.owner = payload.owner
    if payload.priority is not None:
        item.priority = payload.priority
    if payload.deadline is not None:
        item.deadline = payload.deadline

    db.commit()
    db.refresh(item)

    return {
        "id": item.id,
        "project": item.project_name,
        "status": item.status,
        "action": item.action,
        "owner": item.owner,
        "priority": item.priority,
        "deadline": item.deadline,
    }
