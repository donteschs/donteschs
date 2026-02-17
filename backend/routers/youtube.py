import os
from typing import Any

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

load_dotenv()

router = APIRouter(tags=["youtube"])

YOUTUBE_SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
]
TOKEN_URI = "https://oauth2.googleapis.com/token"

# In-memory token storage (can be replaced by SQLite persistence later)
youtube_tokens: dict[str, Any] = {}


def _get_google_client_config() -> dict[str, dict[str, str]]:
    client_id = os.getenv("YT_CLIENT_ID")
    client_secret = os.getenv("YT_CLIENT_SECRET")
    redirect_uri = os.getenv("YT_REDIRECT_URI")

    if not client_id or not client_secret or not redirect_uri:
        raise HTTPException(
            status_code=500,
            detail="Missing YouTube OAuth environment variables",
        )

    return {
        "web": {
            "client_id": client_id,
            "project_id": "donteschs-youtube-oauth",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": TOKEN_URI,
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": client_secret,
            "redirect_uris": [redirect_uri],
        }
    }


@router.get("/auth/youtube/start")
def youtube_oauth_start():
    flow = Flow.from_client_config(
        _get_google_client_config(),
        scopes=YOUTUBE_SCOPES,
        redirect_uri=os.getenv("YT_REDIRECT_URI"),
    )
    auth_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    youtube_tokens["oauth_state"] = state
    return {"auth_url": auth_url}


@router.get("/auth/youtube/callback")
def youtube_oauth_callback(code: str = Query(...), state: str | None = Query(default=None)):
    saved_state = youtube_tokens.get("oauth_state")
    if saved_state and state and saved_state != state:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")

    flow = Flow.from_client_config(
        _get_google_client_config(),
        scopes=YOUTUBE_SCOPES,
        redirect_uri=os.getenv("YT_REDIRECT_URI"),
        state=state,
    )

    try:
        flow.fetch_token(code=code)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"OAuth token exchange failed: {exc}") from exc

    credentials = flow.credentials
    youtube_tokens["access_token"] = credentials.token
    youtube_tokens["refresh_token"] = credentials.refresh_token
    youtube_tokens["token_uri"] = credentials.token_uri or TOKEN_URI
    youtube_tokens["client_id"] = credentials.client_id or os.getenv("YT_CLIENT_ID")
    youtube_tokens["client_secret"] = credentials.client_secret or os.getenv("YT_CLIENT_SECRET")
    youtube_tokens["scopes"] = list(credentials.scopes or YOUTUBE_SCOPES)

    frontend_url = os.getenv("FRONTEND_URL")
    if not frontend_url:
        raise HTTPException(status_code=500, detail="Missing FRONTEND_URL environment variable")

    return RedirectResponse(url=f"{frontend_url.rstrip('/')}/settings?youtube=connected", status_code=307)


@router.get("/youtube/channel")
def youtube_channel_metrics():
    access_token = youtube_tokens.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="YouTube account not connected")

    try:
        creds = Credentials(
            token=access_token,
            refresh_token=youtube_tokens.get("refresh_token"),
            token_uri=youtube_tokens.get("token_uri", TOKEN_URI),
            client_id=youtube_tokens.get("client_id"),
            client_secret=youtube_tokens.get("client_secret"),
            scopes=youtube_tokens.get("scopes", YOUTUBE_SCOPES),
        )
        youtube = build("youtube", "v3", credentials=creds)

        response = youtube.channels().list(part="statistics", mine=True).execute()
        items = response.get("items", [])
        if not items:
            raise HTTPException(status_code=404, detail="No YouTube channel found for authenticated account")

        statistics = items[0].get("statistics", {})
        return {
            "subscriberCount": int(statistics.get("subscriberCount", 0)),
            "viewCount": int(statistics.get("viewCount", 0)),
            "videoCount": int(statistics.get("videoCount", 0)),
        }
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to load YouTube channel metrics: {exc}") from exc
