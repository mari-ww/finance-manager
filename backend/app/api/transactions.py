from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models.category import Category
from app.db.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.core.security import get_current_user
from app.db.models.user import User


router = APIRouter(prefix="/transactions", tags=["Transactions"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    category = db.query(Category).filter(
        Category.id == transaction.category_id,
        Category.user_id == current_user.id,
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    new_transaction = Transaction(
        user_id=current_user.id,
        category_id=transaction.category_id,
        type=transaction.type,
        amount=transaction.amount,
        description=transaction.description,
        date=transaction.date,
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction


@router.get("/", response_model=list[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).all()

    return transactions


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id,
    ).first()

    if not transaction:
        return {"message": "Transaction not found"}

    db.delete(transaction)
    db.commit()

    return {"message": "Transaction deleted"}


@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id,
    ).first()

    if not existing_transaction:
        return {"message": "Transaction not found"}

    existing_transaction.category_id = transaction.category_id
    existing_transaction.type = transaction.type
    existing_transaction.amount = transaction.amount
    existing_transaction.description = transaction.description
    existing_transaction.date = transaction.date

    db.commit()
    db.refresh(existing_transaction)

    return existing_transaction