// ============================================================================
// SCRIPT GEE 04 — ÓPTICO (SENTINEL-2) VS. RADAR (SENTINEL-1 SAR)
// ============================================================================
// Propósito : Demo en vivo para el docente — Bloque 6 de la Sesión 1
//             (Plataformas satelitales: sensores pasivos vs. activos)
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 1 (Viernes 17 de julio de 2026)
// Plataforma: Google Earth Engine Code Editor
// ============================================================================
// CÓMO USARLO EN CLASE:
//   Se busca deliberadamente un período de TEMPORADA DE LLUVIAS (alta nubosidad
//   en el norte del Magdalena) para que la imagen óptica Sentinel-2 salga
//   cubierta de nubes, mientras Sentinel-1 (radar) entrega la misma zona limpia,
//   el mismo mes. Esto hace tangible la frase del Bloque 6:
//   "Sentinel-2 pierde esas imágenes. Sentinel-1 las captura igual."
//
//   1. Ejecutar el script (Run)
//   2. Mostrar primero la capa "Sentinel-2 (óptico, temporada lluviosa)"
//      → se ve blanca/nublada, casi inservible
//   3. Activar la capa "Sentinel-1 (SAR, misma zona y mes)"
//      → superficie completamente visible, sin nubes
//   4. Activar "Sentinel-2 (óptico, temporada seca)" como contraste — muestra
//      que en época seca sí funciona, para no dar la idea de que el óptico
//      "nunca sirve"
// ============================================================================

var norte_magdalena = ee.Geometry.Rectangle([-74.5, 10.2, -73.2, 11.2]);

// ----------------------------------------------------------------------------
// PASO 1: SENTINEL-2 EN TEMPORADA DE LLUVIAS (SIN FILTRO DE NUBES)
// ----------------------------------------------------------------------------
// A propósito NO filtramos por nubosidad aquí — queremos que se vea el problema real
var coleccion_s2_lluvias = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(norte_magdalena)
  .filterDate('2024-10-01', '2024-10-31');

// .mosaic() en vez de .first(): un solo tile Sentinel-2 (~110x110 km) no
// alcanza a cubrir todo norte_magdalena (~130x110 km) -- con .first() solo
// se veía el pedacito de un tile. .mosaic() combina TODAS las escenas de
// octubre-2024 que caen en la zona en un mosaico que sí cubre el rectángulo
// completo, sin enmascarar nubes (a propósito).
var s2_lluvias = coleccion_s2_lluvias.mosaic().clip(norte_magdalena);

var n_imagenes_lluvias = coleccion_s2_lluvias.size();
var pct_nubes_promedio = coleccion_s2_lluvias.aggregate_mean('CLOUDY_PIXEL_PERCENTAGE');

// ----------------------------------------------------------------------------
// PASO 2: SENTINEL-2 EN TEMPORADA SECA (PARA CONTRASTE)
// ----------------------------------------------------------------------------
var s2_seca = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(norte_magdalena)
  .filterDate('2024-02-01', '2024-02-28')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(norte_magdalena);

// ----------------------------------------------------------------------------
// PASO 3: SENTINEL-1 SAR — MISMA ZONA, MISMO MES LLUVIOSO
// ----------------------------------------------------------------------------
// Banda C, polarización VV (vertical-vertical) — buena para distinguir
// agua (backscatter bajo, se ve oscura) de vegetación/suelo (backscatter alto)
var s1_lluvias = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(norte_magdalena)
  .filterDate('2024-10-01', '2024-10-31')
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .median()
  .clip(norte_magdalena);

// ----------------------------------------------------------------------------
// PASO 4: VISUALIZACIÓN
// ----------------------------------------------------------------------------
Map.centerObject(norte_magdalena, 10);

Map.addLayer(s2_lluvias, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4},
  '1 — Sentinel-2 óptico (temporada LLUVIOSA, oct-2024)', true);

Map.addLayer(s1_lluvias, {bands: ['VV'], min: -20, max: 0},
  '2 — Sentinel-1 SAR (misma zona y mes, oct-2024)', false);

Map.addLayer(s2_seca, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4},
  '3 — Sentinel-2 óptico (temporada SECA, feb-2024, contraste)', false);

// ----------------------------------------------------------------------------
// PASO 5: GUION PARA EL DOCENTE
// ----------------------------------------------------------------------------
print('=== ÓPTICO VS. RADAR EN TEMPORADA DE LLUVIAS ===');
print('Imágenes Sentinel-2 combinadas en el mosaico de octubre-2024:', n_imagenes_lluvias);
print('% de nubes promedio entre esas imágenes:', pct_nubes_promedio);
print('');
print('INSTRUCCIONES EN CLASE:');
print('  1) Muestra la capa 1 (Sentinel-2 lluvias) — nubes cubren gran parte');
print('  2) Apaga la 1, enciende la capa 2 (Sentinel-1 SAR) — superficie visible');
print('  3) Enciende la capa 3 (Sentinel-2 seca) — así sí funciona el óptico');
print('');
print('PREGUNTA PARA LA CLASE:');
print('  ¿Por qué Sentinel-1 "ve" a través de las nubes y Sentinel-2 no?');
print('  Respuesta (Bloque 2 + Bloque 6): la onda de radar (5.6 cm) es miles de');
print('  veces más grande que las gotas de nube (5-100 μm) y las atraviesa;');
print('  la luz visible es del tamaño de esas gotas y rebota en ellas.');
print('');
print('  Dato regional: el Caribe colombiano tiene 60-80% de días nublados en');
print('  temporada de lluvias — por eso el Artículo 3 de investigación del');
print('  docente fusiona Sentinel-1 y Sentinel-2 en vez de usar solo uno.');

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
