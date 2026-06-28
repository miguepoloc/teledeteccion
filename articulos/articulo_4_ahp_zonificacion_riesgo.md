# Artículo 4 — Guía Metodológica Completa

## Título

**"Zonificación del riesgo fitosanitario potencial de Moniliasis en la Región Caribe colombiana mediante análisis multicriterio AHP e imágenes satelitales"**

*Título en inglés para submission:*
**"Spatial Zonification of Potential Moniliophthora roreri Disease Risk in Colombian Caribbean Cacao Systems Using AHP Multi-Criteria Analysis and Satellite Remote Sensing"**

---

## Revista objetivo

**MDPI *Remote Sensing*** (ISSN 2072-4292), sección "Remote Sensing in Agriculture and Vegetation"
- IF 4.1, Q1

**Segunda opción principal:** *Remote Sensing Applications: Society and Environment* (Elsevier, IF 4.0, Q1) — muy enfocada en aplicaciones prácticas, ideal para este tipo de artículo.

**Referencia directa que valida la revista:** Tu propia bibliografía incluye Tuesta-Trauco et al. (2025) publicado en *Remote Sensing* con metodología GIS + RS + F-AHP para aptitud de cultivos. Ese artículo es el antecedente metodológico más directo del tuyo.

---

## Justificación de la novedad científica

Los artículos existentes de AHP + GIS para Moniliasis o para cacao en general tienen tres limitaciones que tú superas:

1. **Mapas estáticos de aptitud climática** (Singh et al., 2021; Osujieke et al., 2025): usan variables promediadas que no capturan la variabilidad estacional que activa la esporulación.

2. **Sin componente satelital dinámico:** los artículos de AHP agrícola usan capas estáticas (tipo de suelo, pendiente, temperatura media anual). Tú incorporas índices satelitales **temporales** (NDVI, NDWI por período estacional) como variables dinámicas dentro del AHP.

3. **Sin foco en riesgo de enfermedad específica:** la mayoría zonifica aptitud general del cultivo, no riesgo fitosanitario de un patógeno específico con epidemiología conocida.

La combinación AHP + variables estáticas (pendiente, altitud, proximidad hídrica) + **variables satelitales dinámicas** (NDWI estacional, temperatura superficial LST) para riesgo de *M. roreri* específicamente es lo que no existe en la literatura.

---

## Fundamento metodológico AHP que debes dominar

### ¿Qué es el AHP (Proceso Analítico Jerárquico)?
Método de decisión multicriterio propuesto por Saaty (1980). Permite combinar variables de distinta naturaleza y escala en un índice compuesto ponderado, donde los pesos se derivan de comparaciones pareadas entre criterios realizadas por expertos.

### Lógica del AHP en este artículo
1. Identificas las variables que condicionan el riesgo de Moniliasis
2. Construyes una matriz de comparación pareada entre variables (cada experto decide cuánto más importante es A vs. B)
3. Calculas los pesos de cada variable mediante el vector propio de la matriz
4. Verificas la consistencia del juicio (Ratio de Consistencia CR < 0.10)
5. Combinas los mapas de cada variable ponderados por sus pesos

### Fórmula del índice de riesgo
```
Riesgo = w1×HR + w2×Temp + w3×NDWI + w4×Pendiente + w5×DistHidrica + w6×Altitud + w7×NDVI
```
Donde w1...w7 son los pesos derivados del AHP y cada variable está estandarizada en escala 0–1.

---

## Paso 1 — Identificación y justificación de criterios

### Variables a incluir (mínimo 6, máximo 9)

**Variables climáticas y ambientales (capas estáticas o semiestáticas):**

| Variable | Fuente | Justificación fitopatológica |
|----------|--------|------------------------------|
| Temperatura media (°C) | WorldClim v2.1 o ERA5 | Óptimo *M. roreri*: 22–26°C |
| Humedad relativa media (%) | WorldClim o IDEAM | HR > 85% favorece esporulación |
| Precipitación anual (mm) | WorldClim v2.1 | Lluvias prolongadas = condición de riesgo |
| Altitud (msnm) | SRTM DEM 30 m | Determina temperatura y HR |
| Pendiente (°) | Derivado del DEM | Mayor pendiente = menor retención de humedad |
| Proximidad a cuerpos hídricos (m) | Red hídrica IGAC | Fuentes hídricas aumentan HR local |

**Variables satelitales dinámicas (capa temporal — novedad del artículo):**

| Variable | Fuente | Justificación |
|----------|--------|---------------|
| NDWI período húmedo | Sentinel-2 GEE | Proxy de acumulación de agua en dosel |
| LST (Temperatura Superficial) | MODIS MOD11A2 o Landsat | Temperatura real superficial vs. promedio WorldClim |
| NDVI período húmedo | Sentinel-2 GEE | Densidad del dosel = retención de humedad |

### Fuentes de datos para cada capa

```
WorldClim v2.1 → worldclim.org (gratuito, 1 km resolución, variables bioclimáticas)
ERA5-Land     → Copernicus Climate Change Service (gratuito, 0.1° resolución)
SRTM DEM      → GEE: 'USGS/SRTMGL1_003' (30 m)
IGAC capas    → datos.gov.co (hidrografía, límites)
Sentinel-2    → GEE (gratuito, 10 m)
MODIS LST     → GEE: 'MODIS/061/MOD11A2' (1 km, 8 días)
```

---

## Paso 2 — Consulta a expertos para las comparaciones pareadas

Este es el paso más diferencial metodológicamente. Necesitas **mínimo 3 expertos** para la validación del AHP. Más es mejor — con 5 es suficiente para publicación.

### Perfil de expertos a consultar
- Fitopatólogo especialista en cacao (AGROSAVIA, universidades)
- Agrónomo con experiencia en manejo de Moniliasis
- Investigador en teledetección agrícola (puede ser tu director de tesis)

### Instrumento de consulta — Escala de Saaty

Los expertos responden: **¿Cuánto más importante es el criterio A frente al criterio B para determinar el riesgo de Moniliasis?**

| Valor | Significado |
|-------|-------------|
| 1 | Igual importancia |
| 3 | Moderadamente más importante |
| 5 | Fuertemente más importante |
| 7 | Muy fuertemente más importante |
| 9 | Extremadamente más importante |
| 2,4,6,8 | Valores intermedios |

### Ejemplo de matriz para 4 criterios

```
              HR    Temp   NDWI   Pendiente
HR          [ 1     3      2       5    ]
Temp        [ 1/3   1      1/2     3    ]
NDWI        [ 1/2   2      1       4    ]
Pendiente   [ 1/5   1/3    1/4     1    ]
```

### Cálculo del AHP en Python

```python
import numpy as np

# Matriz de comparación pareada (n×n)
matrix = np.array([
    [1,   3,   2,   5  ],
    [1/3, 1,   1/2, 3  ],
    [1/2, 2,   1,   4  ],
    [1/5, 1/3, 1/4, 1  ]
])

n = matrix.shape[0]

# Paso 1: Normalizar la matriz (dividir cada columna por su suma)
col_sum = matrix.sum(axis=0)
normalized = matrix / col_sum

# Paso 2: Vector de prioridades (promedio de filas de la matriz normalizada)
weights = normalized.mean(axis=1)
print("Pesos:", weights)
# Ejemplo output: [0.467, 0.168, 0.278, 0.087]

# Paso 3: Verificar consistencia
lambda_max = (matrix @ weights / weights).mean()
CI = (lambda_max - n) / (n - 1)

# Random Index para n criterios (tabla de Saaty)
RI = {1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45}
CR = CI / RI[n]

print(f"λmax = {lambda_max:.4f}")
print(f"CI = {CI:.4f}")
print(f"CR = {CR:.4f}")

# CR < 0.10 → juicio consistente → aceptable para publicación
if CR < 0.10:
    print("✓ Consistencia aceptable")
else:
    print("✗ Revisar comparaciones pareadas")
```

**Obligatorio:** Si CR > 0.10 para algún experto, debes pedir que revise sus comparaciones. Esto va en el artículo con transparencia total.

---

## Paso 3 — Preparación de las capas espaciales

Todas las capas deben estar en:
- Sistema de coordenadas: **MAGNA-SIRGAS / Colombia Bogota Zone** (EPSG: 3116) para análisis local, o WGS84 (EPSG: 4326) si usas GEE
- Resolución: **homogeneizar todo a 100 m** (compromiso entre detalle y tamaño de procesamiento para el área del Magdalena)
- Extensión: misma área recortada para todas las capas

### Estandarización de capas (fuzzy membership)

Antes de combinar, cada capa se transforma a escala 0–1 según su relación con el riesgo:

**Humedad relativa:** relación directa con el riesgo (más HR = más riesgo)
```python
# Fuzzy linear membership
def fuzzy_linear(raster, min_val, max_val):
    return (raster - min_val) / (max_val - min_val)

hr_fuzzy = fuzzy_linear(hr_raster, min_val=60, max_val=95)
```

**Temperatura:** relación no lineal (óptimo entre 22–26°C, fuera de ese rango baja el riesgo)
```python
# Fuzzy gaussiana centrada en el óptimo
def fuzzy_gaussian(raster, optimo, spread):
    return np.exp(-0.5 * ((raster - optimo) / spread)**2)

temp_fuzzy = fuzzy_gaussian(temp_raster, optimo=24, spread=3)
```

**Altitud:** también no lineal (la franja de 400–1200 msnm es el óptimo del cacao)

**Pendiente:** relación inversa (más pendiente = menos humedad retenida = menos riesgo)
```python
pendiente_fuzzy = 1 - fuzzy_linear(pendiente_raster, min_val=0, max_val=45)
```

**Proximidad hídrica:** relación inversa a la distancia (más cerca del río = más riesgo)
```python
distancia_fuzzy = 1 - fuzzy_linear(distancia_raster, min_val=0, max_val=5000)
```

---

## Paso 4 — Construcción del mapa de riesgo

### Cálculo del Índice de Riesgo de Moniliasis (IRM)

```python
import numpy as np
import rasterio

# Pesos derivados del AHP (ejemplo — los tuyos saldrán de la consulta a expertos)
pesos = {
    'HR':        0.35,
    'Temp':      0.20,
    'NDWI':      0.18,
    'Pendiente': 0.10,
    'DistHidrica': 0.08,
    'Altitud':   0.05,
    'NDVI':      0.04
}

# Suma ponderada
IRM = (pesos['HR']          * hr_fuzzy +
       pesos['Temp']        * temp_fuzzy +
       pesos['NDWI']        * ndwi_fuzzy +
       pesos['Pendiente']   * pendiente_fuzzy +
       pesos['DistHidrica'] * dist_fuzzy +
       pesos['Altitud']     * alt_fuzzy +
       pesos['NDVI']        * ndvi_fuzzy)

# Clasificar en 4 niveles de riesgo
riesgo_clasificado = np.digitize(IRM, bins=[0.25, 0.50, 0.75])
# 0: Muy bajo | 1: Bajo | 2: Medio | 3: Alto | 4: Muy alto
```

### Análisis de sensibilidad (obligatorio para Q1)

Un buen artículo AHP en revista Q1 incluye análisis de sensibilidad: ¿cómo cambia el mapa si los pesos varían ±10%?

```python
# Variar el peso de cada criterio ±10% y recalcular el IRM
resultados_sensibilidad = {}
for criterio in pesos:
    pesos_mod = pesos.copy()
    pesos_mod[criterio] *= 1.10  # +10%
    # Renormalizar para que sumen 1
    total = sum(pesos_mod.values())
    pesos_mod = {k: v/total for k, v in pesos_mod.items()}
    
    IRM_mod = sum(pesos_mod[c] * capas[c] for c in pesos_mod)
    # Calcular % de área que cambia de categoría de riesgo
    cambio = np.mean(np.digitize(IRM_mod, bins=[0.25, 0.50, 0.75]) != 
                     np.digitize(IRM, bins=[0.25, 0.50, 0.75]))
    resultados_sensibilidad[criterio] = cambio * 100

print("Sensibilidad por criterio (% área que cambia de categoría):")
for k, v in sorted(resultados_sensibilidad.items(), key=lambda x: -x[1]):
    print(f"  {k}: {v:.1f}%")
```

---

## Paso 5 — Validación del mapa de riesgo

### Opción A: Validación con datos históricos de incidencia (ideal)
Si AGROSAVIA tiene datos de incidencia por zona: calcular correlación entre el IRM y la incidencia observada. Reportar r de Spearman (datos ordinales).

### Opción B: Validación con puntos de campo (viable en 2 meses)
Visitar 20–30 fincas de cacao en la zona, registrar presencia/ausencia de Moniliasis activa o historial reciente, y verificar si el IRM las clasifica correctamente:

```python
from sklearn.metrics import confusion_matrix, classification_report

# y_true: incidencia observada en campo (0=baja, 1=alta)
# y_pred: categoría de IRM para cada punto de campo
print(classification_report(y_true, y_pred, target_names=['Bajo riesgo','Alto riesgo']))
```

### Opción C: Validación cruzada con literatura
Comparar la distribución espacial del mapa con los reportes de Correa Álvarez et al. (2014) sobre distribución de Moniliasis en Colombia. Menos riguroso pero publicable si se argumenta bien.

---

## Paso 6 — Análisis temporal (diferenciador)

Para mostrar que el componente satelital dinámico aporta valor real, genera dos versiones del mapa:

**Versión 1 — Solo variables estáticas:** AHP con temperatura, pendiente, altitud, distancia hídrica (como hacen los artículos convencionales)

**Versión 2 — Versión completa con S2:** AHP con todas las variables anteriores + NDWI y NDVI estacionales de Sentinel-2

Compara ambos mapas y cuantifica en cuántas hectáreas el resultado difiere. Si el componente satelital cambia la clasificación en zonas importantes, ese es el argumento empírico de que tu enfoque híbrido es superior.

---

## Paso 7 — Figuras y resultados clave

**Figura 1:** Mapa del área de estudio con municipios del Magdalena y parcelas cacaoteras

**Figura 2:** Dendrograma o diagrama jerárquico del AHP con criterios y pesos (obligatorio para artículos AHP)

**Figura 3:** Mapas estandarizados (fuzzy) de cada variable individual — panel de 7 mapas

**Figura 4:** Mapa final del Índice de Riesgo de Moniliasis (IRM) con 5 categorías de riesgo

**Figura 5:** Distribución de área por categoría de riesgo (gráfica de barras y tabla de ha)

**Figura 6:** Análisis de sensibilidad — barplot de % área que cambia al variar cada peso ±10%

**Figura 7:** Comparación mapa estático (sin S2) vs. mapa dinámico (con S2) — diferencias espaciales

**Tabla 1:** Descripción de criterios con justificación fitopatológica y fuente de dato

**Tabla 2:** Matrices de comparación pareada por experto y pesos derivados

**Tabla 3:** Ratio de Consistencia (CR) por experto (todos deben ser < 0.10)

**Tabla 4:** Validación — comparación IRM vs. datos de campo o literatura

---

## Paso 8 — Estructura del artículo

### Abstract (250 palabras)
- Problema: ausencia de herramientas de zonificación de riesgo de Moniliasis a escala regional
- Metodología: AHP con X criterios, Y expertos, variables satélite dinámicas
- Resultado: % del área en categoría de riesgo alto/muy alto; qué municipios concentran ese riesgo
- Implicación: insumo para política pública fitosanitaria del Magdalena (esto conecta con PIIOM Misión 2)

### 1. Introduction (700–900 palabras)
**Párrafo 1:** Pérdidas económicas por Moniliasis en Colombia. Contexto SNSM y expansión cacaotera.

**Párrafo 2:** Estado del arte en zonificación fitosanitaria: enfoques actuales y sus limitaciones (reactivos, puntuales, sin escala regional).

**Párrafo 3:** AHP+GIS como metodología validada en agricultura. Citar Polo-Castañeda et al. (2021) — tu propio paper sobre AHP+GIS para WSN en el Caribe colombiano es la referencia metodológica más directa y honesta aquí.

**Párrafo 4:** El valor de integrar variables satelitales dinámicas en AHP — superar la zonificación estática.

**Párrafo 5:** Objetivos.

### 2. Study Area (300–400 palabras)

### 3. Materials and Methods (1100–1300 palabras)
- 3.1 Selección y justificación de criterios
- 3.2 Fuentes de datos y preprocesamiento
- 3.3 Estandarización fuzzy de criterios
- 3.4 Consulta a expertos y construcción de matrices AHP
- 3.5 Cálculo de pesos y verificación de consistencia (CR)
- 3.6 Construcción del índice IRM y clasificación
- 3.7 Análisis de sensibilidad
- 3.8 Validación

### 4. Results (900–1100 palabras)
- 4.1 Pesos derivados del AHP y consistencia
- 4.2 Mapas individuales estandarizados
- 4.3 Mapa final de riesgo: distribución espacial y cuantificación por municipio
- 4.4 Análisis de sensibilidad
- 4.5 Comparación versión estática vs. dinámica (con S2)
- 4.6 Validación

### 5. Discussion (800–1000 palabras)
- Qué municipios concentran el mayor riesgo y por qué (argumentación geográfica y climática)
- Por qué la HR y la temperatura son los criterios más pesados (respaldo en la biología de *M. roreri*)
- Limitaciones: el AHP depende del juicio experto (subjetividad), las variables climáticas a 1 km pueden no capturar la variabilidad microclimática bajo el dosel
- Conexión con la tesis: este mapa estático es la línea base sobre la que se superpondrá el sistema dinámico IoT
- Implicaciones de política pública: los mapas de riesgo como insumo para las mesas técnicas departamentales del cacao

### 6. Conclusions (250 palabras)

---

## Paso 9 — Checklist de calidad

- [ ] CR < 0.10 para todos los expertos consultados (documentar en tabla)
- [ ] Análisis de sensibilidad incluido (sin esto, revisores de Q1 rechazarán el artículo)
- [ ] Validación con al menos una fuente externa (campo, literatura o datos históricos)
- [ ] Todas las capas en la misma resolución y sistema de coordenadas
- [ ] Citar la escala de Saaty (1980) al describir el AHP
- [ ] Código y capas disponibles en Zenodo (dato FAIR — mejora considerablemente las chances de aceptación)
- [ ] Mapa final con escala, norte, leyenda y sistema de coordenadas visibles

---

## Timeline — 8 semanas

| Semana | Actividad |
|--------|-----------|
| 1 | Definir criterios finales, preparar instrumento de consulta a expertos, contactar expertos |
| 2 | Descargar y preprocesar todas las capas estáticas (WorldClim, DEM, hidrografía) |
| 3 | Extraer capas satelitales dinámicas en GEE (NDWI, NDVI, LST por período estacional) |
| 4 | Recibir respuestas de expertos, calcular pesos AHP, verificar CR |
| 5 | Estandarización fuzzy de todas las capas, construcción del IRM, clasificación |
| 6 | Análisis de sensibilidad, validación de campo (1–2 días visita) o con literatura |
| 7 | Escritura del artículo |
| 8 | Revisión, corrección inglés, submission |

---

## Nota crítica final

Este es el artículo con **mayor conexión directa a tu tesis doctoral** de los cuatro. El mapa de riesgo que produces aquí es literalmente el producto que el Artículo 2 de tu tesis (Objetivo 3) describió así: *"Presentará el sistema de soporte a la decisión geoespacial AHP-GIS, documentando la arquitectura de integración ML y AHP [...] la generación de mapas dinámicos de riesgo."*

La diferencia es que en la tesis el AHP recibirá como entrada el índice predictivo del modelo de Ensemble Learning. Este artículo construye esa misma arquitectura AHP-GIS pero alimentada solo con variables satelitales y estáticas, sin IoT aún. Es la versión reducida pero publicable del sistema completo. Cuando completes la tesis, el artículo de tesis será una extensión natural de este trabajo, añadiendo la capa IoT al mismo framework.
