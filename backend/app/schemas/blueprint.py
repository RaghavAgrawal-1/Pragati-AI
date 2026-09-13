from pydantic import BaseModel, Field


class BlueprintGenerateRequest(BaseModel):
    project_type: str = Field(default="Residential 3BHK House", description="Type of construction (House, Railway Terminal, Commercial, Highway Bridge)")
    location: str = Field(default="Jaipur, Rajasthan", description="City and State")
    plot_width_ft: float = Field(default=30.0, ge=10.0, le=500.0, description="Plot width in feet")
    plot_length_ft: float = Field(default=50.0, ge=10.0, le=1000.0, description="Plot length in feet")
    floors: int = Field(default=1, ge=1, le=10, description="Number of floors / storeys")
    budget_lakhs: float = Field(default=45.0, ge=5.0, description="Target budget in Lakhs INR")
    special_requirements: str | None = Field(default="Vastu compliant, Rainwater harvesting, Solar rooftop orientation", description="User preferences or architectural constraints")


class BlueprintEnhanceRequest(BaseModel):
    project_type: str = Field(default="Residential House", description="Project type")
    location: str = Field(default="Jaipur, Rajasthan", description="Location")
    existing_blueprint_description: str = Field(..., min_length=10, description="Description, room dimensions, or structural notes of existing blueprint")
    floors: int = Field(default=1, ge=1, le=10)


class RoomLayout(BaseModel):
    name: str
    dimensions: str
    area_sqft: float
    orientation: str
    features: str


class BOQItem(BaseModel):
    material: str
    estimated_quantity: str
    unit: str
    approx_cost_inr: str
    benchmark_note: str


class MatchedContractor(BaseModel):
    id: int
    company_name: str
    contractor_class: str
    headquarters: str
    trust_score: float
    rating_grade: str
    badge: str
    on_time_rate_pct: float
    contact_email: str | None = None
    contact_phone: str | None = None
    match_reason: str


class BlueprintResponse(BaseModel):
    project_title: str
    category: str
    location: str
    total_built_up_area_sqft: float
    estimated_construction_cost_lakhs: float
    spatial_layout: list[RoomLayout]
    structural_specifications: dict
    bill_of_quantities: list[BOQItem]
    nbc_compliance_checklist: list[str]
    svg_blueprint_code: str
    enhancement_suggestions: list[str]
    matched_contractors: list[MatchedContractor]
    gemini_architectural_notes: str | None = None
