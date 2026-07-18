// ============================================================================
// SCRIPT GEE 02 — EXPLORADOR DE FIRMAS ESPECTRALES (INTERACTIVO)
// ============================================================================
// Propósito : Demo en vivo para el docente — Bloques 3 y 4 de la Sesión 1
//             (Interacción radiación-materia / Firmas espectrales)
// Autor     : Miguel Ángel Polo Castañeda
// Curso     : Teledetección — Maestría en Ingeniería, Universidad del Magdalena
// Sesión    : 1 (Viernes 17 de julio de 2026)
// Plataforma: Google Earth Engine Code Editor
//             https://code.earthengine.google.com
// ============================================================================
// CÓMO USARLO EN CLASE:
//   1. Pegar este código en el Code Editor y presionar "Run"
//   2. El mapa se centra en una vista ampliada que incluye la zona cacaotera
//      (Ciénaga-Fundación) Y la Ciénaga Grande real, más al oeste
//   3. Haz clic sobre VEGETACIÓN (zona cacaotera, lado este/derecho del mapa),
//      luego sobre AGUA (Ciénaga Grande, lado oeste/izquierdo), luego sobre
//      SUELO DESNUDO
//   4. Cada clic agrega una curva al gráfico de la derecha ("Firma espectral")
//   5. Compara las tres curvas en vivo con los estudiantes:
//      - Vegetación: sube fuerte en NIR (B8)
//      - Agua: cae a casi cero desde el NIR en adelante
//      - Suelo: sube de forma gradual, sin el salto de la vegetación
//   Botón "Limpiar" para reiniciar la comparación.
// ============================================================================

// ----------------------------------------------------------------------------
// PASO 1: IMAGEN BASE — SENTINEL-2 L2A, TEMPORADA SECA, ZONA AMPLIADA
// ----------------------------------------------------------------------------
// La Ciénaga Grande real queda al OESTE de la caja estrecha de la zona
// cacaotera — si el mapa solo mostrara zona_cacaotera, no habría ningún
// cuerpo de agua claro sobre el cual hacer clic en vivo. Por eso la imagen
// y el mapa usan zona_busqueda_agua (más ancha), aunque el nombre de la
// variable original zona_cacaotera se conserva para el resto del curso.
var zona_cacaotera = ee.Geometry.Rectangle([-74.2, 10.5, -73.8, 11.0]);
var zona_busqueda_agua = ee.Geometry.Rectangle([-74.6, 10.5, -73.8, 11.0]);

var imagen = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(zona_busqueda_agua)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()
  .clip(zona_busqueda_agua);

// Bandas que vamos a leer y su longitud de onda central (nm)
// Este orden IMPORTA: define el eje X del gráfico (de onda corta a onda larga)
var bandas = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12'];
var longitudes_onda = [490, 560, 665, 705, 740, 783, 842, 865, 1610, 2190];

// ----------------------------------------------------------------------------
// PASO 2: INTERFAZ — MAPA + PANEL DE GRÁFICO
// ----------------------------------------------------------------------------
var mapa = ui.Map();
mapa.style().set({stretch: 'both'});
mapa.centerObject(zona_busqueda_agua, 10);
mapa.addLayer(imagen, {bands: ['B8', 'B4', 'B3'], min: 0, max: 4000},
  'Falso color NIR (referencia para elegir dónde hacer clic)');

var panelGrafico = ui.Panel({style: {width: '420px', padding: '8px', stretch: 'vertical'}});
panelGrafico.add(ui.Label('Firma espectral (haz clic en el mapa)', {fontWeight: 'bold', fontSize: '16px'}));
panelGrafico.add(ui.Label('Clic sobre vegetación, agua y suelo desnudo para comparar.', {fontSize: '12px', color: '666666'}));

var botonLimpiar = ui.Button({
  label: 'Limpiar curvas',
  onClick: function() { reiniciar(); }
});
panelGrafico.add(botonLimpiar);

var contenedorGrafico = ui.Panel();
panelGrafico.add(contenedorGrafico);

var panelPrincipal = ui.Panel({
  widgets: [mapa, panelGrafico],
  layout: ui.Panel.Layout.Flow('horizontal'),
  style: {stretch: 'both'}
});
ui.root.clear();
ui.root.add(panelPrincipal);

// ----------------------------------------------------------------------------
// PASO 3: LÓGICA DE CLIC — MUESTREAR REFLECTANCIA Y ACUMULAR CURVAS
// ----------------------------------------------------------------------------
// curvas = lista de objetos {nombre, color, valores: [reflectancia por banda]}
var curvas = [];
var colores = ['#2ecc71', '#3498db', '#a0522d', '#e74c3c', '#9b59b6'];
var contadorClics = 0;

function reiniciar() {
  curvas = [];
  contadorClics = 0;
  mapa.layers().reset([mapa.layers().get(0)]); // deja solo la capa base
  contenedorGrafico.clear();
}

mapa.onClick(function(coords) {
  var punto = ee.Geometry.Point([coords.lon, coords.lat]);
  var color = colores[contadorClics % colores.length];
  contadorClics += 1;

  // Marcar el punto en el mapa para que quede visible cuál curva es cuál
  mapa.addLayer(punto, {color: color}, 'Punto ' + contadorClics);

  // Reducir la imagen a un promedio en un radio de 15 m alrededor del clic
  var valores = imagen.select(bandas).reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: punto.buffer(15),
    scale: 10
  });

  // evaluate() trae el resultado del servidor de GEE al cliente de forma
  // asíncrona — necesario porque ui.Chart no puede leer un ee.Dictionary
  // directamente dentro de una función de clic.
  valores.evaluate(function(dict) {
    var reflectancias = bandas.map(function(b) {
      // Sentinel-2 L2A entrega reflectancia * 10000 → dividir para tener 0-1
      return dict[b] ? dict[b] / 10000 : 0;
    });

    curvas.push({
      nombre: 'Punto ' + contadorClics,
      color: color,
      valores: reflectancias
    });

    dibujarGrafico();
  });
});

function dibujarGrafico() {
  contenedorGrafico.clear();

  // Construir un array 2D: cada fila es una curva, columnas = bandas
  var arregloValores = curvas.map(function(c) { return c.valores; });
  var etiquetas = curvas.map(function(c) { return c.nombre; });
  var listaColores = curvas.map(function(c) { return c.color; });

  var grafico = ui.Chart.array.values({
    array: ee.Array(arregloValores),
    axis: 1,
    xLabels: longitudes_onda
  })
  .setSeriesNames(etiquetas)
  .setOptions({
    title: 'Reflectancia superficial vs. longitud de onda',
    hAxis: {title: 'Longitud de onda (nm)'},
    vAxis: {title: 'Reflectancia (0–1)', minValue: 0, maxValue: 0.6},
    colors: listaColores,
    lineWidth: 3,
    pointSize: 5
  });

  contenedorGrafico.add(grafico);
}

// ----------------------------------------------------------------------------
// PASO 4: GUION PARA EL DOCENTE (imprimir en consola como recordatorio)
// ----------------------------------------------------------------------------
print('=== EXPLORADOR DE FIRMAS ESPECTRALES ===');
print('Haz clic en el mapa (panel izquierdo) sobre:');
print('  1) Vegetación densa (zonas rojas en falso color, dentro de la zona cacaotera)');
print('  2) Un cuerpo de agua (zonas muy oscuras/negras — la Ciénaga Grande está');
print('     al OESTE de la zona cacaotera, hacia el borde izquierdo del mapa)');
print('  3) Suelo desnudo o zona urbana (tonos claros/uniformes)');
print('');
print('PREGUNTA PARA LA CLASE:');
print('  ¿Por qué la curva del agua cae a casi cero después del rojo?');
print('  Respuesta: el agua absorbe casi toda la energía en NIR y SWIR —');
print('  por eso el NDWI y el NDVI distinguen agua de vegetación con tanta claridad.');
print('');
print('  ¿Por qué la vegetación tiene ese "salto" entre B4 (rojo) y B8 (NIR)?');
print('  Respuesta: la estructura celular de la hoja (mesófilo esponjoso) refleja');
print('  fuertemente en NIR — es la base física del NDVI (Bloque 4).');

// ============================================================================
// FIN DEL SCRIPT
// ============================================================================
