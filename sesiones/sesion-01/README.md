# Sesión 1 — Fundamentos de Teledetección
**Viernes 17 de julio de 2026 · 6:00 PM – 9:00 PM**
Maestría en Ingeniería — Universidad del Magdalena

---

## ¿Qué veremos hoy?

Esta sesión es **100% conceptual**. No hay laboratorio. El objetivo es que al final de la noche tengas claro qué es la teledetección, cómo funciona el espectro electromagnético, qué son las firmas espectrales y qué significa cada tipo de resolución. Todo con ejemplos del Caribe colombiano.

---

## Mapa de la sesión

| Bloque | Duración | Tema |
|--------|----------|------|
| 0 | 20 min | Apertura — imagen Sentinel-2 de la SNSM + presentación |
| 1 | 30 min | ¿Qué es la teledetección? Sensores proximales vs. remotos |
| 2 | 40 min | El espectro electromagnético — visible, NIR, SWIR, radar |
| 3 | 30 min | Interacción de la radiación con la materia |
| 4 | 35 min | Firmas espectrales — la huella dactilar de cada material |
| 5 | 40 min | Resoluciones: espacial, espectral, radiométrica, temporal |
| 6 | 20 min | Plataformas: Sentinel-2, Sentinel-1, Landsat, MODIS |
| **Cierre** | 10 min | Demo en vivo con GEE — falso color de la SNSM |

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
