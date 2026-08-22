from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# ADD THESE 2 LINES HERE
print("Looking for .env at:", BASE_DIR / ".env")
print("Exists:", (BASE_DIR / ".env").exists())


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    groq_api_key: str = ""
    google_api_key: str = ""
    llm_provider: str = "auto"
    groq_model: str = "openai/gpt-oss-120b"
    gemini_model: str = "gemini-2.0-flash"
    twelve_data_api_key: str = ""
    alpha_vantage_api_key: str = ""
    database_url: str = f"sqlite+aiosqlite:///{BASE_DIR / 'finsight.db'}"
    chroma_persist_dir: str = str(BASE_DIR / "chroma_data")
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    default_user_id: str = "demo_user"

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


settings = Settings()

print("Groq Key:", settings.groq_api_key)
print("Google Key:", settings.google_api_key)
print("Provider:", settings.llm_provider)


@lru_cache
def get_settings() -> Settings:
    return Settings()