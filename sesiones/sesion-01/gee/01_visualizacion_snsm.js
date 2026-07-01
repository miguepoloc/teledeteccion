// ============================================================================
// SCRIPT GEE 01 — VISUALIZACIÓN DE LA SIERRA NEVADA DE SANTA MARTA
// ============================================================================
// Propósito : Demo de cierre Sesión 1 — mostrar color natural vs. falso color
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 1 (Viernes 17 de julio de 2026)
// Plataforma: Google Earth Engine Code Editor
//             https://code.earthengine.google.com
// ============================================================================
// INSTRUCCIONES PARA EL DOCENTE:
//   1. Pegar este código completo en el Code Editor de GEE
//   2. Presionar el botón "Run" (arriba a la derecha)
//   3. El mapa se centrará automáticamente sobre la SNSM
//   4. En el panel "Layers" (derecha del mapa) pueden activar/desactivar capas
// ============================================================================

// ----------------------------------------------------------------------------
// PASO 1: DEFINIR LAS ZONAS DE ESTUDIO
// ----------------------------------------------------------------------------

// Zona amplia: norte del Magdalena (para el contexto regional)
var norte_magdalena = ee.Geometry.Rectangle([-74.5, 10.2, -73.2, 11.2]);

// Zona cacaotera: entre Ciénaga y Fundación (foco del curso)
var zona_cacaotera = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);

// Sierra Nevada de Santa Marta (polígono aproximado)
var snsm = ee.Geometry.Polygon([
  [[-74.2, 11.0], [-73.6, 11.3], [-73.0, 10.8], [-73.5, 10.4], [-74.1, 10.5]]
]);

// ----------------------------------------------------------------------------
// PASO 2: CARGAR IMAGEN SENTINEL-2 L2A (ya corregida atmosféricamente)
// ----------------------------------------------------------------------------
// Sentinel-2 L2A = Surface Reflectance = los valores representan la
// reflectancia REAL del suelo, no la de la cima de la atmósfera (L1C)
//
// Filtramos por:
//   - Zona: norte del Magdalena
//   - Fecha: temporada seca (enero-marzo 2024) → menos nubes
//   - Nubosidad: menos del 10% de pixels con nube
//   - Función .median(): combina varias imágenes tomando el valor mediano
//     pixel a pixel → elimina nubes residuales

var imagen_2024 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(norte_magdalena)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(norte_magdalena);

// Verificar cuántas imágenes se combinaron
var n_imagenes = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(norte_magdalena)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .size();

print('Número de imágenes Sentinel-2 combinadas:', n_imagenes);
print('Bandas disponibles en la imagen:', imagen_2024.bandNames());

// ----------------------------------------------------------------------------
// PASO 3: CONFIGURAR PARÁMETROS DE VISUALIZACIÓN
// ----------------------------------------------------------------------------
// Los valores de reflectancia en Sentinel-2 L2A van de 0 a 10000
// (multiplicados por 10000 para evitar decimales)
// Una vegetación muy densa puede llegar a ~4000 en NIR
// El suelo desnudo típico está entre 500-2000 en todas las bandas

// Composición COLOR NATURAL (lo que vería el ojo humano)
// Canal Rojo   → Banda B4 (rojo del espectro,   665 nm)
// Canal Verde  → Banda B3 (verde del espectro,  560 nm)
// Canal Azul   → Banda B2 (azul del espectro,   490 nm)
var params_color_natural = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000,
  gamma: 1.4   // aumenta el brillo para mejor visualización
};

// Composición FALSO COLOR ESTÁNDAR (inventada en los años 70, la más usada para vegetación)
// Canal Rojo   → Banda B8 (NIR,   842 nm) — la vegetación refleja mucho en NIR
// Canal Verde  → Banda B4 (rojo,  665 nm)
// Canal Azul   → Banda B3 (verde, 560 nm)
// RESULTADO: la vegetación sana aparece en ROJO BRILLANTE
//            el suelo desnudo en tonos café/beige
//            el agua en azul muy oscuro (casi negro)
var params_falso_color = {
  bands: ['B8', 'B4', 'B3'],
  min: 0,
  max: 4000
};

// Composición SWIR (útil para humedad y distinción de coberturas)
// Canal Rojo   → Banda B11 (SWIR,  1610 nm) — sensible al agua en la vegetación
// Canal Verde  → Banda B8  (NIR,    842 nm)
// Canal Azul   → Banda B4  (rojo,   665 nm)
var params_swir = {
  bands: ['B11', 'B8', 'B4'],
  min: 0,
  max: 4000
};

// ----------------------------------------------------------------------------
// PASO 4: CENTRAR EL MAPA Y AGREGAR LAS CAPAS
// ----------------------------------------------------------------------------
Map.centerObject(zona_cacaotera, 10);

// Capa 1: Color natural (la que ve el ojo humano)
Map.addLayer(
  imagen_2024,
  params_color_natural,
  '1 — Color Natural (B4-B3-B2)',
  true   // visible al cargar
);

// Capa 2: Falso color (vegetación = rojo brillante)
Map.addLayer(
  imagen_2024,
  params_falso_color,
  '2 — Falso Color NIR (B8-B4-B3)',
  false  // apagada al cargar — activar manualmente en Layers
);

// Capa 3: SWIR — humedad y coberturas
Map.addLayer(
  imagen_2024,
  params_swir,
  '3 — Composición SWIR (B11-B8-B4)',
  false
);

// Capa 4: Polígono de la zona cacaotera
Map.addLayer(
  zona_cacaotera,
  {color: 'FF6B00', fillColor: '00000000'},
  '4 — Zona Cacaotera'
);

// Capa 5: Polígono SNSM
Map.addLayer(
  snsm,
  {color: '0000FF', fillColor: '0000FF20'},
  '5 — Sierra Nevada de Santa Marta'
);

// ----------------------------------------------------------------------------
// PASO 5: INFORMACIÓN EN CONSOLA (panel izquierdo de GEE)
// ----------------------------------------------------------------------------
print('=== SESIÓN 1 — VISUALIZACIÓN SNSM ===');
print('Satélite: Sentinel-2 L2A (Surface Reflectance)');
print('Período: Enero–Marzo 2024 (temporada seca)');
print('Resolución espacial: 10 m (bandas B2, B3, B4, B8)');
print('');
print('INSTRUCCIONES:');
print('  → Activa/desactiva capas en el panel "Layers" (derecha del mapa)');
print('  → Compara Color Natural vs. Falso Color NIR');
print('  → En Falso Color: rojo brillante = vegetación densa y sana');
print('  → Usa el cursor sobre el mapa para ver los valores de cada pixel');
print('');
print('PREGUNTA PARA LA CLASE:');
print('  ¿Por qué la vegetación aparece roja en el falso color?');
print('  Respuesta: porque el canal ROJO de la pantalla está asignado');
print('  a la banda NIR, y la vegetación refleja MUCHO en NIR.');

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
