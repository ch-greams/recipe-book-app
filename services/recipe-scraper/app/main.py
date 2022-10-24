from fastapi import FastAPI
from app.routers import recipe


app = FastAPI()

app.include_router(recipe.router)
