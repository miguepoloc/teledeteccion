// ============================================================================
// SCRIPT GEE 03 — RESOLUCIÓN ESPACIAL Y TEMPORAL EN VIVO
// ============================================================================
// Propósito : Demo en vivo para el docente — Bloque 5 de la Sesión 1
//             (Resolución espacial, espectral, radiométrica y temporal)
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 1 (Viernes 17 de julio de 2026)
// Plataforma: Google Earth Engine Code Editor
// ============================================================================
// CÓMO USARLO EN CLASE:
//   PARTE A — Resolución espacial:
//     3 mapas lado a lado (Sentinel-2 10m / Landsat 30m / MODIS 250m) sobre
//     la MISMA zona cacaotera, con zoom y desplazamiento sincronizados.
//     Acerca el zoom en clase y pide a los estudiantes que digan en qué
//     imagen empiezan a "perderse" los polígonos de las fincas.
//   PARTE B — Resolución temporal:
//     Panel de consola muestra cuántas imágenes de cada satélite hay
//     disponibles en el MISMO rango de fechas (un mes) — la diferencia de
//     revisita se vuelve un número concreto, no un dato abstracto de tabla.
// ============================================================================

// ----------------------------------------------------------------------------
// PARTE A: RESOLUCIÓN ESPACIAL — TRES MAPAS SINCRONIZADOS
// ----------------------------------------------------------------------------

var zona_cacaotera = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);
var fecha_inicio = '2024-01-01';
var fecha_fin = '2024-03-31';

// --- Sentinel-2 (10 m en B2/B3/B4/B8) ---
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_cacaotera)
  .filterDate(fecha_inicio, fecha_fin)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(zona_cacaotera);

// --- Landsat 8/9 (30 m) ---
// Nivel 2 = ya corregido a reflectancia de superficie; hay que reescalar
// los DN con los factores SCALE/OFFSET que trae la colección Landsat Collection 2
var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(zona_cacaotera)
  .filterDate(fecha_inicio, fecha_fin)
  .filter(ee.Filter.lt('CLOUD_COVER', 20))
  .map(function(img) {
    var opticas = img.select('SR_B.').multiply(0.0000275).add(-0.2);
    return img.addBands(opticas, null, true);
  })
  .median()
  .clip(zona_cacaotera);

// --- MODIS (250 m, producto de reflectancia de superficie diaria) ---
var modis = ee.ImageCollection('MODIS/061/MOD09GA')
  .filterBounds(zona_cacaotera)
  .filterDate(fecha_inicio, fecha_fin)
  .median()
  .clip(zona_cacaotera);

// Parámetros de visualización — falso color NIR en los tres, para comparar
// exactamente el mismo tipo de composición a distintas resoluciones
var visSentinel = {bands: ['B8', 'B4', 'B3'], min: 0, max: 4000};
var visLandsat = {bands: ['SR_B5', 'SR_B4', 'SR_B3'], min: 0, max: 0.4};
var visModis = {bands: ['sur_refl_b02', 'sur_refl_b01', 'sur_refl_b04'], min: -100, max: 4000};

var mapaSentinel = ui.Map();
var mapaLandsat = ui.Map();
var mapaModis = ui.Map();

mapaSentinel.add(ui.Label('Sentinel-2 — 10 m', {fontWeight: 'bold', backgroundColor: 'white'}));
mapaLandsat.add(ui.Label('Landsat 8 — 30 m', {fontWeight: 'bold', backgroundColor: 'white'}));
mapaModis.add(ui.Label('MODIS — 250 m', {fontWeight: 'bold', backgroundColor: 'white'}));

mapaSentinel.addLayer(sentinel2, visSentinel, 'Sentinel-2 falso color');
mapaLandsat.addLayer(landsat, visLandsat, 'Landsat 8 falso color');
mapaModis.addLayer(modis, visModis, 'MODIS falso color');

// Centrar antes de enlazar (el Linker sincroniza los tres a partir de aquí)
mapaSentinel.setCenter(-74.0, 10.75, 12);

// Sincronizar centro y zoom de los tres mapas: al mover uno, se mueven todos
ui.Map.Linker([mapaSentinel, mapaLandsat, mapaModis]);

var panelComparativo = ui.Panel({
  widgets: [mapaSentinel, mapaLandsat, mapaModis],
  layout: ui.Panel.Layout.Flow('horizontal'),
  style: {stretch: 'both'}
});

ui.root.clear();
ui.root.add(panelComparativo);

// ----------------------------------------------------------------------------
// PARTE B: RESOLUCIÓN TEMPORAL — CONTAR IMÁGENES DISPONIBLES EN 1 MES
// ----------------------------------------------------------------------------
var mesEjemplo_inicio = '2024-02-01';
var mesEjemplo_fin = '2024-03-01';

var n_sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_cacaotera).filterDate(mesEjemplo_inicio, mesEjemplo_fin).size();

var n_landsat89 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .merge(ee.ImageCollection('LANDSAT/LC09/C02/T1_L2'))
  .filterBounds(zona_cacaotera).filterDate(mesEjemplo_inicio, mesEjemplo_fin).size();

var n_modis = ee.ImageCollection('MODIS/061/MOD09GA')
  .filterBounds(zona_cacaotera).filterDate(mesEjemplo_inicio, mesEjemplo_fin).size();

print('=== RESOLUCIÓN TEMPORAL: imágenes disponibles en 1 mes (feb 2024) sobre la zona cacaotera ===');
print('Sentinel-2 (A+B, revisita teórica 5 días):', n_sentinel2);
print('Landsat 8+9 combinados (revisita teórica 8 días):', n_landsat89);
print('MODIS (revisita teórica 1-2 días):', n_modis);
print('');
print('PREGUNTA PARA LA CLASE:');
print('  Con estos números reales, ¿por qué MODIS "ve" tantas veces más seguido');
print('  pero nunca se usa para monitorear una finca individual? (Bloque 5:');
print('  el trade-off resolución espacial vs. temporal — 250 m es demasiado grueso');
print('  para distinguir una parcela).');

// ----------------------------------------------------------------------------
// PARTE C (BONUS SI HAY TIEMPO): RESOLUCIÓN RADIOMÉTRICA EN UN CLIC
// ----------------------------------------------------------------------------
// Reescalar la misma banda NIR de Sentinel-2 (12 bits, 4096 niveles) a solo
// 8 niveles de gris simula un sensor de resolución radiométrica muy baja.
var nir_original = sentinel2.select('B8');
var nir_8_niveles = nir_original.divide(4096).multiply(8).floor().multiply(4096 / 8);

print('');
print('=== BONUS: RESOLUCIÓN RADIOMÉTRICA ===');
print('Compara "NIR original (12 bits)" vs "NIR degradado (3 bits, 8 niveles)"');
print('en el mapa Sentinel-2 (capas añadidas abajo) — la imagen degradada se ve');
print('"escalonada", perdiendo el detalle fino de reflectancia.');

mapaSentinel.addLayer(nir_original, {min: 0, max: 4000}, 'NIR original (12 bits)', false);
mapaSentinel.addLayer(nir_8_niveles, {min: 0, max: 4000}, 'NIR degradado (3 bits / 8 niveles)', false);

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
