import csv
import json

features = []

with open("./KernalDensityModel/datasets/traffic_collisions.csv", newline="", encoding="utf-8") as f:
  reader = csv.DictReader(f)
  for i, row in enumerate(reader):
    # if i % 2 != 0:
      # continue
    if not row["LAT"] or not row["LONG"]:
      continue

    features.append({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                float(row["LONG"]),
                float(row["LAT"])
            ]
        },
        "properties": {}
    })

geojson = {
    "type": "FeatureCollection",
    "features": features
}

with open("./KernalDensityModel/datasets/collisions.geojson", "w", encoding="utf-8") as f:
  json.dump(geojson, f)
