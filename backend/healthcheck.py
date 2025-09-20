#!/usr/bin/env python3
import os, socket, sys

# NOTE: Using 127.0.0.1 checks the server inside the container network stack.
host = "127.0.0.1"
_port = os.getenv("API_UPSTREAM_PORT")

if _port is None:
    sys.exit(1)
    s=socket.socket();
    s.settimeout(2)
    try:
        port = int(_port)
        s.connect((host, port))
        s.close()
        sys.exit(0)
    except Exception:
        sys.exit(1)
