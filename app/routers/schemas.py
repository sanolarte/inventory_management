from typing import Union, Optional
from datetime import datetime
from pydantic import BaseModel
from sqlmodel import Field


class ProductCreate(BaseModel):
    name: str
    price: float
    quantity: float
    description: Optional[str] = None


class ProductPublic(ProductCreate):
    description: str
    created_at: datetime
    updated_at: datetime


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[float] = None


class ProductBase(BaseModel):
    name: str = Field(index=True, nullable=False, max_length=100)
    description: Union[str, None]
    price: float
    quantity: Union[float, None] = Field(default=None, index=True)


class Product(ProductBase):
    __table_args__ = {"extend_existing": True}
    id: Union[int, None] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ProductPublic(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class TokenData(BaseModel):
    username: Union[str, None] = None


class UserInDB(User):
    hashed_password: str
