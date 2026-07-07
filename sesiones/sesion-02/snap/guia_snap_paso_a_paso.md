# Guía SNAP — Laboratorio Sesión 2
## Procesamiento de imágenes Sentinel-2 (L1C y L2A)

> **Este es un laboratorio que TÚ ejecutas en tu propio computador.** El
> docente hace la demo en pantalla grande, paso por paso, y tú repites cada
> paso en tu SNAP mientras él avanza. Si te atrasas, no te preocupes — sigue
> a tu ritmo, no hay problema si terminas después que el grupo.

---

## ¿Qué es SNAP?

**SNAP (Sentinel Application Platform)** es el software oficial de la ESA para
procesar imágenes Sentinel. Es gratuito, corre en Windows/Mac/Linux y está
diseñado específicamente para Sentinel-1 y Sentinel-2.

- **Descarga:** https://step.esa.int/main/toolboxes/snap
- **Peso:** ~1 GB de instalación
- **Requiere:** Java (se instala automáticamente)

**Debes tener SNAP instalado y funcionando ANTES de esta sesión** (era la
tarea de la Sesión 1). Si no te instaló a tiempo, sigue la guía en pantalla
observando al docente y ponte al día en casa esta semana con el mismo
paquete de datos (pídelo por USB).

---

## Los 4 archivos que necesitas (ya en tu USB/carpeta compartida)

El docente preparó y distribuyó 4 imágenes (ver
`docente/COMO_DESCARGAR_DATOS_COPERNICUS.md` si quieres replicar la descarga
tú mismo más adelante):

| Archivo | Qué es | Para qué paso |
|---------|--------|----------------|
| `01_L2A_2024_ene-mar.SAFE` | Imagen principal, L2A, temporada seca 2024 | Pasos 1–8 (todo el flujo base) |
| `02_L1C_2024_ene-mar.SAFE` | Misma zona, L1C (sin corrección atmosférica) | Paso 9 (TOA vs BOA) |
| `03_L2A_2024_oct-nov_con_nubes.SAFE` | Temporada húmeda, con nubes | Paso 10 (con/sin nubes + SCL) |
| `04_L2A_2018_ene-mar.SAFE` | Misma zona, 2018 | Paso 12 (comparación multitemporal) |

Copia la carpeta completa que te entregó el docente a un lugar de tu
computador donde tengas al menos 4 GB libres.

---

## Paso 1 — Abrir la imagen principal en SNAP

1. Abrir SNAP (puede tardar 1–2 minutos en iniciar)
2. Menú: **File → Open Product**
3. Navegar hasta la carpeta `01_L2A_2024_ene-mar.SAFE`
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

**Valores típicos que deberías ver al mover el cursor:**

| Cobertura | B4 (rojo) | B8 (NIR) |
|-----------|-----------|----------|
| Bananeras sanas | 200–600 | 4,000–8,000 |
| Ciénaga Grande (agua) | — | 0–200 |
| Suelo desnudo | 800–2,500 | — |

---

## Paso 6 — Calcular NDWI y SAVI (Band Math)

Repite exactamente el **Método 1 del Paso 5**, pero con estas fórmulas:

**NDWI** (contenido de agua en la vegetación):
```
(B8 - B11) / (B8 + B11)
```
Target band name: `NDWI`

**SAVI** (vegetación con suelo expuesto):
```
1.5 * (B8 - B4) / (B8 + B4 + 0.5)
```
Target band name: `SAVI`

Visualiza ambas igual que el NDVI (Colour Manipulation) y compáralas
visualmente con el NDVI ya calculado — activa y desactiva ventanas para ver
las tres una junto a la otra.

> **Nota sobre la tarea de casa:** si llegaste hasta aquí en clase, ya
> cumpliste la tarea de NDWI/SAVI en SNAP — no necesitas repetirla en el
> Notebook 04. Si no alcanzaste este paso en clase, hazlo en casa esta semana
> siguiendo estas mismas instrucciones, o alternativamente en el Notebook 04
> (Colab/GEE), que calcula lo mismo con código.

---

## Paso 7 — Recortar al área de estudio (Subset)

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

## Paso 8 — Exportar el NDVI como GeoTIFF

1. Click derecho sobre el producto con NDVI en el Product Explorer
2. **File → Export → GeoTIFF**
3. Seleccionar solo la banda `NDVI`
4. Guardar como: `NDVI_SNSM_2024_enero.tif`

Este archivo puede abrirse en QGIS para visualización y análisis adicional.

---

## Paso 9 — Comparación TOA (L1C) vs. BOA (L2A) — Bloque 2

Ahora vas a ver con tus propios ojos la diferencia entre una imagen SIN
corregir atmosféricamente (L1C) y una corregida (L2A).

1. Abre el segundo producto: **File → Open Product** →
   `02_L1C_2024_ene-mar.SAFE` → seleccionar `MTD_MSIL1C.xml`
2. Ahora tienes dos productos abiertos en el Product Explorer: el L2A (Paso 1)
   y este L1C nuevo.
3. Abre una composición **Color Natural** (B4-B3-B2, igual que el Paso 3) del
   producto L1C, y compárala en pantalla junto a la que ya tenías del L2A.
   **Qué buscar:** la banda azul (B2) se ve más "velada" o brillante de más
   en el L1C — es el efecto de dispersión atmosférica (dispersión de
   Rayleigh) que el L2A ya corrigió.
4. Calcula el NDVI del L1C igual que en el Paso 5 (Band Math, misma fórmula).
5. Mueve el cursor sobre el mismo punto de vegetación en ambos productos
   (L1C y L2A) y anota el valor de NDVI de cada uno.
   **Qué esperar:** el NDVI del L1C suele salir 0.05–0.15 unidades MÁS BAJO
   que el del L2A en el mismo punto — la atmósfera "contamina" la señal y
   reduce el contraste rojo/NIR que el NDVI mide.
6. Observa un cuerpo de agua o una zona de sombra en ambas imágenes: en L1C
   suele verse con más brillo residual (menos oscuro) que en L2A.

**Pregunta guía:** si comparas NDVI calculado sobre L1C de una fecha con
NDVI calculado sobre L2A de otra fecha, ¿la diferencia que obtienes es del
cultivo o de la atmósfera? *(Respuesta: no puedes saberlo — por eso la regla
del curso es SIEMPRE usar L2A para cualquier análisis cuantitativo o
comparación temporal).*

---

## Paso 10 — Con nubes vs. sin nubes, y la banda SCL — Bloques 1 y 2

1. Abre el tercer producto: **File → Open Product** →
   `03_L2A_2024_oct-nov_con_nubes.SAFE` → `MTD_MSIL2A.xml`
2. Abre una composición **Color Natural** de este producto. Compárala en
   pantalla junto a la del producto principal (Paso 1, temporada seca).
   **Qué verás:** gran parte de la escena de octubre-noviembre está cubierta
   de nubes blancas — el suelo debajo simplemente no es visible.
3. En el Product Explorer del producto con nubes, expande **Bands** y busca
   la banda **SCL** (Scene Classification Layer). Doble click para abrirla.
4. La SCL viene con colores predefinidos por clase (nubes, sombras, agua,
   vegetación, suelo, nieve, etc.). Identifica visualmente las zonas de nube
   (normalmente en blanco/gris claro) comparándolas con la imagen a color
   natural del mismo producto.
5. Ahora crea la máscara de nubes con Band Math:
   - Menú: **Raster → Band Math**
   - Fórmula (excluye sombra de nube=3, nube media=8, nube alta=9, cirros=10):
     ```
     SCL != 3 && SCL != 8 && SCL != 9 && SCL != 10
     ```
   - Target band name: `mascara_sin_nubes`
   - Click OK
6. Calcula el NDVI de este producto con nubes (Band Math, misma fórmula del
   Paso 5) y compara: sin aplicar la máscara, ¿qué valor de NDVI da un pixel
   de nube? *(Normalmente 0.2–0.4 — fácilmente confundible con vegetación
   escasa si no sabes que es una nube).*

**Pregunta guía:** si no hicieras este enmascaramiento y simplemente
calcularas NDVI sobre toda la imagen con nubes, ¿qué pasaría con tu análisis
de cambio temporal? *(Respuesta: los pixels de nube contaminarían el
promedio, haciendo parecer que hubo pérdida de vegetación donde en realidad
solo había una nube ese día).*

---

## Paso 11 — Índices predefinidos con paleta de colores (repaso)

Repite el Paso 5 (Método 2) sobre cualquiera de los productos que ya tienes
abiertos, esta vez fijándote en cómo SNAP asigna automáticamente una paleta
de colores al índice calculado. Compara visualmente NDVI vs. NDWI vs. SAVI
del mismo producto, uno junto al otro.

---

## Paso 12 — Comparación NDVI multitemporal: 2018 vs. 2024 ("momento eureka")

1. Abre el cuarto producto: **File → Open Product** →
   `04_L2A_2018_ene-mar.SAFE` → `MTD_MSIL2A.xml`
2. Calcula su NDVI igual que en el Paso 5 (Band Math).
3. Abre en pantalla, **simultáneamente**, la ventana de NDVI de 2018 y la
   ventana de NDVI de 2024 (Paso 5) — usa **Window → Tile Horizontally** para
   verlas una junto a la otra.
4. Compara visualmente la zona cacaotera de la SNSM en ambos años.
   **Este es el "momento eureka" del laboratorio:** la diferencia visual
   entre 2018 y 2024 es la evidencia satelital directa del proceso de
   reconversión café → cacao que documenta el Artículo 1 de investigación
   doctoral.
5. *(Opcional, si tienes tiempo)* Calcula la diferencia con Band Math sobre
   los dos productos NDVI:
   ```
   NDVI_2024 - NDVI_2018
   ```
   Valores positivos = aumento de vegetación (dosel más denso); valores
   negativos = pérdida de vegetación.

---

## Checklist de cierre — verifica que hiciste todo

- [ ] Abriste la imagen L2A principal y exploraste B4 y B8 por separado
- [ ] Creaste composición Color Natural y Falso Color
- [ ] Calculaste NDVI, NDWI y SAVI con Band Math
- [ ] Hiciste el subset de la zona cacaotera
- [ ] Exportaste el NDVI como GeoTIFF
- [ ] Comparaste L1C vs. L2A (banda azul, valor de NDVI en el mismo punto)
- [ ] Viste la imagen con nubes, identificaste la banda SCL y creaste una máscara
- [ ] Comparaste NDVI 2018 vs. 2024 en la zona cacaotera

---

## Preguntas frecuentes sobre SNAP

**¿Por qué SNAP tarda tanto en abrir?**
Porque carga el índice de todas las bandas al iniciar. En computadores con 8 GB de RAM
tarda 2–3 minutos. Con 16 GB es más rápido.

**¿Cuál es la diferencia entre L1C y L2A en SNAP?**
L1C contiene valores de reflectancia de la cima de la atmósfera (TOA). L2A ya tiene
la corrección atmosférica aplicada (Sen2Cor). Siempre usa L2A para análisis cuantitativos.
Ver Paso 9 para la comparación en vivo.

**¿SNAP o QGIS?**
SNAP es mejor para procesar imágenes Sentinel (correcciones, índices, clasificación).
QGIS es mejor para análisis espacial, combinar capas de distintas fuentes y hacer mapas
cartográficos finales. En la práctica los dos se complementan: procesas en SNAP, visualizas en QGIS.

**Voy más lento que el resto del grupo, ¿qué hago?**
No importa — sigue a tu ritmo. Los pasos 1–8 son la base; si llegas hasta ahí
en clase ya cumpliste lo esencial. Los pasos 9–12 (comparaciones TOA/BOA,
nubes/SCL, multitemporal) puedes terminarlos en casa con el mismo paquete de
datos si el tiempo de clase se acaba antes.
