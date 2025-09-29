from datetime import timedelta, datetime, timezone
import pytest
import unittest
from unittest.mock import MagicMock, patch

from fastapi import HTTPException
import jwt
from jwt.exceptions import InvalidTokenError


from app.routers.security import authenticate_user, create_access_token, get_current_user, get_current_active_user, ALGORITHM, SECRET_KEY

class TestAuthenticateUser(unittest.TestCase):
    def setUp(self):
        self.repository = MagicMock()

    
    def test_authenticate_user_success(self):
        self.repository.get.return_value = None
        self.assertFalse(authenticate_user(self.repository, "johndoe", "secret"))
    

    @patch("app.routers.security.CryptContext.verify")
    def test_authenticate_user_fails(self, mock_verify):
        user = MagicMock()
        self.repository.get.return_value = user
        mock_verify.return_value = True
        result = authenticate_user(self.repository, "tst", "secret")
        self.assertEqual(result, user)

class TestCreateAccessToken(unittest.TestCase):
    def test_create_access_token_with_delta(self):
        data = {"sub": "tst_username"}
        
        token = create_access_token(data)
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert decoded["sub"] == "tst_username"
        

    def test_create_access_token_without_delta(self):
        data = {"sub": "tst_username"}

        token = create_access_token(data, expires_delta=timedelta(minutes=5))
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert decoded["sub"] == "tst_username"
        assert "exp" in decoded


class TestGetCurrentUser(unittest.TestCase):

    def setUp(self):
        self.repository = MagicMock()

    @patch("app.routers.security.jwt.decode")
    @pytest.mark.asyncio
    async def test_get_current_user_success(self, mock_decode):
        mock_user = MagicMock()
        mock_decode.get.return_value = "tst_username"
        self.repository.get.return_value = mock_user

        user = MagicMock(username="johndoe", hashed_password="hash")
    
        result = get_current_user("token", self.repository)
        self.assertEqual(result, mock_user)


    @patch("app.routers.security.jwt.decode")
    @pytest.mark.asyncio
    async def test_get_current_user_fails_user_is_none(self, mock_decode):
        mock_user = MagicMock()
        mock_decode.get.return_value = None
        self.repository.get.return_value = mock_user
        with self.assertRaises(HTTPException):    
            get_current_user("token", self.repository)

    @patch("app.routers.security.jwt.decode")
    @pytest.mark.asyncio
    async def test_get_current_user_fails_invalid_token(self, mock_decode):
        mock_user = MagicMock()
        mock_decode.get.side_effect = InvalidTokenError
        self.repository.get.return_value = mock_user
        with self.assertRaises(HTTPException):    
            get_current_user("token", self.repository)


class TestGetCurrentActiveUser(unittest.TestCase):
    
    @pytest.mark.asyncio
    async def test_get_current_active_user_not_disabled(self):
        user = MagicMock(disabled=False)
        result = await get_current_active_user(current_user=user)
        self.assertEqual(result, user)


    @pytest.mark.asyncio
    async def test_get_current_active_user_disabled(self):
        user = MagicMock(disabled=True)
        result = await get_current_active_user(current_user=user)
        self.assertEqual(result, user)
# @pytest.mark.asyncio
# async def test_get_current_active_user_returns_user():
#     user = DummyUser(username="johndoe", hashed_password="hash", disabled=False)
#     result = await auth.get_current_active_user(current_user=user)
#     assert result == user

# def test_get_repository_returns_instance():
#     repo = auth.get_repository()
#     from app.infrastructure.database import UserDatabaseRepository
#     assert isinstance(repo, UserDatabaseRepository)
