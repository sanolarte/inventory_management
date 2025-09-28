from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Session, select

from app.infrastructure.database import ProductDatabaseRepository
from app.domain.repositories import ProductRepository

from app.routers.schemas import ProductCreate, ProductPublic, ProductUpdate

app = FastAPI()


def get_repository():
    return ProductDatabaseRepository()

@app.on_event("startup")
def on_startup():
    repository = get_repository()
    repository.create_db_and_tables()


@app.post("/products/")
def create_product(
    product: ProductCreate, repository: ProductRepository = Depends(get_repository)
) -> ProductPublic:
    new_product = repository.create(product)
    return new_product


@app.get("/products/")
def read_products(
    repository: ProductRepository = Depends(get_repository),
    offset: int = 0,
    limit: int = Query(default=100, le=100),
) -> list[ProductPublic]:
    products = repository.list_all(offset, limit)
    return products


@app.get("/products/{product_id}")
def read_product(
    product_id: int, repository: ProductRepository = Depends(get_repository)
) -> ProductPublic:
    product = repository.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="product not found")
    return product


@app.patch("/products/{product_id}")
def update_product(
    product_id: int, product: ProductUpdate, repository: ProductRepository = Depends(get_repository)
) -> ProductPublic:
    updated_product = repository.update(product_id, product)
    if updated_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    else:
        return updated_product


@app.delete("/products/{product_id}")
def delete_product(product_id: int, repository: ProductRepository = Depends(get_repository)):
    is_deleted = repository.delete(product_id)
    if update_product:
        return {"deleted": True }
    else:
        raise HTTPException(status_code=404, detail="Product not found")


