import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from sqlalchemy.orm import Session

from database.db import get_db
from models.user import User
from models.youtube_credential import YouTubeCredential
from services.auth import get_current_user

load_dotenv()

router = APIRouter(tags=["youtube"])

YOUTUBE_SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
]
TOKEN_URI = "https://oauth2.googleapis.com/token"

# Temporary OAuth state mapping (tokens are persisted in SQLite)
oauth_state_to_user_id: dict[str, int] = {}


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
def youtube_oauth_start(current_user: User = Depends(get_current_user)):
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
    oauth_state_to_user_id[state] = current_user.id
    return {"auth_url": auth_url}


@router.get("/auth/youtube/callback")
def youtube_oauth_callback(
    code: str = Query(...),
    state: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if not state:
        raise HTTPException(status_code=400, detail="Missing OAuth state")

    user_id = oauth_state_to_user_id.pop(state, None)
    if not user_id:
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

    credential = db.query(YouTubeCredential).filter(YouTubeCredential.user_id == user_id).first()
    scopes = " ".join(credentials.scopes or YOUTUBE_SCOPES)

    if not credential:
        credential = YouTubeCredential(
            user_id=user_id,
            access_token=credentials.token,
            refresh_token=credentials.refresh_token,
            token_uri=credentials.token_uri or TOKEN_URI,
            scopes=scopes,
        )
        db.add(credential)
    else:
        credential.access_token = credentials.token
        if credentials.refresh_token:
            credential.refresh_token = credentials.refresh_token
        credential.token_uri = credentials.token_uri or TOKEN_URI
        credential.scopes = scopes

    db.commit()

    frontend_url = os.getenv("FRONTEND_URL")
    if not frontend_url:
        raise HTTPException(status_code=500, detail="Missing FRONTEND_URL environment variable")

    return RedirectResponse(url=f"{frontend_url.rstrip('/')}/settings?youtube=connected", status_code=307)


@router.get("/youtube/channel")
def youtube_channel_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    credential = db.query(YouTubeCredential).filter(YouTubeCredential.user_id == current_user.id).first()
    if not credential:
        raise HTTPException(status_code=401, detail="YouTube account not connected")

    try:
        creds = Credentials(
            token=credential.access_token,
            refresh_token=credential.refresh_token,
            token_uri=credential.token_uri,
            client_id=os.getenv("YT_CLIENT_ID"),
            client_secret=os.getenv("YT_CLIENT_SECRET"),
            scopes=credential.scopes.split(),
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
