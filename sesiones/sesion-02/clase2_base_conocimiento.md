# Sesión 2 — Base de Conocimiento del Docente
## Imágenes Pasivas, Preprocesamiento, Índices Espectrales y Laboratorio SNAP
### Maestría en Ingeniería — Universidad del Magdalena
#### Sábado 18 de julio de 2026 | 8:00 AM – 6:00 PM

> Este documento es tu guía personal. Todo está explicado con analogías para que
> tú lo entiendas profundamente y puedas explicarlo con seguridad frente al grupo.
> El hilo conductor de toda la sesión es el Artículo 1 de investigación:
> análisis multitemporal NDVI en la zona cacaotera de la SNSM.

---

## DISTRIBUCIÓN DEL DÍA

| Horario | Bloque | Tipo |
|---------|--------|------|
| 8:00 – 8:15 | Apertura y conexión con sesión 1 | Teoría |
| 8:15 – 9:30 | Imágenes pasivas y preprocesamiento | Teoría |
| 9:30 – 10:30 | Correcciones radiométrica, atmosférica y geométrica | Teoría |
| 10:30 – 10:45 | Pausa activa | — |
| 10:45 – 12:00 | Índices espectrales: NDVI, NDWI, SAVI y más | Teoría |
| 12:00 – 1:00 | Almuerzo | — |
| 1:00 – 3:30 | Laboratorio SNAP: cargar imagen, explorar, calcular NDVI | Práctica |
| 3:30 – 4:00 | Pausa activa | — |
| 4:00 – 5:30 | Clasificación supervisada y no supervisada (demo) | Teoría + Demo |
| 5:30 – 6:00 | Cierre, tarea y preguntas | — |

---

## BLOQUE 0 — Apertura (15 minutos)

### Cómo conectar con la sesión 1

No empieces desde cero. Los estudiantes ya saben qué es teledetección, qué es
una firma espectral y los cuatro tipos de resolución. Arranca recordándoles eso
con una pregunta rápida al grupo:

*"La semana pasada vimos que Sentinel-2 tiene 13 bandas. ¿Alguien recuerda por qué
necesitamos 13 bandas y no solo 3 como una foto normal?"*

Deja que respondan. La respuesta correcta es: porque cada banda captura una región
distinta del espectro y cada región nos dice algo diferente sobre lo que hay en el suelo.

Luego dices: *"Hoy vamos a aprender qué hacer con esas 13 bandas desde que llegan
del satélite hasta que tenemos un mapa útil. Y todo lo que hagamos hoy lo vamos a
aplicar sobre imágenes reales de la Sierra Nevada de Santa Marta para analizar
el cambio de café a cacao — que es parte de mi investigación doctoral."*

Eso pone al grupo en modo activo desde el minuto 1.

---

## BLOQUE 1 — Imágenes pasivas: qué son y cómo llegan (30 minutos)

### Qué es una imagen pasiva

Ya viste en la sesión 1 que los sensores pasivos dependen del Sol. Sentinel-2 es
pasivo: el Sol ilumina la superficie, la superficie refleja energía, y Sentinel-2
captura esa energía reflejada.

Una imagen satelital pasiva no es una foto convencional. Es una matriz de números.
Cada pixel tiene un valor numérico por cada banda que representa la cantidad de
energía que llegó al sensor desde ese punto del suelo.

**Analogía — la planilla de Excel:**
Imagina una hoja de Excel donde cada celda es un pixel. Si la imagen tiene
13 bandas, tienes 13 hojas de Excel apiladas, una por banda. En cada celda
hay un número que representa cuánta energía llegó al sensor en esa banda
para ese punto del suelo. Eso es una imagen multiespectral.

Cuando SNAP o QGIS "muestra" la imagen en pantalla, simplemente asigna colores
a esos números para que el ojo humano pueda interpretarlos. Pero el dato real
son números, no colores.

### Los niveles de procesamiento de Sentinel-2

Cuando descargas una imagen Sentinel-2, encuentras dos niveles:

**Nivel 1C (L1C) — Top of Atmosphere (TOA):**
Son los valores de energía tal como llegaron al sensor, sin corregir el efecto
de la atmósfera. Los números reflejan la energía en la cima de la atmósfera,
no en el suelo. Son valores de reflectancia aparente.

**Nivel 2A (L2A) — Bottom of Atmosphere / Surface Reflectance (SR):**
Ya tienen la corrección atmosférica aplicada. Los números representan la
reflectancia real de la superficie terrestre, como si la atmósfera no existiera.

**¿Cuál usar?**
Siempre Level 2A para análisis cuantitativos como cálculo de índices y
comparaciones multitemporales. El Level 1C solo si necesitas procesar tú mismo
la corrección o si L2A no está disponible.

**Analogía — el vaso de agua con lápiz:**
Si metes un lápiz en un vaso de agua parece que está doblado. Esa es la
distorsión que introduce el medio (el agua). El L1C es como ver el lápiz
desde afuera del vaso — ya tiene la distorsión del "agua" (la atmósfera).
El L2A es como sacar el lápiz del vaso y verlo directo — sin la distorsión.
Para medir el lápiz correctamente, necesitas sacarlo del vaso primero.

### Cómo descargar la imagen para el curso

**Antes de la clase debes hacer esto:**

1. Ir a **browser.dataspace.copernicus.eu**
2. Crear cuenta gratuita (si no la tienes)
3. Buscar la zona: municipio de Ciénaga o Fundación, Magdalena, Colombia
4. Filtrar por:
   - Tipo de producto: Sentinel-2 L2A (ya corregida atmosféricamente)
   - Cobertura de nubes: menos del 10%
   - Período: enero–marzo de 2024 (temporada seca, menos nubes)
5. Descargar el archivo .SAFE (pesa entre 600 MB y 1 GB)
6. También descargar la imagen del mismo período para 2018
   (para mostrar el cambio temporal en la sesión — 2018 es el año más antiguo
   con buena disponibilidad Sentinel-2 en la zona; el satélite no existía
   antes de junio de 2015)
7. Guardar todo en USB para llevar al aula

**Nota importante:** descarga también una imagen de la misma zona pero de la
temporada húmeda (octubre–noviembre) para mostrar el contraste de nubosidad.
Esa imagen tendrá muchas nubes y servirá para explicar visualmente por qué
el preprocesamiento y el manejo de nubes es un problema real en el Caribe colombiano.

---

## BLOQUE 2 — Preprocesamiento: por qué es obligatorio (60 minutos)

### La analogía maestra del preprocesamiento

Imagina que eres un juez en un concurso de fotografía. Los participantes debían
fotografiar el mismo paisaje pero cada uno lo hizo en un día diferente, a una hora
diferente, con diferente neblina y diferente ángulo de sol. Cuando intentas comparar
las fotos para evaluar el paisaje, no puedes — las diferencias son del ambiente,
no del paisaje.

El preprocesamiento es el proceso de "normalizar" todas las imágenes para que
las diferencias que veas sean del suelo y no de las condiciones atmosféricas
o geométricas del momento en que se tomó la foto.

Hay tres tipos de correcciones. Cada una elimina un tipo diferente de "ruido".

---

### Corrección Radiométrica

**Qué es:**
El sensor del satélite mide energía en valores digitales crudos llamados
DN (Digital Numbers). Estos valores dependen de cómo está calibrado el sensor
en ese momento — la ganancia del instrumento, el ruido electrónico, la
degradación del sensor con el tiempo. La corrección radiométrica convierte
esos DN en valores físicos reales de radiancia o reflectancia.

**Analogía — el termómetro descalibrado:**
Tienes dos termómetros. Uno dice 36.5°C y el otro dice 37.2°C para la misma
persona. ¿Cuál tiene razón? Ninguno si no están calibrados contra un estándar.
La corrección radiométrica es calibrar el "termómetro" del satélite contra
estándares físicos conocidos para que sus lecturas sean comparables con
las de otros satélites y con mediciones en campo.

**En la práctica:**
Para Sentinel-2 L2A esto ya viene hecho. Los valores que descargas ya están
en unidades de reflectancia de superficie (multiplicados por 10.000 para
evitar decimales — así que un valor de 1000 en SNAP equivale a reflectancia
de 0.10 o 10%).

**Por qué importa para el Artículo 1:**
Si comparas el NDVI de una imagen de 2018 con una de 2024 sin corrección
radiométrica, podrías concluir que el cultivo cambió cuando en realidad
el sensor simplemente estaba más degradado en 2018 que en 2024.

---

### Corrección Atmosférica

**Qué es:**
La atmósfera no es transparente. Absorbe y dispersa parte de la energía
antes de que llegue al suelo (iluminación) y otra parte antes de que llegue
al sensor (reflectancia). Esto añade "ruido" a la imagen que no tiene nada
que ver con el suelo. La corrección atmosférica elimina ese efecto.

**Los dos efectos atmosféricos que hay que corregir:**

**1. Absorción:** ciertos gases (vapor de agua, CO₂, ozono) absorben energía
en longitudes de onda específicas. Por eso las bandas de Sentinel-2 están
diseñadas para evitar esas regiones del espectro — están en las "ventanas
atmosféricas" donde la absorción es mínima.

**2. Dispersión (Scattering):** las moléculas de aire y las partículas en
suspensión (polvo, aerosoles) dispersan la luz en todas las direcciones.
La dispersión de Rayleigh es la que hace que el cielo sea azul — las
longitudes de onda cortas (azul) se dispersan más que las largas (rojo).
Esto hace que la banda azul de Sentinel-2 tenga siempre un "velo" adicional
que no es del suelo.

**Analogía — las gafas de sol polarizadas:**
Cuando manejas con sol de frente, la luz que viene del asfalto te encandila
y no puedes ver bien. Las gafas polarizadas eliminan esa luz "extra" que
viene del reflejo del asfalto y te dejan ver la carretera tal como es.
La corrección atmosférica hace exactamente eso: elimina la luz "extra"
que viene de la atmósfera y te deja ver el suelo tal como es.

**Otra analogía — la foto con niebla:**
Tomas dos fotos del mismo bosque: una con cielo despejado y otra con niebla
ligera. En la foto con niebla todo se ve más grisáceo y los colores menos
saturados. Si comparas los "colores" de ambas fotos para sacar conclusiones
sobre el bosque, las conclusiones son falsas. La corrección atmosférica
"quita la niebla" de la imagen.

**El algoritmo Sen2Cor:**
Para Sentinel-2 L1C, la corrección atmosférica se hace con Sen2Cor — un
plugin que viene integrado en SNAP. Toma la imagen L1C, modela la atmósfera
usando información auxiliar (presión, vapor de agua, ozono) y produce la
imagen L2A. Por eso cuando descargas directamente L2A, esto ya está hecho.

**En clase:** muestra una imagen L1C vs. L2A de la misma zona. La diferencia
más visible es que la banda azul se ve más "limpia" en L2A y los valores
de NDVI son más altos y más confiables.

---

### Corrección Geométrica

**Qué es:**
Las imágenes satelitales tienen distorsiones geométricas — los objetos no
están exactamente donde deberían estar en el mapa real. Estas distorsiones
vienen de la curvatura de la Tierra, el movimiento del satélite, la variación
en la altitud del terreno (topografía), y el ángulo de visión del sensor.
La corrección geométrica ajusta la imagen para que cada pixel corresponda
exactamente a su posición real en la superficie terrestre.

**Analogía — la foto aérea oblicua:**
Cuando fotaografías un edificio desde un ángulo, el edificio parece inclinado
y las esquinas no coinciden con el mapa del lote. Si quieres usar esa foto
para medir el edificio, primero tienes que "enderezarla" — corregir la
perspectiva para que todo quede en su posición correcta. Eso es la corrección
geométrica.

**El efecto topográfico:**
En zonas montañosas como la SNSM, el relieve causa una distorsión adicional.
Una ladera que mira hacia el satélite recibe más iluminación y aparece más
brillante que la misma ladera en la sombra. Para corregir esto se usa el
DEM (Modelo Digital de Elevación) del terreno.

**Los dos tipos de corrección geométrica:**

**Ortorrectificación:** corrige tanto el ángulo del sensor como el efecto
del relieve usando un DEM. Produce una ortofoto donde cada pixel está en su
posición geográfica correcta. Sentinel-2 L2A ya viene ortorrectificado.

**Registro (Co-registration):** alinear dos imágenes de la misma zona tomadas
en fechas diferentes para que los píxeles coincidan exactamente. Si el pixel
(100, 200) de la imagen de 2018 corresponde a una esquina de una finca,
el pixel (100, 200) de la imagen de 2024 debe corresponder exactamente al
mismo punto en el suelo. Sin esto, la comparación multitemporal es imposible.

**Por qué es crítico para el Artículo 1:**
Cuando comparas NDVI de 2018 vs. 2024, si las imágenes no están perfectamente
alineadas, un pixel que en 2018 era bosque puede corresponder a una carretera
en 2024 simplemente porque la imagen está desplazada unos metros. Eso destruye
el análisis multitemporal.

**Buena noticia:** Sentinel-2 tiene un sistema de georreferenciación muy preciso
(error < 12 m). Para la mayoría de los análisis a escala regional, el
co-registro entre imágenes Sentinel-2 de distintas fechas es suficientemente
bueno sin corrección adicional. Landsat tiene más variabilidad y a veces
requiere co-registro manual.

---

### Enmascaramiento de nubes (Cloud Masking)

Este no es una "corrección" formal pero es parte esencial del preprocesamiento
y probablemente la tarea que más tiempo consume en teledetección tropical.

**El problema:**
En el Caribe colombiano hay entre 60–80% de días nublados en temporada húmeda.
Una nube sobre un pixel hace que el valor de ese pixel sea inútil — estás
midiendo la nube, no el suelo. Si calculas NDVI sobre un pixel nublado,
obtienes un valor completamente falso.

**La solución:**
Sentinel-2 L2A incluye una banda llamada SCL (Scene Classification Layer)
que clasifica automáticamente cada pixel en categorías: vegetación, suelo
desnudo, agua, nubes, sombra de nubes, nieve, etc. Usando la SCL puedes
crear una máscara que "tapa" todos los pixels nublados y solo analiza los
pixels limpios.

**Analogía — el enmarcado de foto:**
Tienes una foto familiar donde alguien pasó en el momento y tapó parte de
la foto. No puedes ver lo que hay detrás de esa persona. Lo que haces es
recortar esa parte y solo analizar lo que está visible. El cloud masking
hace exactamente eso: recorta los píxeles con nubes y deja solo los visibles.

**Por qué importa para el Artículo 1:**
Cuando calculas el NDVI promedio de una zona para comparar entre años,
necesitas asegurarte de que estás comparando zonas sin nubes. Si en 2018
la imagen tenía 30% de nubes y en 2024 solo 5%, el NDVI promedio va a ser
diferente no por el cambio del cultivo sino porque tienes más pixels válidos
en 2024. La máscara de nubes resuelve ese problema.

---

## BLOQUE 3 — Índices Espectrales (75 minutos)

### Qué es un índice espectral

Un índice espectral es una fórmula matemática que combina los valores de
reflectancia de dos o más bandas para resaltar una característica específica
del suelo que no sería evidente mirando las bandas por separado.

**Analogía — los análisis de sangre:**
Un médico no te hace solo una medición. Te mide hemoglobina, leucocitos,
glucosa, colesterol — cada uno diagnostica una cosa diferente. Un índice
espectral es como uno de esos indicadores: combina varios valores para
diagnosticar algo específico del suelo. El NDVI diagnostica vigor de
vegetación. El NDWI diagnostica contenido de agua. El SAVI diagnostica
vegetación en zonas con suelo expuesto.

---

### NDVI — Normalized Difference Vegetation Index

**Es el índice más importante de la teledetección. Debes conocerlo perfectamente.**

**Fórmula:**
```
NDVI = (NIR - Rojo) / (NIR + Rojo)
```
Para Sentinel-2:
```
NDVI = (B8 - B4) / (B8 + B4)
```

**Rango de valores:** -1 a +1

**Por qué funciona — la explicación física:**
Recuerda de la sesión 1 que la vegetación sana:
- Absorbe mucho en rojo (la clorofila usa esa energía para fotosíntesis)
- Refleja mucho en NIR (la estructura interna de la hoja actúa como espejo)

Entonces para vegetación sana: NIR es alto, Rojo es bajo → NDVI alto (cercano a 1)
Para suelo desnudo: NIR y Rojo son similares → NDVI cercano a 0
Para agua: NIR es muy bajo (el agua absorbe en NIR) → NDVI negativo

**Valores de referencia para interpretar:**

| Valor NDVI | Interpretación |
|-----------|---------------|
| < 0 | Agua, nieve, nubes |
| 0.0 – 0.1 | Suelo desnudo, roca, arena |
| 0.1 – 0.2 | Vegetación muy escasa o muy estresada |
| 0.2 – 0.4 | Vegetación moderada, pasturas, cultivos jóvenes |
| 0.4 – 0.6 | Vegetación densa, cultivos en desarrollo |
| 0.6 – 0.9 | Vegetación muy densa y sana, bosque tropical, cacao adulto |

**Para el Artículo 1:**
El cacao agroforestal adulto con buen dosel tiene NDVI de 0.6–0.8.
El café de sombra tiene valores similares: 0.5–0.75.
La diferencia no es enorme en NDVI solo — por eso en el Artículo 3 añadimos
el SAR para discriminar mejor entre los dos cultivos.

**Lo que el NDVI NO puede hacer:**
- No distingue entre tipos de vegetación con dosel similar
- Se satura en vegetación muy densa (valores > 0.8 no reflejan diferencias reales)
- Es sensible al suelo expuesto cuando la cobertura vegetal es baja

**Analogía del NDVI para un ingeniero electrónico:**
Es exactamente igual a calcular la diferencia normalizada entre dos señales.
Si tienes dos sensores midiendo la misma señal con y sin ruido, la diferencia
normalizada te dice qué tan diferente es la señal. El NDVI hace eso entre
dos bandas del espectro: qué tan diferente es la respuesta en NIR vs. en Rojo.
Cuando esa diferencia es grande, hay vegetación. Cuando es pequeña, no hay.

---

### NDWI — Normalized Difference Water Index

**Fórmula (versión para contenido de agua en vegetación — la más usada en agricultura):**
```
NDWI = (NIR - SWIR) / (NIR + SWIR)
```
Para Sentinel-2:
```
NDWI = (B8 - B11) / (B8 + B11)
```

**Nota importante:** existe otra versión del NDWI (McFeeters, 1996) para detectar
cuerpos de agua usando Verde y NIR. En agricultura de precisión usamos la versión
de Gao (1996) con NIR y SWIR para medir agua en la vegetación.

**Por qué funciona:**
El SWIR es muy sensible al agua. Las moléculas de agua absorben fuertemente
en esa región. Cuando una planta tiene mucha agua en sus hojas (dosel húmedo),
absorbe más en SWIR → SWIR baja → NDWI sube.

**Valores de referencia:**
- NDWI alto (cercano a 1): vegetación con alto contenido de agua, dosel muy húmedo
- NDWI cercano a 0: vegetación con contenido moderado de agua
- NDWI negativo: suelo desnudo, vegetación muy seca o estresada hídricamante

**Para el Artículo 2 (conexión con la tesis):**
Este es el índice clave para estimar si el dosel del cacao tiene condiciones
de humedad que favorecen la esporulación de Moniliasis. Un NDWI alto sostenido
durante el período húmedo indica dosel con mucha agua acumulada — exactamente
las condiciones que favorecen a *M. roreri*.

---

### NDMI — Normalized Difference Moisture Index

**Fórmula:**
```
NDMI = (B8A - B11) / (B8A + B11)
```
Similar al NDWI pero usa la banda B8A (Red Edge NIR, 865 nm) en lugar de B8.
Es más preciso para estimar humedad foliar porque B8A es más estrecha y menos
afectada por la atmósfera.

---

### NDRE — Normalized Difference Red Edge Index

**Fórmula:**
```
NDRE = (B8A - B5) / (B8A + B5)
```

**Por qué es especial:**
La región Red Edge (alrededor de 700–730 nm) es donde la reflectancia de
la vegetación cambia abruptamente de absorber (en rojo) a reflejar (en NIR).
La posición exacta de ese cambio depende del contenido de clorofila.

Cuando una planta está bajo estrés nutricional o hídrico, la clorofila se
degrada y el "borde rojo" se desplaza hacia longitudes de onda más cortas.
El NDRE detecta ese desplazamiento antes de que aparezcan síntomas visuales.

**Ventaja sobre el NDVI:**
El NDVI se satura en vegetación muy densa (valores > 0.8 son indistinguibles).
El NDRE no se satura tan fácilmente y es más sensible a variaciones sutiles
en la salud del cultivo. Para un dosel de cacao denso donde el NDVI de todas
las parcelas es similar, el NDRE puede detectar diferencias de salud que
el NDVI no puede ver.

**Solo disponible en Sentinel-2:**
Landsat no tiene bandas Red Edge. Esta es una ventaja exclusiva de Sentinel-2
para agricultura de precisión. Los sensores del dron Parrot Sequoia también
tienen banda Red Edge.

---

### SAVI — Soil Adjusted Vegetation Index

**Fórmula:**
```
SAVI = 1.5 × (NIR - Rojo) / (NIR + Rojo + 0.5)
```
Para Sentinel-2:
```
SAVI = 1.5 × (B8 - B4) / (B8 + B4 + 0.5)
```

**Por qué existe:**
El NDVI tiene un problema en zonas donde el suelo está parcialmente expuesto
(cobertura vegetal < 50%). El color del suelo influye en los valores de
las bandas Rojo y NIR, distorsionando el NDVI. En zonas áridas, suelos
rojos, o cultivos jóvenes donde se ve el suelo entre las plantas, el NDVI
da valores incorrectos.

El SAVI añade una constante de ajuste (0.5 es el valor estándar, llamado
factor L) que compensa el efecto del suelo.

**Cuándo usar SAVI en lugar de NDVI:**
En zonas de cultivo donde las plantas son jóvenes o el dosel no cubre
completamente el suelo. En cacao adulto con dosel denso, el NDVI funciona
bien. En cacao recién sembrado o en zonas de transición donde aún se ve
suelo entre las plantas, el SAVI da resultados más precisos.

---

### EVI — Enhanced Vegetation Index

**Fórmula:**
```
EVI = 2.5 × (NIR - Rojo) / (NIR + 6×Rojo - 7.5×Azul + 1)
```
Para Sentinel-2:
```
EVI = 2.5 × (B8 - B4) / (B8 + 6×B4 - 7.5×B2 + 1)
```

**Por qué mejora el NDVI:**
El EVI corrige dos problemas del NDVI:
1. La saturación en vegetación muy densa (usa el azul para corregir)
2. El efecto del suelo (el denominador actúa como ajuste)

**Cuándo usar EVI:**
En bosques tropicales densos y sistemas agroforestales con dosel muy cerrado —
exactamente como el cacao de la SNSM. En esas condiciones el NDVI se satura
y el EVI sigue siendo sensible a diferencias de vigor.

---

### Tabla resumen de índices

| Índice | Fórmula S2 | Qué mide | Cuándo usarlo |
|--------|-----------|----------|---------------|
| NDVI | (B8-B4)/(B8+B4) | Vigor de vegetación general | Siempre como base |
| NDWI | (B8-B11)/(B8+B11) | Agua en la vegetación | Estrés hídrico, riesgo Moniliasis |
| NDMI | (B8A-B11)/(B8A+B11) | Humedad foliar precisa | Agricultura de precisión |
| NDRE | (B8A-B5)/(B8A+B5) | Contenido de clorofila | Estrés temprano, salud del cultivo |
| SAVI | 1.5×(B8-B4)/(B8+B4+0.5) | Vegetación con suelo expuesto | Cultivos jóvenes, zonas áridas |
| EVI | fórmula extendida | Vegetación densa sin saturación | Bosque, cacao adulto, dosel cerrado |

---

## BLOQUE 4 — LABORATORIO EN SNAP (150 minutos)

### Qué es SNAP y por qué lo usamos

SNAP (Sentinel Application Platform) es el software oficial de la ESA para
procesar imágenes Sentinel. Es gratuito, corre en Windows/Mac/Linux y está
diseñado específicamente para Sentinel-1 y Sentinel-2. También puede abrir
imágenes Landsat y otros formatos.

**Descarga:** step.esa.int/main/toolboxes/snap

### Paso a paso del laboratorio

---

#### Paso 1 — Abrir la imagen Sentinel-2 en SNAP

1. Abrir SNAP
2. Menú: **File → Open Product**
3. Navegar hasta la carpeta de la imagen descargada (archivo .SAFE)
4. Dentro del .SAFE, seleccionar el archivo **MTD_MSIL2A.xml**
5. Click en Open

**Qué verás:**
En el panel izquierdo (Product Explorer) aparecerá la imagen con todas sus
bandas organizadas. Verás carpetas: Bands (con B1 a B12 y B8A), Masks,
Tie-Point Grids, etc.

**Nota para el docente:**
Muestra primero tú en pantalla proyectada, paso a paso. Luego que los
estudiantes lo repliquen. No avances hasta que todos tengan la imagen abierta.

---

#### Paso 2 — Explorar las bandas

1. En el Product Explorer, expandir la carpeta **Bands**
2. Doble click en **B4** (banda roja) → se abre una ventana con la imagen en escala de grises
3. Doble click en **B8** (NIR) → se abre otra ventana
4. Observar las diferencias: en B8 la vegetación aparece muy brillante (alta reflexión
   en NIR), en B4 aparece más oscura (la vegetación absorbe en rojo)

**Qué decirles:**
*"Esta diferencia entre lo oscuro en B4 y lo brillante en B8 es exactamente
lo que el NDVI va a capturar matemáticamente. Estamos viendo con los ojos
lo que el índice va a calcular con números."*

---

#### Paso 3 — Crear una composición a color natural (RGB)

Una composición RGB asigna tres bandas a los canales Rojo, Verde y Azul
de la pantalla para crear una imagen a color.

**Color natural (lo que vería el ojo humano):**
- Canal Rojo ← Banda B4 (rojo del espectro)
- Canal Verde ← Banda B3 (verde del espectro)
- Canal Azul ← Banda B2 (azul del espectro)

**Cómo hacerlo en SNAP:**
1. Menú: **Window → Open RGB Image Window**
2. En el diálogo: Red = B4, Green = B3, Blue = B2
3. Click OK

**Resultado:** una imagen que se ve como una foto aérea convencional.
Los cultivos se ven verdes, las zonas urbanas grises, el agua azul/negra.

---

#### Paso 4 — Composición en falso color (la más útil para vegetación)

**Falso color estándar para vegetación:**
- Canal Rojo ← Banda B8 (NIR)
- Canal Verde ← Banda B4 (rojo)
- Canal Azul ← Banda B3 (verde)

**Cómo hacerlo:**
1. Window → Open RGB Image Window
2. Red = B8, Green = B4, Blue = B3

**Resultado:** la vegetación sana aparece en color rojo brillante (porque
refleja mucho en NIR que está asignado al canal rojo de la pantalla).
El suelo desnudo aparece en tonos café/verde. El agua aparece azul oscuro.

**Qué decirles:**
*"Este rojo brillante que ven es el NIR — la vegetación lo refleja
intensamente. Cuanto más rojo, más sana y densa es la vegetación.
Esta composición la inventaron en los años 70 y sigue siendo la más
usada en el mundo para analizar vegetación."*

---

#### Paso 5 — Calcular el NDVI en SNAP

**Método 1: Band Math (el más directo)**

1. Menú: **Raster → Band Math**
2. En el campo de expresión escribir:
```
(B8 - B4) / (B8 + B4)
```
3. En "Target band name" escribir: **NDVI**
4. Click OK

**Método 2: Índices predefinidos (más fácil para estudiantes)**

SNAP tiene una herramienta de índices de vegetación predefinidos:
1. Menú: **Optical → Thematic Land Processing → Vegetation Radiometric Indices**
2. Seleccionar el producto
3. Marcar NDVI
4. Click Run

**Visualizar el NDVI:**
1. Doble click en la banda NDVI recién creada
2. En el panel de color (Color Manipulation), aplicar una paleta de colores:
   - Click derecho en la barra de colores → "Import color palette"
   - O ajustar manualmente: rojo para valores bajos, verde para valores altos
3. El resultado debe mostrar vegetación densa en verde brillante y
   suelo/agua en rojo/amarillo

**Explorar los valores:**
- Mueve el cursor sobre diferentes zonas de la imagen
- En la barra de estado abajo verás el valor exacto de NDVI de cada pixel
- Pide a los estudiantes que identifiquen: ¿dónde está el NDVI más alto?
  ¿dónde está el más bajo? ¿coincide con lo que esperaban?

---

#### Paso 6 — Subset: recortar al área de estudio

La imagen completa de Sentinel-2 cubre 100×100 km. Para trabajar más rápido,
recortamos solo la zona de interés (Ciénaga/Fundación).

1. Menú: **Raster → Subset**
2. En la pestaña "Spatial Subset":
   - Seleccionar "Geo Coordinates"
   - Ingresar coordenadas aproximadas de la zona cacaotera:
     - North: 11.0° | South: 10.5° | West: -74.2° | East: -73.8°
3. En "Band Subset": seleccionar solo las bandas que necesitas (B2, B3, B4, B8, B11)
4. Click OK

**Por qué hacer esto:**
Una imagen completa Sentinel-2 pesa ~600 MB. El subset de la zona de interés
pesa ~50 MB y procesa 10 veces más rápido. En un laboratorio con varios
estudiantes corriendo SNAP simultáneamente, esto es crítico.

---

#### Paso 7 — Exportar el NDVI como GeoTIFF

1. Click derecho sobre el producto con NDVI en el Product Explorer
2. **File → Export → GeoTIFF**
3. Seleccionar solo la banda NDVI
4. Guardar como: `NDVI_Magdalena_2024_Enero.tif`

Este archivo puede abrirse en QGIS para visualización y análisis adicional.

---

### Qué mostrar al grupo durante el laboratorio

**Momento 1 — Apertura del laboratorio (1 PM):**
Antes de que toquen el computador, muestra tú en pantalla grande la imagen
ya abierta en SNAP con la composición falso color. Que el primer impacto
visual sea impresionante — la Sierra Nevada, el río Magdalena, la Ciénaga
Grande, todo en una sola imagen.

**Momento 2 — Cuando tengan el NDVI calculado:**
Muestra en pantalla el NDVI de la imagen de 2024 junto al NDVI de la imagen
de 2018 (que ya tienes descargada). La diferencia visual en la zona cacaotera
es el "momento eureka" de la sesión: se ve cómo el NDVI cambia en ciertas
zonas de la SNSM entre los dos años.

**Momento 3 — Exploración libre (15 minutos):**
Da 15 minutos para que exploren libremente: que midan el NDVI de distintas
zonas, que comparen la composición color natural vs. falso color, que traten
de identificar el cauce del Río Magdalena, la Ciénaga Grande, las zonas
urbanas de Ciénaga. El aprendizaje por exploración libre en estos minutos
vale más que 30 minutos de instrucción.

---

## BLOQUE 5 — Clasificación de imágenes (90 minutos)

### Qué es clasificar una imagen satelital

Clasificar una imagen es asignar a cada pixel una categoría de cobertura
(cacao, café, bosque, suelo desnudo, agua) basándose en sus valores espectrales.
El resultado es un mapa temático donde cada color representa una cobertura.

**Analogía — el diagnóstico médico por síntomas:**
Un médico tiene una lista de síntomas y para cada combinación de síntomas
asigna un diagnóstico. El clasificador satelital tiene una lista de valores
espectrales (los "síntomas") y para cada combinación asigna una cobertura
(el "diagnóstico"). Si un pixel tiene NIR alto, Rojo bajo y NDWI moderado,
el clasificador lo diagnostica como vegetación densa sana.

### Clasificación No Supervisada

**Qué es:**
El algoritmo agrupa los pixels en categorías por similitud espectral sin
que tú le digas de antemano qué categorías existen. Es como decirle a
alguien que agrupe canicas por color sin decirle cuántos colores hay.

**Algoritmo más común: K-means**
Funciona así:
1. El usuario define cuántos grupos (K) quiere (ejemplo: K=5)
2. El algoritmo asigna aleatoriamente K "centros" en el espacio espectral
3. Cada pixel se asigna al centro más cercano
4. Los centros se recalculan como el promedio de los pixels de cada grupo
5. Se repite hasta que los grupos se estabilizan

**Cuándo usarla:**
Cuando no tienes datos de campo para entrenar el clasificador. Útil para
una primera exploración de qué tipos de cobertura existen en la imagen.

**Limitación principal:**
El algoritmo crea grupos espectrales pero tú tienes que interpretar manualmente
qué significa cada grupo. Un grupo puede corresponder a "cacao adulto" pero
tú tienes que ir al campo o usar Google Earth para confirmarlo.

### Clasificación Supervisada

**Qué es:**
Tú le "enseñas" al algoritmo qué aspecto espectral tiene cada categoría
dibujando áreas de entrenamiento (ROIs — Regions of Interest) sobre zonas
donde sabes con certeza qué cobertura hay. Luego el algoritmo clasifica
el resto de la imagen basándose en lo que aprendió.

**Analogía — entrenar a un perro:**
Le muestras al perro (el algoritmo) varias fotos de gatos diciendo "esto es
un gato", y varias fotos de perros diciendo "esto es un perro". Luego el perro
puede identificar si una foto nueva es gato o perro. Tus ROIs son las fotos
de entrenamiento.

**Pasos en la clasificación supervisada:**
1. Dibujar ROIs sobre zonas conocidas de cada cobertura
   (mínimo 30–50 ROIs por clase para publicación)
2. El algoritmo aprende la firma espectral de cada clase
3. Se clasifica toda la imagen
4. Se valida con puntos de campo no usados en el entrenamiento

**Algoritmos más comunes:**

**Máxima Verosimilitud (Maximum Likelihood):**
Asume que los datos espectrales de cada clase siguen una distribución normal.
Es el más clásico y sigue siendo válido para imágenes con pocas bandas.

**Random Forest:**
Un ensemble de árboles de decisión. Cada árbol vota y gana la clase
con más votos. Más robusto, maneja bien muchas bandas y clases.
Es el estándar actual en teledetección. Lo que usamos en los artículos 1, 2 y 3.

**Support Vector Machine (SVM):**
Busca el hiperplano que mejor separa las clases en el espacio espectral.
Muy eficiente con pocas muestras de entrenamiento.

### Validación de la clasificación

Toda clasificación supervisada debe validarse. No es opcional para publicación.

**Método:** usar un conjunto de puntos de validación (independientes de los
de entrenamiento) y comparar la clase predicha con la clase real observada.

**Métricas que reportar:**

**Overall Accuracy:** porcentaje total de pixels correctamente clasificados.
Meta mínima para publicación en Q1: ≥ 85%

**Kappa Coefficient:** mide el acuerdo entre la clasificación y la realidad
corrigiendo el acuerdo por azar. Rango 0–1.
- < 0.4: acuerdo pobre
- 0.4–0.6: acuerdo moderado
- 0.6–0.8: acuerdo sustancial
- > 0.8: acuerdo casi perfecto
Meta para publicación: Kappa ≥ 0.80

**Matriz de confusión:** tabla donde las filas son las clases reales y
las columnas son las clases predichas. Te muestra exactamente dónde
se confunde el clasificador (por ejemplo: café confundido con cacao).

**En clase:** no hagas la clasificación completa hoy — el tiempo no alcanza.
Muestra el resultado ya hecho: un mapa clasificado de la zona cacaotera
donde se distinguen café, cacao, bosque y pasturas. Que lo vean e interpreten.
En la sesión 3 ellos la ejecutan.

---

## BLOQUE 6 — Cierre de la sesión (30 minutos)

### Resumen de conceptos del día

Dedica 15 minutos a un cierre estructurado. Pregunta al grupo:

- *"¿Cuál es la diferencia entre una imagen L1C y una L2A?"*
- *"¿Por qué no podemos calcular NDVI sobre una imagen con nubes?"*
- *"Si el NDVI de una zona es 0.75, ¿qué nos dice eso sobre esa zona?"*
- *"¿Qué tiene el NDRE que no tiene el NDVI?"*

No esperes respuestas perfectas. El objetivo es que el grupo consolide
lo que vio durante el día.

### Tarea para casa

1. En SNAP: calcular el NDWI y el SAVI de la misma imagen que trabajaron hoy
2. Exportar ambos índices como GeoTIFF
3. Abrir los tres índices en QGIS (NDVI, NDWI, SAVI) y comparar visualmente
   qué zonas cambian entre uno y otro
4. Escribir media página respondiendo: ¿en qué zonas de la imagen el NDWI
   y el NDVI dan información diferente? ¿Por qué crees que ocurre eso?

---

## NOTAS DEL DOCENTE — Preguntas frecuentes sesión 2

**"¿Por qué dividimos por la suma en el NDVI en lugar de solo restar?"**
La normalización (dividir por la suma) hace que el índice sea independiente
de la intensidad de la iluminación. Si el Sol está más alto o más bajo, los
valores absolutos de B8 y B4 cambian, pero su diferencia normalizada permanece
relativamente estable. Sin la normalización, no podrías comparar imágenes
de distintas fechas confiablemente.

**"¿Por qué Sentinel-2 tiene 13 bandas y no 100?"**
Porque hay un trade-off entre número de bandas, peso del archivo y tiempo
de procesamiento. 13 bandas cubren las regiones espectrales más informativas
para aplicaciones terrestres. Los sensores hiperespectrales con 200+ bandas
existen (AVIRIS, PRISMA) pero generan archivos enormes y requieren mayor
capacidad de procesamiento. Para agricultura, 13 bandas son suficientes.

**"¿El NDVI negativo significa que algo está mal?"**
No necesariamente. NDVI negativo es normal en agua, nieve, nubes y algunas
superficies artificiales. Solo es preocupante si aparece en una zona donde
debería haber vegetación.

**"¿Cuándo se usa QGIS y cuándo SNAP?"**
SNAP es mejor para procesar imágenes Sentinel (correcciones, cálculo de índices,
clasificación en imágenes de satélite). QGIS es mejor para análisis espacial,
combinar capas de distintas fuentes, hacer mapas finales con cartografía.
En la práctica, los dos se complementan: procesas en SNAP y visualizas/analizas en QGIS.

---

## RESUMEN DE CONCEPTOS CLAVE — Sesión 2

- **Imagen pasiva:** capta energía solar reflejada por la superficie
- **L1C:** imagen sin corregir (Top of Atmosphere)
- **L2A:** imagen corregida atmosféricamente (Surface Reflectance) → siempre usar esta
- **Corrección radiométrica:** convierte DN en valores físicos reales
- **Corrección atmosférica:** elimina el efecto de la atmósfera (niebla, aerosoles)
- **Corrección geométrica:** alinea la imagen con la posición real en el mapa
- **Cloud masking:** elimina pixels con nubes antes del análisis
- **NDVI:** vigor de vegetación general (NIR-Rojo)/(NIR+Rojo)
- **NDWI:** agua en la vegetación (NIR-SWIR)/(NIR+SWIR)
- **NDRE:** contenido de clorofila, Red Edge, Sentinel-2 exclusivo
- **SAVI:** NDVI corregido para suelo expuesto
- **EVI:** NDVI mejorado para vegetación muy densa
- **Clasificación no supervisada:** K-means, agrupa sin etiquetas previas
- **Clasificación supervisada:** Random Forest, SVM, aprende de ROIs etiquetados
- **Overall Accuracy:** métrica de validación, meta ≥ 85%
- **Kappa:** métrica de acuerdo, meta ≥ 0.80

---

*Documento elaborado para uso interno del docente. Sesión 2 — Sábado 18 de julio de 2026.*
*Miguel Ángel Polo Castañeda — Maestría en Ingeniería, Universidad del Magdalena.*
