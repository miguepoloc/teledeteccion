// ============================================================================
// SCRIPT GEE DOCENTE 03 — CLASIFICACIÓN NO SUPERVISADA (K-MEANS)
// ============================================================================
// Propósito : Demo en vivo para el docente — Bloque 5 de la Sesión 2
//             ("el docente mostrará el resultado de una clasificación ya
//             completada" — prompts/05.md, Slide 17)
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 2 (Sábado 18 de julio de 2026)
// Plataforma: Google Earth Engine Code Editor
// ============================================================================
// IMPORTANTE — QUÉ ES ESTO Y QUÉ NO ES:
//   Esta es una clasificación NO SUPERVISADA (K-means / clusterer), generada
//   automáticamente SIN datos de entrenamiento reales (ROIs). Sirve como
//   "resultado ya hecho" para mostrar CÓMO SE VE un mapa clasificado y para
//   discutir el concepto general de clasificación.
//   NO es la clasificación supervisada validada del Artículo 1 (esa usa
//   Random Forest con ROIs reales en campo, OA≥85%, Kappa≥0.80) — esa versión
//   la construirán los estudiantes en la Sesión 3 con sus propios ROIs.
//   Sé explícito con el grupo sobre esta diferencia al mostrar la capa.
// ============================================================================
// CÓMO USARLO EN CLASE:
//   1. Ejecutar el script (Run)
//   2. Mostrar "1 — Falso Color" como referencia visual
//   3. Activar "2 — Clasificación no supervisada (5 clusters)"
//   4. Explicar que cada color = un grupo estadístico de pixels con
//      reflectancia parecida (NO una clase validada en campo)
//   5. Comparar visualmente con la composición falso color: ¿los clusters
//      coinciden aproximadamente con zonas de vegetación densa, agua,
//      suelo desnudo, etc.?
// ============================================================================

var zona_estudio = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);
Map.centerObject(zona_estudio, 12);

// ----------------------------------------------------------------------------
// PASO 1: IMAGEN BASE CON ÍNDICES COMO BANDAS DE ENTRADA
// ----------------------------------------------------------------------------
function enmascararNubes(imagen) {
  var scl = imagen.select('SCL');
  var mascara = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return imagen.updateMask(mascara);
}

var imagen = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_estudio)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .map(enmascararNubes)
  .median()
  .clip(zona_estudio);

var ndvi = imagen.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndwi = imagen.normalizedDifference(['B8', 'B11']).rename('NDWI');

// Bandas de entrada al clasificador: reflectancia + índices
// (más información por pixel = clusters más coherentes espectralmente)
var bandasEntrada = imagen.select(['B2', 'B3', 'B4', 'B8', 'B11']).addBands([ndvi, ndwi]);

Map.addLayer(imagen, {bands: ['B8', 'B4', 'B3'], min: 0, max: 4000},
  '1 — Falso Color (referencia)', true);

// ----------------------------------------------------------------------------
// PASO 2: MUESTREO DE PIXELS PARA ENTRENAR EL CLUSTERER
// ----------------------------------------------------------------------------
// El clusterer K-means necesita una muestra de pixels para "aprender" los
// grupos — esto NO son ROIs etiquetados, son solo puntos aleatorios sin clase
var muestra = bandasEntrada.sample({
  region: zona_estudio,
  scale: 20,
  numPixels: 5000,
  seed: 42
});

// ----------------------------------------------------------------------------
// PASO 3: ENTRENAR Y APLICAR K-MEANS (5 CLUSTERS)
// ----------------------------------------------------------------------------
// 5 clusters ≈ cacao / café / bosque / pasturas / agua (aproximación visual,
// el clusterer no sabe estos nombres, solo agrupa por similitud espectral)
var numeroClusters = 5;
var clusterer = ee.Clusterer.wekaKMeans(numeroClusters).train(muestra);

var clasificacion = bandasEntrada.cluster(clusterer);

var paletaClusters = ['#8B4513', '#DAA520', '#006400', '#90EE90', '#0000FF'];

Map.addLayer(clasificacion, {min: 0, max: numeroClusters - 1, palette: paletaClusters},
  '2 — Clasificación no supervisada (5 clusters)', false);

// ----------------------------------------------------------------------------
// PASO 4: ÁREA APROXIMADA POR CLUSTER (solo para tener números que discutir)
// ----------------------------------------------------------------------------
var area_por_cluster = ee.Image.pixelArea().addBands(clasificacion)
  .reduceRegion({
    reducer: ee.Reducer.sum().group({groupField: 1, groupName: 'cluster'}),
    geometry: zona_estudio,
    scale: 20,
    maxPixels: 1e9
  });

print('=== CLASIFICACIÓN NO SUPERVISADA — ÁREA POR CLUSTER (m²) ===');
print(area_por_cluster);
print('');
print('RECORDATORIO PARA LA CLASE:');
print('  Estos 5 clusters son grupos ESTADÍSTICOS de pixels espectralmente');
print('  parecidos — el algoritmo no sabe qué es "cacao" o "café", solo');
print('  agrupa números similares. Para saber qué cobertura real representa');
print('  cada cluster, necesitarías visitar el campo (verdad de terreno) o');
print('  compararlo con un mapa ya validado.');
print('');
print('  EN LA SESIÓN 3: van a hacer el proceso completo — dibujar ROIs');
print('  reales etiquetados (cacao, café, bosque, pasturas, agua), entrenar');
print('  un clasificador SUPERVISADO (Random Forest) y calcular una matriz');
print('  de confusión con accuracy real. Hoy solo ven CÓMO SE VE un mapa');
print('  clasificado, como referencia visual del Artículo 1.');

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
