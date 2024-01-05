from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from typing import Optional
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from .. import models
from ..database.schemas import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# use authentication
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password) -> bool:
    """ Verifies a user's password. Takes the password in plain text and the hashed 
    version to compare them. Returns True for a match and False otherwise."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """ Hashes a user's password. Takes the password in plain text as input and returns 
    the hashed password."""
    return pwd_context.hash(password)

def get_user(db: Session, email: str) -> Optional[models.UserBase]:
    """ Finds a user in the database based on their email. Takes the database and email
     as input, and returns the user information as an instance of the UserInDB class."""
    return db.query(User).filter(User.email == email).first()
    
def authenticate_user(db: Session, email: str, password: str) -> Optional[models.UserBase]:
    """ Authenticates a user from their email and password combination. Returns True if the 
    credentials are valid and False if they are invalid, or if the user doesn't exist. """
    user = get_user(db, email)
    if not user or not verify_password(password, user.hashed_password):
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

def invalidate_refresh_token(db: Session, user: models.User):
    # TODO
    pass
