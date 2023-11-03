from fastapi import HTTPException
from config import load_config
from models import Gender

def calculate_bmi(height_cm: float, weight_kg: float) -> float:
    """ Function to calculate the BMI index based on height (m) and weight (kg). 
        Takes input in cm and converts to avoid delimeter confusion. """
    height_m = height_cm / 100
    return round(weight_kg/(height_m ** 2),2)

def calculate_fmi(height_cm: float, weight_kg: float = None, 
                  fat_mass_kg: float = None, body_fat_percentage: float = None) -> float:
    """ Function to calculate the FMI index based on height (m) and fat mass (kg) 
        or height (m), weight (kg), and body fat (%). 
        Takes input in cm and converts to avoid delimeter confusion. """
    if fat_mass_kg is not None:
        # Calculate FMI from fat mass in kg and height
        height_m = height_cm / 100
        fmi = fat_mass_kg / (height_m ** 2)
        return round(fmi,2)
    elif body_fat_percentage is not None and weight_kg is not None:
        # Calculate FMI from body fat percentage, weight, and height
        fat_mass_kg = (body_fat_percentage / 100) * weight_kg
        height_m = height_cm / 100
        fmi = fat_mass_kg / (height_m ** 2)
        return round(fmi,2)
    else:
        raise HTTPException(
            status_code=400,
            detail="Insufficient data provided. Please provide either fat mass or both body fat percentage and weight."
        )
  
def calculate_vo2max(speed_km_per_h:float, age_yr:int) -> float:
    """ Function to calculate the VO2 max based on age (years) and speed (km/h). """
    vo2max = 31.025 + (3.238 * speed_km_per_h) - (3.248 * age_yr) + (0.1536 * age_yr * speed_km_per_h)
    return round(vo2max, 2)

# load config for cutoff points
config = load_config('./config/config.json')

def calculate_risk_score(gender: Gender, vo2max: float, bmi: float = None, fmi: float = None, tv_hours: float = None) -> int:
    """ Function to calculate the overall risk score of the test-taker. """
    
    risk_score = 0

    # classify and calculate risk score
    if gender == Gender.male:
        bmi_cutoffs = config['bmi_cutoffs']
        for classification, cutoff in bmi_cutoffs.items():
            if bmi < cutoff:
                risk_score += calculate_bmi_risk_score(classification)
                break
        
        if vo2max < 37:
            risk_score += calculate_vo2max_risk_score("healthy",gender)
        else:
            risk_score += calculate_vo2max_risk_score("low fitness",gender)

        return risk_score
    elif gender == Gender.female:   
        fmi_cutoffs = config['fmi_cutoffs']
        for classification, cutoff in fmi_cutoffs.items():
            if fmi < cutoff:
                risk_score += calculate_fmi_risk_score(classification)
                break
        
        if vo2max < 37:
            risk_score += calculate_vo2max_risk_score("healthy", gender)
        else:
            risk_score += calculate_vo2max_risk_score("low fitness", gender)
        
        risk_score += calculate_tv_hours_risk_score(tv_hours)

        return risk_score

def calculate_bmi_risk_score(classification: str) -> int:
    """ Helper function to return risk-score points based on BMI classification. """  
    if classification == "healthy":
        return 0
    if  classification == "overweight":
        return 12
    if classification == "obese":
        return 19

def calculate_fmi_risk_score(classification: str) -> int:
    """ Helper function to return risk-score points based on FMI classification. """  
    if classification == "underfat" or classification == "normal":
        return 0
    if  classification == "overweight":
        return 0
    if classification == "obese":
        return 18
    
def calculate_vo2max_risk_score(classification: str, gender: Gender) -> int:
    """ Helper function to return risk-score points based on VO2 max classification. """  
    if classification == "healthy":
        return 0
    if classification == "low fitness":
        if gender == Gender.male:
            return 10
        if gender == Gender.female:
            return 15

def calculate_tv_hours_risk_score(tv_hours: float) -> int:
    """ Helper function to return risk-score points based on TV viewing hours per day. """  
    if tv_hours < 1:
        return 0
    if tv_hours >=1:
        return 10
    
def classify_risk_score(risk_score: int, gender: Gender) -> str:
  """ Function to classify the risk of early Diabetes 2 or IR based on the overall risk score of the test-taker. """
  risk_cutoffs = config['risk_cutoffs']
  for classification, cutoff in risk_cutoffs[gender].items():
      if risk_score < cutoff:
          return classification