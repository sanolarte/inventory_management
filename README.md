# 📦 Inventory Management System (FastAPI)

This is a full-stack **Inventory Management System** built with **FastAPI**.  
It provides secure authentication (JWT) and CRUD operations for managing products.

---

## 🚀 Features

- User registration & login with JWT authentication.
- Product CRUD operations (create, read, update, delete).
- Repository pattern for database access.
- SQLModel models (SQLAlchemy + Pydantic in one).
- Automatically generated Swagger UI.

---

## 🛠️ Prerequisites

- Python 3.10 or higher
- `pip` (Python package manager)
- `virtualenv` (recommended)

---

## 🔧 Setup Instructions

1. **Clone the repository:**

```
git clone https://github.com/sanolarte/inventory-management.git
cd inventory-management
```


2. **Create and activate a virtual environment:**
```
python3 -m venv venv
```

Activate (Linux/Mac)
```
source venv/bin/activate
```

Activate (Windows PowerShell)
```
.\venv\Scripts\activate
```

3. **Install dependencies from requirements.txt**
```
pip install -r requirements.txt
```


4. **Set Env variables**
```
python -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))" >> .env
```

## ▶️ Running the Application

Use Uvicorn to run the FastAPI application:
```
uvicorn app.main:app --reload
```

- app.main:app points to the app object in app/main.py.

- --reload enables live-reload during development.

The app will start by default at http://127.0.0.1:8000


## Run Tests
Both regression and unit tests can be ran using Pytest
```
pytest
```



## 📚 API Documentation

FastAPI automatically provides interactive docs:

**Swagger UI: ** http://127.0.0.1:8000/docs