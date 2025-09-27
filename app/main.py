from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Session, select

from app.database import (
    get_session,
    create_db_and_tables,
    Product,
    ProductUpdate,
    ProductPublic,
)

app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/products/")
def create_product(
    product: Product, session: Session = Depends(get_session)
) -> Product:
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@app.get("/products/")
def read_products(
    session: Session = Depends(get_session),
    offset: int = 0,
    limit: int = Query(default=100, le=100),
) -> list[ProductPublic]:
    products = session.exec(select(Product).offset(offset).limit(limit)).all()
    return products


@app.get("/products/{product_id}")
def read_product(
    product_id: int, session: Session = Depends(get_session)
) -> ProductPublic:
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="product not found")
    return product


@app.patch("/products/{product_id}")
def update_product(
    product_id: int, product: ProductUpdate, session: Session = Depends(get_session)
) -> ProductPublic:
    product_db = session.get(Product, product_id)
    if not product_db:
        raise HTTPException(status_code=404, detail="Product not found")
    product_data = product.model_dump(exclude_unset=True)
    product_db.sqlmodel_update(product_data)
    session.add(product_db)
    session.commit()
    session.refresh(product_db)
    return product_db


@app.delete("/products/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"ok": True}
