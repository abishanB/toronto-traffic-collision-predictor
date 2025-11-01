from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

router = APIRouter()

load_model_obj = joblib.load("./RandomForestModel/rf_model.joblib")
rf_model = load_model_obj["model"]
feature_names = load_model_obj.get("feature_names", [])


class InputData(BaseModel):
  neighbourhood: str
  light_condition: str
  visibility: str
  road_condition: str
  time_of_day: str
  dow: str
  season: str
  vehicle_type: str
  driver_action: str
  impact_type: str
  age_range: str


def classify_risk(probability: float) -> str:
  if probability <= 0.55:
    return "Low Risk"
  elif probability <= 0.80:
    return "Medium Risk"
  else:
    return "High Risk"


@router.post("/predict/rf")
def predict_severity(data: InputData) -> object:  # severity risk prediction
  input_data = {
    "LIGHT": [data.light_condition],
    "VISIBILITY": [data.visibility],
    "ROAD_CONDITION": [data.road_condition],
    "DOW": [data.dow],
    "TIME_OF_DAY": [data.time_of_day],
    "SEASON": [data.season],
    "VEHICLE_TYPE": [data.vehicle_type],
    "DRIVER_ACTION": [data.driver_action],
    "IMPACT_TYPE": [data.impact_type],
    "NEIGHBOURHOOD": [data.neighbourhood],
    "AGE_RANGE": [data.age_range]
      }
  input_df = pd.DataFrame(input_data)

  severity_probability = rf_model.predict_proba(input_df)[0][1]
  severity_risk_class = classify_risk(severity_probability)
  return {
    "severity_risk_score": severity_probability,
    "severity_risk_class": severity_risk_class
  }
