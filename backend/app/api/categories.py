from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models.category import Category
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
    current_user=Depends(get_current_user),
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


@router.get("/")
def get_categories(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    categories = db.query(Category).filter(
        Category.user_id == current_user.id
    ).all()

    return categories


@router.put("/{category_id}")
def update_category(
    category_id: int,
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id,
    ).first()

    if not existing_category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    existing_category.name = category.name
    existing_category.type = category.type

    db.commit()
    db.refresh(existing_category)

    return existing_category


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id,
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    db.delete(category)
    db.commit()

    return {"message": "Category deleted"}