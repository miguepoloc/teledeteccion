// ============================================================================
// SCRIPT 3: CLASIFICACIÓN RANDOM FOREST — CAFÉ vs CACAO vs BOSQUE
// ============================================================================
// Propósito: Generar mapas de cobertura para 4 años clave (2000, 2010, 2015, 2024)
// Método: Random Forest con entrenamiento supervisionado
// Entrada: Puntos de referencia (que crearás manualmente)
// Salida: Mapas clasificados exportados a Google Drive
// ============================================================================

// 1. CARGAR ÁREA DE ESTUDIO
var areaEstudio = ee.FeatureCollection('projects/sistemas-inteligentes-400722/assets/SierraNevada');
Map.centerObject(areaEstudio, 10);

// ============================================================================
// 2. FUNCIÓN PARA PROCESAR IMAGEN SENTINEL-2 (MEJOR RESOLUCIÓN QUE LANDSAT)
// ============================================================================
// Sentinel-2: 10 metros (vs Landsat 30m) = más precisión para cultivos

function procesarSentinel2(imagen) {
  var cloud_mask = imagen.select('MSK_CLDPRB').lt(20); // Máscara nubes
  var ndvi = imagen.normalizedDifference(['B8', 'B4']).rename('NDVI');
  var evi = imagen.expression(
    '2.5 * (B8 - B4) / (B8 + 6*B4 - 7.5*B2 + 1)',
    {'B8': imagen.select('B8'), 'B4': imagen.select('B4'), 'B2': imagen.select('B2')}
  ).rename('EVI');
  var ndwi = imagen.normalizedDifference(['B8', 'B11']).rename('NDWI'); // Humedad
  var ndmi = imagen.normalizedDifference(['B8', 'B11']).rename('NDMI'); // Humedad del dosel
  
  return imagen.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B11', 'B12'])
    .addBands([ndvi, evi, ndwi, ndmi])
    .updateMask(cloud_mask);
}

// ============================================================================
// 3. CREAR PUNTOS DE ENTRENAMIENTO (DEBES HACER ESTO MANUALMENTE)
// ============================================================================
// Aquí va tu CONOCIMIENTO de campo:
// Clase 1 = Café, Clase 2 = Cacao, Clase 3 = Bosque, Clase 4 = Pastura, Clase 5 = Urbano

// EJEMPLO (reemplaza con tus coordenadas GPS reales):
var puntos_entrenamiento = ee.FeatureCollection([
  // CAFÉ (Clase 1) — líneas rectas, sombrío, café histórico (franja alta)
  ee.Feature(ee.Geometry.Point([-74.05, 11.20]), {'clase': 1, 'nombre': 'Café_1'}),
  ee.Feature(ee.Geometry.Point([-74.08, 11.25]), {'clase': 1, 'nombre': 'Café_2'}),
  ee.Feature(ee.Geometry.Point([-74.10, 11.18]), {'clase': 1, 'nombre': 'Café_3'}),
  ee.Feature(ee.Geometry.Point([-74.03, 11.22]), {'clase': 1, 'nombre': 'Café_4'}),
  ee.Feature(ee.Geometry.Point([-74.07, 11.19]), {'clase': 1, 'nombre': 'Café_5'}),
  
  // CACAO (Clase 2) — agroforestería, dosel denso, cacao nuevo (franja media/baja)
  ee.Feature(ee.Geometry.Point([-74.04, 11.15]), {'clase': 2, 'nombre': 'Cacao_1'}),
  ee.Feature(ee.Geometry.Point([-74.06, 11.12]), {'clase': 2, 'nombre': 'Cacao_2'}),
  ee.Feature(ee.Geometry.Point([-74.09, 11.10]), {'clase': 2, 'nombre': 'Cacao_3'}),
  ee.Feature(ee.Geometry.Point([-74.02, 11.11]), {'clase': 2, 'nombre': 'Cacao_4'}),
  ee.Feature(ee.Geometry.Point([-74.08, 11.13]), {'clase': 2, 'nombre': 'Cacao_5'}),
  
  // BOSQUE NATURAL (Clase 3) — NDVI muy alto, no intervenido
  ee.Feature(ee.Geometry.Point([-74.12, 11.30]), {'clase': 3, 'nombre': 'Bosque_1'}),
  ee.Feature(ee.Geometry.Point([-74.15, 11.28]), {'clase': 3, 'nombre': 'Bosque_2'}),
  ee.Feature(ee.Geometry.Point([-74.11, 11.32]), {'clase': 3, 'nombre': 'Bosque_3'}),
  ee.Feature(ee.Geometry.Point([-74.14, 11.26]), {'clase': 3, 'nombre': 'Bosque_4'}),
  ee.Feature(ee.Geometry.Point([-74.13, 11.29]), {'clase': 3, 'nombre': 'Bosque_5'}),
  
  // PASTURA (Clase 4) — NDVI moderado, sin sombra, áreas limpias
  ee.Feature(ee.Geometry.Point([-74.00, 11.08]), {'clase': 4, 'nombre': 'Pastura_1'}),
  ee.Feature(ee.Geometry.Point([-74.02, 11.06]), {'clase': 4, 'nombre': 'Pastura_2'}),
  ee.Feature(ee.Geometry.Point([-74.01, 11.09]), {'clase': 4, 'nombre': 'Pastura_3'}),
  ee.Feature(ee.Geometry.Point([-73.99, 11.07]), {'clase': 4, 'nombre': 'Pastura_4'}),
  ee.Feature(ee.Geometry.Point([-74.03, 11.05]), {'clase': 4, 'nombre': 'Pastura_5'}),
  
  // URBANO (Clase 5) — carreteras, estructuras, suelo desnudo
  ee.Feature(ee.Geometry.Point([-74.22, 11.35]), {'clase': 5, 'nombre': 'Urbano_1'}),
  ee.Feature(ee.Geometry.Point([-74.25, 11.33]), {'clase': 5, 'nombre': 'Urbano_2'}),
]);

// Mostrar puntos en el mapa
Map.addLayer(puntos_entrenamiento, {color: 'red'}, 'Puntos de Entrenamiento');

print('Total de puntos de entrenamiento:', puntos_entrenamiento.size());

// ============================================================================
// 4. FUNCIÓN PARA CLASIFICAR UN AÑO
// ============================================================================

function clasificarAno(ano) {
  var start = ee.Date.fromYMD(ano, 1, 1);
  var end = ee.Date.fromYMD(ano, 3, 31); // Enero-Marzo (época seca)
  
  // Descargar Sentinel-2
  var coleccion = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate(start, end)
    .filterBounds(areaEstudio)
    .map(procesarSentinel2);
  
  if (coleccion.size().getInfo() === 0) {
    print('⚠️ No hay imágenes para ' + ano);
    return null;
  }
  
  var imagen = coleccion.median().clip(areaEstudio);
  
  // Seleccionar bandas para clasificación
  var bandas = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B11', 'B12', 'NDVI', 'EVI', 'NDWI', 'NDMI'];
  imagen = imagen.select(bandas);
  
  // ENTRENAR RANDOM FOREST
  var muestras = imagen.sampleRectangles({
    collection: puntos_entrenamiento,
    properties: ['clase'],
    scale: 10,
    geometries: true
  });
  
  var clasificador = ee.Classifier.smileRandomForest({
    numberOfTrees: 100,
    variablesPerSplit: null,
    minLeafPopulation: 1,
    bagFraction: 0.5,
    maxNodes: null
  }).train({
    features: muestras,
    classProperty: 'clase',
    inputProperties: bandas
  });
  
  // CLASIFICAR
  var clasificada = imagen.classify(clasificador).byte();
  
  // Etiquetar
  clasificada = clasificada.set('year', ano);
  
  return clasificada;
}

// ============================================================================
// 5. CLASIFICAR 4 AÑOS CLAVE
// ============================================================================

var anos = [2000, 2010, 2015, 2024];
var mapas_clasificados = [];

anos.forEach(function(ano) {
  var mapa = clasificarAno(ano);
  if (mapa !== null) {
    mapas_clasificados.push(mapa);
    
    // Mostrar en mapa
    Map.addLayer(
      mapa,
      {
        min: 1,
        max: 5,
        palette: ['8B4513', 'FFD700', '00AA00', '228B22', 'FF0000']
        // 1=Café(marrón), 2=Cacao(oro), 3=Pastura(verde claro), 4=Bosque(verde oscuro), 5=Urbano(rojo)
      },
      'Clasificación ' + ano
    );
    
    // Exportar
    Export.image.toDrive({
      image: mapa,
      description: 'Clasificacion_Coberturas_' + ano,
      folder: 'GEE_Exports',
      scale: 10,
      region: areaEstudio.geometry(),
      fileFormat: 'GeoTIFF'
    });
    
    print('✓ ' + ano + ' clasificado y en cola de exportación');
  }
});

// ============================================================================
// 6. CALCULAR MATRIZ DE TRANSICIÓN (2000 → 2024)
// ============================================================================
// Esto te dirá: ¿cuántas hectáreas de CAFÉ se convirtieron en CACAO?

if (mapas_clasificados.length >= 2) {
  var mapa_2000 = mapas_clasificados[0];
  var mapa_2024 = mapas_clasificados[mapas_clasificados.length - 1];
  
  // Combinar: (clase_2000 * 10) + clase_2024
  var transicion = mapa_2000.multiply(10).add(mapa_2024);
  
  // Exportar para análisis en Python
  Export.image.toDrive({
    image: transicion,
    description: 'Matriz_Transicion_2000_2024',
    folder: 'GEE_Exports',
    scale: 10,
    region: areaEstudio.geometry(),
    fileFormat: 'GeoTIFF'
  });
  
  print('✓ Matriz de transición en cola de exportación');
}

print('');
print('═══════════════════════════════════════════════════════');
print('SCRIPT COMPLETADO');
print('═══════════════════════════════════════════════════════');
print('Revisa la pestaña Tasks (arriba a la derecha)');
print('Haz clic en RUN para cada exportación');
print('Los archivos se guardarán en Google Drive → GEE_Exports');
print('═══════════════════════════════════════════════════════');