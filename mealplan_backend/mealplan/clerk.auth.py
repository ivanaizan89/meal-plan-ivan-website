# clerk_auth.py
import requests
from django.contrib.auth.models import AnonymousUser
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
import jwt

User = get_user_model()

CLERK_JWKS_URL = 'https://<your-clerk-domain>.clerk.accounts.dev/.well-known/jwks.json'

class ClerkJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            jwks = requests.get(CLERK_JWKS_URL).json()
            public_keys = {key['kid']: jwt.algorithms.RSAAlgorithm.from_jwk(key) for key in jwks['keys']}
            unverified = jwt.get_unverified_header(token)
            key = public_keys[unverified['kid']]

            payload = jwt.decode(token, key=key, algorithms=["RS256"], audience=None)
            user_id = payload.get('sub')  # Clerk uses 'sub' as user ID

            user, _ = User.objects.get_or_create(username=user_id)
            return (user, None)

        except Exception:
            raise AuthenticationFailed('Invalid Clerk token')
