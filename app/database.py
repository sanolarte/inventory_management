from typing import Union
from datetime import datetime
from sqlmodel import Field, Session, SQLModel, create_engine, select


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


class ProductPublic(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

class ProductUpdate(ProductBase):
    name: Union[str, None]
    description: Union[str, None]
    price: Union[float, None]
    quantity: Union[int, None]


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
