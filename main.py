from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import neighbourhood, predict_kernal_density, predict_random_forest

app: FastAPI = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
  return {"OK!"}


app.include_router(predict_kernal_density.router)
app.include_router(predict_random_forest.router)
app.include_router(neighbourhood.router)
