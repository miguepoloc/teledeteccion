# Guía SNAP — Laboratorio Sesión 2
## Procesamiento de imagen Sentinel-2 L2A

> **Esta guía es para seguir la demo del docente.** En sesiones futuras realizarás
> estos pasos tú mismo. Hoy el objetivo es conocer la interfaz y el flujo completo.

---

## ¿Qué es SNAP?

**SNAP (Sentinel Application Platform)** es el software oficial de la ESA para
procesar imágenes Sentinel. Es gratuito, corre en Windows/Mac/Linux y está
diseñado específicamente para Sentinel-1 y Sentinel-2.

- **Descarga:** https://step.esa.int/main/toolboxes/snap
- **Peso:** ~1 GB de instalación
- **Requiere:** Java (se instala automáticamente)

---

## Antes de empezar — Descargar una imagen Sentinel-2

### Paso 0A: Registrarse en Copernicus Data Space
1. Ir a https://browser.dataspace.copernicus.eu
2. Crear cuenta gratuita
3. Confirmar el correo

### Paso 0B: Buscar y descargar la imagen
1. Abrir el navegador de datos
2. En la barra de búsqueda escribir: **Fundación, Magdalena, Colombia**
3. Seleccionar el ícono de satélite → **Sentinel-2**
4. Filtros:
   - Tipo: `S2MSI2A` (Level-2A, ya corregida atmosféricamente)
   - Cobertura de nubes: `< 10%`
   - Fecha: `2024-01-01` a `2024-03-31`
5. Seleccionar la imagen con menos nubosidad
6. Descargar el archivo `.SAFE` (~600 MB – 1 GB)

> **Nota:** El docente ya tiene esta imagen descargada. Los estudiantes pueden
> explorar la interfaz de búsqueda sin necesidad de descargar.

---

## Paso 1 — Abrir la imagen en SNAP

1. Abrir SNAP (puede tardar 1–2 minutos en iniciar)
2. Menú: **File → Open Product**
3. Navegar hasta la carpeta del archivo `.SAFE`
4. Dentro del `.SAFE`, seleccionar el archivo **`MTD_MSIL2A.xml`**
5. Click en **Open**

**Qué verás:**
En el panel izquierdo (**Product Explorer**) aparecerá la imagen con todas sus
bandas organizadas en carpetas:
- `Bands` → B1 a B12 y B8A (las 13 bandas de Sentinel-2)
- `Masks` → máscaras de nubes, sombras, agua
- `Tie-Point Grids` → información de ángulos y geometría

---

## Paso 2 — Explorar las bandas individuales

1. En el Product Explorer, expandir la carpeta **Bands**
2. Doble click en **B4** (banda roja, 665 nm) → se abre una ventana con la imagen en escala de grises
3. Doble click en **B8** (NIR, 842 nm) → se abre otra ventana

**Observa la diferencia:**
- En **B4**: la vegetación aparece **oscura** (la clorofila absorbe la luz roja para la fotosíntesis)
- En **B8**: la vegetación aparece **muy brillante** (la estructura celular refleja mucho en NIR)

> Esta diferencia entre lo oscuro en B4 y lo brillante en B8 es exactamente
> lo que el NDVI captura matemáticamente. Estamos viendo con los ojos
> lo que el índice calculará con números.

---

## Paso 3 — Composición a Color Natural

Una composición RGB asigna tres bandas a los canales Rojo, Verde y Azul de la pantalla.

**Color natural** (lo que vería el ojo humano):
- Canal Rojo ← Banda **B4** (rojo del espectro, 665 nm)
- Canal Verde ← Banda **B3** (verde del espectro, 560 nm)
- Canal Azul ← Banda **B2** (azul del espectro, 490 nm)

**Cómo hacerlo en SNAP:**
1. Menú: **Window → Open RGB Image Window**
2. En el diálogo:
   - Red: `B4`
   - Green: `B3`
   - Blue: `B2`
3. Click **OK**

**Resultado:** la imagen se ve como una foto aérea convencional. Los cultivos
se ven verdes, las zonas urbanas grises, el agua azul oscuro.

---

## Paso 4 — Composición en Falso Color

**Falso color estándar para vegetación** (la más usada en teledetección):
- Canal Rojo ← Banda **B8** (NIR, 842 nm)
- Canal Verde ← Banda **B4** (rojo, 665 nm)
- Canal Azul ← Banda **B3** (verde, 560 nm)

**Cómo hacerlo:**
1. Window → **Open RGB Image Window**
2. Red: `B8` · Green: `B4` · Blue: `B3`
3. Click OK

**Resultado:** la vegetación sana aparece en **rojo brillante** (porque refleja
mucho en NIR, que está asignado al canal rojo de la pantalla). El suelo desnudo
aparece en tonos café/beige. El agua aparece casi negra.

> El rojo brillante = NIR alto = vegetación densa y sana.
> Esta composición se inventó en los años 70 y sigue siendo la más usada en el mundo.

---

## Paso 5 — Calcular el NDVI

### Método 1: Band Math (directo)

1. Menú: **Raster → Band Math**
2. Click en **Edit Expression**
3. Escribir la fórmula:
   ```
   (B8 - B4) / (B8 + B4)
   ```
4. En "Target band name": escribir `NDVI`
5. Click **OK**

### Método 2: Índices predefinidos (más fácil)

1. Menú: **Optical → Thematic Land Processing → Vegetation Radiometric Indices**
2. Seleccionar el producto de entrada
3. Marcar ✅ **NDVI**
4. Click **Run**

### Visualizar el NDVI con paleta de colores

1. Doble click en la banda `NDVI` recién creada
2. En el panel **Colour Manipulation** (abajo a la izquierda):
   - Click derecho en la barra de colores → "Import colour palette"
   - O ajustar manualmente: rojo para valores bajos (< 0.2), verde para valores altos (> 0.6)
3. Mueve el cursor sobre diferentes zonas:
   - En la barra de estado aparece el valor exacto de NDVI de cada pixel
   - ¿Dónde está el NDVI más alto? ¿Coincide con lo que esperabas?

**Valores de referencia:**

| NDVI | Qué hay |
|------|---------|
| < 0 | Agua, nubes |
| 0.0 – 0.2 | Suelo desnudo, zona urbana |
| 0.2 – 0.4 | Vegetación escasa o estresada |
| 0.4 – 0.6 | Cultivos en desarrollo |
| 0.6 – 0.9 | Vegetación densa: bosque, cacao adulto |

---

## Paso 6 — Recortar al área de estudio (Subset)

La imagen completa cubre 100×100 km. Para trabajar más rápido, recortamos solo la zona de interés.

1. Menú: **Raster → Subset**
2. Pestaña "Spatial Subset" → seleccionar "Geo Coordinates"
3. Ingresar coordenadas de la zona cacaotera:
   ```
   North: 11.0°  |  South: 10.5°
   West: -74.2°  |  East:  -73.8°
   ```
4. Pestaña "Band Subset": seleccionar solo `B2, B3, B4, B8, B11`
5. Click **OK**

> Una imagen completa Sentinel-2 pesa ~600 MB. El subset de la zona de interés
> pesa ~50 MB y procesa 10 veces más rápido. Crítico cuando varios computadores
> corren SNAP simultáneamente.

---

## Paso 7 — Exportar el NDVI como GeoTIFF

1. Click derecho sobre el producto con NDVI en el Product Explorer
2. **File → Export → GeoTIFF**
3. Seleccionar solo la banda `NDVI`
4. Guardar como: `NDVI_SNSM_2024_enero.tif`

Este archivo puede abrirse en QGIS para visualización y análisis adicional.

---

## Preguntas frecuentes sobre SNAP

**¿Por qué SNAP tarda tanto en abrir?**
Porque carga el índice de todas las bandas al iniciar. En computadores con 8 GB de RAM
tarda 2–3 minutos. Con 16 GB es más rápido.

**¿Cuál es la diferencia entre L1C y L2A en SNAP?**
L1C contiene valores de reflectancia de la cima de la atmósfera (TOA). L2A ya tiene
la corrección atmosférica aplicada (Sen2Cor). Siempre usa L2A para análisis cuantitativos.

**¿Puedo calcular NDWI y SAVI igual que el NDVI?**
Sí. En Band Math:
- NDWI: `(B8 - B11) / (B8 + B11)`
- SAVI: `1.5 * (B8 - B4) / (B8 + B4 + 0.5)`

**¿SNAP o QGIS?**
SNAP es mejor para procesar imágenes Sentinel (correcciones, índices, clasificación).
QGIS es mejor para análisis espacial, combinar capas de distintas fuentes y hacer mapas
cartográficos finales. En la práctica los dos se complementan: procesas en SNAP, visualizas en QGIS.
