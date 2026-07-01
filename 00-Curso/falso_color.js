// Define la región (norte del Magdalena)
var magdalena = ee.Geometry.Rectangle([-74.5, 10.2, -73.2, 11.2]);

// Obtén una imagen Sentinel-2 reciente sin nubes
var image = ee
    .ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .filterBounds(magdalena)
    .filterDate("2024-01-01", "2024-12-31")
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 10))
    .median();

// Falso color: NIR (B8) = Rojo, Rojo (B4) = Verde, Verde (B3) = Azul
var falsoColor = image.select(["B8", "B4", "B3"]);

// Visualiza
Map.centerObject(magdalena, 10);
Map.addLayer(falsoColor, { min: 0, max: 3000 }, "Falso Color");
