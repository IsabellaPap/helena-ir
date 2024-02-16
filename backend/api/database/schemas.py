from sqlalchemy import JSON, Column, ForeignKey, Integer, Numeric, String, Boolean, UniqueConstraint, func, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    disabled = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    questionnaire_results = relationship('QuestionnaireResult', back_populates='user')


class QuestionnaireResult(Base):
    __tablename__ = 'questionnaire_results'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    questionnaire_id = Column(String, index=True, nullable=False)
    gender = Column(String, nullable=False)
    vo2max = Column(Numeric, nullable=False)
    bmi = Column(Numeric)
    fmi = Column(Numeric)
    tv_hours = Column(Numeric)
    score = Column(Integer, nullable=False)
    classification = Column(String, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())

    user = relationship('User', back_populates='questionnaire_results')

    __table_args__ = (
        UniqueConstraint('questionnaire_id', 'user_id'),
    )