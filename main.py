from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_model_obj: dict = joblib.load("./KernalDensityModel/model.joblib")
kd_model = load_model_obj["model"]
kd_min_risk: int = 0
kd_max_risk: int = 165


class InputData(BaseModel):
  lat: float
  long: float


@app.get("/")
def root():
  return {"OK!"}


def classify_risk(score: float) -> str:
  if score < 40:
    return "Low Risk"
  elif score < 75:
    return "Medium Risk"
  else:
    return "High Risk"


@app.post("/predict/kd")
def predict(data: InputData) -> object:
  point = np.array([[data.lat, data.long]])
  log_density: np.ndarray = kd_model.score_samples(point)
  risk_score: float = np.exp(log_density)[0]

  # scale of 0 - 100
  normalized_risk_score: float = (
    (risk_score - kd_min_risk) / (kd_max_risk - kd_min_risk)) * 100
  risk_class: str = classify_risk(normalized_risk_score)

  return {"risk_score": normalized_risk_score, "risk_class": risk_class}
