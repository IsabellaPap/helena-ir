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

def get_user(db: Session, email: str) -> Optional[schemas.User]:
    """Finds a user in the database based on their email.

    Args:
        db (Session): The database session.
        email (str): The email of the user to find.

    Returns:
        Optional[schemas.User]: An instance of the User model or None if not found.
    """
    db_user = db.query(schemas.User).filter(schemas.User.email == email).first()
    if db_user:
        return db_user
    return None

def create_questionnaire_result(db: Session, user_email: str, result:models.QuestionnaireResultCreate):
    user = get_user(db, user_email)
    db_result = schemas.QuestionnaireResult(user_id = user.id, gender= result.gender,questionnaire_id = result.questionnaire_id, vo2max = result.vo2max, bmi = result.bmi, fmi = result.fmi, tv_hours = result.tv_hours, score = result.score, classification = result.classification )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    questionnaire_result = models.QuestionnaireResultResponse(
        user_id=user_email,
        questionnaire_id=result.questionnaire_id,
        gender = result.gender, 
        vo2max = result.vo2max, 
        bmi = result.bmi, 
        fmi = result.fmi, 
        tv_hours = result.tv_hours, 
        score = result.score, 
        classification = result.classification
    )
    return questionnaire_result

def get_questionnaire_result_by_user(db: Session, user_email: str):
    user = get_user(db, user_email)
    results = db.query(schemas.QuestionnaireResult).filter(schemas.QuestionnaireResult.user_id == user.id).all()
    return results