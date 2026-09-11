from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    project_code: str
    project_name: str
    ministry: str | None = None
    sector: str | None = None
    implementing_agency: str | None = None

    approved_cost: Decimal | None = None
    revised_cost: Decimal | None = None
    cumulative_expenditure: Decimal | None = None

    start_date: date | None = None
    original_completion_date: date | None = None
    revised_completion_date: date | None = None

    physical_progress: Decimal | None = Field(default=None, ge=0, le=100)
    status: str | None = None
    milestone_status: str | None = None
    location: str | None = None
    description: str | None = None


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)