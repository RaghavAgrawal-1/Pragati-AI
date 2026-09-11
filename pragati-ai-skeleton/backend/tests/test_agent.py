import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401
from app.db.database import Base
from app.db.session import get_db
from app.main import app
from app.models.project import Project

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(name="session")
def db_session_fixture():
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(name="client")
def client_fixture(session):
    def override_get_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_analyze_project_not_found(client: TestClient) -> None:
    response = client.post("/api/agent/analyze/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"


def test_get_analysis_history_not_found(client: TestClient) -> None:
    response = client.get("/api/agent/history/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"


def test_analyze_project_success(client: TestClient, session) -> None:
    # Create sample project in session
    project = Project(
        project_code="PRJ-001",
        project_name="Test Highway",
        approved_cost=100.0,
        revised_cost=150.0,
        physical_progress=40.0,
        status="Delayed",
    )
    session.add(project)
    session.commit()
    session.refresh(project)

    response = client.post(f"/api/agent/analyze/{project.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["project_id"] == project.id
    assert data["result"]["risk_level"] in ["LOW", "MEDIUM", "HIGH"]

    # Check history
    history_resp = client.get(f"/api/agent/history/{project.id}")
    assert history_resp.status_code == 200
    hist_data = history_resp.json()
    assert hist_data["total_analysis"] == 1

