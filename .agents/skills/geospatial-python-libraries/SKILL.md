---
name: geospatial-python-libraries
description: "Best practices, common workflows, and code patterns for Rasterio, GeoPandas, Shapely, GDAL/OGR, Xarray, NumPy, Pandas, Polars, Scikit-Learn, Matplotlib, Seaborn, and PyMannKendall in Remote Sensing."
---

# Python Geospatial & Data Science Libraries

Use this skill when writing, refactoring, or debugging code that processes spatial data (rasters and vectors), analyzes data tables, creates machine learning pipelines, or generates plots for Remote Sensing.

---

## 1. Geospatial Core (Rasterio, GeoPandas, Shapely, Xarray, GDAL)

### Rasterio (Raster I/O and Processing)
*   **Reading Rasters Safely:**
    Always open datasets within a context manager.
    ```python
    import rasterio

    with rasterio.open('datos/Sentinel2_B4.tif') as src:
        print(src.width, src.height)
        print(src.crs)       # Coordinate system (e.g., EPSG:32618)
        print(src.transform) # Affine transform (pixel-to-coord mapping)
        
        # Read band 1 (Note: Rasterio bands are 1-indexed!)
        band4 = src.read(1)
    ```

*   **Writing Rasters with Correct Georeferencing:**
    Copy the profile from the source raster to keep the same projection, size, and transform.
    ```python
    with rasterio.open('datos/Sentinel2_B4.tif') as src:
        profile = src.profile.copy()
        
    profile.update(
        dtype=rasterio.float32,
        count=1,
        nodata=-9999
    )

    with rasterio.open('datos/NDVI_output.tif', 'w', **profile) as dst:
        dst.write(ndvi_array.astype(rasterio.float32), 1)
    ```

### GeoPandas & Shapely (Vector Data)
*   **CRS Projection (CRITICAL):**
    For calculating areas, distances, or doing spatial buffers, always reproject from degrees (`EPSG:4326`) to meters (e.g., `EPSG:32618` - UTM Zone 18N for Magdalena/Caribbean).
    ```python
    import geopandas as gpd

    gdf = gpd.read_file('datos/area_estudio.geojson')
    gdf_utm = gdf.to_crs(epsg=32618) # Project to UTM 18N
    gdf_utm['area_ha'] = gdf_utm.geometry.area / 10000.0 # area in hectares
    ```

### Xarray (Multidimensional Rasters / Datacubes)
*   **Opening and Slicing Datasets:**
    ```python
    import xarray as xr

    ds = xr.open_dataset('datos/series_NDVI.nc')
    subset = ds.sel(time=slice('2024-01-01', '2024-06-30'))
    mean_ndvi = subset['ndvi'].mean(dim='time')
    ```

---

## 2. Data Analysis (NumPy, Pandas, Polars, SciPy)

### NumPy (Vectorized Grid Calculations)
*   **Vectorization over Loops:**
    Never iterate through pixels of a raster. Always use vectorized numpy operations.
    ```python
    import numpy as np

    # Avoid divide-by-zero errors in division (like NDVI calculation)
    # NDVI = (NIR - Red) / (NIR + Red)
    with np.errstate(divide='ignore', invalid='ignore'):
        ndvi = np.where((nir + red) == 0, np.nan, (nir - red) / (nir + red))
    ```
*   **Managing NaNs and NoData:**
    ```python
    # Mask out NoData values (e.g., -9999) before calculations
    masked_array = np.where(raw_array == -9999, np.nan, raw_array)
    mean_val = np.nanmean(masked_array)
    ```

### Pandas & Polars (DataFrames for Training Musters and Statistics)
*   **Pandas (Classic Data Handling):**
    ```python
    import pandas as pd
    # Loading training pixels
    df = pd.read_csv('datos/training_samples.csv')
    # Filter by class
    cacao_samples = df[df['class_name'] == 'cacao']
    ```
*   **Polars (High Performance Data Processing):**
    ```python
    import polars as pl
    df_pl = pl.read_csv('datos/training_samples.csv')
    summary = df_pl.group_by('class_name').agg(pl.col('ndvi').mean())
    ```

---

## 3. Machine Learning (Scikit-Learn, XGBoost)

For land cover classification (Random Forest, XGBoost):
*   **Extracting Raster Pixels for ML Training:**
    Create a feature matrix `X` (bands) and target vector `y` (classes) from sample points.
    ```python
    # X shape: (n_samples, n_features), y shape: (n_samples,)
    X = training_df[['B2', 'B3', 'B4', 'B8', 'B11', 'B12']].values
    y = training_df['class_id'].values
    ```
*   **Random Forest Classifier:**
    ```python
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import classification_report, confusion_matrix

    rf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)
    
    print(classification_report(y_test, y_pred))
    ```
*   **XGBoost Classifier:**
    ```python
    from xgboost import XGBClassifier
    xgb = XGBClassifier(n_estimators=100, random_state=42, use_label_encoder=False)
    xgb.fit(X_train, y_train)
    ```

---

## 4. Time Series & Trends (PyMannKendall)

*   **Mann-Kendall Trend Test:**
    Used to detect monotonic trends in time series of NDVI or other indices.
    ```python
    import pymannkendall as pmk

    # Run the test on a 1D array of values over time
    result = pmk.original_test(ndvi_time_series)
    print(result.trend)  # 'increasing', 'decreasing', or 'no trend'
    print(result.p)      # p-value (p < 0.05 is statistically significant)
    print(result.slope)  # Sen's slope (rate of change per time step)
    ```

---

## 5. Visualizing Geospatial Data (Matplotlib, Seaborn)

*   **Plotting Spatial Rasters with Colormaps:**
    ```python
    import matplotlib.pyplot as plt
    import seaborn as sns

    plt.figure(figsize=(10, 8))
    # Use 'viridis' or 'YlGn' (Yellow-Green) for vegetation
    plt.imshow(ndvi, cmap='YlGn', vmin=0, vmax=1)
    plt.colorbar(label='NDVI')
    plt.title('Mapa de NDVI - Sierra Nevada de Santa Marta')
    plt.axis('off')
    plt.show()
    ```
*   **Plotting Spectral Signatures (Line Plot):**
    ```python
    bands = ['Blue', 'Green', 'Red', 'NIR', 'SWIR1', 'SWIR2']
    cacao_signature = [0.03, 0.06, 0.04, 0.45, 0.18, 0.08]
    soil_signature = [0.08, 0.12, 0.15, 0.20, 0.28, 0.24]

    plt.figure(figsize=(8, 5))
    plt.plot(bands, cacao_signature, marker='o', label='Cacao', color='green')
    plt.plot(bands, soil_signature, marker='s', label='Suelo Desnudo', color='brown')
    plt.ylabel('Reflectancia')
    plt.title('Firmas Espectrales Típicas')
    plt.legend()
    plt.grid(True, linestyle='--')
    plt.show()
    ```
