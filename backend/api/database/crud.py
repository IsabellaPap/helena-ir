from typing import Optional
from sqlalchemy.orm import Session
from .. import models
from . import schemas
from ..services.auth import get_password_hash

def create_user(db: Session, user: models.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = schemas.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    user_pydantic = models.UserBase(
        email=db_user.email, 
        full_name=db_user.full_name, 
        disabled=db_user.disabled
    )
    return user_pydantic

def get_user(db: Session, email: str) -> Optional[models.UserBase]:
    """Finds a user in the database based on their email.

    Args:
        db (Session): The database session.
        email (str): The email of the user to find.

    Returns:
        Optional[models.User]: An instance of the User model or None if not found.
    """
    db_user = db.query(schemas.User).filter(schemas.User.email == email).first()
    if db_user:
        return models.UserBase(
            email=db_user.email, 
            full_name=db_user.full_name, 
            disabled=db_user.disabled
        )
    return None