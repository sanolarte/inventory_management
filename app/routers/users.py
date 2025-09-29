from datetime import datetime, timezone, timedelta

from fastapi import Depends, APIRouter, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel


from app.infrastructure.database import UserDatabaseRepository
from app.domain.repositories import UserRepository
from app.routers.security import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
)
from app.routers.schemas import User


ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(prefix="/users")


def get_repository():
    return UserDatabaseRepository()


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    repository: UserRepository = Depends(get_repository),
) -> Token:
    user = authenticate_user(repository, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    print("TOKEN", access_token)
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=User)
async def read_users_me(
    current_user: User = Depends(get_current_active_user),
):
    return current_user


@router.get("/users/me/items/")
async def read_own_items(
    current_user: User = Depends(get_current_active_user),
):
    return [{"item_id": "Foo", "owner": current_user.username}]
