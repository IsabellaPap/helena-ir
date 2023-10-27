from fastapi import Depends, FastAPI, HTTPException
from enum import Enum
from pydantic import BaseModel
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
from asyncpg import DataError, UndefinedTableError

async def get_db():
    conn = await asyncpg.connect(user='user', password='password', database='database', host='host')
    try:
        yield conn
    finally:
        await conn.close()


tags_metadata = [
    {
        "name": "calculation",
        "description": "Various calculations of complex factors.",
    },
    {
        "name": "classification",
        "description": "Various classifications based on input",
    },
]
# enums
class Gender(str, Enum):
    male = "male"
    female = "female"

class BodyfatClassification(str,Enum):
    underfat = "underfat"
    normal = "normal"
    overweight = "overweight"
    obese = "obese"

# pydantic input classes
class BmiInput(BaseModel):
    """ Input format for the bmi calculation. """
    weight_kg:float
    height_cm:float

class FmiInput(BaseModel):
    """ Input format for the bmi calculation. """
    fat_mass_kg:float
    height_cm:float

class Vo2maxInput(BaseModel):
    """ Input format for the VO2 max calculation. """
    speed_km_per_h:float
    age_yr:int

class RiskScoreInput(BaseModel):
    """ Input format for the VO2 max calculation. """
    bmi:float
    vo2max:int

class BodyFatClassificationInput(BaseModel):
    """ Input format for the body fat classification. """
    age_yr: int
    gender: Gender
    body_fat_percentage: float



app = FastAPI(openapi_tags=tags_metadata)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cutoff_points_bmi = { "healthy": 25, "overweight": 30.0, "obesity": 50.0 }

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# Calculation endpoints

@app.post("/calculate/bmi",tags=["calculation"])
async def calculate_bmi(input_data: BmiInput) -> Dict[str,float]:
    """ Function to calculate the BMI index based on height (m) and weight (kg). 
        Takes input in cm and converts to avoid delimeter confusion. """
    height_m = input_data.height_cm / 100
    bmi = input_data.weight_kg/(height_m ** 2)
    return {"bmi" : bmi}

@app.post("/calculate/fmi",tags=["calculation"])
async def calculate_fmi(input_data: FmiInput) -> Dict[str,float]:
    """ Function to calculate the FMI index based on height (m) and fat mass (kg). 
        Takes input in cm and converts to avoid delimeter confusion. """
    height_m = input_data.height_cm / 100
    fmi = input_data.fat_mass_kg/(height_m ** 2)
    return {"fmi" : fmi}

@app.post("/calculate/vo2max",tags=["calculation"])
async def calculate_vo2max(input_data:Vo2maxInput) -> Dict[str,float]:
    """ Function to calculate the VO2 max based on age (years) and speed (km/h). """
    speed = input_data.speed_km_per_h
    age = input_data.age_yr
    vo2max = 31.025 + 3.238 * speed - 3.248 * age + 0.1536 * age * speed
    return {"vo2max" : vo2max}

# @app.post("/calculate/risk-score",tags=["calculation"])
# async def calculate_risk_score(input_data:RiskScoreInput) -> int:


# Classification endpoints

@app.post("/classify/bodyfat",tags=["classification"])
async def classify_bodyfat(input_data: BodyFatClassificationInput,conn=Depends(get_db)) -> Dict[str,str]:
    """ Function to classify the child based on their age (years), gender, and body fat %. """
    if not (1 <= input_data.body_fat_percentage <= 80):
        raise HTTPException(status_code=400, detail="Invalid input for body fat %. Valid range = [1,80]")
    try:
        age_group = await conn.fetchrow("SELECT * FROM body_fat_classification WHERE age=$1 AND gender=$2", input_data.age_yr, input_data.gender)
        if len(age_group) == 0:
            raise HTTPException(status_code=400, detail="No matching entries found for the provided age and gender.")
    except Exception as e:  # Catch all exceptions and log for debugging
        raise HTTPException(status_code=400, detail=str(e))
    
    if input_data.body_fat_percentage <= age_group['underfat_max']:
        return {"classification": BodyfatClassification.underfat.value}
    elif input_data.body_fat_percentage <= age_group['normal_max']:
        return {"classification": BodyfatClassification.normal.value}
    elif input_data.body_fat_percentage <= age_group['overweight_max']:
        return {"classification": BodyfatClassification.overweight.value}
    elif input_data.body_fat_percentage <= age_group['obese_max']:
        return {"classification": BodyfatClassification.obese.value}
    else:
        return {"classification": "Unknown"}

@app.post("/classify/bmi",tags=["classification"])
async def classify_bmi(bmi: float) -> Dict[str,str]:
    """ Function to classify the bmi of a child based on specific cut_offs. """    
    for classification, cutoff in cutoff_points_bmi.items():
        if bmi < cutoff:
            return {"classification" : classification}

@app.post("/classify/vo2max",tags=["classification"])
async def classify_vo2max(vo2max: float) -> Dict[str,str]:
    """ Function to classify the VO2 max of a child based on specific cut_offs. """
    if vo2max < 37:
        return {"classification" : "healthy"}
    else:
        return {"classification" : "low fitness"}

