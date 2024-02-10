from passlib.context import CryptContext

# use authentication
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def verify_password(plain_password, hashed_password) -> bool:
    """ Verifies a user's password. Takes the password in plain text and the hashed 
    version to compare them. Returns True for a match and False otherwise."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """ Hashes a user's password. Takes the password in plain text as input and returns 
    the hashed password."""
    return pwd_context.hash(password)

