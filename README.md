# Toronto Collision Predictor
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Jupyter Notebook](https://img.shields.io/badge/jupyter-%23FA0F00.svg?style=for-the-badge&logo=jupyter&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

## Overview
This project is a web-based application that analyzes historical traffic collision data in Toronto to identify and visualize high-risk areas. 
It combines machine learning, geospatial analysis, and an interactive map-based UI to help users explore collision density, assess relative risk at specific locations, and better understand spatial patterns in traffic incidents.

## Tech Stack & Tools
### Frontend
- Next.js
- Mapbox GL JS
### Backend
- FastAPI

### Data & Machine Learning
- Scikit-learn
- Jupyter Notebook
- Pandas, NumPy
- Matplotlib, Seaborn

## Data Source
Traffic collision data used in this project is provided by the Toronto Police Service:
https://data.torontopolice.on.ca/

Neighbourhood boundary data is sourced from this repo: https://github.com/jasonicarter/toronto-geojson/tree/master

## Models
This project uses two complementary machine learning models to estimate and classify traffic collision risk.

### Kernel Density Estimation (KDE)
Kernel Density Estimation is used to compute a continuous collision risk surface over geographic space. Given a set of latitude and longitude coordinates, KDE estimates the relative likelihood of collisions occurring near that location based on the spatial concentration of historical incidents.

### Random Forest Classifier
A Random Forest classifier is used to classify severity risk levels based on multiple features beyond location alone. These features may include time of day, road condition, visibility and other attributes derived from the collision dataset. Severe collisions are collisions where injuries or fatalities were reported.

## License
This project is licensed under the MIT License.
