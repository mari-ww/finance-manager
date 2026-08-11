from fastapi import FastAPI
from sqlalchemy import text

from app.api.categories import router as categories_router
from app.api.users import router as users_router
from app.api.transactions import router as transactions_router

from app.db.database import engine
from app.db.models.user import User
from app.db.models.category import Category
from app.db.models.transaction import Transaction

app = FastAPI(title="Finance Manager")

app.include_router(categories_router)
app.include_router(users_router)
app.include_router(transactions_router)

@app.get("/")
def root():
    return {"message": "Finance Manager API"}


@app.get("/health/db")
def database_health():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database": result.scalar() == 1}