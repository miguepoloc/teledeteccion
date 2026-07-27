# Sesión 4 — Drones + Python para Teledetección

**Fecha:** [a definir por el docente] · Duración estimada total: **10–11 h**
(el horario exacto se arma después — este README organiza contenido y
orden, no un reloj fijo)
**Docente:** Ing. Miguel Ángel Polo Castañeda
**Meta:** Los estudiantes reciben la teoría completa de drones (incluyendo
posicionamiento de precisión con RTK/GCPs), vuelan el P4M en grupos
rotativos, procesan sus propias fotos por dos caminos (shift manual y
WebODM), extraen firmas espectrales, analizan con Python, y cierran con un
mapa profesional en QGIS. Entregan su propuesta de proyecto final al cierre
del día.

---

## Distribución del contenido

| Bloque | Tema | Tipo | Duración estimada |
|--------|------|------|---------------------|
| 0 | Apertura | Plenaria | 10 min |
| 1 | Fundamentos del dron: qué es, tipos y cómo se maneja | Teoría | 45 min |
| 2 | Dron y satélite: el P4M por dentro | Teoría | 40 min |
| 3 | **Precisión de los datos: posicionamiento (RTK/GCPs), calibración y georreferenciación** | Teoría | 40 min |
| 4 | El problema del shift y la fotogrametría automática (WebODM) | Teoría + demo | 50 min |
| 5 | Preparación para volar: regulación AEROCIVIL y briefing | Teoría + Prep | 35 min |
| 6 | **Lab campo** — el vuelo, rotativo por grupos | Práctica en grupos | 90–120 min |
| 7 | **Procesamiento de las fotos, por grupo** (WebODM, shift manual, firmas espectrales, revisar resultados) | Práctica en grupos | 130–150 min |
| 8 | **Python** — Notebook 00 (rasterio) y Notebook 01 (Random Forest) | Práctica en grupos | 180 min |
| 9 | **Cierre en QGIS** — georreferenciar (si aplica) y armar el mapa final | Práctica en grupos | 55 min |
| 10 | **GEE Demo** — serie temporal NDVI 2018–2025 zona bananera del Magdalena | Teoría + Demo | 45 min |
| 11 | **Entrega** — propuesta de proyecto final (1 página) | Entrega | 30 min |

Guion completo de cada bloque, con analogías y guiones exactos, agrupado
por tema (mismo estilo que `sesion-02/clase2_base_conocimiento.md`):
[clase4_base_conocimiento.md](clase4_base_conocimiento.md).

---

## Por qué hay un bloque dedicado a precisión de datos (Bloque 3)

El GPS de consumo del P4M tiene un error típico de 1.5–3 m — irrelevante a
10 m/px de Sentinel-2, pero significativo a 5.3 cm/px del dron. El Bloque 3
agrupa las tres preguntas que un revisor de artículo haría sobre cualquier
mapa de dron:

1. **¿Qué tan bien ubicado está?** → RTK (estación base + rover, corrección
   en tiempo real) y GCPs (puntos de control medidos en el suelo) bajan el
   error a 2–5 cm. Aclara que el P4M **no** trae RTK integrado de fábrica
   (a diferencia del modelo "Phantom 4 RTK") — confusión común.
2. **¿Qué tan confiables son los valores?** → calibración: el sunshine
   sensor y la brújula/IMU los resuelve el P4M **solo**; el único paso
   manual real es la foto del panel de calibración.
3. **¿Cómo sé que apunta al norte?** → el composite armado a mano (shift
   manual, Bloque 7) no tiene coordenadas ni orientación real — a
   diferencia del ortomosaico de WebODM, que sí las trae. Se corrige
   georreferenciando en QGIS (Bloque 9).

---

## La lógica del bloque de procesamiento (por qué ese orden)

WebODM tarda en procesar incluso un set pequeño de fotos, así que el orden
del Bloque 7 está pensado para que nadie se quede esperando:

1. Apenas un grupo aterriza, **lanza WebODM primero** — corre solo, en
   segundo plano.
2. Mientras corre, el grupo hace el **shift manual** sobre 1–2 fotos
   individuales — es rápido y es donde se enseña el concepto de raíz.
3. Con las bandas ya alineadas a mano, extraen las **firmas espectrales** y
   avanzan con los notebooks de Python (Bloque 8).
4. Para cuando llegan a QGIS (Bloque 9), el ortomosaico de WebODM debería
   estar listo — el cierre compara "lo que armé a mano en una foto" vs.
   "lo que WebODM armó automáticamente para el vuelo completo". Si el
   resultado viene del camino manual, primero hay que georreferenciarlo
   (no tiene coordenadas reales todavía) antes del layout final.

La clase enseña primero **por qué existe el problema** (shift manual, foto
por foto) y después **la herramienta que lo resuelve a escala** (WebODM) —
nunca al revés, para que los estudiantes entiendan qué hace la
automatización antes de confiar en ella ciegamente.

---

## Logística de vuelo — grupos rotando pilotaje

Con varios grupos pequeños rotando sobre un solo P4M y un número limitado
de baterías, confirma antes del día:

- [ ] ¿Cuántas baterías hay frente a cuántos grupos? Si no alcanza una
      batería por grupo, arma un ciclo de carga en paralelo.
- [ ] ¿Cada grupo vuela sobre un área distinta (más rico para comparar) o
      la misma área en momentos distintos (más simple de coordinar)?
- [ ] Mientras un grupo vuela, el grupo anterior ya puede ir descargando
      fotos y lanzando WebODM — evita tiempo muerto.
- [ ] Cada grupo procesa **su propio** set de fotos de principio a fin
      (WebODM, shift, firmas, notebooks, QGIS) — no se combina todo en un
      solo dataset de clase.
- [ ] ¿Se van a usar GCPs? Si sí, definir quién los coloca y mide (Bloque
      5) antes de que arranque la rotación de vuelos.

---

## Archivos de la sesión

| Tipo | Archivo | Descripción |
|------|---------|-------------|
| Guía docente | [clase4_base_conocimiento.md](clase4_base_conocimiento.md) | Guion completo: fundamentos de dron, precisión (RTK/GCPs), shift, WebODM, vuelo, firmas espectrales, QGIS |
| Vuelo | [vuelo/guia_vuelo_p4m.md](vuelo/guia_vuelo_p4m.md) | Checklist de seguridad, configuración P4M, parámetros de misión *(actualizar para rotación por grupos)* |
| Procesamiento | [webodm/guia_webodm_p4m.md](webodm/guia_webodm_p4m.md) | Instalación WebODM + flujo completo de procesamiento fotogramétrico |
| Notebook 00 | [colab/00_rasterio_dron_analisis.ipynb](colab/00_rasterio_dron_analisis.ipynb) | rasterio: carga ortomosaico multibanda, NDVI/NDRE/NDMI, exportar |
| Notebook 01 | [colab/01_clasificacion_dron_rf.ipynb](colab/01_clasificacion_dron_rf.ipynb) | RF sobre imagen de dron, matriz de confusión, mapa clasificado |
| Notebook 02 | [colab/02_shift_manual_bandas.ipynb](colab/02_shift_manual_bandas.ipynb) | rasterio sobre una captura REAL del P4M (`datos/DJI_202407202018_012`, sin banda Blue): encuentra el borde más confiable por NCC, visualiza el desalineamiento, aplica shift (dx, dy), compara NDVI antes/después, firmas espectrales, y exporta `composite_shift_corregido.tif` |
| GEE | [gee/04_ndvi_temporal_bananera.js](gee/04_ndvi_temporal_bananera.js) | Serie NDVI 2018–2025 zona bananera Landsat + Sentinel-2 |
| QGIS | [qgis/guia_georreferenciacion_y_layout.md](qgis/guia_georreferenciacion_y_layout.md) | Parte A: georreferenciar el composite manual con el Georeferencer (EPSG:32618). Parte B: leyenda, escala, norte, exportar |
| Entrega | [plantilla_propuesta_proyecto.md](plantilla_propuesta_proyecto.md) | Plantilla de propuesta final (llena en clase) |

---

## Hardware y software requerido

| Recurso | Estado |
|---------|--------|
| DJI Phantom 4 Multispectral | Docente trae el equipo |
| Baterías P4M cargadas | Cargar noche anterior — confirmar cuántas frente al número de grupos |
| Panel de calibración (papel matte blanco o tarjeta gris 18%) | Preparar antes — único paso de calibración manual |
| GPS RTK de mano + marcadores GCP *(opcional, ver Bloque 3)* | Solo si se busca precisión centimétrica en el resultado |
| Docker Desktop instalado | Los estudiantes instalan antes de la sesión |
| WebODM corriendo en `localhost:8000` | Instalar antes (guía en webodm/) |
| Conda env: `teledeteccion` con rasterio + scikit-learn | Tarea de sesión anterior |
| QGIS instalado (versión reciente, con el complemento Georeferencer) | Los estudiantes instalan antes de la sesión |
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
GPS estándar del P4M: ±1.5–3 m · con RTK/GCPs: 2–5 cm (Bloque 3)

---

## Tarea para la sesión siguiente

1. Instalar Docker + WebODM antes del día del vuelo (guía:
   `webodm/guia_webodm_p4m.md`)
2. Instalar QGIS si no se alcanzó a hacer antes
3. Leer sobre SAR: Jensen (2007) Cap. 6 — *Microwave Remote Sensing*
4. Registrarse en ASF Vertex (asf.alaska.edu) para descargar imágenes
   Sentinel-1
5. Entregar propuesta de proyecto final al docente antes de salir de la
   sesión

---

## Propuesta de proyecto final

**Entrega el mismo día, al final de la jornada.** Usa la plantilla
[`plantilla_propuesta_proyecto.md`](plantilla_propuesta_proyecto.md).
Extensión: 1 página. Puedes escribir en Word, Google Docs o Markdown.
El docente da retroalimentación escrita antes de la sesión de
presentaciones finales.

---

## Estado del material práctico

Los 3 pendientes que existían (notebook del shift manual, guía de
georreferenciación en QGIS, y la logística de rotación por grupos en la
guía de vuelo) ya están completos:

1. ✅ `colab/02_shift_manual_bandas.ipynb` — usa una captura real del vuelo
   del 20 de julio de 2024 (`datos/DJI_202407202018_012`, sin banda Blue),
   con detección automática del borde más confiable por correlación cruzada
   (NCC) — no una imagen sintética — y exporta el composite corregido.
2. ✅ `qgis/guia_georreferenciacion_y_layout.md` — paso a paso del Bloque 9,
   Parte A (Georeferencer, EPSG:32618) y Parte B (Print Layout), con
   checklist de cierre y preguntas frecuentes.
3. ✅ `vuelo/guia_vuelo_p4m.md` — ya incluye la sección 7 (rotación de vuelo
   por grupos: perímetros de 15/20 m, ventana de 2+vuelo+2 min) y la sección
   4 (colocación y medición de GCPs, opcional).
