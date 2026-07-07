# Sesión 1 — Fundamentos de Teledetección
**Viernes 17 de julio de 2026 · 6:00 PM – 9:00 PM**
Maestría en Ingeniería — Universidad del Magdalena

---

## ¿Qué veremos hoy?

Esta sesión es **100% conceptual para el estudiante**. No hay laboratorio — nadie instala ni ejecuta nada hoy; eso queda reservado para la Sesión 2. El objetivo es que al final de la noche tengas claro qué es la teledetección, cómo funciona el espectro electromagnético, qué son las firmas espectrales y qué significa cada tipo de resolución. Todo con ejemplos del Caribe colombiano.

Para el **docente**, en cambio, varios bloques sí tienen una demo real que se proyecta en pantalla mientras se explica — ver [Demos del docente durante la teoría](#demos-del-docente-durante-la-teoría-en-vivo) más abajo. La idea es que las curvas de reflectancia, la comparación de resoluciones o el contraste óptico-radar no queden solo en la diapositiva sino que el estudiante los vea moverse en vivo, con datos reales de la zona del curso.

---

## Mapa de la sesión

| Bloque | Duración | Tema |
|--------|----------|------|
| Bloque | Duración | Tema | Demo del docente |
|--------|----------|------|-------------------|
| 0 | 20 min | Apertura — imagen Sentinel-2 de la SNSM + presentación | — |
| 1 | 30 min | ¿Qué es la teledetección? Sensores proximales vs. remotos | — |
| 2 | 40 min | El espectro electromagnético — visible, NIR, SWIR, radar | `01_visualizacion_snsm` (color natural/falso color/SWIR) |
| 3 | 30 min | Interacción de la radiación con la materia | `02_firmas_espectrales` |
| 4 | 35 min | Firmas espectrales — la huella dactilar de cada material | `02_firmas_espectrales` |
| 5 | 40 min | Resoluciones: espacial, espectral, radiométrica, temporal | `03_resoluciones_espacial_temporal` |
| 6 | 20 min | Plataformas: Sentinel-2, Sentinel-1, Landsat, MODIS | `04_optico_vs_sar` |
| **Cierre** | 10 min | Demo en vivo con GEE — falso color de la SNSM | `01_visualizacion_snsm` |

---

## Lo que debes tener listo ANTES de llegar

- [ ] Cuenta de Google activa
- [ ] Cuenta aprobada en **Google Earth Engine**: https://code.earthengine.google.com
  *(el proceso de aprobación puede tardar hasta 24h — regístrate el jueves)*
- [ ] QGIS instalado (para la Sesión 2): https://qgis.org
- [ ] SNAP instalado (para la Sesión 2): https://step.esa.int

---

## Material teórico de la sesión

Los documentos en `teoria/` cubren cada bloque de la clase:

| Archivo | Bloque |
|---------|--------|
| `Remote_Sensing_Fundamentals.pdf` | Bloques 1–2 |
| `Radiation_Matter_Interaction.pdf` | Bloque 3 |
| `Orbital_Spectral_Fingerprinting.pdf` | Bloque 4 |
| `Remote_Sensing_Systems_and_Resolutions.pdf` | Bloque 5 |
| `Sensores_de_Teledetección.pdf` | Bloque 6 |
| `Teledetección_Aplicada_al_Caribe.pdf` | Contexto regional |

---

## Demos del docente durante la teoría (en vivo)

Estas demos **las ejecuta el docente en pantalla** durante los bloques teóricos correspondientes — los estudiantes no las corren hoy, solo observan y participan respondiendo las preguntas guía. Cada una tiene una versión en **GEE Code Editor (JavaScript)**, la más rápida de improvisar entre bloques de 30-40 min, y una versión equivalente en **Python/Colab** por si prefieres proyectar Python.

### Bloque 3+4 — Explorador de firmas espectrales

- GEE: [`gee/02_firmas_espectrales.js`](gee/02_firmas_espectrales.js)
- Colab: [`colab/02_firmas_espectrales.ipynb`](colab/02_firmas_espectrales.ipynb)

En GEE, cada clic sobre el mapa (vegetación, agua, suelo) agrega en vivo una curva de reflectancia al gráfico — la "huella dactilar" del Bloque 4 se vuelve literal. La versión Colab usa tres coordenadas fijas dentro de la zona cacaotera (ajustables la noche antes de la clase).

### Bloque 5 — Resolución espacial y temporal

- GEE: [`gee/03_resoluciones_espacial_temporal.js`](gee/03_resoluciones_espacial_temporal.js)
- Colab: [`colab/03_resoluciones_espacial_temporal.ipynb`](colab/03_resoluciones_espacial_temporal.ipynb)

Tres mapas sincronizados (Sentinel-2 10 m / Landsat 30 m / MODIS 250 m) sobre la misma zona cacaotera — al hacer zoom en clase, los estudiantes ven en qué imagen se "pierden" los polígonos de las fincas. Incluye además un conteo real de cuántas imágenes hay disponibles de cada satélite en el mismo mes (resolución temporal) y un bonus de resolución radiométrica (12 bits vs. 3 bits).

### Bloque 6 — Óptico (Sentinel-2) vs. radar (Sentinel-1)

- GEE: [`gee/04_optico_vs_sar.js`](gee/04_optico_vs_sar.js)
- Colab: [`colab/04_optico_vs_sar.ipynb`](colab/04_optico_vs_sar.ipynb)

Muestra la misma zona del norte del Magdalena en temporada de lluvias: Sentinel-2 sale cubierto de nubes, Sentinel-1 (SAR) entrega la escena limpia el mismo mes. Hace tangible la diferencia entre sensor pasivo y activo, y por qué el Caribe colombiano necesita radar.

---

## Demo de cierre — GEE en vivo (10 min)

Al final de la sesión el docente abrirá el script [`gee/01_visualizacion_snsm.js`](gee/01_visualizacion_snsm.js) en el **Google Earth Engine Code Editor** y mostrará en pantalla:

1. La Sierra Nevada de Santa Marta en **color natural** (como la ve el ojo humano)
2. La misma zona en **falso color** (NIR en el canal rojo) — la vegetación aparece roja brillante
3. La zona cacaotera entre Ciénaga y Fundación, Magdalena

**Para los estudiantes:** solo observen. En la Sesión 2 ustedes ejecutarán este tipo de visualizaciones.

---

## Conceptos clave que debes llevarte de esta sesión

- **Teledetección** = obtener información sin contacto, mediante energía electromagnética
- **Sensor pasivo** = depende del Sol (Sentinel-2, Landsat) → no funciona con nubes densas
- **Sensor activo** = emite su propia energía (Sentinel-1 SAR) → penetra nubes
- **Firma espectral** = huella dactilar de reflexión de cada material en el espectro
- **NIR** = infrarrojo cercano → clave para detectar vegetación sana (alta reflexión)
- **NDVI** = índice de vegetación → se calcula con NIR y Rojo (lo veremos en detalle en Sesión 2)
- **Resolución espacial** = tamaño del pixel en el suelo (Sentinel-2: 10 m)
- **Resolución temporal** = cada cuánto días el satélite vuelve (Sentinel-2: 5 días)

---

## Tarea para la Sesión 2 (sábado)

1. Registrarse en **Copernicus Data Space**: https://browser.dataspace.copernicus.eu
2. Buscar una imagen Sentinel-2 L2A de la zona de Ciénaga/Fundación con < 10% de nubes
3. Revisar cuántas bandas tiene y cuánto pesa el archivo

*(No necesitas descargar nada — solo explorar la interfaz)*
