from dotenv import load_dotenv
import os
from pathlib import Path
import secrets


ENV_PATH = Path(".env")

def load_env():
    load_dotenv(ENV_PATH)