from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "Pragati AI API"
    app_version: str = "0.1.0"
    environment: str = "development"
    database_url: str = "postgresql+psycopg://pragati:change_me@localhost:5433/pragati"

    @property
    def resolved_database_url(self) -> str:
        if self.database_url.startswith("sqlite:///"):
            path_part = self.database_url[len("sqlite:///"):]
            p = Path(path_part)
            if not p.is_absolute():
                abs_p = (BACKEND_DIR / p).resolve()
                return f"sqlite:///{abs_p.as_posix()}"
        return self.database_url

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()