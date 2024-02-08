from datetime import timedelta
from fastapi import FastAPI, HTTPException, Depends, status
from typing import Dict, Annotated
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import logging
from .helpers.exceptions import InsufficientDataError, InvalidInputError
from . import models as md
from .services import auth
from .services import services as srv
from .database.database import SessionLocal
from .database.crud import create_user
from .database.crud import create_questionnaire_result

tags_metadata = [
    {
        "name": "calculation",
        "description": "Various calculations of complex factors.",
    },
    {
        "name": "classification",
        "description": "Various classifications based on input",
    },
    {
        "name": "authentication",
        "description": "Authentication for users"
    },
]

# initialize FastAPI app with custom OpenAPI tags and configure CORS middleware
# to allow requests from the frontend running on localhost:3000.
app = FastAPI(openapi_tags=tags_metadata)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.1.104:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/users/create/", response_model=md.UserBase, tags=["authentication"])
def create_user_endpoint(user: md.UserCreate, db: Session = Depends(get_db)):
    return create_user(db=db, user=user)

@app.post("/token", response_model=md.Token, tags=["authentication"])
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)  # Authenticate against DB
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/logout", tags=["authentication"])
async def logout():
    return {"message": "User logged out successfully"}

# calculation endpoints
@app.post("/calculate/bmi", tags=["calculation"])
async def calculate_bmi_endpoint(input_data: md.BmiInput) -> Dict[str, float]:
    bmi = srv.calculate_bmi(input_data.height_cm, input_data.weight_kg)
    logger.info(f"Calculating BMI for height: {input_data.height_cm} and weight: {input_data.weight_kg}")
    return {"bmi": bmi}

@app.post("/calculate/fmi",tags=["calculation"])
async def calculate_fmi_endpoint(input_data: md.FmiInput) -> Dict[str,float]:
    try:
        fmi = srv.calculate_fmi(input_data.height_cm, input_data.weight_kg, input_data.fat_mass_kg, input_data.body_fat_percentage)
        if input_data.fat_mass_kg is not None:
            logger.info(f"Calculating FMI for height: {input_data.height_cm} and fat mass: {input_data.fat_mass_kg}")
        else:
            logger.info(f"Calculating FMI for height: {input_data.height_cm}, weight: {input_data.weight_kg}, and body fat % {input_data.body_fat_percentage}")
        return {"fmi": fmi}
    except InsufficientDataError as e:
        raise HTTPException(status_code=400, detail=e.detail)


@app.post("/calculate/vo2max",tags=["calculation"])
async def calculate_vo2max_endpoint(input_data:md.Vo2maxInput) -> Dict[str,float]:
    """ Function to calculate the VO2 max based on age (years) and speed (km/h). """
    vo2max = srv.calculate_vo2max(input_data.speed_km_per_h, input_data.age_yr)
    logger.info(f"Calculating VO2 max for speed: {input_data.speed_km_per_h} and age: {input_data.age_yr}")
    return {"vo2max" : vo2max}


@app.post("/calculate/risk-score",tags=["calculation"])
async def calculate_risk_score_endpoint(input_data: md.RiskScoreInput) -> Dict[str,int]:
    try:
        risk_score = srv.calculate_risk_score(input_data.gender, input_data.vo2max, input_data.bmi, input_data.fmi, input_data.tv_hours)
        if input_data.gender == "male":
            logger.info(f"Calculating risk score for gender: {input_data.gender}, vo2max: {input_data.vo2max}, and bmi: {input_data.bmi}")
        if input_data.gender == "female":
            logger.info(f"Calculating risk score for gender: {input_data.gender}, vo2max: {input_data.vo2max}, fmi: {input_data.fmi}, and tv hours: {input_data.tv_hours}")
        return {"risk_score": risk_score}
    except InsufficientDataError as e:
        raise HTTPException(status_code=400, detail=e.detail)

    
@app.post("/classify/risk-score",tags=["classification"])
async def classify_risk_score_endpoint(input_data: md.RiskClassificationInput) -> Dict[str,str]:
    try: 
        classification = srv.classify_risk_score(input_data.risk_score, input_data.gender)
        logger.info(f"Classifying risk score for gender: {input_data.gender} and risk score: {input_data.risk_score}")
        
        return {"classification": classification}
    except InvalidInputError as e:
        raise HTTPException(status_code=422, detail=e.detail)
    
@app.post("/submit_questonnaire")
def submit_questionnaire(result: md.QuestionnaireResultCreate, db: Session = Depends(get_db)):
    return create_questionnaire_result(db=db, result=result)