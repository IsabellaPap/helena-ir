from sqlalchemy import JSON, Column, Integer, Numeric, String, Boolean, func, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    disabled = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

class QuestionnaireResult(Base):
    __tablename__ = 'questionnaire_results'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    questionnaire_id = Column(Integer, unique=True, index=True, nullable=False)
    vo2max = Column(Numeric, nullable=False)
    bmi = Column(Numeric)
    fmi = Column(Numeric)
    tv_hours = Column(Numeric)
    score = Column(Integer, nullable=False)
    classification = Column(String, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())