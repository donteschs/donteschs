from fastapi import APIRouter

from models.schemas import (
    CalendarEntry,
    ContentCenterResponse,
    DashboardResponse,
    InsightResponse,
    PlatformMetrics,
    SettingsResponse,
)
from services import mock_data

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard():
    return mock_data.get_dashboard_data()


@router.get("/platform/{platform}", response_model=PlatformMetrics)
def get_platform(platform: str):
    platform = platform.lower()
    if platform not in {"youtube", "tiktok", "facebook"}:
        return mock_data.get_platform_data("youtube")
    return mock_data.get_platform_data(platform)


@router.get("/content-center", response_model=ContentCenterResponse)
def get_content_center():
    return mock_data.get_content_center_data()


@router.get("/calendar", response_model=list[CalendarEntry])
def get_calendar():
    return mock_data.get_calendar_entries()


@router.get("/insights", response_model=InsightResponse)
def get_insights():
    return mock_data.get_insights()


@router.get("/settings", response_model=SettingsResponse)
def get_settings():
    return mock_data.get_settings()
