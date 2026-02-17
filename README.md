# DONTESCHS – Creator Control Dashboard

A full-stack analytics dashboard for creators to monitor YouTube, TikTok, and Facebook performance from one modern interface.

## Stack

- **Frontend:** React + Vite + Tailwind CSS + Chart.js
- **Backend:** FastAPI (REST)
- **Database:** SQLite (SQLAlchemy)
- **Auth:** Email/password + JWT

## Features Included

- Global dashboard with key KPIs, follower growth chart, alerts
- Platform pages (YouTube/TikTok/Facebook) with growth chart + top video table
- Content Performance Center with sorting
- Posting Tracker calendar-like feed + best day/frequency metrics
- Growth Insights section (AI-ready structure)
- Settings page (connections + manual revenue)
- Login/Register page with JWT storage
- Mock analytics data while APIs are not connected

## Project Structure

```txt
backend/
  main.py
  database/
  models/
  routers/
  services/
frontend/
  src/
    components/
    pages/
    charts/
    services/
```

## Local Run

### 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`.

### 2) Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.


## YouTube OAuth Setup

Create a `.env` file in `backend/` with:

```env
YT_CLIENT_ID=your_google_client_id
YT_CLIENT_SECRET=your_google_client_secret
YT_REDIRECT_URI=http://localhost:8000/auth/youtube/callback
FRONTEND_URL=http://localhost:5173
```

Available endpoints:

- `GET /auth/youtube/start` → returns `{ "auth_url": ... }`
- `GET /auth/youtube/callback?code=...&state=...` → stores OAuth tokens and redirects to `/settings?youtube=connected` on the frontend
- `GET /youtube/channel` → returns `subscribers`, `views`, and `video_count` for the connected account

## API Notes

- `/auth/register` and `/auth/login` are active with SQLite user storage.
- Analytics endpoints currently return mock data from `backend/services/mock_data.py`.
- You can later replace mock services with YouTube/Facebook API integrations and add TikTok API once available.
- SQLite can be migrated to PostgreSQL by updating `DATABASE_URL` and installing the appropriate DB driver.
