# Guía WebODM — Procesamiento Fotogramétrico con P4M
## Sesión 4 | Universidad del Magdalena

> WebODM es la alternativa open source a Agisoft Metashape y Pix4D.
> Produce ortomosaicos, modelos 3D y nubes de puntos con la misma calidad para uso académico.
> Esta guía cubre instalación + flujo completo con imágenes del P4M.

---

## Parte 1 — Instalación (hacer ANTES de la sesión)

### Requisitos del sistema
- RAM: mínimo 8 GB (recomendado 16 GB para datasets grandes)
- Disco: 20 GB libres
- OS: Windows 10/11, macOS 11+, Ubuntu 20.04+
- **Docker Desktop instalado y corriendo**

### Paso 1: Instalar Docker Desktop
1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop
2. Instala y reinicia el computador
3. Abre Docker Desktop y espera a que el ícono de la ballena aparezca en la barra de tareas (verde = listo)
4. Verifica en terminal: `docker --version` → debe mostrar algo como `Docker version 24.x.x`

### Paso 2: Instalar WebODM

**En Windows (PowerShell como Administrador):**
```powershell
git clone https://github.com/OpenDroneMap/WebODM --config core.autocrlf=input --depth 1
cd WebODM
.\webodm.bat start
```

**En macOS / Linux (Terminal):**
```bash
git clone https://github.com/OpenDroneMap/WebODM --depth 1
cd WebODM
./webodm.sh start
```

La primera vez descarga ~3 GB de imágenes Docker. Puede tardar 10–30 minutos según la conexión.

### Paso 3: Verificar que funciona
1. Abre el navegador en: **http://localhost:8000**
2. Crea una cuenta de administrador (usuario + contraseña de tu elección)
3. Si ves el panel de WebODM → instalación exitosa ✓

### Comandos útiles
```bash
./webodm.sh start    # Iniciar WebODM
./webodm.sh stop     # Detener WebODM
./webodm.sh update   # Actualizar a la última versión
```

---

## Parte 2 — Flujo de procesamiento con imágenes P4M

### Estructura de archivos esperada

Antes de subir, organiza las fotos así:

```
vuelo_universidad/
├── DJI_0001_MS_B.TIF
├── DJI_0001_MS_G.TIF
├── DJI_0001_MS_R.TIF
├── DJI_0001_MS_RE.TIF
├── DJI_0001_MS_NIR.TIF
├── DJI_0001.JPG
├── DJI_0002_MS_B.TIF
... (continúa para todas las fotos)
```

> **Importante:** sube TODAS las bandas de TODOS los vuelos juntas — WebODM necesita ver el par B+G+R+RE+NIR de cada foto para alinearlas correctamente.

### Paso 1: Crear nuevo proyecto
1. En WebODM, haz clic en **+ Add Project**
2. Nombre: `Universidad_Magdalena_25Jul2026`
3. Haz clic en **Upload Files** y selecciona toda la carpeta de fotos
4. Espera a que suban todos los archivos (puede tardar varios minutos)

### Paso 2: Configurar opciones de procesamiento

Haz clic en **Options** antes de procesar. Para el P4M multispectral:

| Opción | Valor recomendado | Por qué |
|--------|-------------------|---------|
| `multispectral` | ✓ activado | Indica que son bandas separadas del mismo sensor |
| `radiometric-calibration` | `camera` | Usa el sunshine sensor integrado del P4M |
| `orthophoto-resolution` | `1` | 1 cm/px (mayor detalle para área pequeña) |
| `min-num-features` | `8000` | Más puntos de coincidencia = mejor alineación |
| `feature-quality` | `high` | Calidad alta para mayor precisión |
| `pc-quality` | `high` | Nube de puntos densa |

> Para datasets grandes (>500 fotos) o computadores lentos, reducir `orthophoto-resolution` a `3` y `feature-quality` a `medium`.

### Paso 3: Iniciar procesamiento

1. Haz clic en **Start Processing**
2. El tiempo estimado aparece en pantalla:
   - 50–100 fotos: 15–30 min
   - 200–400 fotos: 45–90 min
   - Más de 500 fotos: 2–4 horas

El procesamiento tiene 4 etapas internas que puedes ver en el log:
```
1. Feature extraction      ← detecta puntos en común entre fotos
2. Feature matching        ← empareja puntos entre fotos adyacentes
3. Structure from Motion   ← reconstruye la posición 3D de la cámara
4. MVS Dense reconstruction← genera nube de puntos densa
5. Orthophoto generation   ← proyecta las fotos como mapa plano
```

### Paso 4: Revisar y descargar resultados

Cuando termine, haz clic en el proyecto y luego en **Download**:

| Archivo | Descripción | Para qué se usa |
|---------|-------------|-----------------|
| `odm_orthophoto.tif` | Ortomosaico RGB (3 bandas) | Visualización en QGIS |
| `odm_orthophoto_NDVI.tif` | Mapa NDVI calculado | Referencia rápida |
| `orthophoto_Blue.tif` | Banda azul calibrada | Python / análisis |
| `orthophoto_Green.tif` | Banda verde calibrada | Python / análisis |
| `orthophoto_Red.tif` | Banda roja calibrada | Python / análisis |
| `orthophoto_RedEdge.tif` | Banda Red Edge calibrada | Python / análisis |
| `orthophoto_NIR.tif` | Banda NIR calibrada | Python / análisis |
| `odm_dem/dsm.tif` | Modelo digital de superficie | Alturas de árboles |
| `odm_report.pdf` | Reporte de calidad | Verificar precisión GSD |

### Paso 5: Crear stack multibanda para Python

WebODM exporta bandas separadas. Para el Notebook 07 necesitamos un solo GeoTIFF con 5 bandas. Ejecuta esto en terminal una vez descargados los archivos:

```bash
# Instalar GDAL si no está disponible
conda install -c conda-forge gdal -y

# Apilar las 5 bandas en orden: Blue, Green, Red, RedEdge, NIR
gdal_merge.py -separate \
  -o ortomosaico_p4m_5bandas.tif \
  orthophoto_Blue.tif \
  orthophoto_Green.tif \
  orthophoto_Red.tif \
  orthophoto_RedEdge.tif \
  orthophoto_NIR.tif

echo "Stack creado: ortomosaico_p4m_5bandas.tif"
```

O desde Python con rasterio (Notebook 07 lo hace automáticamente si los archivos están separados).

---

## Parte 3 — Verificar calidad del ortomosaico

### En WebODM — reporte de calidad
- Descarga el `odm_report.pdf`
- Revisar: **GSD** (debe ser cercano al teórico: 5.3 cm a 50 m)
- Revisar: **Error de reproyección** (< 1 px = excelente, < 2 px = aceptable)
- Revisar: **Cobertura de puntos de control** (solo si tienes GCPs)

### En QGIS — verificación visual
1. Abre QGIS → arrastra el `odm_orthophoto.tif`
2. Verifica que el ortomosaico está georreferenciado (coordenadas reales)
3. Haz zoom a zonas conocidas (el lago, edificios) para verificar nitidez y alineación

---

## Parte 4 — Procesar las fotos de la bananera

Mismo procedimiento que con el vuelo de la universidad, pero:
- Crear proyecto nuevo: `Bananera_NorteMagdalena`
- Subir las fotos crudas del P4M del bananal
- Usar mismos parámetros de procesamiento
- El resultado será el dato de tu investigación CONCAPAN 2022

> Las imágenes de la bananera son el dataset de investigación real. El análisis Python del Notebook 07-08 aplica sobre el dataset de la universidad (obtenido en clase), pero la misma metodología aplica exactamente sobre las imágenes del bananal.

---

## Solución de problemas comunes

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| "Docker not running" | Docker Desktop no está iniciado | Abrir Docker Desktop y esperar la ballena verde |
| Procesamiento falla en Feature Matching | Muy pocas fotos o poco overlap | Verificar que subiste todas las bandas; aumentar min-num-features |
| Ortomosaico con huecos blancos | Nubes, sombras, o fotos movidas | Revisar el log; repetir vuelo en esas zonas |
| GSD muy grande (peor de lo esperado) | Altitud de vuelo incorrecta | Verificar que la misión se ejecutó a la altura configurada |
| Memoria insuficiente | Dataset muy grande | Reducir quality a medium; procesar por lotes |
| Puerto 8000 ocupado | Otro proceso usa ese puerto | `./webodm.sh start --port 8080` |
