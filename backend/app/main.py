from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import engine

app = FastAPI(title="Finance Manager")


@app.get("/")
def root():
    return {"message": "Finance Manager API"}


@app.get("/health/db")
def database_health():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database": result.scalar() == 1}