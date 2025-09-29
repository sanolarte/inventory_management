from functools import wraps
from sqlmodel import create_engine, Session, SQLModel, select
from sqlmodel import Session, select
from app.domain.repositories import ProductRepository, UserRepository
from app.infrastructure.models import Product, User


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


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
    def create_db_and_tables(self):
        SQLModel.metadata.create_all(engine)

    @with_session
    def list_all(self, offset, limit, session: Session):
        products = session.exec(select(Product).offset(offset).limit(limit)).all()
        return products

    @with_session
    def get(self, product_id, session: Session):
        product = session.get(Product, product_id)
        return product

    @with_session
    def update(self, product_id, product, session: Session):
        product_db = self.get(product_id)
        if not product_db:
            return None
        product_data = product.model_dump(exclude_unset=True)
        product_db.sqlmodel_update(product_data)
        session.add(product_db)
        session.commit()
        session.refresh(product_db)
        return product_db

    @with_session
    def delete(self, product_id, session: Session):
        product = session.get(Product, product_id)
        if not product:
            return None
        session.delete(product)
        session.commit()
        return True

    @with_session
    def create(self, product, session: Session):
        db_product = Product.from_orm(product)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product


class UserDatabaseRepository(UserRepository):

    @with_session
    def get(self, username, session: Session):
        user = session.get(User, username)
        return user
