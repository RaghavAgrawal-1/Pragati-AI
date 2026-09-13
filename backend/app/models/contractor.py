from datetime import datetime
from sqlalchemy import DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Contractor(Base):
    __tablename__ = "contractors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    registration_no: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    contractor_class: Mapped[str] = mapped_column(String(100), nullable=False, default="Class-1 Super / Mega EPC")
    sector_specialization: Mapped[str] = mapped_column(String(255), nullable=False, default="Highways & Bridges")
    headquarters: Mapped[str] = mapped_column(String(255), nullable=False, default="New Delhi")
    contact_email: Mapped[str] = mapped_column(String(255), nullable=True)
    contact_phone: Mapped[str] = mapped_column(String(50), nullable=True)
    established_year: Mapped[int] = mapped_column(Integer, nullable=True, default=2010)

    # Performance & Trust metrics
    total_projects: Mapped[int] = mapped_column(Integer, default=0)
    on_time_projects: Mapped[int] = mapped_column(Integer, default=0)
    delayed_projects: Mapped[int] = mapped_column(Integer, default=0)
    average_progress_pct: Mapped[float] = mapped_column(Float, default=0.0)
    trust_score: Mapped[float] = mapped_column(Float, default=70.0)  # 0 to 100
    rating_grade: Mapped[str] = mapped_column(String(10), default="A")  # A+, A, B+, B, NEW_ENTRANT
    badge: Mapped[str] = mapped_column(String(50), default="VERIFIED_PARTNER")
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE_VERIFIED")
    verified_by: Mapped[str] = mapped_column(String(150), default="MoSPI & PM GatiShakti Portal")

    # Reviews
    market_reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    market_rating_avg: Mapped[float] = mapped_column(Float, default=4.5)  # 1.0 to 5.0
    key_achievements: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
