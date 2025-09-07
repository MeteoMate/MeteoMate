import os
import multiprocessing

# ---------- helpers functions (for validation) ----------
def _int_env(name: str, default: int, *, min_: int | None = None, max_: int | None = None) -> int:
    """Parse an int env var with bounds and a clear error if invalid."""
    raw = os.getenv(name)
    if raw is None:
        value = default
    else:
        try:
            value = int(raw)
        except ValueError as e:
            raise ValueError(f"Environment variable {name} must be an integer (got {raw!r})") from e
    if min_ is not None and value < min_:
        value = min_
    if max_ is not None and value > max_:
        value = max_
    return value

def _bool_env(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.lower() in {"1", "true", "t", "yes", "y", "on"}

# ---------- binding ----------
# HOST:PORT of the backend API
host = "0.0.0.0"
port = os.getenv("API_UPSTREAM_PORT", "5000")
try:
    _ = int(port)
except ValueError as e:
    raise ValueError(f"Port must be an integer (got {port!r})") from e
bind = f"{host}:{port}"

# ---------- workers / concurrency ----------
# Use 1 worker per vCPU unless overridden
cpu_count = os.cpu_count() or multiprocessing.cpu_count() or 2

# Worker class, use "sync" by default 
worker_class = os.getenv("WORKER_CLASS", "sync")

# Default workers
workers = _int_env("WORKERS", default=cpu_count, min_=1)

# Number of threads (a suitable setting depends on the worker class)
threads = _int_env("THREADS", default=8, min_=1) if worker_class == "gthread" else 1

# Preload app for memory savings
preload_app = _bool_env("PRELOAD_APP", True)

# ---------- timeouts ----------
timeout = _int_env("TIMEOUT", default=60, min_=10)
graceful_timeout = _int_env("GRACEFUL_TIMEOUT", default=30, min_=10)
keepalive = _int_env("KEEPALIVE", default=5, min_=1)

# ---------- stability under load ----------
max_requests = _int_env("MAX_REQUESTS", default=1000, min_=0)
max_requests_jitter = _int_env("MAX_REQUESTS_JITTER", default=100, min_=0)

# ---------- request limits (defensive hardening) ----------
limit_request_line = _int_env("LIMIT_REQUEST_LINE", default=8190, min_=1024)
limit_request_fields = _int_env("LIMIT_REQUEST_FIELDS", default=100, min_=10)
limit_request_field_size = _int_env("LIMIT_REQUEST_FIELD_SIZE", default=8190, min_=1024)