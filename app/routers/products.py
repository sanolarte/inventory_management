from fastapi import Depends, APIRouter, HTTPException, Query

from app.infrastructure.database import ProductDatabaseRepository
from app.domain.repositories import ProductRepository

from app.routers.schemas import ProductCreate, ProductPublic, ProductUpdate
from app.routers.security import get_current_active_user
from app.routers.schemas import User



router = APIRouter(prefix="/products")


def get_repository():
    return ProductDatabaseRepository()


@router.on_event("startup")
def on_startup():
    repository = get_repository()
    repository.create_db_and_tables()


@router.post("/")
def create_product(
    product: ProductCreate,
    repository: ProductRepository = Depends(get_repository),
    current_user: User = Depends(get_current_active_user),
) -> ProductPublic:
    new_product = repository.create(product)
    return new_product


@router.get("/")
def read_products(
    repository: ProductRepository = Depends(get_repository),
    current_user: User = Depends(get_current_active_user),
    offset: int = 0,
    limit: int = Query(default=100, le=100),
) -> list[ProductPublic]:
    products = repository.list_all(offset, limit)
    return products


@router.get("/{product_id}")
def read_product(
    product_id: int,
    repository: ProductRepository = Depends(get_repository),
    current_user: User = Depends(get_current_active_user),
) -> ProductPublic:
    product = repository.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="product not found")
    return product


@router.patch("/{product_id}")
def update_product(
    product_id: int,
    product: ProductUpdate,
    repository: ProductRepository = Depends(get_repository),
    current_user: User = Depends(get_current_active_user),
) -> ProductPublic:
    updated_product = repository.update(product_id, product)
    if updated_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    else:
        return updated_product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    repository: ProductRepository = Depends(get_repository),
    current_user: User = Depends(get_current_active_user),
):
    is_deleted = repository.delete(product_id)
    if update_product:
        return {"deleted": True}
    else:
        raise HTTPException(status_code=404, detail="Product not found")
