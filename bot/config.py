import os
from dotenv import load_dotenv
load_dotenv()

API_URL = os.getenv("API_URL")
TWITCH_TOKEN = os.getenv("TWITCH_TOKEN")
REFRESH_TOKEN = os.getenv("REFRESH_TOKEN")
CLIENT_ID = os.getenv("CLIEND_ID")
CHANNELS = ["koochablm"]
PREFIX = "!"
ADMIN_IDS = [456602329, "at0m", "koochablm"]

