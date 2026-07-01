# Teledetección Aplicada — Maestría en Ingeniería
### Universidad del Magdalena · 2026
**Docente:** Miguel Ángel Polo Castañeda

---

## ¿Qué es este repositorio?

Material de clases, laboratorios y scripts de investigación para la asignatura de **Teledetección** de la Maestría en Ingeniería. Todo el código está contextualizado en el Caribe colombiano: la Sierra Nevada de Santa Marta (SNSM), la Ciénaga Grande y el departamento del Magdalena.

---

## Cómo usar este repositorio

### Opción A — Clonar en tu computador (recomendado)
```bash
git clone https://github.com/miguepoloc/teledeteccion-maestria.git
```

### Opción B — Abrir directamente en Google Colab
Cada notebook tiene un botón [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)] en su encabezado.

---

## Antes de la primera clase — Lista de tareas

Completa esto **antes del viernes 17 de julio**:

- [ ] **Cuenta Google** con acceso a Google Drive y Google Colab
- [ ] **Registrarse en Google Earth Engine:** https://code.earthengine.google.com (seleccionar "Academia/Non-profit")
- [ ] **Instalar QGIS 3.x:** https://qgis.org (gratuito)
- [ ] **Instalar SNAP 10.x:** https://step.esa.int (gratuito, pesa ~1 GB)
- [ ] **Crear cuenta en Copernicus Data Space:** https://browser.dataspace.copernicus.eu

---

## Estructura del repositorio

```
teledeteccion/
├── sesiones/
│   ├── sesion-01/          ← Viernes 17 jul — Fundamentos teóricos
│   └── sesion-02/          ← Sábado 18 jul — Preprocesamiento + Índices + Laboratorio
│
├── datos/                  ← Dataset mini Sentinel-2 (bandas B4 y B8, zona SNSM)
├── code/                   ← Scripts de investigación (GEE JS + Python)
├── articulos/              ← Guías de los artículos de investigación doctoral
└── referencia/             ← Notebooks de referencia (base de la docente anterior)
```

---

## Sesiones

| Sesión | Fecha | Tema | Herramientas |
|--------|-------|------|-------------|
| [Sesión 1](sesiones/sesion-01/README.md) | Viernes 17 jul | Fundamentos: espectro EM, firmas espectrales, resoluciones, plataformas | GEE (demo) |
| [Sesión 2](sesiones/sesion-02/README.md) | Sábado 18 jul | Preprocesamiento, índices espectrales, laboratorio SNAP + Colab | SNAP, GEE, Python/Colab |

---

## Herramientas del curso

| Herramienta | Para qué | Dónde |
|-------------|----------|-------|
| **Google Earth Engine** | Procesar imágenes satelitales en la nube sin descargar datos | code.earthengine.google.com |
| **Google Colab** | Ejecutar notebooks Python sin instalar nada | colab.research.google.com |
| **SNAP** | Visualizar y procesar imágenes Sentinel localmente | step.esa.int |
| **QGIS** | Análisis espacial y cartografía final | qgis.org |

---

## Datos satelitales que usamos

- **Sentinel-2 L2A** (ESA/Copernicus) — resolución 10 m, 13 bandas, revisita 5 días, **gratuito**
- **Sentinel-1 SAR** (ESA/Copernicus) — radar, penetra nubes, **gratuito**
- **Landsat 8/9** (NASA/USGS) — resolución 30 m, archivo desde 1972, **gratuito**

Todos los datos se acceden directamente desde **Google Earth Engine** — no es necesario descargarlos.

---

## Zona de estudio

**Sierra Nevada de Santa Marta (SNSM)** — zona cacaotera y cafetera entre 400 y 1800 m de altitud.
Los análisis cubren el cambio de cobertura café → cacao entre 2015 y 2024.

---

## Referencia docente anterior

Los notebooks de la Dra. Claudia Imbett (AGROSAVIA) están en la carpeta [`referencia/`](referencia/).
Son la base técnica sobre la que se construyeron los laboratorios de este curso.

---

*Repositorio público — Universidad del Magdalena · Maestría en Ingeniería*
