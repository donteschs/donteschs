from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MetricCard(BaseModel):
    label: str
    value: str
    change: str


class TimePoint(BaseModel):
    date: str
    value: float


class PlatformVideo(BaseModel):
    id: str
    title: str
    views: int
    likes: int
    comments: int
    publish_date: datetime
    platform: str


class PlatformMetrics(BaseModel):
    platform: str
    followers: int
    views: int
    engagement_rate: float
    growth: list[TimePoint]
    top_videos: list[PlatformVideo]


class DashboardResponse(BaseModel):
    cards: list[MetricCard]
    follower_growth: list[TimePoint]
    engagement_rate: float
    best_platform: str
    alerts: list[str]


class ContentCenterResponse(BaseModel):
    top_content: list[PlatformVideo]


class CalendarEntry(BaseModel):
    date: str
    platform: str
    title: str
    performance: str


class InsightResponse(BaseModel):
    fastest_growing_platform: str
    best_content_type: str
    engagement_trend: str
    alerts: list[str]


class SettingsResponse(BaseModel):
    youtube_connected: bool
    tiktok_connected: bool
    facebook_connected: bool
    monthly_revenue: float
