# Sesión 4 — Drones + Python para Teledetección

**Fecha:** Sábado 25 de julio de 2026 | 8:00 AM – 6:00 PM (8 h)  
**Docente:** Ing. Miguel Ángel Polo Castañeda  
**Meta:** Los estudiantes completan el ciclo completo UAV: vuelan el drone en la universidad, procesan las imágenes con WebODM, analizan con Python, y entregan su propuesta de proyecto final.

---

## Distribución del día

| Hora | Tipo | Actividad |
|------|------|-----------|
| 8:00–8:15 | Apertura | Conexión con S3 + mapa del día |
| 8:15–9:00 | Teoría | Drones y teledetección: componentes, P4M, planificación de vuelo |
| 9:00–9:15 | Teoría | Regulación AEROCIVIL Colombia (15 min) |
| 9:15–9:30 | Prep | Briefing de seguridad + calibración panel |
| 9:30–11:00 | **Lab campo** | Vuelo P4M en universidad — lago + vegetación |
| 11:00–11:15 | Pausa | — |
| 11:15–12:30 | **Lab WebODM** | Procesamiento fotogramétrico → ortomosaico 5 bandas |
| 12:30–13:30 | Almuerzo | — |
| 13:30–15:00 | **Notebook 07** | rasterio: cargar ortomosaico, calcular índices, visualizar |
| 15:00–16:30 | **Notebook 08** | scikit-learn RF: clasificar imagen de dron (lago, pasto, árboles, concreto) |
| 16:30–16:45 | Pausa | — |
| 16:45–17:30 | **GEE Demo** | Serie temporal NDVI 2018–2025 zona bananera del Magdalena |
| 17:30–18:00 | **Entrega** | Propuesta de proyecto final (1 página) |

---

## Archivos de la sesión

| Tipo | Archivo | Descripción |
|------|---------|-------------|
| Guía docente | [clase4_base_conocimiento.md](clase4_base_conocimiento.md) | Script completo con teoría, analogías e instrucciones hora a hora |
| Vuelo | [vuelo/guia_vuelo_p4m.md](vuelo/guia_vuelo_p4m.md) | Checklist de seguridad, configuración P4M, parámetros de misión |
| Procesamiento | [webodm/guia_webodm_p4m.md](webodm/guia_webodm_p4m.md) | Instalación WebODM + flujo completo de procesamiento fotogramétrico |
| Notebook 07 | [colab/07_rasterio_dron_analisis.ipynb](colab/07_rasterio_dron_analisis.ipynb) | rasterio: carga ortomosaico multibanda, NDVI/NDRE/NDMI, exportar |
| Notebook 08 | [colab/08_clasificacion_dron_rf.ipynb](colab/08_clasificacion_dron_rf.ipynb) | RF sobre imagen de dron, matriz de confusión, mapa clasificado |
| GEE | [gee/04_ndvi_temporal_bananera.js](gee/04_ndvi_temporal_bananera.js) | Serie NDVI 2018–2025 zona bananera Landsat + Sentinel-2 |
| Entrega | [plantilla_propuesta_proyecto.md](plantilla_propuesta_proyecto.md) | Plantilla de propuesta final (llena en clase) |

---

## Hardware y software requerido

| Recurso | Estado |
|---------|--------|
| DJI Phantom 4 Multispectral | Docente trae el equipo |
| Baterías P4M cargadas (×3 mínimo) | Cargar noche anterior |
| Panel de calibración (papel matte blanco o tarjeta gris 18%) | Preparar antes |
| Docker Desktop instalado | Los estudiantes instalan antes de la sesión |
| WebODM corriendo en `localhost:8000` | Instalar antes (guía en webodm/) |
| Conda env: `teledeteccion` con rasterio + scikit-learn | Tarea de S3 |
| Google Colab (fallback) | Siempre disponible |

---

## Banda P4M — referencia rápida

| Banda | λ central | Equivalente Sentinel-2 | Para qué sirve |
|-------|-----------|------------------------|----------------|
| Blue  | 450 nm | B2 | Agua, atmósfera |
| Green | 560 nm | B3 | Pico reflectancia vegetal |
| Red   | 650 nm | B4 | Absorción clorofila |
| RedEdge | 730 nm | B5 | Transición Red Edge — clorofila |
| NIR   | 840 nm | B8A | Estructura celular, LAI |

GSD a 50 m de altura: **5.3 cm/px** por banda (resolución real del campo)

---

## Tarea para Sesión 5

1. Instalar Docker + WebODM antes del sábado (guía: `webodm/guia_webodm_p4m.md`)
2. Leer sobre SAR: Jensen (2007) Cap. 6 — *Microwave Remote Sensing*
3. Registrarse en ASF Vertex (asf.alaska.edu) para descargar imágenes Sentinel-1
4. Entregar propuesta de proyecto final al docente antes de salir de la sesión

---

## Propuesta de proyecto final

**Entrega hoy al final del día.** Usa la plantilla [`plantilla_propuesta_proyecto.md`](plantilla_propuesta_proyecto.md).  
Extensión: 1 página. Puedes escribir en Word, Google Docs o Markdown.  
El docente da retroalimentación escrita antes de la Sesión 6.
