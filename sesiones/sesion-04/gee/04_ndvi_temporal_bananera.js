/**
 * Sesión 4 — Serie Temporal NDVI 2018–2025: Zona Bananera del Norte del Magdalena
 * Teledetección | Maestría en Ingeniería | Universidad del Magdalena
 * Sábado 25 Jul 2026
 *
 * Propósito: Mostrar cómo ha cambiado la salud de la vegetación en la zona
 *            bananera de Ciénaga y Zona Bananera (Magdalena) año a año desde 2018.
 *
 * Hilo conductor: este script conecta con el paper CONCAPAN 2022
 * (Espinosa Valdez, Polo-Castañeda et al.) que analizó dosel de banano con UAV.
 * Aquí vemos el mismo cultivo pero desde el satélite y en el tiempo.
 *
 * Fuente de datos:
 *   - Sentinel-2 L2A SR Harmonized (desde 2017, 10 m)
 *   - Landsat 8/9 C02 T1 L2 (2013–presente, 30 m) — para comparación larga
 *
 * Basado en: code/01_gee_ndvi_series.js (script de investigación del docente)
 * Adaptado para uso pedagógico en Sesión 4.
 */

// ============================================================
// 1. ÁREA DE ESTUDIO — ZONA BANANERA NORTE DEL MAGDALENA
// ============================================================
var zona_bananera = ee.Geometry.Rectangle([-74.40, 10.70, -74.00, 11.05]);
Map.centerObject(zona_bananera, 10);
Map.addLayer(zona_bananera, {color: '#FF6B35'}, 'Zona bananera Norte Magdalena');

// Subzonas para análisis diferencial
var zona_cienaga  = ee.Geometry.Rectangle([-74.25, 10.85, -74.05, 11.00]);  // municipio Ciénaga
var zona_fundacion= ee.Geometry.Rectangle([-74.20, 10.70, -74.00, 10.88]);  // municipio Zona Bananera

// ============================================================
// 2. SENTINEL-2 — SERIE 2018–2025 (resolución 10 m)
// ============================================================
function enmascarar_nubes_s2(imagen) {
  var scl = imagen.select('SCL');
  var mascara = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return imagen.updateMask(mascara);
}

// Calcular NDVI anual con Sentinel-2 (temporada seca: enero-marzo)
var ndvi_s2_anual = ee.ImageCollection.fromImages(
  ee.List.sequence(2018, 2025).map(function(year) {
    var imagen = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterBounds(zona_bananera)
      .filterDate(ee.Date.fromYMD(year, 1, 1), ee.Date.fromYMD(year, 3, 31))
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
      .map(enmascarar_nubes_s2)
      .median()
      .clip(zona_bananera);

    var ndvi = imagen.normalizedDifference(['B8', 'B4']).rename('NDVI');
    return ndvi.set('year', year).set('system:time_start', ee.Date.fromYMD(year, 2, 1));
  })
);

// ============================================================
// 3. LANDSAT 8/9 — SERIE 2018–2025 (resolución 30 m, para comparar)
// ============================================================
function enmascarar_nubes_landsat(imagen) {
  var qa = imagen.select('QA_PIXEL');
  var mascara = qa.bitwiseAnd(parseInt('11111', 2)).eq(0);
  return imagen.updateMask(mascara);
}

var ndvi_l89_anual = ee.ImageCollection.fromImages(
  ee.List.sequence(2018, 2025).map(function(year) {
    var imagen = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .merge(ee.ImageCollection('LANDSAT/LC09/C02/T1_L2'))
      .filterBounds(zona_bananera)
      .filterDate(ee.Date.fromYMD(year, 1, 1), ee.Date.fromYMD(year, 3, 31))
      .map(enmascarar_nubes_landsat)
      .median()
      .clip(zona_bananera);

    var ndvi = imagen.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
    return ndvi.set('year', year).set('system:time_start', ee.Date.fromYMD(year, 2, 1));
  })
);

// ============================================================
// 4. EXTRAER ESTADÍSTICAS ANUALES POR SUBZONA
// ============================================================
var estadisticas = ndvi_s2_anual.map(function(imagen) {
  var year = imagen.get('year');

  var stats_total = imagen.reduceRegion({
    reducer: ee.Reducer.mean().combine({reducer2: ee.Reducer.stdDev(), sharedInputs: true}),
    geometry: zona_bananera,
    scale: 10,
    maxPixels: 1e9
  });

  var stats_cienaga = imagen.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: zona_cienaga,
    scale: 10,
    maxPixels: 1e9
  });

  var stats_fundacion = imagen.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: zona_fundacion,
    scale: 10,
    maxPixels: 1e9
  });

  return ee.Feature(null, {
    'year':              year,
    'NDVI_total_media':  stats_total.get('NDVI_mean'),
    'NDVI_total_std':    stats_total.get('NDVI_stdDev'),
    'NDVI_cienaga':      stats_cienaga.get('NDVI'),
    'NDVI_fundacion':    stats_fundacion.get('NDVI'),
  });
});

print('=== Serie temporal NDVI Sentinel-2 — Zona Bananera ===');
print('(Temporada seca: enero–marzo de cada año)');
print(estadisticas);

// ============================================================
// 5. GRÁFICO DE SERIE TEMPORAL EN LA CONSOLA DE GEE
// ============================================================
var grafico_s2 = ui.Chart.feature.byFeature({
  features: estadisticas,
  xProperty: 'year',
  yProperties: ['NDVI_total_media', 'NDVI_cienaga', 'NDVI_fundacion']
}).setChartType('LineChart')
  .setOptions({
    title: 'NDVI anual — Zona Bananera Norte del Magdalena (Sentinel-2, 10 m)',
    hAxis: {title: 'Año', format: '####'},
    vAxis: {title: 'NDVI medio (Ene–Mar)', minValue: 0.3, maxValue: 0.9},
    series: {
      0: {color: '#27ae60', lineWidth: 3, label: 'Zona total'},
      1: {color: '#2980b9', lineWidth: 2, lineDashStyle: [6,3], label: 'Municipio Ciénaga'},
      2: {color: '#e74c3c', lineWidth: 2, lineDashStyle: [6,3], label: 'Municipio Zona Bananera'}
    },
    legend: {position: 'bottom'},
    pointSize: 5
  });
print(grafico_s2);

// ============================================================
// 6. VISUALIZAR NDVI 2018 vs 2024 EN EL MAPA
// ============================================================
var ndvi_2018 = ee.Image(ndvi_s2_anual.filter(ee.Filter.eq('year', 2018)).first());
var ndvi_2024 = ee.Image(ndvi_s2_anual.filter(ee.Filter.eq('year', 2024)).first());

var paleta_ndvi = {
  min: 0.2, max: 0.85,
  palette: ['#d73027','#f46d43','#fdae61','#ffffbf','#a6d96a','#66bd63','#1a9850']
};

Map.addLayer(ndvi_2018, paleta_ndvi, 'NDVI 2018 (S2)', false);
Map.addLayer(ndvi_2024, paleta_ndvi, 'NDVI 2024 (S2)');

// ============================================================
// 7. MAPA DE CAMBIO 2018 → 2024
// ============================================================
var cambio = ndvi_2024.subtract(ndvi_2018).rename('Cambio_NDVI');

var paleta_cambio = {
  min: -0.3, max: 0.3,
  palette: ['#8c510a','#d8b365','#f6e8c3','#f5f5f5','#c7eae5','#5ab4ac','#01665e']
};
Map.addLayer(cambio, paleta_cambio, 'Cambio NDVI 2018→2024');

// Categorizar el cambio
var cambio_cat = cambio
  .where(cambio.lt(-0.15), 1)   // pérdida severa
  .where(cambio.gte(-0.15).and(cambio.lt(-0.05)), 2)  // pérdida leve
  .where(cambio.gte(-0.05).and(cambio.lt(0.05)), 3)   // sin cambio
  .where(cambio.gte(0.05).and(cambio.lt(0.15)), 4)    // ganancia leve
  .where(cambio.gte(0.15), 5)   // ganancia severa
  .rename('Categoria_cambio');

Map.addLayer(cambio_cat, {
  min: 1, max: 5,
  palette: ['#d73027','#fc8d59','#ffffbf','#91bfdb','#4575b4']
}, 'Categorías de cambio', false);

print('');
print('Leyenda cambio NDVI:');
print('Clase 1 = Pérdida severa (Δ < -0.15) → posible deforestación o muerte');
print('Clase 2 = Pérdida leve (-0.15 a -0.05) → estrés hídrico o cosecha');
print('Clase 3 = Sin cambio significativo (-0.05 a 0.05)');
print('Clase 4 = Ganancia leve (0.05 a 0.15) → recuperación');
print('Clase 5 = Ganancia severa (> 0.15) → nueva plantación o rebrote');

// ============================================================
// 8. SERIE MENSUAL 2024 — variación estacional en un año
// ============================================================
var serie_mensual_2024 = ui.Chart.image.series({
  imageCollection: ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(zona_bananera)
    .filterDate('2024-01-01', '2024-12-31')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 25))
    .map(enmascarar_nubes_s2)
    .map(function(img) {
      return img.normalizedDifference(['B8', 'B4']).rename('NDVI');
    }),
  region: zona_bananera,
  reducer: ee.Reducer.mean(),
  scale: 10,
  xProperty: 'system:time_start'
}).setChartType('LineChart')
  .setOptions({
    title: 'NDVI mensual 2024 — Zona Bananera (variación estacional)',
    hAxis: {title: 'Fecha'},
    vAxis: {title: 'NDVI medio'},
    lineWidth: 2,
    pointSize: 4,
    colors: ['#27ae60']
  });
print(serie_mensual_2024);

// ============================================================
// 9. EXPORTAR SERIE A CSV
// ============================================================
Export.table.toDrive({
  collection: estadisticas,
  description: 'NDVI_Serie_2018_2025_Bananera_Magdalena',
  folder: 'Teledeteccion_S4',
  fileFormat: 'CSV'
});

print('');
print('Para exportar el CSV: Tasks → Start');
print('Archivo: NDVI_Serie_2018_2025_Bananera_Magdalena.csv');
print('Columnas: year, NDVI_total_media, NDVI_total_std, NDVI_cienaga, NDVI_fundacion');
