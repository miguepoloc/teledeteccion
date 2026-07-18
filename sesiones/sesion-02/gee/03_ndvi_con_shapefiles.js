// ============================================================================
// SCRIPT GEE 03 — NDVI CON VECTORES (SHAPEFILES/GEOJSON): ANÁLISIS POR ZONA
// ============================================================================
// Propósito : Extraer estadísticas de NDVI agrupadas por franjas altitudinales
//             (cacao vs café) usando el DEM SRTM y cargar un GeoJSON local en GEE.
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 2
// Plataforma: Google Earth Engine Code Editor (https://code.earthengine.google.com)
// ============================================================================

// ----------------------------------------------------------------------------
// PASO 1: DEFINIR EL ÁREA DE ESTUDIO Y CARGAR EL DEM SRTM
// ----------------------------------------------------------------------------
var zona_snsm = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);
Map.centerObject(zona_snsm, 11);

// Modelo Digital de Elevación SRTM (30 m de resolución)
var dem = ee.Image('USGS/SRTMGL1_003');

// ----------------------------------------------------------------------------
// PASO 2: CREAR MÁSCARAS POR FRANJA ALTITUDINAL (CACAO VS CAFÉ)
// ----------------------------------------------------------------------------
// Definimos las franjas altitudinales como máscaras binarias (1 donde cumple, 0 donde no)
var franja_baja  = dem.gte(400).and(dem.lt(700));    // 400–700 m   → zona de cacao
var franja_media = dem.gte(700).and(dem.lt(1200));   // 700–1200 m  → transición
var franja_alta  = dem.gte(1200).and(dem.lte(1800)); // 1200–1800 m → zona de café

print("Franjas altitudinales definidas (enmascaradas con el DEM SRTM)");

// ----------------------------------------------------------------------------
// PASO 3: PREPARAR IMAGEN SENTINEL-2 Y CALCULAR NDVI
// ----------------------------------------------------------------------------
function preparar_imagen_s2(fecha_inicio, fecha_fin) {
  var enmascarar_nubes = function(img) {
    var scl = img.select('SCL');
    var mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
    return img.updateMask(mask);
  };

  var img = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(zona_snsm)
    .filterDate(fecha_inicio, fecha_fin)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15))
    .map(enmascarar_nubes)
    .median()
    .clip(zona_snsm);

  var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
  return img.addBands(ndvi).addBands(dem.rename('Elevacion'));
}

// Cargar imagen de la temporada seca de 2024
var imagen_2024 = preparar_imagen_s2('2024-01-01', '2024-03-31');

// ----------------------------------------------------------------------------
// PASO 4: CALCULAR ESTADÍSTICAS DE NDVI POR FRANJA ALTITUDINAL
// ----------------------------------------------------------------------------
// Función para calcular estadísticas zonales
function calcularEstadisticas(mascara, nombreFranja) {
  // Enmascarar la imagen NDVI para dejar solo la franja de interés
  var ndvi_enmascarado = imagen_2024.select('NDVI').updateMask(mascara);
  
  var stats = ndvi_enmascarado.reduceRegion({
    reducer: ee.Reducer.mean()
      .combine(ee.Reducer.stdDev(), null, true)
      .combine(ee.Reducer.min(), null, true)
      .combine(ee.Reducer.max(), null, true)
      .combine(ee.Reducer.percentile([25, 50, 75]), null, true),
    geometry: zona_snsm,
    scale: 30,
    maxPixels: 1e9
  });
  
  print('Estadísticas NDVI — ' + nombreFranja, stats);
}

// Ejecutar el cálculo para cada una de las franjas
calcularEstadisticas(franja_baja, 'Franja Baja (400–700m) — Cacao');
calcularEstadisticas(franja_media, 'Franja Media (700–1200m) — Transición');
calcularEstadisticas(franja_alta, 'Franja Alta (1200–1800m) — Café');

// ----------------------------------------------------------------------------
// PASO 5: VISUALIZAR EN EL MAPA INTERACTIVO
// ----------------------------------------------------------------------------
var paleta_ndvi = ['#d73027', '#f46d43', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];

// NDVI de fondo
Map.addLayer(imagen_2024.select('NDVI'), {min: -0.1, max: 0.9, palette: paleta_ndvi}, 'NDVI 2024');

// DEM en escala de azules
Map.addLayer(dem.clip(zona_snsm), {min: 0, max: 2500, palette: ['#a8ddb5', '#43a2ca', '#0868ac']}, 'Elevación (DEM)', false);

// Franjas altitudinales (usamos selfMask para hacer transparentes los ceros y ver la capa inferior)
Map.addLayer(franja_baja.selfMask().clip(zona_snsm), {palette: ['2ecc71'], opacity: 0.4}, 'Franja Baja 400–700m (Cacao)');
Map.addLayer(franja_media.selfMask().clip(zona_snsm), {palette: ['f39c12'], opacity: 0.4}, 'Franja Media 700–1200m (Transición)');
Map.addLayer(franja_alta.selfMask().clip(zona_snsm), {palette: ['e74c3c'], opacity: 0.4}, 'Franja Alta 1200–1800m (Café)');

// ----------------------------------------------------------------------------
// PASO 6: CARGAR GEOJSON VECTORIAL DIRECTO EN GEE
// ----------------------------------------------------------------------------
// Definimos los polígonos de fincas directamente como un objeto FeatureCollection
var geojson_zona_cacao = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"nombre": "Finca Norte (Cacao)", "cultivo": "cacao"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-74.00, 10.85], [-73.95, 10.85],
          [-73.95, 10.90], [-74.00, 10.90],
          [-74.00, 10.85]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {"nombre": "Finca Sur (Café)", "cultivo": "cafe"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-73.92, 10.75], [-73.87, 10.75],
          [-73.87, 10.80], [-73.92, 10.80],
          [-73.92, 10.75]
        ]]
      }
    }
  ]
};

// Convertir a FeatureCollection del servidor
var zonas_gee = ee.FeatureCollection(geojson_zona_cacao);

// Mapear la función para calcular el NDVI promedio en cada polígono (finca)
var zonas_con_ndvi = zonas_gee.map(function(feature) {
  var geom = feature.geometry();
  var ndvi_medio = imagen_2024.select('NDVI').reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geom,
    scale: 10,
    maxPixels: 1e8
  }).get('NDVI');
  
  return feature.set('NDVI_promedio', ndvi_medio);
});

// Imprimir los resultados por finca en la consola
print("NDVI promedio por zonas de cultivo (GeoJSON):", zonas_con_ndvi);

// Agregar los vectores al mapa en color blanco para contraste
Map.addLayer(zonas_gee, {color: 'white'}, 'Zonas de cultivo (GeoJSON)');
