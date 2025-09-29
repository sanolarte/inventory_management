# tests/test_products_api.py
import sys, os

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
)

# tests/app/test_products_api.py
import pytest
from fastapi.testclient import TestClient
from app.routers import products
from fastapi import FastAPI


def test_create_product(client):
    payload = {"name": "Banana", "price": 2.5, "quantity": 10, "description": "Yellow"}
    response = client.post("/products/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Banana"
    assert "id" in data


def test_read_products(client):
    response = client.get("/products/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_read_product(client):
    response = client.get("/products/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1


def test_update_product(client):
    update_payload = {"quantity": 99}
    response = client.patch("/products/1", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["quantity"] == 99


# def test_delete_product(client):
#     response = client.delete("/products/1")
#     assert response.status_code == 200
#     assert response.json() == {"deleted": True}


def test_read_nonexistent_product(client):
    response = client.get("/products/999")
    assert response.status_code == 404
