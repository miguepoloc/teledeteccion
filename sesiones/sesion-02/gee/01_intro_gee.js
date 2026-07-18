// ============================================================================
// SCRIPT GEE 01 — INTRODUCCIÓN A GOOGLE EARTH ENGINE
// ============================================================================
// Propósito : Aprender a cargar colecciones de imágenes, filtrar por fecha/zona/nubosidad,
//             visualizar composiciones de color y consultar valores de píxeles.
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 2
// Plataforma: Google Earth Engine Code Editor (https://code.earthengine.google.com)
// ============================================================================

// ----------------------------------------------------------------------------
// PASO 1: DEFINIR EL ÁREA DE ESTUDIO
// ----------------------------------------------------------------------------
// En GEE JavaScript no necesitamos inicializar ni autenticar, ya está integrado.

// Zona cacaotera entre Ciénaga y Fundación, Magdalena
var zona_cacaotera = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);

// Norte del Magdalena (contexto regional más amplio)
var norte_magdalena = ee.Geometry.Rectangle([-74.5, 10.2, -73.2, 11.2]);

print("Áreas de estudio definidas:");
print("  Zona cacaotera:", zona_cacaotera);
print("  Norte del Magdalena:", norte_magdalena);

// Centrar el mapa en la zona de estudio
Map.centerObject(zona_cacaotera, 11);

// ----------------------------------------------------------------------------
// PASO 2: CARGAR Y FILTRAR LA COLECCIÓN SENTINEL-2 (TEMPORADA SECA)
// ----------------------------------------------------------------------------
// ID de la colección: 'COPERNICUS/S2_SR_HARMONIZED'
var coleccion_s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_cacaotera)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15));

// Imprimir cuántas imágenes pasaron los filtros
print('Imágenes Sentinel-2 disponibles (ene-mar 2024, < 15% nubes):', coleccion_s2.size());

// ----------------------------------------------------------------------------
// PASO 3: REDUCIR LA COLECCIÓN A UNA IMAGEN LIMPIA
// ----------------------------------------------------------------------------
var imagen_mediana = coleccion_s2
  .median()              // Toma el valor mediano de cada píxel (elimina nubes residuales)
  .clip(zona_cacaotera); // Recorta al área de estudio

// Ver bandas disponibles
print("Bandas disponibles en la imagen:", imagen_mediana.bandNames());

// ----------------------------------------------------------------------------
// PASO 4: VISUALIZAR EN EL MAPA INTERACTIVO
// ----------------------------------------------------------------------------
// Parámetros de visualización para color natural
var params_color_natural = {
  bands: ['B4', 'B3', 'B2'],   // Rojo, Verde, Azul
  min: 0,
  max: 3000,
  gamma: 1.4                   // Brillo
};

// Agregar color natural al mapa
Map.addLayer(imagen_mediana, params_color_natural, 'Sentinel-2 — Color Natural (B4-B3-B2)');

// Parámetros de visualización para falso color (NIR en canal rojo)
var params_falso_color = {
  bands: ['B8', 'B4', 'B3'],   // Infrarrojo Cercano, Rojo, Verde
  min: 0,
  max: 4000
};

// Agregar falso color al mapa (desactivado por defecto)
Map.addLayer(imagen_mediana, params_falso_color, 'Falso Color NIR (B8-B4-B3)', false);

// Agregar el borde de la zona cacaotera
Map.addLayer(zona_cacaotera, {color: 'FF6B00', fillColor: '00000000'}, 'Zona Cacaotera (Borde)');

// ----------------------------------------------------------------------------
// PASO 5: EXPLORAR VALORES DE PÍXELES INDIVIDUALES
// ----------------------------------------------------------------------------
// En la interfaz web puedes usar el Inspector (pestaña "Inspector" arriba a la derecha).
// Programáticamente podemos hacer reduceRegion para puntos específicos:

var puntos = {
  'Zona cacaotera (Ciénaga)':       ee.Geometry.Point([-74.00, 10.85]),
  'Bosque SNSM (ladera)':          ee.Geometry.Point([-73.90, 10.92]),
  'Río Magdalena':                  ee.Geometry.Point([-74.18, 10.70]),
  'Zona urbana Fundación':          ee.Geometry.Point([-74.19, 10.52]),
  'Ciénaga Grande (cuerpo de agua)':ee.Geometry.Point([-74.35, 10.78])
};

var bandas_analizar = ['B2', 'B3', 'B4', 'B8', 'B11'];

// Consultar e imprimir valores
// Nota: Dado que reduceRegion es asíncrono, se imprime como un objeto ee.Dictionary en el panel Console
var consultarPunto = function(nombre, geom) {
  var valores = imagen_mediana.select(bandas_analizar).reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: geom.buffer(30), // buffer de 30m para promediar el píxel
    scale: 10
  });
  print('Valores en: ' + nombre, valores);
};

// Ejecutar consulta para cada punto
consultarPunto('Zona cacaotera (Ciénaga)', puntos['Zona cacaotera (Ciénaga)']);
consultarPunto('Bosque SNSM (ladera)', puntos['Bosque SNSM (ladera)']);
consultarPunto('Río Magdalena', puntos['Río Magdalena']);
consultarPunto('Zona urbana Fundación', puntos['Zona urbana Fundación']);
consultarPunto('Ciénaga Grande', puntos['Ciénaga Grande (cuerpo de agua)']);

// ----------------------------------------------------------------------------
// PASO 6: COMPARAR TEMPORADAS (SECA VS HÚMEDA)
// ----------------------------------------------------------------------------
// Cargar imagen de temporada húmeda (octubre–noviembre 2024) para ver nubes
var imagen_humeda = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_cacaotera)
  .filterDate('2024-10-01', '2024-11-30')
  .median()
  .clip(zona_cacaotera);

Map.addLayer(imagen_humeda, params_color_natural, 'Temporada HÚMEDA (oct-nov 2024)', false);

print('Comparación de imágenes disponibles:');
var n_seca = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_cacaotera)
  .filterDate('2024-01-01', '2024-03-31')
  .size();
var n_humeda = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_cacaotera)
  .filterDate('2024-10-01', '2024-11-30')
  .size();

print('Imágenes en temporada Seca:', n_seca);
print('Imágenes en temporada Húmeda:', n_humeda);
print('INSTRUCCIÓN: Activa la capa Húmeda en el panel "Layers" para ver la nubosidad en el Caribe.');
