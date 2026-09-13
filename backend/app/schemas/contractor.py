from datetime import datetime
from pydantic import BaseModel, Field


class ContractorBase(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255, description="Legal Registered Name")
    registration_no: str = Field(..., min_length=3, max_length=100, description="CIN / GSTIN / PAN / Enlistment ID")
    contractor_class: str = Field(default="Class-1 Super / Mega EPC", description="Enlistment Tier")
    sector_specialization: str = Field(default="Highways & Bridges", description="Primary construction sector")
    headquarters: str = Field(default="New Delhi", description="HQ City, State")
    contact_email: str | None = Field(default=None, description="Official Contact Email")
    contact_phone: str | None = Field(default=None, description="Contact Number")
    established_year: int | None = Field(default=2015, description="Year established")


class ContractorCreate(ContractorBase):
    initial_project_name: str | None = Field(default=None, description="Primary ongoing or recent completed project")
    experience_summary: str | None = Field(default=None, description="Brief highlights of past execution experience")


class ContractorReviewCreate(BaseModel):
    author_name: str = Field(..., description="Reviewer name / Ministry official / Citizen")
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating from 1.0 to 5.0")
    feedback_text: str = Field(..., min_length=5, description="Detailed qualitative feedback")
    delivery_on_time: bool = Field(default=True, description="Was milestone completed on time?")


class WorkUpdateCreate(BaseModel):
    project_name: str = Field(..., description="Project name")
    milestone_name: str = Field(..., description="Milestone completed (e.g. Earthworks, Superstructure)")
    physical_progress_pct: float = Field(..., ge=0.0, le=100.0, description="Current progress %")
    is_completed: bool = Field(default=False, description="Is whole project completed?")
    completed_on_time: bool = Field(default=True, description="Delivered within schedule deadline?")


class ContractorResponse(ContractorBase):
    id: int
    total_projects: int
    on_time_projects: int
    delayed_projects: int
    average_progress_pct: float
    trust_score: float
    rating_grade: str
    badge: str
    status: str
    verified_by: str
    market_reviews_count: int
    market_rating_avg: float
    key_achievements: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
