"""Start the local Shinobi Legends static game; Python 3 standard library only."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import threading
import webbrowser

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    root = Path(__file__).resolve().parent / 'dist'
    url = f'http://127.0.0.1:{port}'
    try:
        server = ThreadingHTTPServer(('127.0.0.1', port), partial(SimpleHTTPRequestHandler, directory=str(root)))
    except OSError as error:
        print(f'Could not start: {error}\nTry: python run_game.py 8001')
        sys.exit(1)
    print(f'Shinobi Legends: {url}\nPress Ctrl+C to stop.')
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
