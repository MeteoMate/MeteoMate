import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL")
    REPORTS_TABLE_NAME = os.getenv("REPORTS_TABLE_NAME", "reports")
    CZC_RADAR_TABLE_NAME = os.getenv("CZC_RADAR_TABLE_NAME", "radar")
    BZC_RADAR_TABLE_NAME = os.getenv("BZC_RADAR_TABLE_NAME", "radar2")
