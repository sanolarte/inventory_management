from fastapi import FastAPI

from app.routers import products, users


app = FastAPI()

app.include_router(products.router)
app.include_router(users.router)


