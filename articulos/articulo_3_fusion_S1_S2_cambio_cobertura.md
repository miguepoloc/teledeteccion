# Artículo 3 — Guía Metodológica Completa

## Título

**"Detección de cambios en la cobertura vegetal de sistemas agroforestales tropicales usando series temporales Sentinel-1 y Sentinel-2 en el departamento del Magdalena"**

*Título en inglés para submission:*
**"Vegetation Cover Change Detection in Tropical Agroforestry Systems Using Sentinel-1 SAR and Sentinel-2 Multispectral Time Series in the Magdalena Department, Colombia"**

---

## Revista objetivo

**MDPI *Remote Sensing*** (ISSN 2072-4292)
- Impact Factor: 4.1 | Cuartil Q1
- Sección: Remote Sensing in Agriculture and Vegetation
- APC: 2700 CHF

**Segunda opción:** *International Journal of Applied Earth Observation and Geoinformation* (Elsevier, IF 7.5, Q1) — más exigente, mayor impacto

---

## Justificación de la novedad científica

**El argumento diferenciador de este artículo frente al Artículo 1:**

El Artículo 1 usa solo Sentinel-2/Landsat (ópticos). Este artículo **fusiona datos SAR (Sentinel-1) con datos ópticos (Sentinel-2)**. Esa fusión es la novedad. ¿Por qué importa?

La región Caribe colombiana tiene entre 60–80% de cobertura nubosa durante los períodos húmedos. Sentinel-2 pierde imágenes utilizables en esas épocas. Sentinel-1 (radar banda C) **penetra las nubes** y proporciona imágenes en cualquier condición meteorológica. La fusión de ambos sensores produce una caracterización más completa y temporalmente densa de los sistemas agroforestales que cualquiera de los dos por separado.

Además, el backscatter SAR responde de forma diferente a la estructura del dosel (cacao vs. café tienen dosel diferente en altura, densidad y orientación de hojas), lo que lo hace informativo para discriminar coberturas donde los índices ópticos pueden ser similares.

---

## Fundamento técnico SAR que debes dominar

Antes de escribir el artículo necesitas entender estos conceptos (y usarlos con precisión en el texto):

**Backscatter (σ°):** energía de microondas reflejada de vuelta al sensor. Se mide en dB. Valores más negativos → superficie más suave (agua, suelo plano). Valores menos negativos → superficie más rugosa (dosel denso).

**Polarizaciones VV y VH:**
- VV (transmite vertical, recibe vertical): más sensible a suelo y troncos verticales
- VH (transmite vertical, recibe horizontal): más sensible a volumen del dosel y hojas

**Ratio VH/VV:** indicador de la complejidad estructural del dosel. Cacao agroforestal denso → ratio diferente al de café bajo sombra.

**Efecto de la humedad:** suelo húmedo y dosel húmedo aumentan el backscatter. Esto es relevante para correlacionar con riesgo de Moniliasis (conexión con la tesis).

---

## Paso 1 — Diseño del estudio

### Área de estudio
Misma zona que el Artículo 1 (SNSM, municipios de Ciénaga, Fundación, Aracataca) para mantener coherencia entre artículos de la tesis.

### Período temporal
- Sentinel-1: **2017–2025** (disponible en GEE desde ese año con suficiente cobertura)
- Sentinel-2: **2017–2025** (misma ventana para comparabilidad directa)

### Coberturas a detectar
Define exactamente las mismas clases que en el Artículo 1:
1. Cacao agroforestal
2. Café de sombra
3. Bosque nativo / rastrojo
4. Pasturas / suelo desnudo
5. Otras (cuerpos de agua, zonas urbanas)

Mantener las mismas clases entre artículos es importante para que sean coherentes como capítulos de tu tesis.

---

## Paso 2 — Procesamiento Sentinel-1 en GEE

### Colección disponible en GEE
`COPERNICUS/S1_GRD` — Sentinel-1 Ground Range Detected, ya preprocesado por Google (corrección orbital, ruido térmico removido, calibración radiométrica, corrección de terreno con SRTM).

### Script base en GEE

```javascript
// Sentinel-1: filtrar por área, modo, polarización y órbita
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(areaEstudio)
  .filterDate('2020-01-01', '2024-12-31')
  .filter(ee.Filter.eq('instrumentMode', 'IW'))  // Interferometric Wide Swath
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING')); // Escoger órbita consistente

// Calcular ratio VH/VV
var addRatio = function(image) {
  var ratio = image.select('VH').divide(image.select('VV')).rename('VH_VV_ratio');
  return image.addBands(ratio);
};

s1 = s1.map(addRatio);

// Composición mensual (mediana)
var s1_composicion = s1.select(['VV', 'VH', 'VH_VV_ratio']).median();
```

### Filtro speckle (obligatorio — el ruido SAR es "sal y pimienta")
```javascript
// Filtro de Lee mediante convolución en GEE
var KERNEL_SIZE = 7;
var leeFilter = function(image) {
  var bandNames = image.bandNames();
  var filtered = image.reduceNeighborhood({
    reducer: ee.Reducer.mean(),
    kernel: ee.Kernel.square(KERNEL_SIZE/2, 'pixels')
  });
  return filtered.rename(bandNames);
};

s1_filtrado = s1_composicion.map ? s1.map(leeFilter) : leeFilter(s1_composicion);
```

**Importante:** Documenta en el artículo qué filtro de speckle usaste y el tamaño de ventana. Los revisores SAR siempre preguntan esto.

---

## Paso 3 — Procesamiento Sentinel-2 en GEE

Igual que el Artículo 1 y 2, pero aquí usas S2 **solo para el período 2017–2025** para que sea comparable con S1.

```javascript
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(areaEstudio)
  .filterDate('2020-01-01', '2024-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(maskS2clouds);

// Índices para S2
var s2_indices = s2.map(function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var ndwi = image.normalizedDifference(['B8', 'B11']).rename('NDWI');
  var ndre = image.normalizedDifference(['B8A', 'B5']).rename('NDRE');
  return image.addBands([ndvi, ndwi, ndre]);
});
```

---

## Paso 4 — Fusión Sentinel-1 + Sentinel-2

Esta es la parte metodológica clave del artículo. Fusionas las bandas de ambos sensores en una sola imagen de características para alimentar el clasificador.

### Estrategia de fusión
Dado que S1 tiene resolución 10 m y S2 también (para bandas B2, B3, B4, B8), la fusión es directa por apilamiento de bandas:

```javascript
// Para cada fecha de composición:
var fusionada = s2_composicion
  .select(['NDVI', 'NDWI', 'NDRE', 'B2', 'B3', 'B4', 'B8'])
  .addBands(s1_composicion.select(['VV', 'VH', 'VH_VV_ratio']));

// Resultado: imagen de 10 bandas por fecha
// [NDVI, NDWI, NDRE, B2, B3, B4, B8, VV, VH, VH_VV_ratio]
```

### Fechas de composición para el análisis comparativo
Genera composiciones para los mismos 4 años que en el Artículo 1 (2017, 2019, 2022, 2024) + composiciones estacionales por período húmedo/seco.

---

## Paso 5 — Clasificación de coberturas con y sin SAR

Este es el experimento central del artículo: demostrar que la fusión S1+S2 clasifica mejor que S2 solo.

### Experimento comparativo (tres clasificadores)

**Clasificador A:** Solo Sentinel-2 (NDVI, NDWI, NDRE, B4, B8)
**Clasificador B:** Solo Sentinel-1 (VV, VH, ratio)
**Clasificador C:** Fusión S1 + S2 (todas las bandas)

```javascript
// Puntos de entrenamiento etiquetados
var puntosEntrenamiento = cacao.merge(cafe).merge(bosque).merge(pastura);

// Extraer valores de la imagen fusionada para los puntos
var training = fusionada.sampleRegions({
  collection: puntosEntrenamiento,
  properties: ['clase'],
  scale: 10
});

// Dividir 70/30 entrenamiento/validación
var split = 0.7;
var withRandom = training.randomColumn('random');
var trainingSet = withRandom.filter(ee.Filter.lt('random', split));
var validationSet = withRandom.filter(ee.Filter.gte('random', split));

// Random Forest
var classifier = ee.Classifier.smileRandomForest({
  numberOfTrees: 100,
  variablesPerSplit: 3,
  minLeafPopulation: 5,
  seed: 42
});

// Entrenar los 3 clasificadores con sus respectivas bandas
var clA = classifier.train(trainingSet, 'clase', ['NDVI','NDWI','NDRE','B4','B8']);
var clB = classifier.train(trainingSet, 'clase', ['VV','VH','VH_VV_ratio']);
var clC = classifier.train(trainingSet, 'clase', ['NDVI','NDWI','NDRE','B4','B8','VV','VH','VH_VV_ratio']);
```

### Validación y comparación
```javascript
// Para cada clasificador:
var testAccuracy = validationSet.classify(clC)
  .errorMatrix('clase', 'classification');

print('Overall Accuracy:', testAccuracy.accuracy());
print('Kappa:', testAccuracy.kappa());
print('Confusion Matrix:', testAccuracy.array());
```

---

## Paso 6 — Análisis de importancia de variables

Uno de los resultados más valiosos: qué bandas/índices contribuyen más a la clasificación.

```javascript
// En GEE con Random Forest
var importance = ee.Dictionary(clC.explain()).get('importance');
print('Variable Importance:', importance);
```

Esto genera un ranking de importancia de cada banda. Si VH resulta importante para discriminar cacao de café, tienes un resultado novedoso sobre el valor del SAR para este cultivo específico.

---

## Paso 7 — Análisis de disponibilidad de imágenes por sensor

Un resultado adicional valioso para justificar la fusión: muestra cuántas imágenes útiles (sin nubes) tiene S2 vs. cuántas tiene S1 por mes durante 2020–2024.

```python
import pandas as pd
import matplotlib.pyplot as plt

# Datos exportados de GEE: número de imágenes utilizables por mes
df = pd.read_csv('disponibilidad_imagenes.csv')

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
df.groupby('mes')['s2_imagenes'].mean().plot(ax=ax1, title='Sentinel-2 (óptico)')
df.groupby('mes')['s1_imagenes'].mean().plot(ax=ax2, title='Sentinel-1 (SAR)')
ax1.set_ylabel('N° imágenes útiles promedio')
ax2.set_ylabel('N° imágenes disponibles')
```

Esta figura demuestra visualmente por qué se necesita SAR: en los meses húmedos, S2 tiene pocas imágenes útiles mientras S1 mantiene cobertura constante.

---

## Paso 8 — Detección de cambios entre fechas

### Método: Change Vector Analysis (CVA)
Compara las imágenes fusionadas de dos fechas y calcula la magnitud del cambio en el espacio multidimensional de características:

```python
import numpy as np
from sklearn.preprocessing import StandardScaler

# img_2017, img_2024: arrays numpy de (filas, columnas, bandas)
scaler = StandardScaler()
img_2017_norm = scaler.fit_transform(img_2017.reshape(-1, n_bandas))
img_2024_norm = scaler.transform(img_2024.reshape(-1, n_bandas))

# Magnitud del cambio
diferencia = img_2024_norm - img_2017_norm
magnitud = np.sqrt(np.sum(diferencia**2, axis=1))
magnitud_mapa = magnitud.reshape(filas, columnas)

# Umbral: cambios significativos > media + 1.5*std
umbral = magnitud_mapa.mean() + 1.5 * magnitud_mapa.std()
mapa_cambio = magnitud_mapa > umbral
```

---

## Paso 9 — Figuras y resultados clave

**Figura 1:** Mapa del área de estudio

**Figura 2:** Disponibilidad mensual de imágenes S1 vs. S2 (2020–2024) — justificación de la fusión

**Figura 3:** Comparación visual de la misma zona en S2-NDVI vs. S1-VH vs. Fusión clasificada

**Figura 4:** Mapas de cobertura para 3 experimentos (solo S2, solo S1, fusión) para la misma fecha

**Figura 5:** Matrices de confusión para los 3 experimentos (visualizadas como heatmaps)

**Figura 6:** Importancia de variables en el modelo de fusión (barplot ordenado)

**Figura 7:** Mapa de cambio de cobertura 2017–2024 con magnitud del cambio

**Tabla 1:** Comparación de métricas de clasificación: Overall Accuracy, Kappa, F1-score por clase, para los 3 experimentos

**Tabla 2:** Área por cobertura en cada fecha (ha) y variación

---

## Paso 10 — Estructura del artículo

### Abstract (250 palabras)
Destacar: el problema de nubosidad, la solución (fusión SAR+óptico), el resultado cuantitativo (la fusión mejoró la clasificación en X% de Overall Accuracy vs. solo S2), la implicación para monitoreo continuo en trópico húmedo.

### 1. Introduction (700–900 palabras)
**Párrafo 1:** Importancia del monitoreo de coberturas en sistemas agroforestales tropicales. Cambio de uso de suelo acelerado en el Caribe colombiano.

**Párrafo 2:** Limitaciones de los sensores ópticos en regiones con alta nubosidad. Datos de nubosidad en la Región Caribe colombiana (% de días nublados por mes — datos del IDEAM).

**Párrafo 3:** SAR como solución al problema de nubosidad. Sentinel-1 como plataforma gratuita de acceso libre.

**Párrafo 4:** Estado del arte en fusión SAR+óptico para agricultura. Trabajos existentes (en arroz, caña, maíz) y gap en sistemas agroforestales tropicales complejos.

**Párrafo 5:** Objetivos.

### 2. Study Area (300 palabras)

### 3. Materials and Methods (1000–1200 palabras)
- 3.1 Sentinel-1: colección, preprocesamiento, filtro speckle, polarizaciones
- 3.2 Sentinel-2: colección, preprocesamiento, índices
- 3.3 Estrategia de fusión
- 3.4 Diseño del experimento comparativo (3 clasificadores)
- 3.5 Random Forest: parámetros, validación cruzada
- 3.6 Detección de cambios (CVA)
- 3.7 Análisis de importancia de variables

### 4. Results (900–1100 palabras)
- 4.1 Análisis de disponibilidad temporal de imágenes por sensor
- 4.2 Comparación de clasificadores (Tabla 1)
- 4.3 Importancia de variables
- 4.4 Detección de cambios 2017–2024

### 5. Discussion (800–1000 palabras)
- Por qué la fusión mejora la clasificación: el backscatter SAR captura estructura del dosel que el NDVI no diferencia (café y cacao pueden tener NDVI similares pero estructura 3D diferente)
- Limitaciones: el SAR es sensible a la orientación de la órbita y al ángulo de incidencia; la topografía de la SNSM puede distorsionar el backscatter en zonas de ladera
- Cómo manejar el efecto topográfico: corrección con DEM (documentar si se aplicó en SNAP o GEE)
- Proyección hacia monitoreo operativo: frecuencia de actualización posible con S1 (cada 6–12 días)

### 6. Conclusions (200–250 palabras)

---

## Paso 11 — Checklist

- [ ] Documentar el tipo de órbita S1 (ascending/descending) — usar solo una para consistencia
- [ ] Reportar el ángulo de incidencia promedio de S1 en el área de estudio
- [ ] Describir el filtro de speckle con tamaño de ventana
- [ ] Comparar estadísticamente las accuracies (McNemar test entre clasificadores)
- [ ] Código disponible en GitHub/Zenodo
- [ ] Usar la misma leyenda de colores para los mapas de todos los años

---

## Timeline — 8 semanas

| Semana | Actividad |
|--------|-----------|
| 1 | Delimitar área, cargar en GEE, explorar disponibilidad S1 y S2 por mes |
| 2 | Extraer composiciones S1 y S2 para las 4 fechas clave |
| 3 | Construir los 3 clasificadores, colectar puntos de entrenamiento |
| 4 | Ejecutar clasificaciones, calcular matrices de confusión, importancia de variables |
| 5 | Análisis de cambio CVA, campo GPS para validación adicional si es posible |
| 6 | Generar todas las figuras en calidad publicación |
| 7 | Escritura del artículo |
| 8 | Revisión, traducción/corrección inglés, submission |

---

## Nota crítica para el evaluador

El punto más débil potencial de este artículo es **la confusión espectral entre cacao y café** en el sensor óptico, que es real especialmente en la franja de 700–1000 msnm donde pueden coexistir. Si el artículo muestra que la adición de SAR reduce esa confusión (el F1-score de la clase "café" mejora con la fusión), ese es el resultado más publicable del artículo. Diseña el análisis para que eso quede explícito en la Tabla 1.
