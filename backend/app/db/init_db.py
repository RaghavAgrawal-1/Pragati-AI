import app.models
from app.db.database import Base, engine
from app.db.session import SessionLocal
from app.models.project import Project


def init_db():
    Base.metadata.create_all(bind=engine)
    try:
        with SessionLocal() as db:
            if db.query(Project).count() == 0:
                demo_projects = [
                    Project(
                        project_name="Delhi-Mumbai Industrial Expressway (Package 4)",
                        sector="Road Transport & Highways",
                        ministry="Ministry of Road Transport and Highways",
                        implementing_agency="NHAI",
                        state="Maharashtra / Gujarat",
                        approved_cost=18400.0,
                        revised_cost=21200.0,
                        physical_progress=68.5,
                        status="Ongoing",
                    ),
                    Project(
                        project_name="Dedicated Freight Corridor (Western Section)",
                        sector="Railways",
                        ministry="Ministry of Railways",
                        implementing_agency="DFCCIL",
                        state="Rajasthan / Haryana",
                        approved_cost=51100.0,
                        revised_cost=58400.0,
                        physical_progress=82.0,
                        status="Ongoing",
                    ),
                    Project(
                        project_name="Khavda Renewable Ultra Mega Solar Park (30GW)",
                        sector="Power & Renewable Energy",
                        ministry="Ministry of Power",
                        implementing_agency="NTPC",
                        state="Gujarat",
                        approved_cost=32000.0,
                        revised_cost=32000.0,
                        physical_progress=44.0,
                        status="Ongoing",
                    ),
                    Project(
                        project_name="Mumbai Trans Harbour Link Expansion (Phase 2)",
                        sector="Urban Development",
                        ministry="MoHUA",
                        implementing_agency="MMRDA",
                        state="Maharashtra",
                        approved_cost=17843.0,
                        revised_cost=19500.0,
                        physical_progress=91.0,
                        status="Ongoing",
                    ),
                    Project(
                        project_name="Barmer Oil Refinery & Petrochemical Complex",
                        sector="Petroleum & Natural Gas",
                        ministry="MoPNG",
                        implementing_agency="HPCL Rajasthan Refinery Ltd",
                        state="Rajasthan",
                        approved_cost=43129.0,
                        revised_cost=72937.0,
                        physical_progress=61.0,
                        status="Critical",
                    ),
                    Project(
                        project_name="Great Nicobar International Transshipment Port",
                        sector="Ports, Shipping & Waterways",
                        ministry="Ministry of Ports, Shipping and Waterways",
                        implementing_agency="IPA",
                        state="Andaman & Nicobar Islands",
                        approved_cost=41000.0,
                        revised_cost=41000.0,
                        physical_progress=12.0,
                        status="Delayed",
                    ),
                ]
                db.add_all(demo_projects)
                db.commit()
    except Exception:
        pass


if __name__ == "__main__":
    init_db()