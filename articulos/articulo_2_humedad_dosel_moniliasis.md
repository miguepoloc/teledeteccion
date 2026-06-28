# Artículo 2 — Guía Metodológica Completa

## Título

**"Estimación de la humedad del dosel en sistemas agroforestales de cacao mediante índices espectrales Sentinel-2: implicaciones para el monitoreo del riesgo de Moniliasis"**

*Título en inglés para submission:*
**"Canopy Moisture Estimation in Cacao Agroforestry Systems Using Sentinel-2 Spectral Indices: Implications for Moniliophthora roreri Risk Monitoring in the Colombian Caribbean"**

---

## Revista objetivo

**MDPI *Remote Sensing*** (ISSN 2072-4292)
- Impact Factor: 4.1 | Cuartil Q1 (Earth and Planetary Sciences)
- Sección: Remote Sensing in Agriculture and Vegetation
- APC: 2700 CHF (solicitar waiver — Colombia califica como país en desarrollo)
- Tiempo de revisión: 30–45 días

**Segunda opción:** *Computers and Electronics in Agriculture* (Elsevier, IF 8.3, Q1) — más exigente pero mayor visibilidad

---

## Justificación de la novedad científica

**La pregunta que el editor te va a hacer:** ¿Por qué Sentinel-2 y no algo más sofisticado?

**Tu respuesta:** Sentinel-2 es el único sensor satelital con banda Red Edge (B5, B6, B7 a 20 m de resolución) disponible gratuitamente con revisita de 5 días. El Red Edge es sensible a cambios en el contenido de clorofila y agua en la hoja mucho antes de que aparezcan síntomas visuales. Nadie ha caracterizado sistemáticamente qué índices de Sentinel-2 correlacionan mejor con las condiciones microclimáticas que preceden la infección por *M. roreri* en la SNSM. Eso es la novedad.

---

## Fundamento fitopatológico (debes entender esto antes de escribir)

*Moniliophthora roreri* tiene una fase biotrófica asintomática de 45–60 días donde el hongo coloniza la mazorca internamente sin síntomas externos visibles (Bailey et al., 2018). Las condiciones que desencadenan la esporulación y maximizan la infección son:

- Humedad relativa bajo el dosel **> 85%**
- Temperatura entre **22°C y 26°C**
- Exceso de sombra que mantiene la humedad del dosel elevada
- Períodos de lluvia sostenida seguidos de temperatura cálida

El argumento del artículo es: si el dosel del cacao acumula más agua (medible con índices espectrales), las condiciones bajo ese dosel serán más propensas a la infección. Sentinel-2 puede estimar esa acumulación de agua en el dosel como variable proxy del riesgo.

---

## Paso 1 — Definición de parcelas de estudio

### Criterios de selección
Necesitas mínimo **3 tipos de parcelas** para que el análisis sea comparativo:

**Tipo A:** Cacao agroforestal con historial documentado de alta incidencia de Moniliasis
**Tipo B:** Cacao agroforestal con baja incidencia o sin historial reciente
**Tipo C:** Café de sombra en la misma zona altitudinal (control de referencia)

### Fuentes para identificar parcelas
- AGROSAVIA: datos de incidencia fitosanitaria por zona (contactar formalmente)
- FEDECACAO: registros de parcelas certificadas en Ciénaga, Fundación, Aracataca
- Productores locales conocidos de investigaciones previas del grupo GIDEAM
- Google Earth Pro: identificación visual de polígonos de cultivo

### Número mínimo de parcelas
- Para un artículo Q1: mínimo 15–20 parcelas por tipo (45–60 en total)
- Si no consigues datos de incidencia: 30 parcelas totales con verificación de campo de la cobertura y estimación visual del porcentaje de sombra

### Registro de cada parcela
Crear una tabla de campo con:
- ID parcela, coordenadas GPS centroide, área (ha), altitud (msnm)
- Tipo de cultivo, variedad aproximada si se conoce
- Porcentaje de sombra estimado visualmente
- Historial fitosanitario (si disponible)
- Fecha de verificación

---

## Paso 2 — Selección y cálculo de índices espectrales Sentinel-2

Este es el núcleo metodológico del artículo. Debes calcular y comparar **al menos 6 índices** relacionados con contenido de agua y vigor del dosel.

### Índices prioritarios

**NDWI — Normalized Difference Water Index**
Sensible al contenido de agua en la vegetación.
```
NDWI = (NIR - SWIR) / (NIR + SWIR)
= (B8 - B11) / (B8 + B11)
```
Valores más positivos → mayor contenido de agua en el dosel → mayor humedad disponible para esporulación.

**NDMI — Normalized Difference Moisture Index**
Similar al NDWI pero más sensible a agua foliar:
```
NDMI = (B8A - B11) / (B8A + B11)
```

**NDRE — Normalized Difference Red Edge**
Sensible a cambios en contenido de clorofila. En estrés hídrico moderado o saturación, el NDRE responde antes que el NDVI:
```
NDRE = (B8A - B5) / (B8A + B5)
```

**EVI — Enhanced Vegetation Index**
Menos saturado que NDVI en dosel denso:
```
EVI = 2.5 × (B8 - B4) / (B8 + 6×B4 - 7.5×B2 + 1)
```

**SAVI — Soil Adjusted Vegetation Index**
```
SAVI = 1.5 × (B8 - B4) / (B8 + B4 + 0.5)
```

**CLre — Red Edge Chlorophyll Index**
```
CLre = (B7 / B5) - 1
```

### Cálculo en GEE
```javascript
var indices = function(image) {
  var ndwi  = image.normalizedDifference(['B8', 'B11']).rename('NDWI');
  var ndmi  = image.normalizedDifference(['B8A', 'B11']).rename('NDMI');
  var ndre  = image.normalizedDifference(['B8A', 'B5']).rename('NDRE');
  var ndvi  = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var evi   = image.expression(
    '2.5 * (NIR - RED) / (NIR + 6*RED - 7.5*BLUE + 1)',
    {'NIR': image.select('B8'), 'RED': image.select('B4'), 'BLUE': image.select('B2')}
  ).rename('EVI');
  var clre  = image.expression(
    '(B7 / B5) - 1',
    {'B7': image.select('B7'), 'B5': image.select('B5')}
  ).rename('CLre');
  return image.addBands([ndwi, ndmi, ndre, ndvi, evi, clre]);
};
```

---

## Paso 3 — Estrategia temporal del análisis

La Moniliasis tiene estacionalidad ligada a los períodos lluviosos. Debes analizar los índices en al menos **3 ventanas temporales**:

**Período húmedo 1:** Abril–junio (primera temporada de lluvias del Caribe colombiano)
**Período seco:** Julio–agosto
**Período húmedo 2:** Septiembre–noviembre (segunda temporada de lluvias)

Para cada parcela y cada ventana, calcula el **valor mediano de cada índice** usando composiciones de todas las imágenes S2 disponibles sin nubes en ese período.

Usa datos de los últimos 4–5 años (2020–2024) para tener suficientes observaciones por período y manejar el problema de nubosidad de la región Caribe.

---

## Paso 4 — Análisis estadístico

### Análisis de correlación
Correlaciona los valores de cada índice con los datos de incidencia de Moniliasis disponibles:

```python
import pandas as pd
from scipy import stats
import seaborn as sns

# df con columnas: parcela, ndwi, ndmi, ndre, evi, clre, incidencia_moniliasis
df = pd.read_csv('indices_parcelas.csv')

indices = ['NDWI', 'NDMI', 'NDRE', 'EVI', 'CLre']
for idx in indices:
    r, p = stats.pearsonr(df[idx], df['incidencia'])
    print(f"{idx}: r={r:.3f}, p={p:.4f}")
```

### ANOVA o Kruskal-Wallis entre grupos
Compara si los índices difieren significativamente entre:
- Parcelas alta incidencia vs. baja incidencia
- Cacao vs. café

```python
from scipy.stats import kruskal
stat, p = kruskal(df[df['tipo']=='alta_incidencia']['NDWI'],
                  df[df['tipo']=='baja_incidencia']['NDWI'])
print(f"Kruskal-Wallis NDWI: H={stat:.3f}, p={p:.4f}")
```

### Regresión múltiple
Modelo para predecir incidencia a partir de los índices:
```python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

X = df[['NDWI', 'NDMI', 'NDRE', 'EVI', 'CLre']]
y = df['incidencia']

model = LinearRegression()
scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"R² medio: {scores.mean():.3f} ± {scores.std():.3f}")
```

### Si no tienes datos de incidencia de campo
Puedes hacer el artículo de forma **descriptiva-comparativa**: comparas los índices entre parcelas de cacao con distinto nivel de sombra (< 30%, 30–60%, > 60% de cobertura de sombra), argumentando que mayor sombra → mayor humedad del dosel → mayor riesgo potencial. Esta versión es menos fuerte pero publicable si la discusión es rigurosa.

---

## Paso 5 — Componente UAV (diferenciador clave)

Si tienes acceso al dron con cámara multiespectral (Parrot Sequoia, MicaSense RedEdge o similar):

### Diseño del vuelo
- Altura: 50–80 m sobre el dosel
- Resolución mínima: 5 cm/píxel
- Horario: 10:00–14:00 horas solar (evitar sombras largas)
- Día: preferiblemente dentro de los 5 días de un paso de Sentinel-2 sin nubes
- Incluir panel de calibración radiométrica antes y después de cada vuelo

### Qué calculas con el UAV
Los mismos índices que con Sentinel-2 (NDWI, NDMI, NDRE, NDVI) pero a centímetros de resolución. Esto permite:

1. **Validar que Sentinel-2 captura lo mismo** que el UAV a nivel de parcela (análisis de correlación UAV vs. S2 para los mismos índices)
2. **Detectar variabilidad intra-parcela** que Sentinel-2 no puede resolver (zonas de mayor acumulación de humedad dentro de la misma parcela)

### Resultado adicional que genera
Una figura con mapa UAV de NDWI a alta resolución sobre una parcela, vs. el píxel de Sentinel-2 correspondiente. Visualmente muy impactante y metodológicamente justifica la escala de trabajo.

---

## Paso 6 — Figuras y resultados clave

**Figura 1:** Mapa del área de estudio con localización de las parcelas de estudio clasificadas por tipo (alta/baja incidencia, café)

**Figura 2:** Boxplots de cada índice espectral por tipo de parcela — permite ver visualmente si los grupos difieren

**Figura 3:** Heatmap de correlaciones entre todos los índices e incidencia de Moniliasis

**Figura 4:** Serie temporal de NDWI y NDMI para parcelas representativas de cada tipo, por período estacional (2020–2024)

**Figura 5 (si hay UAV):** Comparación visual mapa UAV-NDWI vs. Sentinel-2-NDWI para la misma parcela en la misma fecha

**Figura 6:** Modelo de regresión múltiple — scatter plot de incidencia observada vs. predicha con IC al 95%

**Tabla 1:** Características de las parcelas de estudio (n, área, altitud, sombra, incidencia)

**Tabla 2:** Estadísticos descriptivos de todos los índices por grupo

**Tabla 3:** Coeficientes de correlación de Pearson (r) y significancia (p) entre índices e incidencia

---

## Paso 7 — Estructura del artículo

### Abstract (250 palabras)
Incluir obligatoriamente:
- Problema: detección tardía de Moniliasis por métodos reactivos
- Hipótesis: índices espectrales S2 correlacionan con condiciones de humedad que favorecen infección
- Datos: número de parcelas, período temporal, sensores usados
- Resultado clave: qué índice correlacionó mejor y con qué coeficiente
- Implicación: potencial de S2 para alerta temprana a escala regional

### 1. Introduction (700–900 palabras)
**Párrafo 1:** Importancia del cacao en la economía rural de la Región Caribe. Pérdidas por Moniliasis (hasta 80% en ausencia de control, 40% promedio en Colombia). Citar Correa Álvarez et al. (2014), Mejia Cervantes & Mendoza Thompson (2026).

**Párrafo 2:** La ventana biotrófica asintomática de 45–60 días (Bailey et al., 2018) como el desafío fundamental. Los métodos actuales detectan cuando el daño es irreversible.

**Párrafo 3:** La teledetección óptica como herramienta para monitoreo de condiciones de dosel a escala regional. Índices espectrales como proxies de humedad foliar y estrés. Citar trabajos de NDWI/NDMI en cultivos tropicales.

**Párrafo 4:** Sentinel-2 y sus bandas Red Edge como ventaja específica para cultivos de dosel complejo. Revisita de 5 días como capacidad de monitoreo temporal.

**Párrafo 5:** Gap: nadie ha evaluado sistemáticamente qué índices S2 correlacionan con el riesgo de Moniliasis en cacao de la región Caribe colombiana.

**Párrafo 6:** Objetivos del estudio.

### 2. Study Area (300 palabras)
SNSM, municipios, altitud, clima, descripción del sistema agroforestal, historial fitosanitario general de la zona.

### 3. Materials and Methods (900–1100 palabras)
- 3.1 Selección y caracterización de parcelas
- 3.2 Datos Sentinel-2: colecciones, preprocesamiento, ventanas temporales
- 3.3 Cálculo de índices espectrales (con fórmulas)
- 3.4 Datos de incidencia de Moniliasis
- 3.5 Vuelos UAV (si aplica)
- 3.6 Análisis estadístico (correlación, ANOVA/Kruskal-Wallis, regresión)

### 4. Results (900–1100 palabras)
- 4.1 Variación estacional de los índices por tipo de parcela
- 4.2 Diferencias entre grupos (resultados ANOVA/Kruskal-Wallis)
- 4.3 Correlación índices vs. incidencia
- 4.4 Modelo predictivo (R², RMSE)
- 4.5 Validación UAV (si aplica)

### 5. Discussion (800–1000 palabras)
- Qué índice resultó más informativo y por qué (explicación biofísica)
- Comparación con literatura de otros cultivos tropicales con índices similares
- Limitaciones: resolución 20 m del SWIR en S2, nubosidad, no captura pH ni conductividad eléctrica del suelo
- Proyección: cómo se integraría esto con nodos IoT para crear un sistema de doble fuente (tu tesis)
- Importancia del período estacional: en qué ventana temporal los índices son más predictivos

### 6. Conclusions (200–250 palabras)

---

## Paso 8 — Checklist de calidad para submission

- [ ] Índices calculados con las bandas correctas de S2 (verificar que usas L2A, no L1C)
- [ ] Análisis estadístico con test de normalidad previo (Shapiro-Wilk) para elegir entre Pearson/Spearman y ANOVA/Kruskal-Wallis
- [ ] Reportar tamaño de efecto además del p-value (Cohen's d o eta²)
- [ ] Código disponible en GitHub
- [ ] Mapa de parcelas incluido con coordenadas en sistema WGS84
- [ ] Todas las correlaciones reportan r, p y n
- [ ] Figuras a 300 dpi mínimo, en formato TIFF o EPS

---

## Timeline — 8 semanas

| Semana | Actividad |
|--------|-----------|
| 1 | Identificar y caracterizar parcelas, conseguir datos de incidencia de AGROSAVIA/FEDECACAO |
| 2 | Extraer todos los índices S2 para cada parcela en GEE (exportar como CSV) |
| 3 | Análisis estadístico completo en Python |
| 4 | Campo: verificación GPS de parcelas + vuelo UAV si disponible |
| 5 | Procesamiento imágenes UAV, validación cruzada UAV–S2 |
| 6 | Generación de todas las figuras en calidad publicación |
| 7 | Escritura del artículo (borrador completo) |
| 8 | Revisión, corrección en inglés, submission |

---

## Nota crítica para el evaluador MDPI

El mayor riesgo de rechazo de este artículo es **la calidad de los datos de incidencia**. Los revisores preguntarán: ¿cómo mediste la incidencia de Moniliasis? Si usas datos de AGROSAVIA o FEDECACAO con metodología documentada, el artículo es sólido. Si usas estimación visual propia de campo, debes describir el protocolo con precisión (porcentaje de mazorcas afectadas por parcela, número de mazorcas evaluadas, fecha de evaluación). Nunca uses incidencia estimada sin protocolo explícito — es causal de rechazo inmediato.
