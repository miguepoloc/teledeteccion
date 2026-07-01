# Sesión 3 — Índices Espectrales Avanzados & Clasificación Supervisada

**Fecha:** Viernes 24 de julio de 2026 | 18:00 – 22:00 (4 h)  
**Docente:** Ing. Miguel Ángel Polo Castañeda  
**Meta:** Que los estudiantes dominen los índices avanzados relacionados con cultivos y agua, y puedan diseñar, entrenar y validar un clasificador supervisado con imagen satelital.

---

## Mapa de la sesión

| Hora | Tipo | Actividad |
|------|------|-----------|
| 18:00–18:15 | Apertura | Mini-caso docente: tesis Bonivento 2024 — película de agua en hojas de banano |
| 18:15–19:15 | Teoría | Índices avanzados: NDRE, EVI, NDMI, LAI — fórmulas, interpretación, aplicaciones |
| 19:15–19:45 | Lab Colab | **Notebook 05** — Índices avanzados en zona cacaotera/bananera (GEE) |
| 19:45–20:00 | Pausa | — |
| 20:00–20:45 | Teoría | Clasificación supervisada: ROIs, Random Forest, entrenamiento, validación |
| 20:45–21:30 | Lab Colab | **Notebook 06** — Clasificación supervisada con GEE + scikit-learn |
| 21:30–22:00 | Proyecto | Avance S3: cada estudiante presenta 2 min su área de estudio y pregunta de investigación |

---

## Notebooks Colab

| # | Archivo | Tema | Abrir |
|---|---------|------|-------|
| 05 | [05_indices_avanzados_lai.ipynb](colab/05_indices_avanzados_lai.ipynb) | NDRE, EVI, NDMI, LAI en cultivos | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/TU-USUARIO/teledeteccion/blob/main/sesiones/sesion-03/colab/05_indices_avanzados_lai.ipynb) |
| 06 | [06_clasificacion_supervisada.ipynb](colab/06_clasificacion_supervisada.ipynb) | Clasificación supervisada RF + validación | [![Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/TU-USUARIO/teledeteccion/blob/main/sesiones/sesion-03/colab/06_clasificacion_supervisada.ipynb) |

> Reemplaza `TU-USUARIO` con tu usuario de GitHub antes de publicar.

---

## Script GEE (Code Editor)

| Archivo | Descripción |
|---------|-------------|
| [gee/03_clasificacion_gee.js](gee/03_clasificacion_gee.js) | Clasificación supervisada CART/RF sobre Sentinel-2 en el Code Editor de GEE |

---

## Índices avanzados de referencia

| Índice | Fórmula (Sentinel-2) | Rango útil | Para qué sirve |
|--------|----------------------|------------|----------------|
| **NDRE** | (B8A − B5) / (B8A + B5) | 0.2–0.8 | Clorofila en cultivos densos, mejor que NDVI en saturación |
| **EVI** | 2.5 × (B8 − B4) / (B8 + 6·B4 − 7.5·B2 + 1) | 0–1 | Mejora NDVI en dosel denso o alta reflectancia de suelo |
| **NDMI** | (B8A − B11) / (B8A + B11) | −1 a 1 | Contenido de agua en hoja; positivo = húmedo |
| **LAI** | estimado con regresión sobre NDVI o NDRE | 0–8 m²/m² | Área foliar; clave en modelos de producción |

---

## Qué diferencia supervisada vs no supervisada

| Criterio | No supervisada (S2) | Supervisada (S3) |
|----------|---------------------|------------------|
| Requiere muestras | No | Sí — ROIs dibujadas por el analista |
| Número de clases | El algoritmo decide | El analista define |
| Algoritmo | K-means / ISODATA | Random Forest, SVM, MaxLikelihood |
| Validación | Interpretación visual | Matriz de confusión + Kappa |
| Aplicación típica | Exploración inicial | Mapas de uso del suelo con clases conocidas |

---

## Teoría de soporte

| Tema | Referencia |
|------|-----------|
| Índices espectrales en cultivos tropicales | Chuvieco (2002) Cap. 5 |
| Random Forest para clasificación de imagen | Breiman (2001); Jensen (2007) Cap. 9 |
| Matriz de confusión y Kappa | Congalton & Green (2009) |
| Red Edge en detección de estrés hídrico | Delegido et al. (2011), RSE |

---

## Avance de proyecto (21:30 – 22:00)

Cada estudiante / grupo tiene **2 minutos** para presentar:

1. **¿Cuál es tu área de estudio?** — nombrarla y ubicarla en el mapa
2. **¿Cuál es tu pregunta de investigación?** — en una oración
3. **¿Qué dato satelital usarás?** — Sentinel-2, Landsat, S-1 SAR…

> El docente toma nota de cada área para personalizar los ejemplos de la Sesión 4.

---

## Recursos del docente

| Archivo | Descripción |
|---------|-------------|
| [clase3_base_conocimiento.md](clase3_base_conocimiento.md) | Guía completa del docente: qué decir exactamente, analogías, errores comunes de estudiantes, timing por bloque, y conexión con la tesis Bonivento 2025 |

---

## Tarea para Sesión 4

1. Descargar e instalar Miniconda o Anaconda si aún no lo tienes
2. Ejecutar en tu máquina local: `conda create -n teledeteccion python=3.10 rasterio scikit-learn matplotlib -y`
3. Leer: Espinosa Valdez, Polo-Castañeda et al. (2022) — *Canopy Extraction in a Banana Crop from UAV Multispectral Images*, IEEE CONCAPAN. DOI: 10.1109/CONCAPAN48024.2022.9997598
