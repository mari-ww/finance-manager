from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models.category import Category
from app.db.models.user import User
from app.schemas.category import CategoryCreate
from app.core.security import get_current_user

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
    current_user: User = Depends(get_current_user),
):
    new_category = Category(
        user_id=current_user.id,
        name=category.name,
        type=category.type,
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category