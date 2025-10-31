from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import numpy as np

router = APIRouter()

# Load the Random Forest model
load_model_obj = joblib.load("./RandomForestModel/rf_model.joblib")
rf_model = load_model_obj["model"]
feature_names = load_model_obj.get("feature_names", [])


class Coordinates(BaseModel):
  lat: float
  long: float


def classify_risk(probability: float) -> str:
  if probability < 0.33:
    return "Low Risk"
  elif probability < 0.66:
    return "Medium Risk"
  else:
    return "High Risk"


@router.post("/predict/rf")
def predict_random_forest(coords: Coordinates) -> object:
  """
  Predict collision risk using Random Forest model
  Returns probability of collision and risk classification
  """
  # Create feature array - adjust features according to your model's requirements
  features = np.array([[coords.lat, coords.long]])

  # Get probability prediction
  # Using probability of positive class (collision)
  probability = rf_model.predict_proba(features)[0][1]

  # Scale probability to 0-100 range
  risk_score = probability * 100
  risk_class = classify_risk(probability)

  return {
      "risk_score": float(risk_score),
      "risk_class": risk_class
  }
