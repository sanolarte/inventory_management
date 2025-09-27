from functools import wraps
from sqlmodel import create_engine, Session, SQLModel, select
from sqlmodel import Session, select
from app.domain.repositories import ProductRepository
from app.domain.models import Product


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def with_session(func):
    """Decorator to provide a session and ensure it's closed."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        with Session(engine) as session:
            try:
                return func(*args, session=session, **kwargs)
            except Exception:
                session.rollback()
                raise
    return wrapper


class ProductDatabaseRepository(ProductRepository):

    @with_session
    def list_all(self, offset, limit, session: Session):
        products = session.exec(select(Product).offset(offset).limit(limit)).all()
        return products

