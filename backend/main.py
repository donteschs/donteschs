from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
from routers.analytics import router as analytics_router
from routers.auth import router as auth_router
from routers.youtube import router as youtube_router

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Donteschs API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(analytics_router)
app.include_router(youtube_router)


@app.get("/")
def health_check():
    return {"status": "ok", "app": "DONTESCHS"}
