#!/usr/bin/env python3
"""
Run Black code formatter on the project, regardless of OS.
Usage:
    python format_code.py [optional_path]
"""
import sys
import subprocess
from pathlib import Path


def main():
    # Determine which path to format
    path = sys.argv[1] if len(sys.argv) > 1 else "."
    target = Path(path).resolve()

    # Ensure Black is installed
    try:
        import black  # noqa
    except ImportError:
        print("Black is not installed. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "black"])

    # Run black as module (works on Windows, Linux, macOS)
    subprocess.check_call([sys.executable, "-m", "black", str(target)])


if __name__ == "__main__":
    main()
