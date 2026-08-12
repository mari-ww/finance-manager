from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone

from app.db.database import SessionLocal
from app.db.models.transaction import Transaction
from app.db.models.category import Category
from app.core.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_dashboard(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date >= start_date,
        Transaction.date < end_date,
    ).all()

    total_income = sum(
        (
            transaction.amount
            for transaction in transactions
            if transaction.type == "income"
        ),
        Decimal("0"),
    )

    total_expense = sum(
        (
            transaction.amount
            for transaction in transactions
            if transaction.type == "expense"
        ),
        Decimal("0"),
    )

    balance = total_income - total_expense

    expenses_by_category = (
        db.query(
            Category.name,
            func.sum(Transaction.amount).label("total"),
        )
        .join(Category, Category.id == Transaction.category_id)
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            Transaction.date >= start_date,
            Transaction.date < end_date,
        )
        .group_by(Category.name)
        .all()
    )

    return {
        "month": month,
        "year": year,
        "balance": balance,
        "total_income": total_income,
        "total_expense": total_expense,
        "expenses_by_category": [
            {
                "category": category_name,
                "total": total,
            }
            for category_name, total in expenses_by_category
        ],
    }