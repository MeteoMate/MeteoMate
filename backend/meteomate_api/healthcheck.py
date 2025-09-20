#!/usr/bin/env python3
import os, socket, sys

# host = "127.0.0.1"
host = "0.0.0.0"
_port = os.getenv("API_UPSTREAM_PORT")

if _port is None:
    sys.exit(1)
# else:
#     port = int(_port)
#     try:
#         socket.create_connection((host, port), 2).close()
#         sys.exit(0)
#     except Exception:
#         sys.exit(1)
    s=socket.socket();
    s.settimeout(2)
    try:
        port = int(_port)
        s.connect((host, port))
        s.close()
        sys.exit(0)
    except Exception:
        sys.exit(1)
