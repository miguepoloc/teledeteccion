---
name: google-earth-engine-best-practices
description: "Best practices, common patterns, and optimization strategies for using the Google Earth Engine (GEE) Python API and geemap in Jupyter notebooks."
---

# Google Earth Engine (GEE) Python API Best Practices

Use this skill when writing, refactoring, or debugging Jupyter Notebooks or Python scripts that interface with the Google Earth Engine (GEE) API (`ee` library) or use `geemap` for visualization.

## 1. Authentication and Initialization
Always initialize the GEE library safely, especially inside Google Colab or local Jupyter environments.

```python
import ee
import geemap

try:
    # Try initializing without prompting
    ee.Initialize()
except Exception:
    # If initialization fails, prompt for authentication
    ee.Authenticate()
    ee.Initialize()
```

## 2. Client-Side vs. Server-Side Execution (CRITICAL)
Google Earth Engine runs calculations on Google's servers, not locally. Do NOT mix Python client-side objects/loops with GEE server-side objects.

*   **Rule 1: NEVER use Python `for` loops or `if` statements on GEE collections.**
    *   *Incorrect:*
        ```python
        # SLOW and fails on large collections
        for image in collection.getInfo()['features']:
            # process locally
        ```
    *   *Correct (Server-Side Map):*
        ```python
        def process_image(image):
            # perform server-side calculations
            return image.addBands(ndvi)
            
        processed_collection = collection.map(process_image)
        ```

*   **Rule 2: Avoid `.getInfo()` inside loops or maps.**
    *   `.getInfo()` pulls data from the server to the client synchronously, blocking execution. Calling it inside a loop will crash the notebook or cause gateway timeouts.
    *   *Tip:* Only call `.getInfo()` on final, small aggregated objects (like a single value, a summary dictionary, or a chart dataset).

## 3. Image Collections, Filtering, and Sorting
Optimize performance by filtering collections *as early as possible* in the pipeline before performing calculations.

```python
# Best practice: Filter by bounds, date, and cloud cover FIRST
aoi = ee.Geometry.Point([-74.1, 11.1]) # Magdalena area

s2_collection = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                 .filterBounds(aoi)
                 .filterDate('2024-01-01', '2024-12-31')
                 .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)))
```

## 4. Calculating Spectral Indices
Calculate indices using GEE server-side expression formulas or `.normalizedDifference()`.

*   **Using `normalizedDifference` (e.g., NDVI):**
    ```python
    # NDVI = (NIR - Red) / (NIR + Red) -> Sentinel-2: B8 (NIR), B4 (Red)
    ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
    ```

*   **Using `expression` (complex indices like EVI or SAVI):**
    ```python
    # EVI = 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
    evi = image.expression(
        '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
            'NIR': image.select('B8'),
            'RED': image.select('B4'),
            'BLUE': image.select('B2')
        }
    ).rename('EVI')
    ```

## 5. Reducing Regions (Zonal Statistics)
To compute stats (mean, median, min, max) over specific polygons (like shapes/AOI), use `.reduceRegion()`.

```python
stats = ndvi_image.reduceRegion(
    reducer=ee.Reducer.mean(),
    geometry=polygon,
    scale=10, # Sentinel-2 resolution is 10m
    maxPixels=1e9
)

# Fetch result to client safely (only on the final dict!)
mean_ndvi = stats.get('NDVI').getInfo()
```

## 6. Visualizing with `geemap`
Use `geemap` for interactive maps in Jupyter/Colab.
```python
Map = geemap.Map()
Map.centerObject(aoi, zoom=10)

vis_params = {
    'bands': ['B4', 'B3', 'B2'], # True color
    'min': 0,
    'max': 3000
}
Map.addLayer(s2_image, vis_params, 'Sentinel-2 True Color')
Map.addLayer(ndvi_image, {'min': 0, 'max': 1, 'palette': ['blue', 'yellow', 'green']}, 'NDVI')
Map
```
