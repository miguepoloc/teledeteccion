/**
 * Sesión 3 — Clasificación Supervisada con Random Forest en GEE
 * Teledetección | Maestría en Ingeniería | Universidad del Magdalena
 * Viernes 24 Jul 2026
 *
 * Área de estudio: Norte del Magdalena — zona bananera y cacaotera
 * Imagen: Sentinel-2 L2A SR Harmonized (Ene–Mar 2024)
 * Clasificador: Random Forest (100 árboles)
 * Clases: Agua, Suelo desnudo, Pastizal, Cultivos, Bosque
 *
 * USO: pega este script en code.earthengine.google.com y haz clic en Run.
 *      Puedes ajustar los ROIs en el mapa dibujando polígonos.
 */

// ============================================================
// 1. ÁREA DE ESTUDIO
// ============================================================
var zona_estudio = ee.Geometry.Rectangle([-74.40, 10.50, -73.90, 11.10]);
Map.centerObject(zona_estudio, 10);

// ============================================================
// 2. IMAGEN SENTINEL-2 CON ÍNDICES ESPECTRALES
// ============================================================
function enmascarar_nubes(imagen) {
  var scl = imagen.select('SCL');
  var mascara = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return imagen.updateMask(mascara);
}

function agregar_indices(imagen) {
  var ndvi = imagen.normalizedDifference(['B8',  'B4' ]).rename('NDVI');
  var ndre = imagen.normalizedDifference(['B8A', 'B5' ]).rename('NDRE');
  var ndmi = imagen.normalizedDifference(['B8A', 'B11']).rename('NDMI');
  var ndwi = imagen.normalizedDifference(['B3',  'B8' ]).rename('NDWI');
  var evi  = imagen.expression(
    '2.5*(NIR-RED)/(NIR+6*RED-7.5*BLUE+1)', {
      'NIR':  imagen.select('B8').divide(10000),
      'RED':  imagen.select('B4').divide(10000),
      'BLUE': imagen.select('B2').divide(10000)
    }
  ).rename('EVI');
  return imagen.addBands([ndvi, ndre, ndmi, ndwi, evi]);
}

var imagen_s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_estudio)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15))
  .map(enmascarar_nubes)
  .map(agregar_indices)
  .median()
  .clip(zona_estudio);

var bandas_clasificacion = ['B2','B3','B4','B5','B8','B8A','B11','NDVI','NDRE','NDMI','NDWI','EVI'];

// Visualizar imagen
Map.addLayer(imagen_s2, {bands: ['B4','B3','B2'], min: 0, max: 3000, gamma: 1.4}, 'Color Natural');
Map.addLayer(imagen_s2, {bands: ['B8','B4','B3'], min: 0, max: 5000, gamma: 1.4}, 'Falso Color NIR', false);

// ============================================================
// 3. REGIONES DE INTERÉS (ROIs)
//
// INSTRUCCIÓN PARA EL ESTUDIANTE:
// En lugar de usar estos polígonos predefinidos, puedes dibujar
// tus propios ROIs en el mapa con las herramientas de geometría
// del panel izquierdo. Nombra cada geometría con la propiedad
// {clase: 0} para agua, {clase: 1} para suelo, etc.
// ============================================================
var rois_agua = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[[-74.23,10.95],[-74.18,10.95],[-74.18,10.98],[-74.23,10.98]]]), {clase: 0}),
  ee.Feature(ee.Geometry.Polygon([[[-74.35,10.88],[-74.30,10.88],[-74.30,10.92],[-74.35,10.92]]]), {clase: 0}),
]);

var rois_suelo = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[[-74.10,10.55],[-74.05,10.55],[-74.05,10.58],[-74.10,10.58]]]), {clase: 1}),
  ee.Feature(ee.Geometry.Polygon([[[-74.20,10.62],[-74.15,10.62],[-74.15,10.65],[-74.20,10.65]]]), {clase: 1}),
]);

var rois_pastizal = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[[-74.15,10.70],[-74.10,10.70],[-74.10,10.73],[-74.15,10.73]]]), {clase: 2}),
  ee.Feature(ee.Geometry.Polygon([[[-74.28,10.75],[-74.22,10.75],[-74.22,10.78],[-74.28,10.78]]]), {clase: 2}),
]);

var rois_cultivos = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[[-74.32,10.85],[-74.26,10.85],[-74.26,10.90],[-74.32,10.90]]]), {clase: 3}),
  ee.Feature(ee.Geometry.Polygon([[[-74.05,10.60],[-73.98,10.60],[-73.98,10.65],[-74.05,10.65]]]), {clase: 3}),
  ee.Feature(ee.Geometry.Polygon([[[-74.25,10.82],[-74.20,10.82],[-74.20,10.87],[-74.25,10.87]]]), {clase: 3}),
]);

var rois_bosque = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Polygon([[[-73.95,10.80],[-73.88,10.80],[-73.88,10.85],[-73.95,10.85]]]), {clase: 4}),
  ee.Feature(ee.Geometry.Polygon([[[-74.00,10.90],[-73.93,10.90],[-73.93,10.95],[-74.00,10.95]]]), {clase: 4}),
]);

var todos_rois = rois_agua
  .merge(rois_suelo)
  .merge(rois_pastizal)
  .merge(rois_cultivos)
  .merge(rois_bosque);

// Visualizar ROIs
Map.addLayer(rois_agua,     {color: '#2196F3'}, 'ROI Agua');
Map.addLayer(rois_suelo,    {color: '#FF9800'}, 'ROI Suelo');
Map.addLayer(rois_pastizal, {color: '#CDDC39'}, 'ROI Pastizal');
Map.addLayer(rois_cultivos, {color: '#4CAF50'}, 'ROI Cultivos');
Map.addLayer(rois_bosque,   {color: '#1B5E20'}, 'ROI Bosque');

// ============================================================
// 4. MUESTREO Y ENTRENAMIENTO
// ============================================================
var muestras = imagen_s2
  .select(bandas_clasificacion)
  .sampleRegions({
    collection: todos_rois,
    properties: ['clase'],
    scale: 10,
    tileScale: 2
  });

// Dividir 70/30
var muestras_split = muestras.randomColumn({seed: 42});
var entrenamiento  = muestras_split.filter(ee.Filter.lt('random', 0.7));
var validacion     = muestras_split.filter(ee.Filter.gte('random', 0.7));

// Entrenar Random Forest
var clasificador = ee.Classifier.smileRandomForest({
  numberOfTrees: 100,
  seed: 42
}).train({
  features: entrenamiento,
  classProperty: 'clase',
  inputProperties: bandas_clasificacion
});

// ============================================================
// 5. CLASIFICAR Y VISUALIZAR
// ============================================================
var mapa_clasificado = imagen_s2
  .select(bandas_clasificacion)
  .classify(clasificador);

var paleta_clases = ['#2196F3', '#FF9800', '#CDDC39', '#4CAF50', '#1B5E20'];
Map.addLayer(mapa_clasificado, {min: 0, max: 4, palette: paleta_clases}, 'Clasificación RF');

// Leyenda
var leyenda = ui.Panel({style: {position: 'bottom-left', padding: '8px'}});
leyenda.add(ui.Label('Cobertura del suelo', {fontWeight: 'bold', fontSize: '14px'}));

var clases_leyenda = ['Agua', 'Suelo desnudo', 'Pastizal', 'Cultivos (banano/cacao)', 'Bosque'];
paleta_clases.forEach(function(color, i) {
  var fila = ui.Panel({layout: ui.Panel.Layout.flow('horizontal')});
  fila.add(ui.Label({style: {backgroundColor: color, padding: '8px', margin: '0 6px 0 0'}}));
  fila.add(ui.Label(clases_leyenda[i], {margin: '0 0 4px 0'}));
  leyenda.add(fila);
});
Map.add(leyenda);

// ============================================================
// 6. VALIDACIÓN
// ============================================================
var validacion_clasificada = validacion.classify(clasificador);
var matriz = validacion_clasificada.errorMatrix('clase', 'classification');

print('=== Validación del clasificador ===');
print('Matriz de confusión:', matriz);
print('Precisión global (OA):', matriz.accuracy());
print('Índice Kappa:', matriz.kappa());
print('Precisión por clase (producer):', matriz.producersAccuracy());
print('Precisión por clase (user):', matriz.consumersAccuracy());

// ============================================================
// 7. IMPORTANCIA DE VARIABLES
// ============================================================
print('=== Importancia de variables ===');
print(clasificador.explain());

// ============================================================
// 8. EXPORTAR
// ============================================================
Export.image.toDrive({
  image: mapa_clasificado.toByte(),
  description: 'clasificacion_rf_norte_magdalena_2024',
  folder: 'Teledeteccion_S3',
  fileNamePrefix: 'clasificacion_rf_norte_magdalena_2024',
  region: zona_estudio,
  scale: 10,
  maxPixels: 1e9,
  fileFormat: 'GeoTIFF'
});

print('');
print('Para exportar: haz clic en Run → abre la pestaña Tasks → Start');
