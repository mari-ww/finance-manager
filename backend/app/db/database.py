from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = (
    "postgresql+psycopg://finance_user:finance_password"
    "@postgres:5432/finance_manager"
)


class Base(DeclarativeBase):
    pass


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)