from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse

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
):
    new_transaction = Transaction(
        user_id=1,
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
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == 1
    ).all()

    return transactions

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == 1,
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
):
    existing_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == 1,
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