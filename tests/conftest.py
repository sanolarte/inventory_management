# tests/conftest.py
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))


import pytest
from fastapi.testclient import TestClient
from app.routers import products
from fastapi import FastAPI


class FakeRepo:
    def __init__(self):
        self._items = {
            1: {"id": 1, "name": "Apple", "price": 3.5, "quantity": 5, "description": "Fruit", "created_at":"2025-09-28 18:12:24.403999", "updated_at": "2025-09-28 18:12:24.403999"},
        }

    def create(self, product):
        new_id = max(self._items) + 1 if self._items else 1
        data = product.dict()
        data["id"] = new_id
        data["created_at"] = "2025-09-28 18:12:24.403999"
        data["updated_at"] = "2025-09-28 18:12:24.403999"
        self._items[new_id] = data
        return data

    def list_all(self, offset, limit):
        return list(self._items.values())[offset:offset+limit]

    def get(self, product_id):
        return self._items.get(product_id)

    def update(self, product_id, product_update):
        if product_id not in self._items:
            return None
        current = self._items[product_id]
        for k, v in product_update.dict(exclude_unset=True).items():
            current[k] = v
        self._items[product_id] = current
        return current

    def delete(self, product_id):
        return self._items.pop(product_id, None) is not None



@pytest.fixture
def client():
    app = FastAPI()
    app.include_router(products.router)

    # Override dependency to use FakeRepo
    app.dependency_overrides[products.get_repository] = lambda: FakeRepo()
    return TestClient(app)