from datetime import datetime, timedelta


def _growth(seed: int):
    start = datetime.now() - timedelta(days=6)
    return [
        {"date": (start + timedelta(days=i)).strftime("%Y-%m-%d"), "value": seed + (i * (seed * 0.03))}
        for i in range(7)
    ]


def get_dashboard_data():
    return {
        "cards": [
            {"label": "Views (Today)", "value": "124.3K", "change": "+8.2%"},
            {"label": "Views (7 Days)", "value": "812.9K", "change": "+12.4%"},
            {"label": "Views (30 Days)", "value": "3.1M", "change": "+20.7%"},
            {"label": "Followers", "value": "248.6K", "change": "+5.1%"},
            {"label": "Videos Posted", "value": "63", "change": "+6 this week"},
            {"label": "Estimated Revenue", "value": "$8,420", "change": "+9.3%"},
        ],
        "follower_growth": _growth(205000),
        "engagement_rate": 7.8,
        "best_platform": "YouTube",
        "alerts": [
            "Latest tutorial video is performing above average.",
            "TikTok growth is slowing compared to last week.",
        ],
    }


def _video(platform: str, idx: int, base_views: int):
    return {
        "id": f"{platform.lower()}-{idx}",
        "title": f"{platform} Growth Strategy #{idx}",
        "views": base_views - idx * 900,
        "likes": int((base_views - idx * 900) * 0.08),
        "comments": int((base_views - idx * 900) * 0.01),
        "publish_date": datetime.now() - timedelta(days=idx + 1),
        "platform": platform,
    }


def get_platform_data(platform: str):
    seeds = {
        "youtube": (132000, 2400000, 8.2),
        "tiktok": (91000, 1700000, 9.4),
        "facebook": (45000, 980000, 6.1),
    }
    followers, views, engagement = seeds[platform]
    growth = _growth(followers)
    top_videos = [_video(platform.capitalize(), i, 250000 - (i * 8500)) for i in range(1, 11)]
    return {
        "platform": platform.capitalize(),
        "followers": followers,
        "views": views,
        "engagement_rate": engagement,
        "growth": growth,
        "top_videos": top_videos,
    }


def get_content_center_data():
    merged = []
    for platform in ["YouTube", "TikTok", "Facebook"]:
        merged.extend([_video(platform, i, 320000 - i * 9500) for i in range(1, 6)])
    return {"top_content": sorted(merged, key=lambda item: item["views"], reverse=True)}


def get_calendar_entries():
    today = datetime.now().date()
    return [
        {
            "date": str(today - timedelta(days=i)),
            "platform": ["YouTube", "TikTok", "Facebook"][i % 3],
            "title": f"Content Drop #{14 - i}",
            "performance": ["High", "Medium", "Low"][i % 3],
        }
        for i in range(14)
    ]


def get_insights():
    return {
        "fastest_growing_platform": "YouTube",
        "best_content_type": "Short educational explainers",
        "engagement_trend": "Upward trend during weekday evenings",
        "alerts": [
            "This video is performing above average.",
            "Growth slowing down on TikTok. Consider testing new hook formats.",
        ],
    }


def get_settings():
    return {
        "youtube_connected": True,
        "tiktok_connected": False,
        "facebook_connected": True,
        "monthly_revenue": 8420.00,
    }
