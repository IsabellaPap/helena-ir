from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

# user authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserBase(BaseModel):
    email: str
    full_name: str
    disabled: bool

class QuestionnaireResultCreate(BaseModel):
    questionnaire_id: str
    gender: str
    vo2max: float
    bmi: Optional[float]
    fmi: Optional[float]
    tv_hours: Optional[float]
    score: int
    classification: str

class QuestionnaireResultResponse(BaseModel):
    user_id: str
    questionnaire_id: str
    gender: str
    vo2max: float
    bmi: Optional[float]
    fmi: Optional[float]
    tv_hours: Optional[float]
    score: int
    classification: str

# enums
class Gender(str, Enum):
    male = "male"
    female = "female"

# pydantic input classes
class BmiInput(BaseModel):
    """ Input format for the bmi calculation. """
    weight_kg:float = Field( ..., gt=25, lt=300, description="Weight in kilograms")
    height_cm:float = Field( ..., gt=70, lt=200, description="Height in centimeters")

class FmiInput(BaseModel):
    """ Input format for the bmi calculation. """
    height_cm:float = Field( ..., gt=70, lt=200, description="Height in centimeters")
    weight_kg:Optional[float] = Field( None, gt=25, lt=300, description="Weight in kilograms")
    fat_mass_kg: Optional[float] = Field( None, ge=0, lt=0.8*300, description="Fat mass in kilograms")
    body_fat_percentage: Optional[float] = Field( None, ge=0, lt=80, description="Body fat percentage")

class Vo2maxInput(BaseModel):
    """ Input format for the VO2 max calculation. """
    speed_km_per_h:float = Field( ..., ge= 8.5, lt=20, description="Speed in km/h")
    age_yr:int = Field( ..., gt= 7, lt=20, description="Age in years")

class RiskScoreInput(BaseModel):
    """ Input format for the overall risk score calculation. """
    gender: Gender
    vo2max:float = Field( ..., gt=22.71, lt=94.54, description="VO2 max in mL/(kg·min)")
    bmi:Optional[float] = Field( None, gt=13, lt=35, description="Body Mass Index")
    fmi:Optional[float] = Field( None, gt=3.4, lt=25, description="Fat Mass Index")
    tv_hours: Optional[float] = Field( None, ge=0, lt=20, description="TV viewing hours per day")

class RiskClassificationInput(BaseModel):
    """ Input format for the risk classification. """
    risk_score: int = Field( ..., ge=0, lt=44, description="Risk score total")
    gender: Gender