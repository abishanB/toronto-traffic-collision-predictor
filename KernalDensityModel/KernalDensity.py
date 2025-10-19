import numpy as np
import pandas as pd
from sklearn.neighbors import KernelDensity
import folium

m = folium.Map(location=[43.7, -79.4], zoom_start=12)
m.add_child(folium.LatLngPopup())

m
