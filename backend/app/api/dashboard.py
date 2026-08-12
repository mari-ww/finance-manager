from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models.transaction import Transaction
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
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).all()

    total_income = sum(
        (transaction.amount for transaction in transactions
         if transaction.type == "income"),
        Decimal("0"),
    )

    total_expense = sum(
        (transaction.amount for transaction in transactions
         if transaction.type == "expense"),
        Decimal("0"),
    )

    balance = total_income - total_expense

    return {
        "balance": balance,
        "total_income": total_income,
        "total_expense": total_expense,
    }