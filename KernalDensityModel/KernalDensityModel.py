import numpy as np
import pandas as pd
import joblib
from sklearn.neighbors import KernelDensity


df = pd.read_csv("./KernalDensityModel/datasets/traffic_collisions.csv")
df['LAT'] = df['LAT'].astype(float)
df['LONG'] = df['LONG'].astype(float)

coords = df[['LAT', 'LONG']].values
kde = KernelDensity(
    bandwidth=0.002,     # smoothness 0.005–0.05
    kernel='gaussian'
)
kde.fit(coords)


def getMinMax(coords):
  sampleSize = 0.001
  sample_idx = np.random.choice(len(coords), size=int(
      sampleSize * len(coords)), replace=False)
  coords_sample = coords[sample_idx]

  print(f"Scoring {len(coords_sample)} samples individually...")

  min_val = float('inf')
  max_val = float('-inf')
  risk_scores = []

  for i, point in enumerate(coords_sample):
    log_density = kde.score_samples([point])[0]  # type: ignore
    risk_score = np.exp(log_density)
    risk_scores.append(risk_score)

    # Track min and max
    min_val = min(min_val, risk_score)
    max_val = max(max_val, risk_score)

    if i % 100 == 0 or i == len(coords_sample) - 1:
      print(f"{i + 1}/{len(coords_sample)} → "
            f"Current: {risk_score:.6f}, "
            f"Min: {min_val:.6f}, Max: {max_val:.6f}")

  avg_val = float(np.mean(risk_scores))

  print(f"\nFinal Min: {min_val:.6f}, Max: {max_val:.6f}, Avg: {avg_val:.6f}")
  return min_val, max_val, avg_val


# min_val, max_val, avg_val = getMinMax(coords)
min_val, max_val = 0, 210
model_data = {
    "model": kde,
    "min_risk": min_val,
    "max_risk": max_val,
}

joblib.dump(model_data, "model.joblib")
