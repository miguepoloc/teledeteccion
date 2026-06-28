# Análisis Multitemporal NDVI — Sierra Nevada de Santa Marta (2000–2025)

**Artículo 1:** *Análisis Multitemporal del NDVI en las Estribaciones de la Sierra Nevada de Santa Marta Como Evidencia de la Transición Agrícola Café-Cacao (2000–2025)*

Autor: Ing. Miguel Ángel Polo Castañeda  
Universidad del Magdalena | Maestría en Ingeniería

---

## Estructura del proyecto

```
code/
├── 01_gee_ndvi_series.js          # Script GEE: extracción NDVI multitemporal
├── 02_analisis_mann_kendall.py    # Script Python: análisis estadístico Mann-Kendall
├── requirements.txt               # Dependencias Python
└── README.md                      # Este archivo
```

Los datos y resultados generados se ubican en:

```
datos/                             # Shapefiles, DEM, CSV de GEE
```

---

## Flujo de trabajo

### Fase 1 — Preparación del entorno

Instala las dependencias Python:

```bash
pip install -r requirements.txt
```

Verifica la instalación:

```bash
python3 -c "import numpy, pandas, scipy; print('✓ Listo')"
```

También necesitas:
- **QGIS 3.x** — preprocesamiento y visualización
- **SNAP 10.x** — procesamiento de imágenes SAR
- **Cuenta Google Earth Engine** — [registrarse aquí](https://earthengine.google.com/signup/)

### Fase 2 — Delimitación del área de estudio (QGIS)

1. Descarga el DEM SRTM 30m desde [USGS EarthExplorer](https://earthexplorer.usgs.gov) (busca *SRTM 1 Arc-Second Global*)
2. Descarga los límites municipales desde [Colombia en Mapas](https://www.colombiaenmapas.gov.co/)
3. Descarga el shapefile de la Sierra Nevada desde [Protected Planet](https://www.protectedplanet.net/132)
4. En QGIS:
   - Carga y une los tiles SRTM con **Raster → Miscellaneous → Merge**
   - Recorta el DEM al polígono de la SNSM con **Raster → Extraction → Clip Raster by Mask Layer**
   - Exporta el polígono del área de estudio como `area_estudio.shp`
5. Estratificación altitudinal:

| Franja | Elevación (msnm) | Cobertura histórica |
|--------|-----------------|---------------------|
| Baja   | 400–700         | Cacao tradicional   |
| Media  | 700–1200        | **Zona de transición** |
| Alta   | 1200–1800       | Café tradicional    |

### Fase 3 — Extracción de NDVI en Google Earth Engine

1. Abre [code.earthengine.google.com](https://code.earthengine.google.com)
2. Importa `area_estudio.shp` en **Assets → New → Shapefile upload**
3. Copia el contenido de `01_gee_ndvi_series.js` en el editor
4. Actualiza la ruta del asset en la línea:
   ```js
   var areaEstudio = ee.FeatureCollection('projects/TU_PROYECTO/assets/SierraNevada');
   ```
5. Presiona **Run** y luego ve a **Tasks** para exportar el CSV a Google Drive
6. Descarga el CSV y colócalo en la carpeta `datos/` como `NDVI_Series_Temporal_2000_2025.csv`

### Fase 4 — Análisis estadístico Mann-Kendall (Python)

```bash
# Desde la carpeta code/
python3 02_analisis_mann_kendall.py
```

**Salidas generadas:**
- `mann_kendall_resultados.csv` — tabla con tau, p-value y pendiente de Sen por franja
- `NDVI_series_temporal.png` — gráfica de series temporales (300 dpi, lista para publicar)

---

## Interpretación del Test Mann-Kendall

El test Mann-Kendall detecta si existe una **tendencia monótona** (creciente o decreciente) en una serie temporal sin asumir distribución normal.

- **Tau > 0** → tendencia creciente (NDVI sube con el tiempo)
- **Tau < 0** → tendencia decreciente (NDVI baja con el tiempo)
- **p < 0.05** → la tendencia es estadísticamente significativa
- **Pendiente de Sen** → cambio promedio de NDVI por año

---

## Dependencias

Ver [requirements.txt](requirements.txt) para las versiones exactas.

| Librería | Uso |
|----------|-----|
| `pandas` | Carga y manipulación del CSV |
| `scipy` | Correlación de Kendall |
| `pymannkendall` | Test Mann-Kendall y pendiente de Sen |
| `matplotlib` | Generación de gráficas |
| `rasterio` | Lectura de archivos raster (futuras fases) |
| `geopandas` | Manejo de shapefiles (futuras fases) |
| `scikit-learn` | Clasificación Random Forest (Fase 5) |
