import os, re, hashlib, secrets, base64
from argon2 import PasswordHasher
from cryptography.fernet import Fernet
from fastapi import HTTPException

hasher=PasswordHasher()

def password_hash(password): return hasher.hash(password)
def verify_password(hash_,password):
    try: return hasher.verify(hash_,password)
    except Exception: return False

def norm_email(email): return str(email).strip().lower()
def slug(s):
    import unicodedata
    s=unicodedata.normalize('NFKD',str(s)).encode('ascii','ignore').decode('ascii').lower()
    return re.sub(r'^-|-$','',re.sub(r'[^a-z0-9]+','-',s))[:60] or 'projet'

def token_hash(s): return hashlib.sha256(s.encode()).hexdigest()
def new_token(): return secrets.token_urlsafe(36)
def _get_fernet():
    raw = os.getenv('INTEGRATION_KEY', '')
    if not raw:
        raise HTTPException(503, 'INTEGRATION_KEY non configurée')
    # Fernet requires a 32-byte urlsafe base64-encoded key.
    # If the provided key is raw 32 chars or not valid 32-byte b64, derive it cleanly with SHA-256:
    derived = base64.urlsafe_b64encode(hashlib.sha256(raw.encode()).digest())
    return Fernet(derived)

def encrypt(value):
    return _get_fernet().encrypt(value.encode()).decode()

def decrypt(value):
    return _get_fernet().decrypt(value.encode()).decode()
