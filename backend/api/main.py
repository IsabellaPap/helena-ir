from fastapi import FastAPI, HTTPException
from enum import Enum
from pydantic import BaseModel
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

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
class Gender(str, Enum):
    male = "male"
    female = "female"

class BmiInput(BaseModel):
    """ Input format for the bmi calculation. """
    weight_kg:float
    height_cm:float

class Vo2maxInput(BaseModel):
    """ Input format for the VO2 max calculation. """
    speed_km_per_h:float
    age_yr:int

class BodyFatInput(BaseModel):
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

# cutoff_points_bodyfat: A nested dictionary containing cutoff points for body fat percentages.
# The keys are Gender enum values (male, female), and the values are dictionaries.
# These inner dictionaries have age (in years) as keys and another dictionary as values,
# which contain classifications (underfat, overfat, obese) and their corresponding cutoff values.
# The reason for this redundant format, is avoiding the alignment issues of making each classification
# a table column. In future implementations it should be in the database.
cutoff_points_bodyfat = {
    Gender.male:  
                {
                  5: {"underfat": 12.2, "overfat": 18.6, "obese": 21.4},
                  6: {"underfat": 12.4, "overfat": 19.5, "obese": 22.7},
                  7: {"underfat": 12.6, "overfat": 20.4, "obese": 24.1},
                  8: {"underfat": 12.7, "overfat": 21.3, "obese": 25.5},
                  9: {"underfat": 12.8, "overfat": 22.2, "obese": 26.8},
                  10: {"underfat": 12.8, "overfat": 22.8, "obese": 27.9},
                  11: {"underfat": 12.6, "overfat": 23.0, "obese": 28.3},
                  12: {"underfat": 12.1, "overfat": 22.7, "obese": 27.9},
                  13: {"underfat": 11.5, "overfat": 22.0, "obese": 27.0},
                  14: {"underfat": 10.9, "overfat": 21.3, "obese": 25.9},
                  15: {"underfat": 10.4, "overfat": 20.7, "obese": 25.0},
                  16: {"underfat": 10.1, "overfat": 20.3, "obese": 24.3},
                  17: {"underfat": 9.8, "overfat": 20.1, "obese": 23.9},
                  18: {"underfat": 9.6, "overfat": 20.1, "obese": 23.6},
                },
    Gender.female:
                {
                  5: {"underfat": 13.8, "overfat": 21.5, "obese": 24.3},
                  6: {"underfat": 14.4, "overfat": 23.0, "obese": 26.2},
                  7: {"underfat": 14.9, "overfat": 24.5, "obese": 28.0},
                  8: {"underfat": 15.3, "overfat": 26.0, "obese": 29.7},
                  9: {"underfat": 15.7, "overfat": 27.2, "obese": 31.2},
                  10: {"underfat": 16.0, "overfat": 28.2, "obese": 32.2},
                  11: {"underfat": 16.1, "overfat": 28.8, "obese": 32.8},
                  12: {"underfat": 16.1, "overfat": 29.1, "obese": 33.1},
                  13: {"underfat": 16.1, "overfat": 29.4, "obese": 33.3},
                  14: {"underfat": 16.0, "overfat": 29.6, "obese": 33.6},
                  15: {"underfat": 15.7, "overfat": 29.9, "obese": 33.8},
                  16: {"underfat": 15.5, "overfat": 30.1, "obese": 34.1},
                  17: {"underfat": 15.1, "overfat": 30.4, "obese": 34.4},
                  18: {"underfat": 14.7, "overfat": 30.8, "obese": 34.8},
                }
              }

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/calculate/bmi",tags=["calculation"])
async def calculate_bmi(input_data: BmiInput) -> Dict[str,float]:
    """ Function to calculate the BMI index based on height (m) and weight (kg). 
        Takes input in cm and converts to avoid delimeter confusion. """
    height_m = input_data.height_cm / 100
    bmi = input_data.weight_kg/(height_m ** 2)
    return {"bmi" : bmi}

@app.post("/calculate/vo2max",tags=["calculation"])
async def calculate_vo2max(input_data:Vo2maxInput) -> Dict[str,float]:
    """ Function to calculate the VO2 max based on age (years) and speed (km/h). """
    speed = input_data.speed_km_per_h
    age = input_data.age_yr
    vo2max = 31.025 + 3.238 * speed - 3.248 * age + 0.1536 * age * speed
    return {"vo2max" : vo2max}

@app.post("/classify/bodyfat",tags=["classification"])
async def classify_bodyfat(input_data: BodyFatInput) -> Dict[str,str]:
    """ Function to classify the child based on their age (years), gender, and body fat %. """
    if not (1 <= input_data.body_fat_percentage <= 80):
        raise HTTPException(status_code=400, detail="Invalid input for body fat %. Valid range = [1,80]")

    try:
        age_group = cutoff_points_bodyfat[input_data.gender][input_data.age_yr]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid input for age in years. Valid range = [5,18]")
    
    for classification, cutoff in age_group.items():
        if input_data.body_fat_percentage < cutoff:
            return {"classification" : classification}