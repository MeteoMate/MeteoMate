import os
from functools import cached_property

# APP_ENV = os.getenv("APP_ENV", "development")

# # Only load local .env for development
# if APP_ENV != "production":
#     try:
#         from dotenv import load_dotenv, find_dotenv
#         # Try .env.{env} then fallback to .env
#         env_file = find_dotenv(f".env.{APP_ENV}") or find_dotenv()
#         if env_file:
#             load_dotenv(env_file, override=False)
#     except Exception:
#         # Ignore if python-dotenv is not installed or file missing.
#         pass

def _required_env(name: str) -> str:
    val = os.getenv(name)
    if not val:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return val

class Config:
    REPORTS_TABLE_NAME: str = os.getenv("REPORTS_TABLE_NAME", "reports")
    CZC_RADAR_TABLE_NAME: str = os.getenv("CZC_RADAR_TABLE_NAME", "czc_radar")
    BZC_RADAR_TABLE_NAME: str = os.getenv("BZC_RADAR_TABLE_NAME", "bzc_radar")

    @cached_property
    def DATABASE_URL(self) -> str:
        # Build connection string from required environment variables
        user = _required_env("POSTGRES_USER")
        pwd = _required_env("POSTGRES_PASSWORD")
        db = _required_env("POSTGRES_DB")
        host = _required_env("POSTGRES_HOST")
        port_str = _required_env("POSTGRES_PORT")
        return f"postgresql://{user}:{pwd}@{host}:{int(port_str)}/{db}"
    