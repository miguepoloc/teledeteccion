// ============================================================================
// SCRIPT GEE 02 — ÍNDICES ESPECTRALES Y CAMBIO TEMPORAL (SNSM)
// ============================================================================
// Propósito : Calcular NDVI, NDWI, SAVI, NDRE y EVI sobre la zona cacaotera
//             de la Sierra Nevada de Santa Marta, y comparar 2018 vs 2024
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 2 (Sábado 18 de julio de 2026)
// Plataforma: Google Earth Engine Code Editor
//             https://code.earthengine.google.com
// ============================================================================
// NOTA: Este script hace lo mismo que el Notebook Colab 04 pero en el
//       Code Editor de GEE (sin Python). Úsalo si prefieres la interfaz web.
// ============================================================================

// ----------------------------------------------------------------------------
// PASO 1: DEFINIR EL ÁREA DE ESTUDIO
// ----------------------------------------------------------------------------
// Zona cacaotera entre Ciénaga y Fundación, Magdalena
// Altitud 400-1800 m — zona de transición café ↔ cacao en la SNSM
var zona_estudio = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);

Map.centerObject(zona_estudio, 11);
Map.addLayer(zona_estudio, {color: 'FF6B00', fillColor: '00000000'}, 'Zona de Estudio');

// ----------------------------------------------------------------------------
// PASO 2: FUNCIÓN PARA CARGAR Y LIMPIAR SENTINEL-2
// ----------------------------------------------------------------------------
// Sentinel-2 L2A viene con una banda de clasificación SCL (Scene Classification)
// que identifica nubes, sombras, agua, etc.
// Esta función enmascara los píxeles de nubes y sombras usando la SCL

function cargarSentinel2(fecha_inicio, fecha_fin) {
  return ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(zona_estudio)
    .filterDate(fecha_inicio, fecha_fin)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15))
    .map(function(imagen) {
      // SCL (Scene Classification Layer):
      // 3 = sombra de nube, 8 = nube media, 9 = nube alta, 10 = cirros
      var scl = imagen.select('SCL');
      var mascara_nubes = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
      return imagen.updateMask(mascara_nubes);
    })
    .median()      // combina imágenes tomando el valor mediano (elimina nubes residuales)
    .clip(zona_estudio);
}

// Cargar imagen de temporada seca 2024 (enero–marzo)
var imagen_2024 = cargarSentinel2('2024-01-01', '2024-03-31');

// Cargar imagen del mismo período en 2018 (para comparación temporal)
var imagen_2018 = cargarSentinel2('2018-01-01', '2018-03-31');

print('Imagen 2024 cargada. Bandas:', imagen_2024.bandNames());
print('Imagen 2018 cargada. Bandas:', imagen_2018.bandNames());

// ----------------------------------------------------------------------------
// PASO 3: FUNCIÓN PARA CALCULAR TODOS LOS ÍNDICES
// ----------------------------------------------------------------------------
function calcularIndices(imagen) {

  // --- NDVI (Normalized Difference Vegetation Index) ---
  // Fórmula: (NIR - Rojo) / (NIR + Rojo)
  // Rango: -1 a +1 | Vegetación densa sana: 0.6 – 0.9
  // Sentinel-2: B8 = NIR (842 nm), B4 = Rojo (665 nm)
  var ndvi = imagen.normalizedDifference(['B8', 'B4']).rename('NDVI');

  // --- NDWI (Normalized Difference Water Index) ---
  // Fórmula: (NIR - SWIR) / (NIR + SWIR)   [versión Gao 1996 para vegetación]
  // Mide el contenido de agua en la vegetación
  // Rango: -1 a +1 | Dosel muy húmedo: > 0.3
  // Sentinel-2: B8 = NIR (842 nm), B11 = SWIR (1610 nm)
  var ndwi = imagen.normalizedDifference(['B8', 'B11']).rename('NDWI');

  // --- SAVI (Soil Adjusted Vegetation Index) ---
  // Fórmula: 1.5 × (NIR - Rojo) / (NIR + Rojo + 0.5)
  // Igual que NDVI pero corrige el efecto del suelo expuesto
  // Útil cuando la cobertura vegetal es < 50% (cultivos jóvenes, zonas áridas)
  var savi = imagen.expression(
    '1.5 * (NIR - RED) / (NIR + RED + 0.5)',
    {
      'NIR': imagen.select('B8'),
      'RED': imagen.select('B4')
    }
  ).rename('SAVI');

  // --- NDRE (Normalized Difference Red Edge Index) ---
  // Fórmula: (B8A - B5) / (B8A + B5)
  // Mide el contenido de clorofila — detecta estrés antes que el ojo humano
  // Solo disponible en Sentinel-2 (Landsat NO tiene bandas Red Edge)
  // B8A = Red Edge NIR (865 nm), B5 = Red Edge 1 (705 nm)
  var ndre = imagen.normalizedDifference(['B8A', 'B5']).rename('NDRE');

  // --- EVI (Enhanced Vegetation Index) ---
  // Fórmula: 2.5 × (NIR - Rojo) / (NIR + 6×Rojo - 7.5×Azul + 1)
  // Mejora el NDVI: no se satura en vegetación muy densa y corrige el suelo
  // Ideal para bosques tropicales y sistemas agroforestales (cacao adulto)
  var evi = imagen.expression(
    '2.5 * (NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1)',
    {
      'NIR':  imagen.select('B8').divide(10000),   // dividir por 10000 para obtener reflectancia 0-1
      'RED':  imagen.select('B4').divide(10000),
      'BLUE': imagen.select('B2').divide(10000)
    }
  ).rename('EVI');

  // --- NDMI (Normalized Difference Moisture Index) ---
  // Fórmula: (B8A - B11) / (B8A + B11)
  // Usa B8A (NIR estrecho) en vez de B8 — más sensible a humedad del dosel que el NDWI
  // Rango: -1 a +1 | Útil para estrés hídrico y riesgo de incendio
  var ndmi = imagen.normalizedDifference(['B8A', 'B11']).rename('NDMI');

  // --- CLre (Chlorophyll Index Red Edge) ---
  // Fórmula: (B7 / B5) - 1  →  es una RAZÓN, no una diferencia normalizada
  // Sensible a clorofila en rangos altos donde el NDVI ya está saturado (~0.8-0.9)
  var clre = imagen.expression(
    '(REDGE3 / REDGE1) - 1',
    {
      'REDGE3': imagen.select('B7'),
      'REDGE1': imagen.select('B5')
    }
  ).rename('CLre');

  return imagen.addBands([ndvi, ndwi, savi, ndre, evi, ndmi, clre]);
}

// Calcular índices para ambos años
var imagen_2024_indices = calcularIndices(imagen_2024);
var imagen_2018_indices = calcularIndices(imagen_2018);

// ----------------------------------------------------------------------------
// PASO 4: VISUALIZAR COLOR NATURAL (referencia)
// ----------------------------------------------------------------------------
Map.addLayer(
  imagen_2024,
  {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4},
  'Color Natural 2024',
  false
);

// ----------------------------------------------------------------------------
// PASO 5: VISUALIZAR NDVI 2024 Y 2018
// ----------------------------------------------------------------------------
var paleta_ndvi = ['#d73027', '#f46d43', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];

Map.addLayer(
  imagen_2024_indices.select('NDVI'),
  {min: -0.1, max: 0.9, palette: paleta_ndvi},
  'NDVI 2024 (ene–mar)',
  true
);

Map.addLayer(
  imagen_2018_indices.select('NDVI'),
  {min: -0.1, max: 0.9, palette: paleta_ndvi},
  'NDVI 2018 (ene–mar)',
  false
);

// ----------------------------------------------------------------------------
// PASO 6: MAPA DE CAMBIO NDVI (2018 → 2024)
// ----------------------------------------------------------------------------
// Un valor POSITIVO = aumento de vegetación (café → cacao con dosel más denso)
// Un valor NEGATIVO = pérdida de vegetación (deforestación, estrés, cambio de uso)

var cambio_ndvi = imagen_2024_indices.select('NDVI')
  .subtract(imagen_2018_indices.select('NDVI'))
  .rename('Cambio_NDVI');

Map.addLayer(
  cambio_ndvi,
  {min: -0.3, max: 0.3, palette: ['#d73027', '#ffffff', '#1a9641']},
  'Cambio NDVI 2018→2024 (rojo=pérdida, verde=ganancia)',
  false
);

// ----------------------------------------------------------------------------
// PASO 7: VISUALIZAR NDWI Y NDRE
// ----------------------------------------------------------------------------
Map.addLayer(
  imagen_2024_indices.select('NDWI'),
  {min: -0.5, max: 0.5, palette: ['#d7191c', '#ffffbf', '#2c7bb6']},
  'NDWI 2024 (contenido de agua)',
  false
);

Map.addLayer(
  imagen_2024_indices.select('NDRE'),
  {min: 0, max: 0.5, palette: ['#ffffcc', '#78c679', '#238443']},
  'NDRE 2024 (contenido de clorofila)',
  false
);

Map.addLayer(
  imagen_2024_indices.select('NDMI'),
  {min: -0.5, max: 0.5, palette: ['#d7191c', '#ffffbf', '#2c7bb6']},
  'NDMI 2024 (humedad del dosel)',
  false
);

Map.addLayer(
  imagen_2024_indices.select('CLre'),
  {min: 0, max: 3, palette: ['#ffffcc', '#78c679', '#238443']},
  'CLre 2024 (clorofila red edge)',
  false
);

// ----------------------------------------------------------------------------
// PASO 8: ESTADÍSTICAS POR ZONA
// ----------------------------------------------------------------------------
// Calcular el NDVI promedio de toda la zona de estudio para 2018 y 2024

var stats_2024 = imagen_2024_indices.select('NDVI').reduceRegion({
  reducer: ee.Reducer.mean().combine(ee.Reducer.stdDev(), null, true)
             .combine(ee.Reducer.min(), null, true)
             .combine(ee.Reducer.max(), null, true),
  geometry: zona_estudio,
  scale: 10,
  maxPixels: 1e9
});

var stats_2018 = imagen_2018_indices.select('NDVI').reduceRegion({
  reducer: ee.Reducer.mean().combine(ee.Reducer.stdDev(), null, true)
             .combine(ee.Reducer.min(), null, true)
             .combine(ee.Reducer.max(), null, true),
  geometry: zona_estudio,
  scale: 10,
  maxPixels: 1e9
});

print('=== ESTADÍSTICAS NDVI 2024 ===');
print('NDVI promedio 2024:', stats_2024.get('NDVI_mean'));
print('Desviación estándar:', stats_2024.get('NDVI_stdDev'));
print('');
print('=== ESTADÍSTICAS NDVI 2018 ===');
print('NDVI promedio 2018:', stats_2018.get('NDVI_mean'));
print('Desviación estándar:', stats_2018.get('NDVI_stdDev'));
print('');
print('INSTRUCCIONES:');
print('  → Activa/desactiva capas en el panel "Layers"');
print('  → Compara NDVI 2024 vs NDVI 2018 visualmente');
print('  → Activa "Cambio NDVI" para ver dónde aumentó y dónde bajó la vegetación');
print('  → Usa el Inspector (ícono de dedo) para ver valores en puntos específicos');

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
