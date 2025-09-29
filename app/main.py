from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import products, users


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(products.router)
app.include_router(users.router)
