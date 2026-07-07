// ============================================================================
// SCRIPT GEE DOCENTE 02 — CON NUBES VS. SIN NUBES, Y ENMASCARAMIENTO SCL
// ============================================================================
// Propósito : Demo en vivo para el docente — Bloques 1 y 2 de la Sesión 2
//             (El problema de las nubes en el Caribe + cloud masking con SCL)
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 2 (Sábado 18 de julio de 2026)
// Plataforma: Google Earth Engine Code Editor
// ============================================================================
// CÓMO USARLO EN CLASE:
//   1. Ejecutar el script (Run)
//   2. Mostrar "1 — Color Natural SECA (ene-mar)" — imagen limpia de referencia
//   3. Alternar a "2 — Color Natural HÚMEDA (oct-nov)" — nubes cubriendo la escena
//   4. Activar "3 — SCL (clasificación de escena)" — señalar visualmente qué
//      colores corresponden a nube, sombra de nube, cirros
//   5. Activar "4 — NDVI SIN enmascarar" — mostrar que las nubes dan NDVI
//      falso de 0.2-0.4, fácil de confundir con vegetación escasa
//   6. Activar "5 — NDVI enmascarado (SCL)" — comparar cuánta área queda
//      válida después de quitar nubes/sombras/cirros
// ============================================================================

var zona_amplia = ee.Geometry.Rectangle([-74.5, 10.2, -73.2, 11.2]);
Map.centerObject(zona_amplia, 10);

// ----------------------------------------------------------------------------
// PASO 1: IMAGEN SECA (referencia limpia) E IMAGEN HÚMEDA (con nubes, sin filtrar)
// ----------------------------------------------------------------------------
var imagen_seca = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_amplia)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(zona_amplia);

// A propósito NO filtramos por nubosidad — queremos ver el problema real
var coleccion_humeda = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_amplia)
  .filterDate('2024-10-01', '2024-11-30');

// .mosaic() en vez de .first(): un solo tile Sentinel-2 (~110x110 km) no
// alcanza a cubrir todo zona_amplia (~130x110 km) -- con .first() solo se
// veía el pedacito de un tile. .mosaic() combina TODAS las escenas de
// oct-nov 2024 que caen en la zona en un mosaico que sí cubre el rectángulo
// completo, sin enmascarar nubes.
var imagen_humeda = coleccion_humeda.mosaic().clip(zona_amplia);
var n_imagenes_humeda = coleccion_humeda.size();
var pct_nubes_promedio = coleccion_humeda.aggregate_mean('CLOUDY_PIXEL_PERCENTAGE');

Map.addLayer(imagen_seca, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4},
  '1 — Color Natural SECA (ene-mar, referencia limpia)', true);
Map.addLayer(imagen_humeda, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4},
  '2 — Color Natural HÚMEDA (oct-nov, con nubes)', false);

// ----------------------------------------------------------------------------
// PASO 2: VISUALIZAR LA BANDA SCL (Scene Classification Layer)
// ----------------------------------------------------------------------------
// Paleta oficial aproximada de la SCL (0-11):
// 0 No data | 1 Saturado/defectuoso | 2 Sombra oscura | 3 Sombra de nube
// 4 Vegetación | 5 Suelo desnudo | 6 Agua | 7 Nube baja probabilidad
// 8 Nube media probabilidad | 9 Nube alta probabilidad | 10 Cirros | 11 Nieve
var paletaSCL = [
  '#000000', '#ff0000', '#2f2f2f', '#643200',
  '#00a000', '#ffff00', '#0000ff', '#bfbfbf',
  '#808080', '#ffffff', '#66ccff', '#ff66ff'
];

Map.addLayer(imagen_humeda.select('SCL'), {min: 0, max: 11, palette: paletaSCL},
  '3 — SCL (clasificación de escena, imagen húmeda)', false);

// ----------------------------------------------------------------------------
// PASO 3: NDVI SIN ENMASCARAR VS. ENMASCARADO
// ----------------------------------------------------------------------------
var ndvi_sin_mascara = imagen_humeda.normalizedDifference(['B8', 'B4']).rename('NDVI_sin_mascara');

function enmascararNubes(imagen) {
  var scl = imagen.select('SCL');
  // Excluir: 3 = sombra de nube, 8 = nube media, 9 = nube alta, 10 = cirros
  var mascara = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return imagen.updateMask(mascara);
}

var imagen_humeda_enmascarada = enmascararNubes(imagen_humeda);
var ndvi_enmascarado = imagen_humeda_enmascarada.normalizedDifference(['B8', 'B4']).rename('NDVI_enmascarado');

var paletaNdvi = ['#d73027', '#f46d43', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];

Map.addLayer(ndvi_sin_mascara, {min: -0.1, max: 0.9, palette: paletaNdvi},
  '4 — NDVI SIN enmascarar (incluye nubes)', false);
Map.addLayer(ndvi_enmascarado, {min: -0.1, max: 0.9, palette: paletaNdvi},
  '5 — NDVI enmascarado con SCL (nubes fuera)', false);

// ----------------------------------------------------------------------------
// PASO 4: CUANTIFICAR EL PROBLEMA — % DE ÁREA VÁLIDA
// ----------------------------------------------------------------------------
var area_total = zona_amplia.area();

var area_valida = ee.Image.pixelArea()
  .updateMask(imagen_humeda_enmascarada.select('B4').mask())
  .reduceRegion({reducer: ee.Reducer.sum(), geometry: zona_amplia, scale: 100, maxPixels: 1e9})
  .get('area');

print('=== IMPACTO REAL DE LAS NUBES (imagen húmeda, oct-nov 2024) ===');
print('Imágenes Sentinel-2 combinadas en el mosaico:', n_imagenes_humeda);
print('% de nubes promedio entre esas imágenes:', pct_nubes_promedio);
print('Área total de la zona (m²):', area_total);
print('Área válida después de enmascarar SCL (m²):', area_valida);
print('');
print('PREGUNTA PARA LA CLASE:');
print('  Un pixel de nube en la capa 4 (NDVI sin enmascarar) puede mostrar');
print('  valores de 0.2-0.4 — el mismo rango que "vegetación escasa".');
print('  Sin la máscara SCL, ¿cómo distinguirías un pixel de nube real de');
print('  un pixel de pastizal seco? Respuesta: no podrías, por eso el');
print('  enmascaramiento con SCL es obligatorio antes de calcular índices.');
print('');
print('Dato regional: el Caribe colombiano tiene 60-80% de días nublados');
print('en temporada de lluvias (sept-nov) — de 18 pasajes posibles de');
print('Sentinel-2 en 90 días, 12-13 pueden ser inutilizables sin este paso.');

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
