from sqlalchemy.orm import Session
from . import models

def create_user(db: Session, user: models.UserCreate):
    db_user = models.User(email=user.email, hashed_password=user.hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user