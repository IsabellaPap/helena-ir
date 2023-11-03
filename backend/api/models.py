from pydantic import BaseModel
from typing import Optional
from enum import Enum

# enums
class Gender(str, Enum):
    male = "male"
    female = "female"

# pydantic input classes
class BmiInput(BaseModel):
    """ Input format for the bmi calculation. """
    weight_kg:float
    height_cm:float

class FmiInput(BaseModel):
    """ Input format for the bmi calculation. """
    height_cm: float
    weight_kg: Optional[float] = None
    fat_mass_kg: Optional[float] = None
    body_fat_percentage: Optional[float] = None

class Vo2maxInput(BaseModel):
    """ Input format for the VO2 max calculation. """
    speed_km_per_h:float
    age_yr:int

class RiskScoreInput(BaseModel):
    """ Input format for the overall risk score calculation. """
    gender: Gender
    vo2max:float
    bmi:Optional[float]
    fmi:Optional[float]
    tv_hours: Optional[float]

class RiskClassificationInput(BaseModel):
    """ Input format for the risk classification. """
    risk_score: int
    gender: Gender