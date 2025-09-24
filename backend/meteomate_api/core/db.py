import os
from psycopg_pool import ConnectionPool
from meteomate_api.core.config import Config

config = Config()

pool = ConnectionPool(conninfo=config.DATABASE_URL, max_size=5, timeout=30)