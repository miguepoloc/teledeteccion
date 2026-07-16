# Sesión 2 — Imágenes Pasivas, Preprocesamiento, Índices y Laboratorio
**Sábado 18 de julio de 2026 · 8:00 AM – 6:00 PM**
Maestría en Ingeniería — Universidad del Magdalena

---

## Dos tipos de laboratorio en esta sesión

1. **GEE + Python (Colab) — el laboratorio principal.** Los 5 notebooks de la carpeta `colab/` (13:00–17:30) — trabajo individual guiado por el propio notebook, con el docente circulando para resolver dudas. **Todo el curso puede completarse en GEE+Python sin necesidad de SNAP.**

2. **SNAP — demo del docente + práctica opcional.** A la 1:00 PM (paralelo al inicio de Colab 00), el docente ejecuta en pantalla la guía SNAP paso a paso. Los estudiantes pueden replicar en su propio computador si tienen SNAP instalado. **Es opcional** — si no tienen SNAP o da problemas, todo lo que se hace en SNAP está también disponible en los notebooks Colab como alternativa completa.

Además, el docente tiene una tercera carpeta, `docente/`, con **demos que solo
él ejecuta y proyecta** durante los bloques teóricos (no son laboratorios que
el estudiante replique en el momento, aunque puede revisarlos después).

---

## Mapa del día

| Horario | Bloque | Tipo | Herramienta |
|---------|--------|------|-------------|
| 8:00 – 8:15 | Apertura y conexión con Sesión 1 | Teoría | — |
| 8:15 – 9:30 | Imágenes pasivas y niveles de procesamiento | Teoría + demo docente | `docente/gee/01_toa_vs_boa.js` |
| 9:30 – 10:30 | Correcciones radiométrica, atmosférica y geométrica | Teoría + demo docente | `docente/gee/02_nubes_y_scl.js` |
| 10:30 – 10:45 | Pausa | — | — |
| 10:45 – 12:00 | Índices espectrales: NDVI, NDWI, SAVI, NDRE, EVI, NDMI, CLre | Teoría | — |
| 12:00 – 13:00 | Almuerzo | — | — |
| 13:00 – 13:30 | Introducción Python y Google Colab | Práctica individual | Colab 00 |
| 13:00 – 14:30 | **SNAP (opcional)** — docente en pantalla, estudiante replica si tiene SNAP | Demo + réplica opcional | SNAP |
| 13:30 – 14:30 | Google Earth Engine desde cero | Práctica individual | Colab 01 |
| 14:30 – 15:30 | NDVI satelital sobre la SNSM | Práctica individual | Colab 02 |
| 15:30 – 15:45 | Pausa | — | — |
| 15:45 – 16:30 | NDVI con shapefiles — zona cacaotera | Práctica individual | Colab 03 |
| 16:30 – 17:30 | Todos los índices + cambio temporal 2018→2024 | Práctica individual | Colab 04 |
| 17:30 – Bloque 5 (teoría) | Clasificación de imágenes | Teoría + demo docente | `docente/gee/03_clasificacion_no_supervisada.js` |
| Cierre | Resumen + tarea | Plenaria | — |

---

## Antes de la clase — descarga de datos (para el docente)

Ver [`docente/COMO_DESCARGAR_DATOS_COPERNICUS.md`](docente/COMO_DESCARGAR_DATOS_COPERNICUS.md):
paso a paso para descargar los 4 archivos que necesitas llevar en USB (L2A
principal 2024, L1C de la misma escena, L2A con nubes oct-nov 2024, L2A 2018).
Hazlo con varios días de anticipación.

**Nota de corrección:** el material original hablaba de comparar 2015 vs.
2024, pero Sentinel-2A se lanzó el 23 de junio de 2015 — no existe ninguna
imagen Sentinel-2 de enero-marzo 2015. Todo el curso usa **2018 vs. 2024**
como comparación multitemporal.

---

## Laboratorio SNAP — demo del docente (opcional para el estudiante)

Guía completa: [`snap/guia_snap_paso_a_paso.md`](snap/guia_snap_paso_a_paso.md).

El docente hace la demo de los 12 pasos en pantalla a las **13:00 PM** mientras los estudiantes
empiezan los notebooks. Quiénes tengan SNAP instalado pueden replicar en paralelo.
Todo lo que SNAP hace en los 12 pasos está replicado también en los notebooks Colab:
**nadie se queda sin poder hacer el laboratorio por un problema de instalación.**

> **Nota:** si tienes problemas con SNAP en macOS con chip Apple Silicon (M1/M2/M3),
> es un problema conocido de compatibilidad de Java. Usa directamente los notebooks Colab.

Los 12 pasos cubren: apertura de imagen, exploración de bandas, color natural, falso
color, NDVI, NDWI y SAVI con Band Math, subset, exportar GeoTIFF, comparación
TOA (L1C) vs. BOA (L2A), comparación con nubes vs. sin nubes + enmascaramiento
con la banda SCL, y comparación NDVI multitemporal 2018 vs. 2024 (el "momento
eureka" del laboratorio).

---

## Laboratorios individuales (carpeta `colab/`)

Ejecuta los notebooks **en orden**. Cada uno construye sobre el anterior.

> **Prerequisito:** haber completado el notebook de introducción a Python de la Sesión 1
> (`sesion-01/colab/01_intro_python.ipynb`) antes de llegar hoy.

| Notebook | Qué aprenderás | Abrir en Colab |
|----------|---------------|----------------|
| [00_descarga_copernicus.ipynb](colab/00_descarga_copernicus.ipynb) | *(Opcional)* Descargar imágenes Sentinel-2 vía API — fallback si no hay USB | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion/blob/main/sesiones/sesion-02/colab/00_descarga_copernicus.ipynb) |
| [01_intro_gee_python.ipynb](colab/01_intro_gee_python.ipynb) | GEE desde cero: autenticación, primer mapa, cargar Sentinel-2 | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion/blob/main/sesiones/sesion-02/colab/01_intro_gee_python.ipynb) |
| [02_ndvi_satelital.ipynb](colab/02_ndvi_satelital.ipynb) | Calcular NDVI sobre imagen Sentinel-2 de la SNSM | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion/blob/main/sesiones/sesion-02/colab/02_ndvi_satelital.ipynb) |
| [03_ndvi_con_shapefiles.ipynb](colab/03_ndvi_con_shapefiles.ipynb) | NDVI recortado a la zona cacaotera con polígono | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion/blob/main/sesiones/sesion-02/colab/03_ndvi_con_shapefiles.ipynb) |
| [04_indices_espectrales_snsm.ipynb](colab/04_indices_espectrales_snsm.ipynb) | NDVI, NDWI, NDRE, SAVI, EVI, NDMI, CLre + cambio 2018→2024 | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion/blob/main/sesiones/sesion-02/colab/04_indices_espectrales_snsm.ipynb) |

---

## Demos del docente durante la teoría (carpeta `docente/`)

Estas demos **las ejecuta el docente en pantalla** durante los bloques
teóricos — no son laboratorios que el estudiante replique en el momento.
Cada una tiene versión GEE (JavaScript, más rápida de improvisar en vivo) y
Colab (Python) equivalente.

### Bloques 1/2 — TOA (L1C) vs. BOA (L2A)
- GEE: [`docente/gee/01_toa_vs_boa.js`](docente/gee/01_toa_vs_boa.js)
- Colab: [`docente/colab/01_toa_vs_boa.ipynb`](docente/colab/01_toa_vs_boa.ipynb)

Compara la misma escena sin corrección atmosférica (L1C) y con ella (L2A):
banda azul velada, NDVI 0.05–0.15 más bajo en L1C, diferencia visible en el
mismo punto de vegetación. Esta demo también existe replicada por el
estudiante en SNAP (Paso 9 de la guía).

### Bloques 1/2 — Con nubes vs. sin nubes + enmascaramiento SCL
- GEE: [`docente/gee/02_nubes_y_scl.js`](docente/gee/02_nubes_y_scl.js)
- Colab: [`docente/colab/02_nubes_y_scl.ipynb`](docente/colab/02_nubes_y_scl.ipynb)

Imagen limpia (ene-mar) vs. imagen con nubes (oct-nov, sin filtrar), la banda
SCL identificando visualmente las nubes, y el efecto real de calcular NDVI
con y sin máscara. También replicado por el estudiante en SNAP (Paso 10).

### Bloque 5 — Clasificación no supervisada
- GEE: [`docente/gee/03_clasificacion_no_supervisada.js`](docente/gee/03_clasificacion_no_supervisada.js)
- Colab: [`docente/colab/03_clasificacion_no_supervisada.ipynb`](docente/colab/03_clasificacion_no_supervisada.ipynb)

K-means sobre la zona cacaotera (5 clusters) como "resultado ya hecho" para
mostrar cómo se ve un mapa clasificado. **No es** la clasificación supervisada
validada del Artículo 1 — esa la construyen los estudiantes en la Sesión 3 con
ROIs reales y Random Forest. Sé explícito con el grupo sobre esta diferencia.

---

## Script GEE alternativo (Code Editor)

Si prefieres trabajar en el Code Editor de GEE en lugar de Colab, el script
[`gee/02_indices_gee.js`](gee/02_indices_gee.js) hace lo mismo que el Colab 04
(ahora incluye los 7 índices: NDVI, NDWI, SAVI, NDRE, EVI, NDMI, CLre).

---

## Material teórico

| Archivo | Tema |
|---------|------|
| `teoria/The_Data_Refinery.pdf` | Correcciones radiométrica y atmosférica |
| `teoria/The_Satellite_Data_Matrix.pdf` | Niveles L1C vs L2A |
| `teoria/Decoding_Spectral_Indices.pdf` | NDVI, NDWI, SAVI, NDRE |
| `teoria/SNAP_Multitemporal_Analysis.pdf` | Laboratorio SNAP |
| `teoria/Clasificación_de_Imágenes_con_ML.pdf` | Clasificación supervisada |

---

## Tarea para casa

1. En el **Notebook 04**: cambiar la fecha de la imagen 2024 por **octubre-noviembre 2024** (temporada húmeda) y comparar el NDVI
   - ¿Qué pasa con las nubes? ¿Cuántos pixels quedan válidos?
   - ¿Cambia el NDVI de la vegetación entre temporada seca y húmeda?

2. Calcular **NDWI y SAVI**:
   - **Si ya tienes SNAP funcionando:** hazlo ahí con Band Math (Paso 6 de la
     guía SNAP) — es la vía preferida, ya la practicaste en clase.
   - **Si SNAP aún no te funciona:** hazlo en el Notebook 04 (Colab/GEE), que
     ya tiene NDWI, SAVI, NDMI y CLre calculados con código.

3. Escribir media página respondiendo: *¿En qué zonas de la SNSM el NDWI y el NDVI dan información diferente? ¿Por qué ocurre eso?*

---

## Requisitos técnicos para el laboratorio

- Computador con Chrome o Firefox actualizado
- Cuenta Google con acceso a Colab y GEE
- Conexión a internet estable (Colab y GEE son el laboratorio principal)
- **SNAP instalado** *(opcional — ver demo del docente a las 13:00)*: https://step.esa.int
  - Si SNAP no instala o da errores, usa los notebooks Colab — hacen exactamente lo mismo
- Carpeta de datos entregada por el docente (USB o disco compartido) con los
  4 archivos `.SAFE` — **solo necesaria si replicar SNAP**
  - Alternativa sin USB: todos los datos se cargan desde GEE en los notebooks
