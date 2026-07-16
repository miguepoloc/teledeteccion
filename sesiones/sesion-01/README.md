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

| Archivo | Bloque | Tema |
|---------|--------|------|
| [`teoria/01 - Teledetección.pdf`](teoria/01%20-%20Teledetección.pdf) | Bloque 1 | ¿Qué es la teledetección? Sensores proximales vs. remotos |
| [`teoria/02 - Espectro electromagnético.pdf`](teoria/02%20-%20Espectro%20electromagnético.pdf) | Bloque 2 | El espectro EM: visible, NIR, SWIR, radar |
| [`teoria/03 - Radiación con la materia.pdf`](teoria/03%20-%20Radiación%20con%20la%20materia.pdf) | Bloque 3 | Reflexión, absorción, transmisión, ventanas atmosféricas |
| [`teoria/04 - Firmas espectrales.pdf`](teoria/04%20-%20Firmas%20espectrales.pdf) | Bloque 4 | Firmas espectrales de vegetación, agua, suelo, urbano |
| [`teoria/05 - Conceptos básicos.pdf`](teoria/05%20-%20Conceptos%20básicos.pdf) | Bloque 5 | Resoluciones espacial, espectral, radiométrica y temporal |
| [`teoria/06 - Plataformas satelitales.pdf`](teoria/06%20-%20Plataformas%20satelitales.pdf) | Bloque 6 | Sentinel-2, Sentinel-1, Landsat, MODIS, P4M |
| [`teoria/07 - Resumen final.pdf`](teoria/07%20-%20Resumen%20final.pdf) | Cierre | Síntesis de la sesión |

---

## Demos del docente durante la teoría (en vivo)

Estas demos **las ejecuta el docente en pantalla** durante los bloques teóricos. Los estudiantes **no las corren hoy** — solo observan y participan. Cada una tiene versión GEE (JavaScript) y versión Python/Colab equivalente en la carpeta **`docente/colab/`** para que el docente la proyecte o el estudiante la repase después en casa.

> **Para el estudiante:** en la Sesión 2 sí correrás tus propios notebooks. Hoy solo observas.

### Demo de apertura + cierre — Visualización SNSM

- GEE: [`gee/01_visualizacion_snsm.js`](gee/01_visualizacion_snsm.js)
- Colab: [`docente/colab/01_visualizacion_snsm.ipynb`](docente/colab/01_visualizacion_snsm.ipynb)

La primera imagen que ve el grupo: la Sierra Nevada en color natural, falso color NIR y composición SWIR. Incluye extracción de valores de pixel y firma espectral en vivo.

### Demo Bloque 3+4 — Explorador de firmas espectrales

- GEE: [`gee/02_firmas_espectrales.js`](gee/02_firmas_espectrales.js)
- Colab: [`docente/colab/02_firmas_espectrales.ipynb`](docente/colab/02_firmas_espectrales.ipynb)

En GEE, cada clic sobre el mapa agrega en vivo una curva de reflectancia. La versión Colab grafica tres puntos fijos (vegetación, agua, suelo) dentro de la zona cacaotera.

### Demo Bloque 5 — Resolución espacial y temporal

- GEE: [`gee/03_resoluciones_espacial_temporal.js`](gee/03_resoluciones_espacial_temporal.js)
- Colab: [`docente/colab/03_resoluciones_espacial_temporal.ipynb`](docente/colab/03_resoluciones_espacial_temporal.ipynb)

Tres mapas sincronizados (Sentinel-2 10 m / Landsat 30 m / MODIS 250 m). Al hacer zoom, los estudiantes ven en qué imagen se “pierden” los polígonos de las fincas.

### Demo Bloque 6 — Óptico (Sentinel-2) vs. Radar (Sentinel-1)

- GEE: [`gee/04_optico_vs_sar.js`](gee/04_optico_vs_sar.js)
- Colab: [`docente/colab/04_optico_vs_sar.ipynb`](docente/colab/04_optico_vs_sar.ipynb)

La misma zona en temporada de lluvias: Sentinel-2 cubierto de nubes, Sentinel-1 SAR entrega la escena limpia. Hace tangible la diferencia sensor pasivo vs. activo.

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

## Tarea para la Sesión 2 (sábado 8 AM)

### ✅ Obligatorio antes de llegar

1. **Completar el notebook de Python** [`colab/01_intro_python.ipynb`](colab/01_intro_python.ipynb) ← **30–45 min, en casa esta noche**
   - Variables, listas, bucles, funciones y gráficos en Python
   - Prerequisito para entender los notebooks de GEE del sábado
   - No requiere instalación — corre directamente en [Google Colab](https://colab.research.google.com)

2. **Registrarse en Copernicus Data Space**: https://browser.dataspace.copernicus.eu
   - Crear cuenta gratuita
   - Buscar una imagen Sentinel-2 L2A de Ciénaga/Fundación con < 10% nubes

### 📚 Lectura recomendada (opcional)

Chuvieco, E. (2016). *Fundamentals of Satellite Remote Sensing* (2nd ed.). CRC Press.
Capítulos 1 y 2 — repasan todo lo de la clase de hoy con más detalle.
