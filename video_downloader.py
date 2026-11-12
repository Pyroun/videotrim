from __future__ import annotations

import threading
import webbrowser

from app import app


def main() -> None:
    address = "http://127.0.0.1:5000"
    threading.Timer(1, webbrowser.open, args=(address,)).start()
    app.run(host="127.0.0.1", port=5000, debug=False)


if __name__ == "__main__":
    main()
