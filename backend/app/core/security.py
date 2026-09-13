import base64
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import json

try:
    import bcrypt
except Exception:
    bcrypt = None

try:
    from jose import jwt
except Exception:
    jwt = None


SECRET_KEY = "pragati-ai-hackathon-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    if bcrypt:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")
    return hashlib.sha256(pwd_bytes).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    pwd_bytes = password.encode("utf-8")[:72]
    if bcrypt and password_hash.startswith("$2"):
        return bcrypt.checkpw(pwd_bytes, password_hash.encode("utf-8"))
    return hashlib.sha256(pwd_bytes).hexdigest() == password_hash


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": int(expire.timestamp()),
    }

    if jwt:
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    header_b64 = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    sig = hmac.new(SECRET_KEY.encode(), f"{header_b64}.{payload_b64}".encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).decode().rstrip("=")
    return f"{header_b64}.{payload_b64}.{sig_b64}"