# Pragati AI Backend

Backend foundation for Pragati AI using FastAPI, SQLAlchemy, and PostgreSQL.

## Run locally

1. Create a virtual environment:
   python -m venv .venv

2. Activate it:
   Windows: .venv\Scripts\activate
   macOS/Linux: source .venv/bin/activate

3. Install dependencies:
   pip install -r requirements.txt

4. Copy `.env.example` to `.env` and update DATABASE_URL if needed.

5. Start the API:
   uvicorn app.main:app --reload

6. Open:
   http://localhost:8000/health
   http://localhost:8000/docs

## Docker

From the project root, use your existing docker-compose PostgreSQL service, or run PostgreSQL locally.
