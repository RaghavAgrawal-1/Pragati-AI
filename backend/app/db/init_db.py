from datetime import date
import app.models
from app.core.security import hash_password
from app.db.database import Base, engine
from app.db.session import SessionLocal
from app.models.project import Project
from app.models.user import User


def init_db():
    Base.metadata.create_all(bind=engine)
    try:
        with SessionLocal() as db:
            if db.query(User).count() == 0:
                demo_users = [
                    User(
                        name="Project Officer",
                        email="admin@pragati.ai",
                        password_hash=hash_password("password123"),
                        role="Project Monitoring Officer",
                    ),
                    User(
                        name="Officer in Charge",
                        email="officer@pragati.gov.in",
                        password_hash=hash_password("password123"),
                        role="Project Monitoring Officer",
                    ),
                ]
                db.add_all(demo_users)
                db.commit()
                print("Seeded demo users successfully.", flush=True)

            if db.query(Project).count() == 0:
                demo_projects = [
                    Project(
                        project_code="PRJ-DMIC-04",
                        project_name="Delhi-Mumbai Industrial Expressway (Package 4)",
                        sector="Road Transport & Highways",
                        ministry="Ministry of Road Transport and Highways",
                        implementing_agency="NHAI",
                        project_type="Expressway",
                        location="Maharashtra / Gujarat",
                        approved_cost=18400.0,
                        revised_cost=21200.0,
                        physical_progress=68.5,
                        milestones_total=14,
                        milestones_completed=9,
                        start_date=date(2022, 1, 15),
                        original_completion_date=date(2025, 6, 30),
                        status="Ongoing",
                    ),
                    Project(
                        project_code="PRJ-DFC-W",
                        project_name="Dedicated Freight Corridor (Western Section)",
                        sector="Railways",
                        ministry="Ministry of Railways",
                        implementing_agency="DFCCIL",
                        project_type="Freight Corridor",
                        location="Rajasthan / Haryana",
                        approved_cost=51100.0,
                        revised_cost=58400.0,
                        physical_progress=82.0,
                        milestones_total=20,
                        milestones_completed=16,
                        start_date=date(2020, 8, 1),
                        original_completion_date=date(2025, 12, 31),
                        status="Ongoing",
                    ),
                    Project(
                        project_code="PRJ-KHAVDA-30",
                        project_name="Khavda Renewable Ultra Mega Solar Park (30GW)",
                        sector="Power & Renewable Energy",
                        ministry="Ministry of Power",
                        implementing_agency="NTPC",
                        project_type="Solar Park",
                        location="Gujarat",
                        approved_cost=32000.0,
                        revised_cost=32000.0,
                        physical_progress=44.0,
                        milestones_total=12,
                        milestones_completed=5,
                        start_date=date(2023, 3, 10),
                        original_completion_date=date(2026, 9, 30),
                        status="Ongoing",
                    ),
                    Project(
                        project_code="PRJ-MTHL-02",
                        project_name="Mumbai Trans Harbour Link Expansion (Phase 2)",
                        sector="Urban Development",
                        ministry="MoHUA",
                        implementing_agency="MMRDA",
                        project_type="Sea Bridge & Link",
                        location="Maharashtra",
                        approved_cost=17843.0,
                        revised_cost=19500.0,
                        physical_progress=91.0,
                        milestones_total=10,
                        milestones_completed=9,
                        start_date=date(2021, 5, 20),
                        original_completion_date=date(2024, 11, 15),
                        status="Ongoing",
                    ),
                    Project(
                        project_code="PRJ-BARMER-01",
                        project_name="Barmer Oil Refinery & Petrochemical Complex",
                        sector="Petroleum & Natural Gas",
                        ministry="MoPNG",
                        implementing_agency="HPCL Rajasthan Refinery Ltd",
                        project_type="Refinery",
                        location="Rajasthan",
                        approved_cost=43129.0,
                        revised_cost=72937.0,
                        physical_progress=61.0,
                        milestones_total=18,
                        milestones_completed=11,
                        start_date=date(2019, 10, 1),
                        original_completion_date=date(2024, 12, 31),
                        status="Critical",
                    ),
                    Project(
                        project_code="PRJ-NICOBAR-01",
                        project_name="Great Nicobar International Transshipment Port",
                        sector="Ports, Shipping & Waterways",
                        ministry="Ministry of Ports, Shipping and Waterways",
                        implementing_agency="IPA",
                        project_type="Port",
                        location="Andaman & Nicobar Islands",
                        approved_cost=41000.0,
                        revised_cost=41000.0,
                        physical_progress=12.0,
                        milestones_total=15,
                        milestones_completed=2,
                        start_date=date(2023, 6, 1),
                        original_completion_date=date(2028, 6, 30),
                        status="Delayed",
                    ),
                ]
                db.add_all(demo_projects)
                db.commit()
                print("Seeded demo infrastructure projects successfully.", flush=True)
    except Exception as e:
        print(f"Error seeding database: {e}", flush=True)


if __name__ == "__main__":
    init_db()