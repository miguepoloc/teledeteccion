# Guía QGIS — Georreferenciar y Armar el Mapa Final
## Sesión 4 | Universidad del Magdalena | Bloque 9

> **Este es un laboratorio que cada grupo ejecuta sobre SU PROPIO resultado**
> del Bloque 7 (el mismo grupo, el mismo dato con el que vinieron trabajando
> toda la sesión). No hay un archivo único de clase — cada grupo abre lo que
> generó en su propia rotación de vuelo y procesamiento.

---

## ¿Necesitas la Parte A, o te la puedes saltar?

Este bloque tiene dos partes, pero **la Parte A no aplica a todos los grupos**:

| Tu resultado del Bloque 7 es... | ¿Necesitas la Parte A? |
| --- | --- |
| El **ortomosaico de WebODM** (`odm_orthophoto.tif` u otro `.tif` que entregó WebODM) | **No** — sáltate la Parte A, WebODM ya lo entrega georreferenciado (Bloque 4). Ve directo a la Parte B. |
| El **composite armado a mano** en `colab/02_shift_manual_bandas.ipynb` (por defecto se llama `composite_shift_corregido.tif`) | **Sí** — ese archivo tiene las bandas ya alineadas entre sí, pero **no tiene coordenadas reales ni está orientado al norte** (Bloque 3). Hace la Parte A antes de pasar a la Parte B. |

> Como se explicó en el Bloque 3: *"El shift manual del Bloque 7 resuelve que
> las bandas coincidan ENTRE ELLAS. Georreferenciar aquí resuelve que la
> imagen completa coincida con EL MUNDO REAL. Son dos problemas distintos —
> uno es interno a la foto, el otro es sobre dónde vive esa foto en el mapa."*

---

## Lo que necesitas antes de empezar

- **QGIS** instalado (versión reciente), con el complemento **Georeferencer**
  activado (viene incluido por defecto en QGIS 3.x — si no lo ves, actívalo en
  **Complementos → Administrar e instalar complementos → Georreferenciador**).
- Tu archivo de entrada: el ortomosaico de WebODM, o
  `composite_shift_corregido.tif` exportado desde el Notebook 02.
- Si vas a hacer la Parte A: **3–4 puntos reconocibles** en tu imagen (una
  esquina de una bandeja de vivero, un cruce de caminos, la esquina de una
  estructura) y su coordenada real, tomada de una de estas dos formas:
  - Con el GPS de tu celular, parado físicamente sobre ese punto en el campo
    (precisión típica de un GPS de celular: 3–5 m — suficiente para este
    ejercicio, ver Bloque 3 sobre por qué esta precisión es aceptable para un
    laboratorio de aprendizaje).
  - Leída directamente sobre un mapa base de satélite (**Google Satellite**)
    dentro de QGIS, ubicando visualmente el mismo punto.

---

## Parte A — Georreferenciar el composite armado a mano

### Paso 1 — Abrir el complemento Georeferencer

1. En QGIS: menú **Capa → Georreferenciador**
2. Se abre una ventana aparte, con su propio lienzo — no es la vista principal
   de QGIS

**Qué verás:** una ventana vacía con una barra de herramientas propia (íconos
de abrir imagen, agregar punto, transformación, etc.).

---

### Paso 2 — Cargar la imagen del composite manual

1. Dentro de la ventana del Georreferenciador: **Archivo → Abrir Raster**
2. Selecciona `composite_shift_corregido.tif` (o el nombre que le hayas dado
   al exportar desde el Notebook 02)
3. Si QGIS pregunta por un sistema de coordenadas de origen, dile que **no
   asigne ninguno todavía** — precisamente no lo tiene, eso es lo que vas a
   corregir en este paso a paso

**Qué verás:** tu composite cargado en el lienzo del Georreferenciador, sin
ninguna cuadrícula de coordenadas de fondo — solo la imagen "flotando".

---

### Paso 3 — Marcar 3–4 puntos reconocibles y asignar su coordenada real

1. En la barra de herramientas del Georreferenciador, activa **Agregar punto**
2. Haz click sobre un punto reconocible de tu imagen (ej. una esquina de
   bandeja de vivero, un cruce de caminos, la esquina de una estructura)
3. Se abre un diálogo pidiendo la coordenada real de ese punto:
   - Si tienes la coordenada del GPS del celular: escríbela directamente
     (longitud, latitud)
   - Si vas a leerla de un mapa base: click en **Desde mapa de lienzo**, y
     ubica el mismo punto sobre el mapa de Google Satellite dentro de QGIS
4. Repite este proceso para **3 a 4 puntos distintos**, distribuidos por toda
   la imagen (no los pongas todos juntos en una esquina — mientras más
   separados estén, mejor calcula QGIS la transformación en el Paso 4)

**Qué verás:** una tabla de puntos de control (GCP) en la parte inferior de
la ventana, con las coordenadas de imagen (columna/fila en píxeles) y las
coordenadas reales que acabas de asignar a cada uno.

> **Nota:** estos son los mismos GCPs conceptualmente que se explicaron en el
> Bloque 3 para WebODM — la diferencia es que allá se cargan como archivo
> antes del procesamiento del vuelo completo, y aquí se marcan a mano, una
> sola imagen, directamente en el Georreferenciador.

---

### Paso 4 — Elegir la transformación y generar el GeoTIFF georreferenciado

1. Menú del Georreferenciador: **Configuración → Transformación**
2. Elige el tipo de transformación:
   - **Lineal** o **Polinomial de orden 1** — cualquiera de las dos alcanza
     para un terreno plano, que es el caso típico de las parcelas
     experimentales de este curso
3. Elige el **SRC de destino** (sistema de referencia de coordenadas):
   usa **EPSG:32618 — WGS 84 / UTM zone 18N** (la zona UTM que cubre el
   departamento del Magdalena y toda la costa Caribe donde se ubica el curso)
4. Define el nombre y la ruta del archivo de salida (ej.
   `composite_georreferenciado.tif`)
5. Click en **Iniciar georreferenciación**

**Qué verás:** un nuevo archivo GeoTIFF, que ahora sí puedes arrastrar a la
vista principal de QGIS y verás que aparece en su ubicación real, alineado
con el mapa base, con el norte hacia arriba.

> **Regla práctica:** *"Este es el paso que hace que la imagen deje de estar
> 'flotando' sin ubicación y pase a tener coordenadas reales, con el norte
> donde debe estar"* (cita del docente, Bloque 9).

---

## Parte B — Layout final (todos los grupos, sin excepción)

Esta parte se hace siempre — vengas de la Parte A o del ortomosaico de
WebODM directamente.

### Paso 5 — Cargar la capa principal en QGIS

1. En la vista principal de QGIS: **Capa → Agregar capa → Agregar capa
   ráster...**
2. Selecciona:
   - El ortomosaico de WebODM, **o**
   - El archivo `composite_georreferenciado.tif` que acabas de generar en el
     Paso 4

---

### Paso 6 — Armar la composición de color, o cargar NDVI/clasificación

Tienes dos opciones para la capa principal del mapa (usa la que tengas lista):

**Opción 1 — Composición de color:**

1. Click derecho sobre la capa → **Propiedades → Simbología**
2. Tipo de renderizador: **Banda multicolor (multiband color)**
3. Para **falso color** (resalta vegetación): banda roja = NIR, banda verde
   = Red, banda azul = Green
4. Para **color natural**: banda roja = Red, banda verde = Green, banda azul
   = Blue (si tu vuelo incluye la banda Blue — si no, usa falso color)

**Opción 2 — Cargar NDVI o clasificación ya calculada (Bloque 8):**

1. **Capa → Agregar capa → Agregar capa ráster...**
2. Selecciona el archivo `.tif` de NDVI o de clasificación que exportaste
   desde el Notebook 07 u 08
3. Click derecho → **Propiedades → Simbología**
4. Para NDVI: tipo **Pseudocolor de banda única**, paleta `RdYlGn`
5. Para clasificación: tipo **Paletizado/valores únicos**, asigna un color
   distinto a cada clase

---

### Paso 7 — Panel de Composición de Impresión (Print Layout)

1. Menú: **Proyecto → Diseñadores de impresión → Nuevo diseñador de
   impresión**
2. Dale un nombre al layout (ej. `Mapa_Bloque9_GrupoX`)
3. Agrega estos 5 elementos, uno por uno, desde la barra de herramientas del
   diseñador:
   - **Mapa** (arrastra un rectángulo sobre la hoja para insertar tu capa)
   - **Leyenda** (Agregar leyenda)
   - **Barra de escala** (Agregar barra de escala)
   - **Flecha de norte** (Agregar imagen → busca "north arrow" en las
     imágenes SVG que trae QGIS)
   - **Título** (Agregar etiqueta → escribe el título de tu mapa)

**Qué verás:** una hoja de composición con tu mapa y los 4 elementos
cartográficos alrededor.

> Cada uno de estos 5 elementos es obligatorio en un mapa profesional: sin
> leyenda no se sabe qué representan los colores, sin barra de escala no se
> pueden estimar distancias, sin flecha de norte no se sabe la orientación,
> y sin título no se sabe qué muestra el mapa.

---

### Paso 8 — Exportar como imagen

1. En el diseñador de impresión: **Diseño → Exportar como imagen...** (PNG)
   o **Exportar como PDF...**
2. Guarda el archivo con un nombre que identifique a tu grupo
   (ej. `mapa_final_grupoX.png`)

**Este archivo es el entregable final de tu grupo para el Bloque 9** —
exactamente el tipo de figura que necesitarás para tu artículo científico
al final del curso.

---

## Checklist de cierre — verifica que hiciste todo

- [ ] Identificaste si tu grupo necesitaba la Parte A o podía saltarla
- [ ] (Si aplicaba) Marcaste 3–4 puntos de control con sus coordenadas reales
- [ ] (Si aplicaba) Generaste el GeoTIFF georreferenciado en EPSG:32618
- [ ] Cargaste tu capa principal (ortomosaico, NDVI o clasificación) en QGIS
- [ ] Armaste el Print Layout con los 5 elementos: mapa, leyenda, escala,
      norte y título
- [ ] Exportaste el mapa final como PNG o PDF
- [ ] Tu grupo está listo para el cierre grupal de 2–3 minutos (Bloque 9):
      qué volaron, qué encontraron en las firmas espectrales, su mapa final,
      y la diferencia entre su shift manual y el resultado de WebODM

---

## Preguntas frecuentes sobre esta parte

**¿Por qué EPSG:32618 y no un sistema de coordenadas geográficas (grados)?**
UTM (Universal Transverse Mercator) usa metros en vez de grados, lo que hace
mucho más fácil medir distancias y áreas reales sobre el mapa — justo lo que
necesitas para la barra de escala del Paso 7. La zona 18N cubre todo el
departamento del Magdalena y el Caribe colombiano donde se ubica este curso.

**Mis 3–4 puntos de control no se ven muy precisos, ¿es un problema?**
Para este laboratorio de aprendizaje, no. El mismo criterio del Bloque 3
aplica aquí: un error de algunos metros es aceptable porque están
practicando el flujo completo, no publicando resultados de investigación.
Si necesitaran precisión centimétrica para publicar, usarían RTK o GCPs
medidos con GPS RTK en el suelo (Bloque 3), no un GPS de celular.

**¿La georreferenciación manual en QGIS reemplaza a WebODM?**
No. Solo corrige la posición y orientación de UNA imagen ya armada a mano.
WebODM reconstruye la geometría 3D de cientos de fotos y corrige el paralaje
punto por punto — esto es la solución rápida para el camino manual, no un
sustituto del pipeline fotogramétrico completo.

**¿Qué pasa si mi ortomosaico de WebODM todavía no ha terminado de
procesar?**
Trabaja con el composite manual del Notebook 02 mientras tanto (Parte A +
Parte B), y cuando WebODM termine —aunque sea después de la sesión—, repite
la Parte B con ese resultado para comparar los dos caminos, como se pide en
el cierre grupal del Bloque 9.
