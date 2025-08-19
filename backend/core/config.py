import os
from dotenv import load_dotenv, find_dotenv

env = os.getenv("APP_ENV", "development")

load_dotenv(find_dotenv(f".env.{env}"), override=True)

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL")
    REPORTS_TABLE_NAME = os.getenv("REPORTS_TABLE_NAME", "reports")
    CZC_RADAR_TABLE_NAME = os.getenv("CZC_RADAR_TABLE_NAME", "radar")
    BZC_RADAR_TABLE_NAME = os.getenv("BZC_RADAR_TABLE_NAME", "radar2")
