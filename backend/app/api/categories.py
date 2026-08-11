from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models.category import Category
from app.schemas.category import CategoryCreate

router = APIRouter(prefix="/categories", tags=["Categories"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
):
    new_category = Category(
        user_id=1,
        name=category.name,
        type=category.type,
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category