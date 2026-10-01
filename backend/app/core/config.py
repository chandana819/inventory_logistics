from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    PROJECT_NAME: str = "Inventory & Logistics Management"
    PROJECT_VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = f"sqlite:///{(BACKEND_DIR / 'db.sqlite3').as_posix()}"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    
    # CORS
    ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = str(BACKEND_DIR / ".env")
        case_sensitive = True


settings = Settings()
