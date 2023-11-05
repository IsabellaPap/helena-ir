from fastapi import FastAPI, HTTPException
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware
import logging
from .exceptions import InsufficientDataError, InvalidInputError

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

# initialize FastAPI app with custom OpenAPI tags and configure CORS middleware
# to allow requests from the frontend running on localhost:3000.
app = FastAPI(openapi_tags=tags_metadata)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# calculation endpoints
from .services import calculate_bmi
from .models import BmiInput

@app.post("/calculate/bmi", tags=["calculation"])
async def calculate_bmi_endpoint(input_data: BmiInput) -> Dict[str, float]:
    bmi = calculate_bmi(input_data.height_cm, input_data.weight_kg)
    logger.info(f"Calculating BMI for height: {input_data.height_cm} and weight: {input_data.weight_kg}")
    return {"bmi": bmi}


from .services import calculate_fmi
from .models import FmiInput

@app.post("/calculate/fmi",tags=["calculation"])
async def calculate_fmi_endpoint(input_data: FmiInput) -> Dict[str,float]:
    try:
        fmi = calculate_fmi(input_data.height_cm, input_data.weight_kg, input_data.fat_mass_kg, input_data.body_fat_percentage)
        if input_data.fat_mass_kg is not None:
            logger.info(f"Calculating FMI for height: {input_data.height_cm} and fat mass: {input_data.fat_mass_kg}")
        else:
            logger.info(f"Calculating FMI for height: {input_data.height_cm}, weight: {input_data.weight_kg}, and body fat % {input_data.body_fat_percentage}")
        return {"fmi": fmi}
    except InsufficientDataError as e:
        raise HTTPException(status_code=400, detail=e.detail)

from .services import calculate_vo2max
from .models import Vo2maxInput

@app.post("/calculate/vo2max",tags=["calculation"])
async def calculate_vo2max_endpoint(input_data:Vo2maxInput) -> Dict[str,float]:
    """ Function to calculate the VO2 max based on age (years) and speed (km/h). """
    vo2max = calculate_vo2max(input_data.speed_km_per_h, input_data.age_yr)
    logger.info(f"Calculating VO2 max for speed: {input_data.speed_km_per_h} and age: {input_data.age_yr}")
    return {"vo2max" : vo2max}

from .services import calculate_risk_score
from .models import RiskScoreInput

@app.post("/calculate/risk-score",tags=["calculation"])
async def calculate_risk_score_endpoint(input_data: RiskScoreInput) -> Dict[str,int]:
    try:
        risk_score = calculate_risk_score(input_data.gender, input_data.vo2max, input_data.bmi, input_data.fmi, input_data.tv_hours)
        if input_data.gender == "male":
            logger.info(f"Calculating risk score for gender: {input_data.gender}, vo2max: {input_data.vo2max}, and bmi: {input_data.bmi}")
        if input_data.gender == "female":
            logger.info(f"Calculating risk score for gender: {input_data.gender}, vo2max: {input_data.vo2max}, fmi: {input_data.fmi}, and tv hours: {input_data.tv_hours}")
        return {"risk_score": risk_score}
    except InsufficientDataError as e:
        raise HTTPException(status_code=400, detail=e.detail)

    

# classification endpoints
from .services import classify_risk_score
from .models import RiskClassificationInput

@app.post("/classify/risk-score",tags=["classification"])
async def classify_risk_score_endpoint(input_data: RiskClassificationInput) -> Dict[str,str]:
    try: 
        classification = classify_risk_score(input_data.risk_score, input_data.gender)
        logger.info(f"Classifying risk score for gender: {input_data.gender} and risk score: {input_data.risk_score}")
        
        return {"classification": classification}
    except InvalidInputError as e:
        raise HTTPException(status_code=422, detail=e.detail)
    