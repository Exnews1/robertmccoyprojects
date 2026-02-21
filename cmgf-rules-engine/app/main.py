from fastapi import FastAPI
from dotenv import load_dotenv
from .api.routes import router

load_dotenv()

app = FastAPI(title="CMGF Rules Engine", version="0.1.0")
app.include_router(router, prefix="/api")
