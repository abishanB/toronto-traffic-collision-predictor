from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

df = pd.read_csv("./RandomForestModel/ksi_collisions.csv")
categorical_features = ['LIGHT', 'VISIBILITY',
                        'ROAD_CONDITION', 'DOW', 'TIME_OF_DAY', 'SEASON']
encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
encoded_array = encoder.fit_transform(df[categorical_features])
encoded_cols = encoder.get_feature_names_out(categorical_features)
encoded_df = pd.DataFrame(encoded_array, columns=encoded_cols, index=df.index)
X = encoded_df
y = df['SEVERE_COLLISION']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42)
params = {
    'n_estimators': [80, 100, 120],
    'max_depth': [15, 20, 40, None],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2', None]
}

rf = RandomForestClassifier(random_state=42)
grid = GridSearchCV(rf, params, cv=3, scoring='f1', n_jobs=-1, verbose=2)
grid.fit(X_train, y_train)

print("Best Params:", grid.best_params_)
print("Best F1 Score:", grid.best_score_)
