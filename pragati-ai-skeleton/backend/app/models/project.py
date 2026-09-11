from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_code: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    project_name: Mapped[str] = mapped_column(String(500), nullable=False)
    ministry: Mapped[str | None] = mapped_column(String(255), nullable=True)
    sector: Mapped[str | None] = mapped_column(String(255), nullable=True)
    implementing_agency: Mapped[str | None] = mapped_column(String(255), nullable=True)

    approved_cost: Mapped[Decimal | None] = mapped_column(Numeric(18, 2), nullable=True)
    revised_cost: Mapped[Decimal | None] = mapped_column(Numeric(18, 2), nullable=True)
    cumulative_expenditure: Mapped[Decimal | None] = mapped_column(
        Numeric(18, 2), nullable=True
    )

    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    original_completion_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    revised_completion_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    physical_progress: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2), nullable=True
    )
    status: Mapped[str | None] = mapped_column(String(100), nullable=True)
    milestone_status: Mapped[str | None] = mapped_column(String(255), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
