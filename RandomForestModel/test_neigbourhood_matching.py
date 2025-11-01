import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

neighbourhoods = gpd.read_file(
  "toronto_neigbourhoods.geojson")

if neighbourhoods.crs is None or neighbourhoods.crs.to_string() != "EPSG:4326":
  neighbourhoods = neighbourhoods.to_crs(epsg=4326)


def get_neighbourhood(lat: float, lon: float) -> str:
  point = Point(lon, lat)
  for _, row in neighbourhoods.iterrows():
    if row["geometry"].contains(point):
      return (
          row.get("AREA_NAME")
          or row.get("Neighbourhood")
          or row.get("name")
          or "Unknown"
      )
  return "Unknown"


data = pd.read_csv("./RandomForestModel/raw_ksi_data.csv", usecols=[
                   "LATITUDE", "LONGITUDE", "NEIGHBOURHOOD_140"])


def predict_row(row: pd.Series) -> str:
  return get_neighbourhood(float(row["LATITUDE"]), float(row["LONGITUDE"]))


data["PredictedNeighbourhood"] = data.apply(predict_row, axis=1)

# Compare results
data["Match"] = data["PredictedNeighbourhood"] == data["NEIGHBOURHOOD_140"]
accuracy = data["Match"].mean() * 100

print(f"Match accuracy: {accuracy:.2f}%")
print("\nSample mismatches:")
print(data[data["Match"] == False].head())

mismatched_df = data[data["Match"] == False]
# mismatched_df.to_csv("mismatched_hoods.csv", index=False)
