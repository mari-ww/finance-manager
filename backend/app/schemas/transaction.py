from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


class TransactionCreate(BaseModel):
    category_id: int
    type: Literal["income", "expense"]
    amount: Decimal = Field(gt=0)
    description: str | None = None
    date: date

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "category_id": 3,
                "type": "expense",
                "amount": 20.00,
                "description": "Almoço",
                "date": "2026-08-12"
            }
        }
    )


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    type: Literal["income", "expense"]
    amount: Decimal
    description: str | None
    date: date

    model_config = ConfigDict(from_attributes=True)