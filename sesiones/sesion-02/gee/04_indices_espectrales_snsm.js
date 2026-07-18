// ============================================================================
// SCRIPT GEE 04 — ÍNDICES ESPECTRALES Y CAMBIO TEMPORAL (SNSM 2018→2024)
// ============================================================================
// Propósito : Calcular NDVI, NDWI, NDRE, SAVI, EVI, NDMI y CLre. Analizar la
//             variabilidad temporal 2018 vs 2024 y exportar capas a Google Drive.
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 2
// Plataforma: Google Earth Engine Code Editor (https://code.earthengine.google.com)
// ============================================================================

// ----------------------------------------------------------------------------
// PASO 1: DEFINIR EL ÁREA DE ESTUDIO Y CARGAR IMÁGENES CON TODOS LOS ÍNDICES
// ----------------------------------------------------------------------------
var zona_snsm = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);
Map.centerObject(zona_snsm, 11);

function cargar_con_indices(fecha_inicio, fecha_fin) {
  var enmascarar_nubes = function(imagen) {
    var scl = imagen.select('SCL');
    var mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
    return imagen.updateMask(mask);
  };

  var img = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(zona_snsm)
    .filterDate(fecha_inicio, fecha_fin)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(enmascarar_nubes)
    .median()
    .clip(zona_snsm);

  // 1. NDVI (Normalized Difference Vegetation Index)
  var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');

  // 2. NDWI (Normalized Difference Water Index) - Gao, 1996
  var ndwi = img.normalizedDifference(['B8', 'B11']).rename('NDWI');

  // 3. NDRE (Normalized Difference Red Edge Index)
  var ndre = img.normalizedDifference(['B8A', 'B5']).rename('NDRE');

  // 4. SAVI (Soil Adjusted Vegetation Index) - Huete, 1988
  var savi = img.expression(
    '1.5 * (NIR - RED) / (NIR + RED + 0.5)',
    {
      'NIR': img.select('B8'),
      'RED': img.select('B4')
    }
  ).rename('SAVI');

  // 5. EVI (Enhanced Vegetation Index)
  var evi = img.expression(
    '2.5 * (NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1)',
    {
      'NIR':  img.select('B8').divide(10000),
      'RED':  img.select('B4').divide(10000),
      'BLUE': img.select('B2').divide(10000)
    }
  ).rename('EVI');

  // 6. NDMI (Normalized Difference Moisture Index)
  var ndmi = img.normalizedDifference(['B8A', 'B11']).rename('NDMI');

  // 7. CLre (Chlorophyll Index Red Edge)
  var clre = img.expression(
    '(REDGE3 / REDGE1) - 1',
    {
      'REDGE3': img.select('B7'),
      'REDGE1': img.select('B5')
    }
  ).rename('CLre');

  return img.addBands([ndvi, ndwi, ndre, savi, evi, ndmi, clre]);
}

// Cargar las imágenes del mismo período (temporada seca) para ambos años
print("Cargando imagen 2024 (ene–mar)...");
var imagen_2024 = cargar_con_indices('2024-01-01', '2024-03-31');

print("Cargando imagen 2018 (ene–mar)...");
var imagen_2018 = cargar_con_indices('2018-01-01', '2018-03-31');

print("✓ Imágenes cargadas. Bandas disponibles:", imagen_2024.bandNames());

// ----------------------------------------------------------------------------
// PASO 2: MAPAS COMPARATIVOS — VISUALIZACIÓN DE ÍNDICES (2024)
// ----------------------------------------------------------------------------
var paleta_vegetacion = ['#d73027', '#f46d43', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];
var paleta_agua       = ['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'];
var paleta_clorofila  = ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'];

Map.addLayer(imagen_2024, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4}, 'Color Natural 2024', false);
Map.addLayer(imagen_2024.select('NDVI'), {min: -0.1, max: 0.9, palette: paleta_vegetacion}, 'NDVI (Vigor)');
Map.addLayer(imagen_2024.select('NDWI'), {min: -0.5, max: 0.5, palette: paleta_agua}, 'NDWI (Agua en vegetación)', false);
Map.addLayer(imagen_2024.select('NDRE'), {min: 0, max: 0.5, palette: paleta_clorofila}, 'NDRE (Clorofila)', false);
Map.addLayer(imagen_2024.select('SAVI'), {min: -0.1, max: 0.7, palette: paleta_vegetacion}, 'SAVI (Suelo ajustado)', false);
Map.addLayer(imagen_2024.select('EVI'), {min: 0, max: 0.8, palette: paleta_vegetacion}, 'EVI (Veg. densa)', false);
Map.addLayer(imagen_2024.select('NDMI'), {min: -0.5, max: 0.5, palette: paleta_agua}, 'NDMI (Humedad dosel)', false);
Map.addLayer(imagen_2024.select('CLre'), {min: 0, max: 3, palette: paleta_clorofila}, 'CLre (Clorofila Red Edge)', false);

// ----------------------------------------------------------------------------
// PASO 3: TABLA COMPARATIVA ESTADÍSTICA (2018 VS 2024)
// ----------------------------------------------------------------------------
// Calcular y comparar estadísticas para cada índice espectral
var indices = ['NDVI', 'NDWI', 'NDRE', 'SAVI', 'EVI', 'NDMI', 'CLre'];

var obtener_stats = function(imagen, año) {
  indices.forEach(function(idx) {
    var stats = imagen.select(idx).reduceRegion({
      reducer: ee.Reducer.mean().combine(ee.Reducer.stdDev(), null, true),
      geometry: zona_snsm,
      scale: 20,
      maxPixels: 1e9
    });
    print('Estadísticas ' + idx + ' (' + año + '):', stats);
  });
};

print("=== CÁLCULO DE ESTADÍSTICAS ZONALES EN CONSOLA ===");
obtener_stats(imagen_2018, '2018');
obtener_stats(imagen_2024, '2024');

// ----------------------------------------------------------------------------
// PASO 4: MAPA DE CAMBIO CONTINUO Y CATEGORIZADO DE NDVI (2018 → 2024)
// ----------------------------------------------------------------------------
var cambio_ndvi = imagen_2024.select('NDVI').subtract(imagen_2018.select('NDVI')).rename('Cambio_NDVI');

// Clasificar el cambio continuo en categorías discretas
var cambio_categorizado = cambio_ndvi
  .where(cambio_ndvi.lt(-0.2), 1)                             // pérdida significativa (>0.2)
  .where(cambio_ndvi.gte(-0.2).and(cambio_ndvi.lt(-0.1)), 2)  // pérdida moderada
  .where(cambio_ndvi.gte(-0.1).and(cambio_ndvi.lt(0.1)), 3)   // sin cambio / estable
  .where(cambio_ndvi.gte(0.1).and(cambio_ndvi.lt(0.2)), 4)    // ganancia moderada
  .where(cambio_ndvi.gte(0.2), 5)                             // ganancia significativa
  .rename('Cambio_Categorizado');

// Capas de cambio
Map.addLayer(imagen_2018.select('NDVI'), {min: -0.1, max: 0.9, palette: paleta_vegetacion}, 'NDVI 2018', false);
Map.addLayer(cambio_ndvi, {min: -0.3, max: 0.3, palette: ['#d73027', '#fc8d59', '#ffffff', '#91bfdb', '#1a9641']}, 'Cambio NDVI 2018→2024');
Map.addLayer(cambio_categorizado, {min: 1, max: 5, palette: ['#d73027', '#fc8d59', '#ffffbf', '#91bfdb', '#1a9641']}, 'Cambio Categorizado NDVI', false);

// ----------------------------------------------------------------------------
// PASO 5: ANÁLISIS DEL CAMBIO NDVI POR FRANJAS ALTITUDINALES (DEM SRTM)
// ----------------------------------------------------------------------------
var dem = ee.Image('USGS/SRTMGL1_003');

var franjas = {
  'Franja Baja (400–700m) — Cacao': dem.gte(400).and(dem.lt(700)),
  'Franja Media (700–1200m) — Transición': dem.gte(700).and(dem.lt(1200)),
  'Franja Alta (1200–1800m) — Café': dem.gte(1200).and(dem.lte(1800))
};

print("=== CAMBIO DE NDVI POR FRANJA ALTITUDINAL ===");
Object.keys(franjas).forEach(function(nombre) {
  var mascara = franjas[nombre];
  var stats_cambio = cambio_ndvi.updateMask(mascara).reduceRegion({
    reducer: ee.Reducer.mean().combine(ee.Reducer.stdDev(), null, true),
    geometry: zona_snsm,
    scale: 20,
    maxPixels: 1e9
  });
  print('Cambio NDVI promedio en ' + nombre, stats_cambio);
});

// ----------------------------------------------------------------------------
// PASO 6: EXPORTAR IMÁGENES A GOOGLE DRIVE (PARA QGIS / SNAP)
// ----------------------------------------------------------------------------
// En GEE JS, se usa el objeto global `Export` directamente
// Al ejecutar el script, ve a la pestaña "Tasks" en el panel superior derecho y haz click en "Run".

Export.image.toDrive({
  image: imagen_2024.select('NDVI'),
  description: 'NDVI_SNSM_2024_ene_mar',
  folder: 'Teledeteccion_Maestria',
  fileNamePrefix: 'NDVI_SNSM_2024',
  region: zona_snsm,
  scale: 10, // Resolución nativa Sentinel-2
  crs: 'EPSG:4326',
  maxPixels: 1e9
});

Export.image.toDrive({
  image: cambio_ndvi,
  description: 'Cambio_NDVI_2018_2024',
  folder: 'Teledeteccion_Maestria',
  fileNamePrefix: 'Cambio_NDVI_2018_vs_2024',
  region: zona_snsm,
  scale: 10,
  crs: 'EPSG:4326',
  maxPixels: 1e9
});

print("✓ Tareas de exportación programadas en la pestaña 'Tasks'.");
