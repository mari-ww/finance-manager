from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class TransactionCreate(BaseModel):
    category_id: int
    type: str
    amount: Decimal
    description: str | None = None
    date: date


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    type: str
    amount: Decimal
    description: str | None
    date: date

    class Config:
        from_attributes = True