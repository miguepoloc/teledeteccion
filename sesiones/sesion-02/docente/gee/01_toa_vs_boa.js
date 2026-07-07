// ============================================================================
// SCRIPT GEE DOCENTE 01 — TOA (L1C) VS. BOA (L2A)
// ============================================================================
// Propósito : Demo en vivo para el docente — Bloque 2 de la Sesión 2
//             (Preprocesamiento — corrección atmosférica)
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 2 (Sábado 18 de julio de 2026)
// Plataforma: Google Earth Engine Code Editor
// ============================================================================
// CÓMO USARLO EN CLASE (Slide 12 de prompts/02.md):
//   1. Ejecutar el script (Run)
//   2. Mostrar primero "L1C Color Natural" — señalar la banda azul velada
//   3. Alternar con "L2A Color Natural" — mismo punto, mucho más nítido
//   4. Activar "NDVI L1C" y "NDVI L2A" — usar el Inspector para comparar el
//      valor exacto de NDVI en el mismo punto de vegetación
//   5. Cerrar con la tabla de diferencia NDVI impresa en consola
// ============================================================================

var zona_estudio = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);
Map.centerObject(zona_estudio, 12);

// ----------------------------------------------------------------------------
// PASO 1: CARGAR L1C (SIN corrección atmosférica) Y L2A (CON corrección)
// ----------------------------------------------------------------------------
// COPERNICUS/S2_HARMONIZED       = L1C, Top of Atmosphere (TOA)
// COPERNICUS/S2_SR_HARMONIZED    = L2A, Surface Reflectance (BOA)
var imagen_l1c = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(zona_estudio)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(zona_estudio);

var imagen_l2a = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_estudio)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(zona_estudio);

// ----------------------------------------------------------------------------
// PASO 2: COLOR NATURAL — COMPARAR LA BANDA AZUL
// ----------------------------------------------------------------------------
var visColorNatural = {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4};

Map.addLayer(imagen_l1c, visColorNatural, '1 — L1C Color Natural (SIN corregir, TOA)', true);
Map.addLayer(imagen_l2a, visColorNatural, '2 — L2A Color Natural (corregida, BOA)', false);

// ----------------------------------------------------------------------------
// PASO 3: CALCULAR NDVI EN AMBAS Y COMPARAR
// ----------------------------------------------------------------------------
var ndvi_l1c = imagen_l1c.normalizedDifference(['B8', 'B4']).rename('NDVI_L1C');
var ndvi_l2a = imagen_l2a.normalizedDifference(['B8', 'B4']).rename('NDVI_L2A');

var paletaNdvi = ['#d73027', '#f46d43', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];

Map.addLayer(ndvi_l1c, {min: -0.1, max: 0.9, palette: paletaNdvi}, '3 — NDVI sobre L1C', false);
Map.addLayer(ndvi_l2a, {min: -0.1, max: 0.9, palette: paletaNdvi}, '4 — NDVI sobre L2A', false);

var diferencia_ndvi = ndvi_l2a.subtract(ndvi_l1c).rename('Diferencia_NDVI');
Map.addLayer(diferencia_ndvi, {min: -0.2, max: 0.2, palette: ['#d73027', '#ffffff', '#1a9641']},
  '5 — Diferencia NDVI (L2A menos L1C)', false);

// ----------------------------------------------------------------------------
// PASO 4: ESTADÍSTICAS SOBRE UN PUNTO DE VEGETACIÓN Y OTRO DE AGUA
// ----------------------------------------------------------------------------
var punto_vegetacion = ee.Geometry.Point([-74.02, 10.75]);
var punto_agua = ee.Geometry.Point([-74.15, 10.85]);

function compararPunto(nombre, punto) {
  var valores = ee.Dictionary({
    B2_L1C: imagen_l1c.select('B2').reduceRegion(ee.Reducer.mean(), punto.buffer(15), 10).get('B2'),
    B2_L2A: imagen_l2a.select('B2').reduceRegion(ee.Reducer.mean(), punto.buffer(15), 10).get('B2'),
    NDVI_L1C: ndvi_l1c.reduceRegion(ee.Reducer.mean(), punto.buffer(15), 10).get('NDVI_L1C'),
    NDVI_L2A: ndvi_l2a.reduceRegion(ee.Reducer.mean(), punto.buffer(15), 10).get('NDVI_L2A')
  });
  print('=== ' + nombre + ' ===', valores);
}

compararPunto('Punto de vegetación (cacaotal)', punto_vegetacion);
compararPunto('Punto de agua (Ciénaga Grande)', punto_agua);

print('');
print('PREGUNTA PARA LA CLASE:');
print('  ¿Por qué el valor de B2 (azul) es más alto en L1C que en L2A?');
print('  Respuesta: la dispersión de Rayleigh de la atmósfera añade brillo');
print('  "extra" en longitudes de onda cortas (azul) que el L2A ya elimina.');
print('');
print('  ¿Por qué el NDVI de L1C suele ser más bajo que el de L2A en el');
print('  mismo punto de vegetación?');
print('  Respuesta: la atmósfera reduce el contraste entre rojo y NIR —');
print('  "aplana" la diferencia que el NDVI necesita para funcionar bien.');
print('');
print('REGLA DEL CURSO: SIEMPRE usar L2A (COPERNICUS/S2_SR_HARMONIZED)');
print('para cualquier análisis cuantitativo o comparación temporal.');

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
