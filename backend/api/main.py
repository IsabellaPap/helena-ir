from datetime import timedelta, datetime
from fastapi import FastAPI, HTTPException, Depends, status
from typing import Dict, Annotated, Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import model_serializer
from sqlalchemy.orm import Session

import logging
from .helpers.exceptions import InsufficientDataError, InvalidInputError
from . import models as md
from .services import auth
from .services import services as srv
from .database.database import SessionLocal
from .database.crud import create_user, get_user, create_questionnaire_result

import os
from dotenv import load_dotenv

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JWT authentication
        
def get_user_base(db: Session, email: str) -> Optional[md.UserBase]:
    """ Finds a user in the database based on their email. Takes the database and email
     as input, and returns the user information as an instance of the UserInDB class."""
    db_user = get_user(db=db, email=email)
    if db_user:
        return md.UserBase(
            email=db_user.email, 
            full_name=db_user.full_name, 
            disabled=db_user.disabled
        )
    return None
    
async def get_current_user(db: Session, token: Annotated[str, Depends(oauth2_scheme)]) -> md.UserBase:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = md.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user_base(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

def authenticate_user(db: Session, email: str, password: str) -> Optional[md.UserBase]:
    """ Authenticates a user from their email and password combination. Returns True if the 
    credentials are valid and False if they are invalid, or if the user doesn't exist. """
    user = get_user(db, email)
    if not user or not auth.verify_password(password, user.hashed_password):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """ Creates an access token from the provided data. Sets the expiration time based on the input. """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Endpoints

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
    user = authenticate_user(db, form_data.username, form_data.password)  # Authenticate against DB
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/logout", tags=["authentication"])
async def logout():
    return {"message": "User logged out successfully"}

@app.post("/questonnaire_result/create")
async def submit_questionnaire(result: md.QuestionnaireResultCreate, token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    current_user = await get_current_user(db, token)
    return create_questionnaire_result(db=db, user_email=current_user.email, result=result)

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
    
