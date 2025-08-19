import os
from psycopg_pool import ConnectionPool
from .config import Config
pool = ConnectionPool(conninfo=Config.DATABASE_URL, max_size=5, timeout=30)