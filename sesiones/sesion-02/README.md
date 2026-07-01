# Sesión 2 — Imágenes Pasivas, Preprocesamiento, Índices y Laboratorio
**Sábado 18 de julio de 2026 · 8:00 AM – 6:00 PM**
Maestría en Ingeniería — Universidad del Magdalena

---

## Mapa del día

| Horario | Bloque | Tipo | Herramienta |
|---------|--------|------|-------------|
| 8:00 – 8:15 | Apertura y conexión con Sesión 1 | Teoría | — |
| 8:15 – 9:30 | Imágenes pasivas y niveles de procesamiento | Teoría | — |
| 9:30 – 10:30 | Correcciones radiométrica, atmosférica y geométrica | Teoría | — |
| 10:30 – 10:45 | Pausa | — | — |
| 10:45 – 12:00 | Índices espectrales: NDVI, NDWI, SAVI, NDRE, EVI | Teoría | — |
| 12:00 – 13:00 | Almuerzo | — | — |
| 13:00 – 13:30 | Introducción Python y Google Colab | Práctica | Colab 00 |
| 13:30 – 14:30 | Google Earth Engine desde cero | Práctica | Colab 01 |
| 14:30 – 15:30 | NDVI satelital sobre la SNSM | Práctica | Colab 02 |
| 15:30 – 15:45 | Pausa | — | — |
| 15:45 – 16:30 | NDVI con shapefiles — zona cacaotera | Práctica | Colab 03 |
| 16:30 – 17:30 | Todos los índices + cambio temporal 2018→2024 | Práctica | Colab 04 |
| 17:30 – 18:00 | Demo SNAP + cierre + tarea | Demo + cierre | SNAP |

---

## Laboratorios (carpeta `colab/`)

Ejecuta los notebooks **en orden**. Cada uno construye sobre el anterior.

| Notebook | Qué aprenderás | Abrir en Colab |
|----------|---------------|----------------|
| [00_intro_python_jupyter.ipynb](colab/00_intro_python_jupyter.ipynb) | Python desde cero: variables, operaciones, gráficos | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion-maestria/blob/main/sesiones/sesion-02/colab/00_intro_python_jupyter.ipynb) |
| [01_intro_gee_python.ipynb](colab/01_intro_gee_python.ipynb) | GEE desde cero: autenticación, primer mapa, cargar Sentinel-2 | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion-maestria/blob/main/sesiones/sesion-02/colab/01_intro_gee_python.ipynb) |
| [02_ndvi_satelital.ipynb](colab/02_ndvi_satelital.ipynb) | Calcular NDVI sobre imagen Sentinel-2 de la SNSM | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion-maestria/blob/main/sesiones/sesion-02/colab/02_ndvi_satelital.ipynb) |
| [03_ndvi_con_shapefiles.ipynb](colab/03_ndvi_con_shapefiles.ipynb) | NDVI recortado a la zona cacaotera con polígono | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion-maestria/blob/main/sesiones/sesion-02/colab/03_ndvi_con_shapefiles.ipynb) |
| [04_indices_espectrales_snsm.ipynb](colab/04_indices_espectrales_snsm.ipynb) | NDVI, NDWI, SAVI, NDRE, EVI + cambio 2018→2024 | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/miguepoloc/teledeteccion-maestria/blob/main/sesiones/sesion-02/colab/04_indices_espectrales_snsm.ipynb) |

---

## Demo SNAP (17:30 — el docente en pantalla)

La guía completa está en [`snap/guia_snap_paso_a_paso.md`](snap/guia_snap_paso_a_paso.md).

El docente mostrará en vivo los 7 pasos con una imagen Sentinel-2 descargada previamente. Los estudiantes observan — el objetivo es conocer la herramienta, no ejecutarla hoy.

---

## Script GEE (Code Editor)

Si prefieres trabajar en el Code Editor de GEE en lugar de Colab, el script [`gee/02_indices_gee.js`](gee/02_indices_gee.js) hace lo mismo que el Colab 04.

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

2. Calcular **NDWI** y **SAVI** en el Notebook 04 para la imagen 2018 y exportar como imagen

3. Escribir media página respondiendo: *¿En qué zonas de la SNSM el NDWI y el NDVI dan información diferente? ¿Por qué ocurre eso?*

---

## Requisitos técnicos para el laboratorio

- Computador con Chrome o Firefox actualizado
- Cuenta Google con acceso a Colab y GEE
- Conexión a internet estable
- *(Opcional)* SNAP instalado para explorar offline: https://step.esa.int
