import os
import sys
from pathlib import Path

# Ensure backend root directory is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.db.init_db import init_db  # noqa: E402


def main() -> None:
    print("Initializing database schema...")
    init_db()
    print("Database initialization successful.")


if __name__ == "__main__":
    main()
