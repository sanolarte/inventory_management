from datetime import datetime
from typing import Union

from sqlmodel import Field, SQLModel

class ProductBase(SQLModel):
    name: str = Field(index=True, nullable=False, max_length=100)
    description: Union[str, None]
    price: float
    quantity: Union[str, None] = Field(default=None, index=True)


class Product(ProductBase, table=True):
    __table_args__ = {'extend_existing': True}
    id: Union[int, None] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)