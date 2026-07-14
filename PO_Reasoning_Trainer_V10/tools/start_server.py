from __future__ import annotations

import http.server
import socket
import socketserver
import sys
import threading
import time
import webbrowser
from pathlib import Path
from urllib.parse import urlparse

HOST = "127.0.0.1"
START_PORT = 8765
MAX_TRIES = 20
ROOT = Path(__file__).resolve().parent.parent
HEARTBEAT_TIMEOUT = 4.0
STARTUP_GRACE = 15.0

last_heartbeat = time.monotonic()
heartbeat_seen = False
state_lock = threading.Lock()

class AppHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def _heartbeat(self):
        global last_heartbeat, heartbeat_seen
        with state_lock:
            last_heartbeat = time.monotonic()
            heartbeat_seen = True
        self.send_response(204)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()

    def do_GET(self):
        if urlparse(self.path).path == "/__reasonforge/heartbeat":
            return self._heartbeat()
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path == "/__reasonforge/heartbeat":
            return self._heartbeat()
        self.send_error(404)

class ReusableThreadingServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def find_port(start: int) -> int:
    for port in range(start, start + MAX_TRIES):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            try:
                sock.bind((HOST, port))
                return port
            except OSError:
                continue
    raise OSError(f"No free port found in range {start}-{start + MAX_TRIES - 1}")


def monitor_tabs(httpd, started_at):
    while True:
        time.sleep(0.5)
        with state_lock:
            seen = heartbeat_seen
            age = time.monotonic() - last_heartbeat
        if seen and age > HEARTBEAT_TIMEOUT:
            httpd.shutdown()
            return
        if not seen and time.monotonic() - started_at > STARTUP_GRACE:
            httpd.shutdown()
            return


def main() -> int:
    port = find_port(START_PORT)
    handler = lambda *args, **kwargs: AppHandler(*args, directory=str(ROOT), **kwargs)
    with ReusableThreadingServer((HOST, port), handler) as httpd:
        url = f"http://{HOST}:{port}/"
        started_at = time.monotonic()
        threading.Thread(target=monitor_tabs, args=(httpd, started_at), daemon=True).start()
        threading.Timer(0.1, lambda: webbrowser.open(url)).start()
        httpd.serve_forever(poll_interval=0.1)
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"STARTUP ERROR: {exc}", file=sys.stderr)
        raise
