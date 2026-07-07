# Cómo descargar los datos para la Sesión 2 (guía para el docente)

Esta guía te lleva paso a paso por la descarga de **4 archivos** desde
Copernicus Data Space. Hazlo con varios días de anticipación — las cuentas
nuevas a veces tardan en activarse y las descargas pueden pesar hasta 1 GB
cada una.

## Qué vas a descargar (resumen)

| # | Archivo | Zona | Fecha | Nubes | Para qué |
|---|---------|------|-------|-------|----------|
| 1 | **L2A principal 2024** | Ciénaga/Fundación, Magdalena | ene–mar 2024 | < 10% | Imagen base de todo el laboratorio SNAP |
| 2 | **L1C misma escena** | misma zona, mismo día que el #1 si es posible | ene–mar 2024 | < 10% | Comparación TOA (L1C) vs BOA (L2A), Bloque 2 |
| 3 | **L2A con nubes** | norte del Magdalena (zona más amplia) | oct–nov 2024 | sin filtro | Comparación con nubes vs sin nubes, Bloque 1/2 |
| 4 | **L2A 2018** | misma zona que el #1 | ene–mar 2018 | < 15-20% | Comparación NDVI multitemporal 2018→2024, "momento eureka" |

**2018 y no 2015:** Sentinel-2A se lanzó el 23 de junio de 2015 — no existe
ninguna imagen Sentinel-2 de enero-marzo 2015. Por eso todo el material del
curso usa 2018 como año de comparación (ver nota de corrección en
`clase2_base_conocimiento.md`).

---

## Paso 0 — Crear tu cuenta (una sola vez)

1. Ir a **https://browser.dataspace.copernicus.eu**
2. Click en **"Register"** (esquina superior derecha)
3. Llenar el formulario con tu correo institucional o personal
4. Confirmar el correo (revisa spam si no llega en 5 minutos)
5. Iniciar sesión

---

## Paso 1 — Descargar el archivo #1: L2A principal 2024

1. Ya con sesión iniciada, en el mapa usa la barra de búsqueda (ícono de lupa,
   arriba a la izquierda) y escribe: `Ciénaga, Magdalena, Colombia` — el mapa
   se centrará ahí. También puedes dibujar manualmente el rectángulo de
   interés con la herramienta de polígono (ícono de lápiz) usando estas
   esquinas aproximadas: Norte 11.0°, Sur 10.5°, Oeste -74.2°, Este -73.8°.
2. Abre el panel de búsqueda (ícono de catálogo, columna izquierda).
3. En **"Data Source"** selecciona **Sentinel-2**.
4. En **"Product Type"** selecciona **S2MSI2A** (esto es L2A — Level-2A,
   Surface Reflectance, ya corregida atmosféricamente).
5. En **"Time range"** selecciona: **2024-01-01** a **2024-03-31**.
6. En **"Cloud cover"** mueve el control deslizante a **máximo 10%**.
7. Click en **"Search"**.
8. De los resultados, ordena por nubosidad (menor primero) y elige la imagen
   con menos nubes que cubra bien tu zona de interés. Click sobre esa imagen
   en la lista para verla resaltada en el mapa — confirma que cubre las
   bananeras, la Ciénaga Grande y parte de la SNSM.
9. Click en el ícono de **descarga** (flecha hacia abajo) junto a esa imagen.
10. Elige **"Product"** (el archivo completo `.SAFE`, ~600 MB–1 GB) — NO elijas
    solo una vista previa.
11. Guarda el `.zip` descargado y renómbralo a algo reconocible, por ejemplo:
    `01_L2A_2024_ene-mar.zip`

---

## Paso 2 — Descargar el archivo #2: L1C de la misma escena

Repite el Paso 1 pero con dos cambios:

- En **"Product Type"** selecciona **S2MSI1C** (esto es L1C — Level-1C,
  Top of Atmosphere, SIN corrección atmosférica) en vez de S2MSI2A.
- Intenta elegir **la misma fecha exacta** que la imagen L2A que ya descargaste
  en el Paso 1 — Copernicus normalmente ofrece L1C y L2A del mismo pase del
  satélite. Si buscas por fecha exacta en vez de por rango, es más fácil
  encontrar el par correspondiente.

Guarda como: `02_L1C_2024_ene-mar.zip`

> **Por qué esto importa:** esta es la imagen que usarás para la demo
> comparativa TOA vs BOA del Bloque 2 — mismo día, misma zona, pero SIN
> corrección atmosférica. Si no encuentras exactamente el mismo día, cualquier
> imagen L1C de esas mismas semanas (ene-mar 2024) sirve igual de bien para
> la demo, aunque no sea pixel-a-pixel idéntica a la L2A.

---

## Paso 3 — Descargar el archivo #3: L2A con nubes (temporada húmeda)

1. Repite la búsqueda, pero esta vez:
   - **Product Type:** S2MSI2A (L2A otra vez)
   - **Time range:** **2024-10-01** a **2024-11-30**
   - **Cloud cover:** NO apliques filtro de nubes (o pon el máximo, 100%) —
     a propósito queremos una imagen nublada para la demo
2. Elige cualquier imagen de ese período que se vea claramente cubierta de
   nubes en la vista previa del mapa.
3. Descarga igual que antes (Product, archivo completo).

Guarda como: `03_L2A_2024_oct-nov_con_nubes.zip`

---

## Paso 4 — Descargar el archivo #4: L2A 2018 (para comparación multitemporal)

Repite el Paso 1 exactamente igual, pero:
- **Time range:** **2018-01-01** a **2018-03-31**
- **Cloud cover:** hasta 15-20% (en 2018 puede haber menos imágenes
  disponibles que en 2024, así que sé un poco más flexible con el filtro)

Guarda como: `04_L2A_2018_ene-mar.zip`

---

## Paso 5 — Preparar la carpeta para el USB

1. Descomprime los 4 archivos `.zip` — cada uno se convierte en una carpeta
   `.SAFE` (ej. `S2B_MSIL2A_20240115T...SAFE`).
2. Crea esta estructura en tu USB o disco compartido:
   ```
   Sesion2_Datos/
   ├── 01_L2A_2024_ene-mar.SAFE/
   ├── 02_L1C_2024_ene-mar.SAFE/
   ├── 03_L2A_2024_oct-nov_con_nubes.SAFE/
   └── 04_L2A_2018_ene-mar.SAFE/
   ```
3. Copia esta carpeta completa a cada computador del laboratorio ANTES de la
   clase (o al USB que rotará entre estudiantes) — el peso total ronda 3-4 GB.
4. Prueba abrir los 4 productos en SNAP tú mismo al menos una vez antes de la
   sesión (File → Open Product → seleccionar el `MTD_MSIL1C.xml` o
   `MTD_MSIL2A.xml` dentro de cada `.SAFE`) para confirmar que no están
   corruptos y que la zona sí se ve como esperas.

---

## Preguntas frecuentes

**¿Puedo usar el navegador de datos sin descargar nada, solo para mostrar la
interfaz en clase?** Sí — el portal permite buscar y previsualizar sin
descargar. Útil para la Tarea de Sesión 1 (explorar la interfaz) y para que
los estudiantes vean el proceso de búsqueda en vivo antes de trabajar con los
archivos que ya tienes preparados.

**¿Qué pasa si Copernicus no tiene una imagen con <10% de nubes en las fechas
exactas?** Amplía el rango de fechas unos días (ej. hasta abril) o sube el
umbral de nubes al 15%. Lo importante es mantener la temporada seca
(enero-marzo) para las imágenes #1, #2 y #4.

**¿Necesito volver a descargar esto cada año que dicte el curso?** No para
las imágenes de investigación (#1, #2, #4) — puedes reusarlas. Sí conviene
refrescar la imagen con nubes (#3) cada año si quieres mostrar datos más
recientes, aunque cualquier temporada húmeda octubre-noviembre sirve para el
propósito pedagógico.
