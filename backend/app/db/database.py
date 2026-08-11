from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = (
    "postgresql+psycopg://finance_user:finance_password"
    "@postgres:5432/finance_manager"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)