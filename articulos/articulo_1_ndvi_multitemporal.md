# Artículo 1 — Guía Metodológica Completa

## Título

**"Análisis multitemporal del NDVI en las estribaciones de la Sierra Nevada de Santa Marta como evidencia de la transición agrícola café-cacao (2000–2025)"**

*Título en inglés para submission:*
**"Multi-Temporal NDVI Analysis in the Sierra Nevada de Santa Marta Foothills as Evidence of Coffee-to-Cacao Agricultural Transition (2000–2025)"**

---

## Revista objetivo

**MDPI *Land*** (ISSN 2073-445X)
- Impact Factor: 3.2 | Cuartil Q1 (Geography, Planning and Development)
- Sección: Land Use, Land Cover and Soil Sciences
- APC: 2200 CHF (solicitar waiver como investigador colombiano)
- Tiempo de revisión promedio: 25–35 días

**Segunda opción:** MDPI *Remote Sensing*, sección "Remote Sensing in Agriculture and Vegetation"

---

## Justificación de la novedad científica

Antes de escribir una línea, debes poder responder esta pregunta al editor:
**¿Qué hace este artículo que no existe en la literatura?**

Respuesta: Ningún estudio ha cuantificado espacial y temporalmente la reconversión café→cacao en la SNSM usando teledetección de largo plazo. Los trabajos existentes de Fremout et al. (2026) y González-Orozco et al. (2024) son modelos de aptitud climática proyectiva, no evidencia satelital observada del cambio ya ocurrido. Tú documentas el fenómeno real con 25 años de datos.

---

## Paso 1 — Definición del área de estudio

### Delimitación geográfica
- Estribaciones de la SNSM en el departamento del Magdalena
- Municipios: Ciénaga, Santa Marta (zona rural), Fundación, Aracataca
- Rango altitudinal: **400 a 1800 msnm** (donde se traslapa el óptimo térmico de café y cacao)
- Extensión aproximada: definir polígono de ~150.000–300.000 ha

### Estratificación altitudinal (obligatoria para el análisis)
Divide el área en 3 franjas:
- Franja baja: 400–700 msnm → zona histórica de cacao
- Franja media: 700–1200 msnm → zona de transición activa café→cacao
- Franja alta: 1200–1800 msnm → zona cafetera tradicional en contracción

Esta estratificación es el argumento espacial central del artículo.

### Cómo hacerlo
1. Descargar shapefile de límites municipales del IGAC (datos.gov.co, gratuito)
2. Delimitar el polígono de estudio en QGIS usando el DEM SRTM para definir las franjas altitudinales
3. Exportar el polígono como shapefile o GeoJSON para importar en GEE

---

## Paso 2 — Adquisición y preprocesamiento de imágenes satelitales

### Fuentes de datos (todas gratuitas en Google Earth Engine)

| Sensor | Período | Resolución | Colección GEE |
|--------|---------|-----------|---------------|
| Landsat 5 TM | 2000–2011 | 30 m | `LANDSAT/LT05/C02/T1_L2` |
| Landsat 7 ETM+ | 2000–2013 | 30 m | `LANDSAT/LE07/C02/T1_L2` |
| Landsat 8 OLI | 2013–2022 | 30 m | `LANDSAT/LC08/C02/T1_L2` |
| Landsat 9 OLI-2 | 2021–2025 | 30 m | `LANDSAT/LC09/C02/T1_L2` |
| Sentinel-2 L2A | 2017–2025 | 10 m | `COPERNICUS/S2_SR_HARMONIZED` |
| SRTM DEM | estático | 30 m | `USGS/SRTMGL1_003` |

### Preprocesamiento en GEE — pasos exactos

**A. Filtrado de nubes**
```javascript
// Para Landsat 8/9
function maskL8sr(image) {
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  return image.updateMask(qaMask);
}

// Para Sentinel-2
function maskS2clouds(image) {
  var scl = image.select('SCL');
  var mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return image.updateMask(mask);
}
```

**B. Cálculo de NDVI**
```javascript
// Landsat 8/9
var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');

// Sentinel-2
var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
```

**C. Composiciones anuales libres de nubes**
Para cada año de 2000 a 2025, genera una composición de mediana (mediana es más robusta que la media para eliminar nubes residuales):
```javascript
var collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2020-01-01', '2020-12-31')
  .filterBounds(areaEstudio)
  .map(maskL8sr)
  .map(function(img){ return img.normalizedDifference(['SR_B5','SR_B4']).rename('NDVI'); });

var composicion = collection.median();
```

**D. Período estacional**
Dado que la SNSM tiene dos períodos secos (diciembre–marzo y julio–agosto), define siempre la composición en el mismo período para comparabilidad. **Recomendación: usar enero–marzo de cada año** (período seco, menor nubosidad, NDVI más contrastado entre cultivos).

---

## Paso 3 — Análisis de tendencia temporal del NDVI

### Test de Mann-Kendall (obligatorio para publicación en Q1)

Este test no paramétrico detecta tendencias monotónicas en series temporales sin asumir normalidad. Es el estándar para análisis de tendencias NDVI en la literatura. Se ejecuta en Python:

```python
import numpy as np
from scipy import stats
import pandas as pd

# Datos de NDVI por zona (extraídos de GEE como CSV)
# Columnas: año, ndvi_zona_baja, ndvi_zona_media, ndvi_zona_alta

df = pd.read_csv('ndvi_series.csv')

for zona in ['zona_baja', 'zona_media', 'zona_alta']:
    tau, p_value = stats.kendalltau(df['año'], df[zona])
    print(f"{zona}: tau={tau:.3f}, p={p_value:.4f}")
    # Si p < 0.05: tendencia significativa
    # tau > 0: tendencia creciente (posible expansión de cacao)
    # tau < 0: tendencia decreciente
```

### Sen's Slope (magnitud del cambio)
Complementa el Mann-Kendall con la pendiente de Sen para cuantificar cuánto cambia el NDVI por año:

```python
from pymannkendall import original_test
result = original_test(df['ndvi_zona_media'])
print(f"Slope: {result.slope:.5f} NDVI/año")
```

### Instalación: `pip install pymannkendall scipy pandas`

---

## Paso 4 — Clasificación de coberturas (4 fechas clave)

Selecciona 4 años representativos para el mapa de cambio:
- **2000**: línea base (dominio cafetalero)
- **2010**: período intermedio
- **2017**: inicio del boom cacaotero documentado
- **2024**: estado actual

### Clases de cobertura a mapear
1. Cacao agroforestal
2. Café de sombra
3. Bosque nativo / rastrojo
4. Pasturas / suelo desnudo
5. Otras coberturas (zona urbana, cuerpos de agua)

### Clasificador: Random Forest en GEE
```javascript
// Puntos de entrenamiento (mínimo 50 por clase, idealmente 100)
var training = cacao.merge(cafe).merge(bosque).merge(pastura);

var classifier = ee.Classifier.smileRandomForest(100)
  .train({
    features: training,
    classProperty: 'clase',
    inputProperties: ['NDVI', 'EVI', 'NDWI', 'B2', 'B3', 'B4', 'B8']
  });

var classified = imagen.classify(classifier);
```

### Validación de la clasificación
- Separar 30% de los puntos para validación (no usados en entrenamiento)
- Calcular **Overall Accuracy** y **Kappa coefficient**
- Meta mínima para publicación: Overall Accuracy ≥ 85%, Kappa ≥ 0.80

### Matriz de transición entre fechas
Cuantifica cuántas hectáreas pasaron de café a cacao, de bosque a cultivo, etc. En QGIS: raster → vector → cruce espacial entre mapas de distintos años.

---

## Paso 5 — Validación de campo (opcional pero recomendada)

Si puedes hacer 1–2 días de campo en la SNSM:
- Tomar puntos GPS con clase de cobertura confirmada (mínimo 20 puntos por clase)
- Fotografiar cada punto con georreferenciación
- Usar Google Maps / Street View como validación adicional para zonas inaccesibles
- Si tienes dron: vuelo sobre 2 parcelas representativas (café y cacao) para comparar NDVI UAV vs. Sentinel-2

---

## Paso 6 — Figuras y resultados clave

El artículo debe tener exactamente estas figuras para ser competitivo:

**Figura 1:** Mapa del área de estudio con estratificación altitudinal y municipios

**Figura 2:** Serie temporal de NDVI (2000–2025) por franja altitudinal — gráfica de líneas, una por franja, con sombreado de incertidumbre (±SD)

**Figura 3:** Mapas de cobertura para las 4 fechas (2000, 2010, 2017, 2024) en un panel 2×2

**Figura 4:** Mapa de cambio neto de NDVI (2000 vs. 2024) — raster de diferencia, paleta de colores divergente

**Figura 5:** Matriz de transición de coberturas visualizada como Sankey diagram o tabla de área en ha

**Tabla 1:** Resultados del test Mann-Kendall por franja altitudinal (tau, p-value, Sen's slope)

**Tabla 2:** Accuracies de clasificación para cada fecha (Overall Accuracy, Kappa)

---

## Paso 7 — Estructura del artículo

### Abstract (250 palabras máximo)
Debe contener obligatoriamente:
- Problema: reconversión café→cacao en la SNSM sin documentación satelital
- Datos: Landsat + Sentinel-2, período 2000–2025, GEE
- Métodos: NDVI multitemporal, Mann-Kendall, clasificación RF
- Resultado principal: X hectáreas convertidas, tendencia significativa en franja media (tau=X, p<0.05)
- Implicación: riesgo emergente de Moniliasis en zonas de expansión cacaotera

### 1. Introduction (600–800 palabras)
**Párrafo 1:** Importancia económica del cacao en Colombia y la Región Caribe. Dato de producción nacional (Fedecacao).

**Párrafo 2:** El desplazamiento climático del café arábica y la expansión del cacao hacia zonas de altitud media. Citar: Fremout et al. (2026), González-Orozco et al. (2024), DaMatta et al. (2018).

**Párrafo 3:** La teledetección como herramienta para documentar cambios de cobertura agrícola en trópico húmedo. Citar trabajos similares (cambio café→otro cultivo en México/Centroamérica).

**Párrafo 4:** Gap de conocimiento — nadie ha documentado este cambio específico en la SNSM con datos satelitales observados de largo plazo.

**Párrafo 5:** Objetivos del estudio (3 máximo, concretos y medibles).

### 2. Study Area (300–400 palabras)
- Descripción geográfica y climática de las estribaciones de la SNSM
- Descripción del sistema productivo café/cacao en la zona
- Mapa del área (Figura 1)

### 3. Materials and Methods (800–1000 palabras)
- 3.1 Fuentes de datos satelitales
- 3.2 Preprocesamiento y composición anual
- 3.3 Cálculo de NDVI y otros índices
- 3.4 Análisis de tendencia (Mann-Kendall + Sen's slope)
- 3.5 Clasificación de coberturas (Random Forest)
- 3.6 Validación

### 4. Results (800–1000 palabras)
- 4.1 Tendencias temporales del NDVI por franja altitudinal
- 4.2 Mapas de cobertura y cambio
- 4.3 Cuantificación de la transición (ha, % del área)
- 4.4 Exactitud de la clasificación

### 5. Discussion (700–900 palabras)
- Interpretación de las tendencias: qué significa el cambio de NDVI en términos de cambio de cultivo
- Diferencias entre franjas altitudinales: por qué la franja media (700–1200 m) muestra el cambio más acelerado
- Limitaciones: nubosidad tropical, resolución de 30 m de Landsat (suficiente para parcelas grandes, no para pequeños agricultores), confusión espectral café-cacao
- Implicación crítica para la tesis: la expansión rápida de cacao sin experiencia fitosanitaria = riesgo emergente de Moniliasis. Este párrafo conecta el artículo con tu trabajo doctoral.

### 6. Conclusions (200–300 palabras)
- Cuantificación del cambio en 3 oraciones
- Utilidad del enfoque para monitoreo territorial continuo
- Línea futura: integración con sistemas IoT para alerta temprana (tu tesis)

### Acknowledgments
GIDEAM UniMagdalena, FEDECACAO, AGROSAVIA (si colaboran)

### Data Availability Statement
"Series temporales NDVI y scripts GEE disponibles en GitHub/Zenodo bajo licencia CC-BY"
*(Publicar el código en GitHub antes del submission — es requisito de muchas revistas MDPI)*

---

## Paso 8 — Checklist antes de hacer submission

- [ ] Abstract tiene resultados numéricos concretos (no solo "se encontraron cambios")
- [ ] Todas las figuras tienen resolución mínima 300 dpi
- [ ] Test estadístico realizado (Mann-Kendall con p-value reportado)
- [ ] Validación de clasificación con Overall Accuracy ≥ 85%
- [ ] Mínimo 35–45 referencias, mayoritariamente de los últimos 5 años
- [ ] Código/datos disponibles en repositorio público (Zenodo o GitHub)
- [ ] Artículo en inglés revisado por hablante nativo o servicio MDPI Language Editing
- [ ] Keywords: entre 5 y 8, incluir "Google Earth Engine", "NDVI time series", "land use change", "Sierra Nevada de Santa Marta", "Theobroma cacao", "remote sensing"

---

## Timeline sugerido — 8 semanas

| Semana | Actividad |
|--------|-----------|
| 1 | Delimitar área, importar polígono en GEE, explorar imágenes disponibles |
| 2 | Extraer series NDVI 2000–2025 para las 3 franjas altitudinales |
| 3 | Análisis Mann-Kendall en Python, generación de gráficas de serie temporal |
| 4 | Clasificación RF para las 4 fechas clave, cálculo de matrices de transición |
| 5 | Campo / validación GPS / vuelo UAV si disponible |
| 6 | Generación de todas las figuras en calidad publicación |
| 7 | Escritura del artículo completo (borrador) |
| 8 | Revisión, corrección en inglés, submission |
