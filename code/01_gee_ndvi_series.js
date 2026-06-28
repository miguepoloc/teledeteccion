// ============================================================================
// SCRIPT 1: EXTRACCIÓN DE NDVI MULTITEMPORAL (2000–2025)
// ============================================================================
// Propósito: Extraer la salud de la vegetación (NDVI) año a año en 3 franjas
//            altitudinales diferentes de la Sierra Nevada
// Autor: Miguel Ángel Polo Castañeda
// Fecha: Junio 2026
// Plataforma: Google Earth Engine Code Editor
//             https://code.earthengine.google.com
// ============================================================================

// ============================================================================
// PASO 1: CARGAR EL ÁREA DE ESTUDIO (Polígono de Sierra Nevada)
// ============================================================================
// Reemplaza el path con tu ID real de asset en GEE
var areaEstudio = ee.FeatureCollection('projects/sistemas-inteligentes-400722/assets/SierraNevada');

// Centrar el mapa sobre el área de estudio (zoom nivel 10)
Map.centerObject(areaEstudio, 10);

// Mostrar el polígono en el mapa con color rojo
Map.addLayer(areaEstudio, {color: 'FF0000'}, 'Sierra Nevada');

// ============================================================================
// PASO 2: CARGAR IMÁGENES SATELITALES LANDSAT (2000–2025)
// ============================================================================
// Landsat toma fotos de la Tierra cada 16 días desde 1972
// Usamos 3 versiones del satélite según el período disponible:

// LANDSAT 5: Operó 2000–2011
var landsat5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
  .filterDate('2000-01-01', '2011-12-31')
  .filterBounds(areaEstudio);

// LANDSAT 7: Operó 2000–2013
var landsat7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
  .filterDate('2000-01-01', '2013-12-31')
  .filterBounds(areaEstudio);

// LANDSAT 8/9: Operó 2013–2025 (mayor precisión)
var landsat89 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate('2013-01-01', '2025-12-31')
  .filterBounds(areaEstudio);

// Combinar los 3 satélites en una sola colección (~2051 imágenes)
var allLandsat = landsat5.merge(landsat7).merge(landsat89);

print('Total de imágenes Landsat disponibles:', allLandsat.size());

// ============================================================================
// PASO 3: FUNCIÓN PARA ELIMINAR NUBES
// ============================================================================
// QA_PIXEL es la banda de control de calidad de Landsat
// bitwiseAnd detecta píxeles con nube y los enmascara
function maskL8sr(image) {
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  return image.updateMask(qaMask);
}

// ============================================================================
// PASO 4: CALCULAR NDVI ANUAL (2000–2025)
// ============================================================================
// NDVI = (NIR - Rojo) / (NIR + Rojo)
//
// Interpretación:
//  -1 a 0    → Sin vegetación (agua, rocas, suelo desnudo)
//   0 a 0.3  → Vegetación escasa (pastura, arbustos)
//   0.3 a 0.7 → Vegetación moderada (cultivos, zonas de transición)
//   0.7 a 1.0 → Vegetación densa (bosque denso)
//
// Se usa el trimestre enero-marzo por ser la época seca en la Sierra Nevada
// → menos nubes → imágenes más claras y precisas

var ndviSeries = ee.ImageCollection.fromImages(
  ee.List.sequence(2000, 2025).map(function(year) {
    var start = ee.Date.fromYMD(year, 1, 1);
    var end = start.advance(3, 'month');

    var collection = allLandsat
      .filterDate(start, end)
      .map(maskL8sr)
      .map(function(image) {
        // SR_B5 = Infrarrojo Cercano (NIR), SR_B4 = Banda Roja
        var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
        return image.addBands(ndvi);
      });

    var median = collection.select('NDVI').median();

    return median
      .set('year', year)
      .set('system:time_start', start);
  })
);

// ============================================================================
// PASO 5: CARGAR MODELO DIGITAL DE ELEVACIÓN (DEM SRTM 30m)
// ============================================================================
var dem = ee.Image('USGS/SRTMGL1_003').clip(areaEstudio);

// ============================================================================
// PASO 6: CREAR MÁSCARAS POR FRANJA ALTITUDINAL
// ============================================================================
// Franja BAJA  (400–700 m)   → Cacao histórico
var franja_baja  = dem.gte(400).and(dem.lt(700));

// Franja MEDIA (700–1200 m)  → Zona de transición café ↔ cacao
var franja_media = dem.gte(700).and(dem.lt(1200));

// Franja ALTA  (1200–1800 m) → Café histórico
var franja_alta  = dem.gte(1200).and(dem.lte(1800));

// ============================================================================
// PASO 7: VISUALIZAR EN EL MAPA
// ============================================================================
Map.addLayer(dem, {palette: ['blue', 'green', 'brown'], min: 0, max: 5000}, 'DEM SRTM');
Map.addLayer(franja_baja.selfMask(),  {palette: ['00ff00']}, 'Franja Baja (400–700 m)');
Map.addLayer(franja_media.selfMask(), {palette: ['ffff00']}, 'Franja Media (700–1200 m)');
Map.addLayer(franja_alta.selfMask(),  {palette: ['ff0000']}, 'Franja Alta (1200–1800 m)');

// ============================================================================
// PASO 8: CALCULAR PROMEDIO DE NDVI POR FRANJA Y POR AÑO
// ============================================================================
var ndvi_estadisticas = ndviSeries.map(function(image) {
  var year = image.get('year');

  var mean_baja = image.updateMask(franja_baja)
    .reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: areaEstudio,
      scale: 30
    }).get('NDVI');

  var mean_media = image.updateMask(franja_media)
    .reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: areaEstudio,
      scale: 30
    }).get('NDVI');

  var mean_alta = image.updateMask(franja_alta)
    .reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: areaEstudio,
      scale: 30
    }).get('NDVI');

  return ee.Feature(null, {
    'year':              ee.Number(year).int(),
    'NDVI_franja_baja':  mean_baja,
    'NDVI_franja_media': mean_media,
    'NDVI_franja_alta':  mean_alta
  });
});

// Mostrar los primeros 5 años para verificar
print('Primeros 5 años de NDVI por franja:', ndvi_estadisticas.limit(5));

// ============================================================================
// PASO 9: EXPORTAR CSV A GOOGLE DRIVE
// ============================================================================
// Resultado: 26 filas (años) × 4 columnas (year + 3 franjas)
Export.table.toDrive({
  collection:  ndvi_estadisticas,
  description: 'NDVI_Series_Temporal_SierraNevada_2000_2025',
  folder:      'GEE_Exports',
  fileFormat:  'CSV'
});

print('✓ Script listo. Ve a Tasks (arriba a la derecha) y presiona RUN para exportar el CSV.');
// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
