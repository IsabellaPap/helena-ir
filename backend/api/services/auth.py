from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from typing import Annotated, Optional
from fastapi import status, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .. import models

SECRET_KEY = "e22c33dd48684c04b2197b0c8ef22528c1dac89f0b0b32ddf178104c2ccd367f"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


fake_users_db = {
    "johndoe@example.com": {
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "full_name": "John Doe",
        "disabled": False,
    }
}

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
    return db.query(models.User).filter(models.User.email == email).first()
    
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

async def get_current_user(db: Session, token: str = Depends(oauth2_scheme)):
    """ Finds the current user beased on their authentication token. """
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
        token_data = email
    except JWTError:
        raise credentials_exception
    user = get_user(db, email=token_data)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: Annotated[models.UserBase, Depends(get_current_user)]):
    """ Finds the current user and checks if they are active or not. Returns the current user
    if they are active, otherwise raise an exception. """
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user