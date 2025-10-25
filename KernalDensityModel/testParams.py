import numpy as np
import pandas as pd
from sklearn.neighbors import KernelDensity
from sklearn.model_selection import GridSearchCV


df = pd.read_csv("./datasets/traffic_collisions.csv")
df['LAT'] = df['LAT'].astype(float)
df['LONG'] = df['LONG'].astype(float)

coords = df[['LAT', 'LONG']].values

sample_size = 0.25
coords_sample = coords[np.random.choice(
  len(coords), size=int(sample_size * len(coords)), replace=False)]


bandwidths = np.linspace(0.001, 0.01, 10)
kernels = ['gaussian', 'cosine', 'epanechnikov']

params = {'bandwidth': bandwidths, 'kernel': kernels}
grid = GridSearchCV(
    KernelDensity(),
    params,
    cv=3,  # 5-fold cross-validation
    n_jobs=-1,  # use all cores
    verbose=2
)
grid.fit(coords_sample)

print("Best bandwidth:", grid.best_estimator_.bandwidth)  # type: ignore
print("Best kernel:", grid.best_estimator_.kernel)  # type: ignore
