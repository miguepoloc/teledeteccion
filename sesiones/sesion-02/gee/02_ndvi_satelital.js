// ============================================================================
// SCRIPT GEE 02 — NDVI SATELITAL SOBRE LA SIERRA NEVADA DE SANTA MARTA
// ============================================================================
// Propósito : Calcular NDVI, realizar estadísticas de zona, categorizar la
//             cobertura del suelo y visualizar con una leyenda interactiva.
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 2
// Plataforma: Google Earth Engine Code Editor (https://code.earthengine.google.com)
// ============================================================================

// ----------------------------------------------------------------------------
// PARTE A — CÁLCULO DE NDVI MATEMÁTICO (EXPRESIÓN MÁS PURA)
// ----------------------------------------------------------------------------
// En Python usamos rasterio con matrices numpy locales.
// En GEE JS, podemos simular la fórmula directamente usando algebra de imágenes.

var zona_estudio = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);
Map.centerObject(zona_estudio, 11);

// Cargar una colección rápida Sentinel-2 limpia
var coleccion_s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_estudio)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15));

// Enmascarar nubes usando SCL (Scene Classification Layer)
function enmascarar_nubes_s2(imagen) {
  var scl = imagen.select('SCL');
  var mascara = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return imagen.updateMask(mascara);
}

var imagen_mediana = coleccion_s2.map(enmascarar_nubes_s2).median().clip(zona_estudio);

// Método 1: Expresión matemática manual (como en Numpy)
// NDVI = (NIR - RED) / (NIR + RED)
var nir = imagen_mediana.select('B8');
var rojo = imagen_mediana.select('B4');
var ndvi_manual = nir.subtract(rojo).divide(nir.add(rojo)).rename('NDVI_Manual');

print("NDVI Manual calculado:", ndvi_manual);

// ----------------------------------------------------------------------------
// PARTE B — NDVI CON FUNCIÓN OPTIMIZADA DE GEE Y ESTADÍSTICAS
// ----------------------------------------------------------------------------

// Método 2: Función optimizada normalizedDifference de GEE (Recomendado)
var ndvi_gee = imagen_mediana.normalizedDifference(['B8', 'B4']).rename('NDVI');
var imagen_con_ndvi = imagen_mediana.addBands(ndvi_gee);

print("✓ NDVI optimizado calculado en GEE");

// Calcular estadísticas del NDVI sobre la zona de estudio
var stats = imagen_con_ndvi.select('NDVI').reduceRegion({
  reducer: ee.Reducer.mean()
    .combine(ee.Reducer.stdDev(), null, true)
    .combine(ee.Reducer.percentile([10, 25, 50, 75, 90]), null, true),
  geometry: zona_estudio,
  scale: 10,
  maxPixels: 1e9
});

print("=== ESTADÍSTICAS NDVI (Zona Cacaotera SNSM) ===");
print("Promedio (Media):", stats.get('NDVI_mean'));
print("Desviación estándar:", stats.get('NDVI_stdDev'));
print("Mediana (Percentil 50):", stats.get('NDVI_p50'));
print("Percentil 25:", stats.get('NDVI_p25'));
print("Percentil 75:", stats.get('NDVI_p75'));

// ----------------------------------------------------------------------------
// PARTE C — VISUALIZACIÓN Y LEYENDA EN EL MAPA
// ----------------------------------------------------------------------------

// Definir paleta de colores para NDVI
var paleta_ndvi = [
  '#d73027',  // < 0    → agua, rojo
  '#f46d43',  // 0–0.1  → suelo desnudo, naranja
  '#fdae61',  // 0.1–0.2 → muy escasa, amarillo-naranja
  '#ffffbf',  // 0.2–0.3 → escasa, amarillo
  '#d9ef8b',  // 0.3–0.4 → moderada, verde claro
  '#a6d96a',  // 0.4–0.6 → densa, verde
  '#1a9641'   // > 0.6  → muy densa (bosque, cacao), verde oscuro
];

// Agregar capas al mapa
Map.addLayer(imagen_con_ndvi, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000, gamma: 1.4}, 'Color Natural', false);
Map.addLayer(imagen_con_ndvi.select('NDVI'), {min: -0.1, max: 0.9, palette: paleta_ndvi}, 'NDVI (ene-mar 2024)');
Map.addLayer(zona_estudio, {color: 'FF6B00', fillColor: '00000000'}, 'Zona de Estudio (Borde)');

// --- CREAR PANEL DE LEYENDA DE INTERFAZ GRÁFICA EN GEE ---
var panel_leyenda = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    backgroundColor: 'white'
  }
});

// Título de la leyenda
var titulo_leyenda = ui.Label({
  value: 'Leyenda NDVI',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 6px 0',
    padding: '0'
  }
});
panel_leyenda.add(titulo_leyenda);

// Categorías de la leyenda
var categorias = [
  {color: '#d73027', label: '< 0 (Agua / Nubes)'},
  {color: '#f46d43', label: '0.0 – 0.1 (Suelo / Urbano)'},
  {color: '#fdae61', label: '0.1 – 0.2 (Veg. muy escasa)'},
  {color: '#ffffbf', label: '0.2 – 0.3 (Veg. escasa)'},
  {color: '#d9ef8b', label: '0.3 – 0.4 (Veg. moderada)'},
  {color: '#a6d96a', label: '0.4 – 0.6 (Veg. densa / cultivos)'},
  {color: '#1a9641', label: '> 0.6 (Bosque / Cacao)'}
];

// Función para crear una fila de la leyenda
var crearFila = function(color, label) {
  var caja_color = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 5px 0 0',
      border: '1px solid black'
    }
  });
  
  var texto_label = ui.Label({
    value: label,
    style: {
      margin: '2px 0 4px 6px',
      fontSize: '12px'
    }
  });
  
  return ui.Panel({
    widgets: [caja_color, texto_label],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

// Agregar cada categoría al panel
for (var i = 0; i < categorias.length; i++) {
  panel_leyenda.add(crearFila(categorias[i].color, categorias[i].label));
}

// Agregar el panel al mapa
Map.add(panel_leyenda);
