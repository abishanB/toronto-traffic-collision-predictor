# split data so that its under github limit 100mb
import pandas as pd

# Read your CSV
df = pd.read_csv('Traffic_Collisions_Open_Data_Complete.csv')

# Find halfway point
half = len(df) // 2

# Split and save
df.iloc[:half].to_csv('Traffic_Collisions_Open_Data_1.csv', index=False)
df.iloc[half:].to_csv('Traffic_Collisions_Open_Data_2.csv', index=False)
