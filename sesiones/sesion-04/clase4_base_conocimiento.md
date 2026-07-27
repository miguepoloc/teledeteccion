# Sesión 4 — Base de Conocimiento del Docente
## Drones + Python para Teledetección
### Maestría en Ingeniería — Universidad del Magdalena
#### [Fecha a definir por el docente]

> Este documento es tu guía personal, con el mismo espíritu que
> `sesion-02/clase2_base_conocimiento.md`: bloques agrupados por tema, cada
> uno con varias subsecciones relacionadas, analogías completas y las
> conexiones con tu investigación explícitas — no un horario minuto a
> minuto. Las duraciones son estimadas para dimensionar, no un límite
> rígido; tú decides después cómo distribuir esto en el tiempo real
> disponible.
>
> El hilo conductor de la sesión: los estudiantes pasan de entender la
> teoría completa de drones, a volar uno con sus propias manos, a procesar
> sus propias fotos por dos caminos (manual y automático), a extraer
> información científica de ellas, y a cerrar con un mapa profesional — el
> mismo tipo de figura que necesitan para su artículo final del curso.

---

## DISTRIBUCIÓN DEL DÍA

| Bloque | Tema | Duración estimada |
|--------|------|---------------------|
| 0 | Apertura | 10 min |
| 1 | Fundamentos del dron: qué es, tipos y cómo se maneja | 45 min |
| 2 | Dron y satélite: el P4M por dentro | 40 min |
| 3 | Precisión de los datos: posicionamiento, calibración y georreferenciación | 40 min |
| 4 | El problema del shift y la fotogrametría automática | 50 min |
| 5 | Preparación para volar: regulación AEROCIVIL y briefing | 35 min |
| 6 | El vuelo, rotativo por grupos | 90–120 min |
| 7 | Procesamiento de las fotos, por grupo (shift, georreferenciación, WebODM, firmas) | 130–150 min |
| 8 | Python: rasterio y Random Forest (Notebooks 07 y 08) | 180 min |
| 9 | Cierre en QGIS: georreferenciar y armar el mapa final | 55 min |
| 10 | GEE Demo: serie NDVI 2018–2025 zona bananera | 45 min |
| 11 | Propuesta de proyecto final | 30 min |

---

## BLOQUE 0 — Apertura (10 minutos)

Conecta con lo visto hasta ahora en el curso: *"Hasta hoy han trabajado con
imágenes satelitales — Sentinel-2, 10 metros de resolución, gratis, pero
sin control sobre cuándo pasa el satélite. Hoy cambian de escala por
completo: van a volar, procesar y analizar sus propias imágenes, capturadas
por ustedes mismos, con una resolución 200 veces más fina."*

---

## BLOQUE 1 — Fundamentos del dron: qué es, tipos y cómo se maneja

### Qué es un dron y por qué existe

**Definición:** un dron es un UAV (*Unmanned Aerial Vehicle*, vehículo
aéreo no tripulado). El sistema completo — vehículo + control remoto +
software de planificación + sensores — se llama UAS (*Unmanned Aerial
System*). Cuando alguien dice "el dron" en la práctica se refiere al UAS
completo, no solo al aparato que vuela.

**Origen (breve):** los primeros UAV fueron militares (reconocimiento y
blancos de práctica, desde principios del siglo XX). La miniaturización de
GPS, baterías de litio, IMUs y cámaras digitales en los años 2000–2010 hizo
posible el dron civil de bajo costo que existe hoy. En una década pasaron
de juguete de aficionado a herramienta profesional estándar en agricultura,
cartografía, inspección de infraestructura, cine y rescate.

**Por qué existe (funcional):** un satélite ya está en el cielo, pero tú no
decides cuándo pasa ni qué tan cerca mira. Un dron es lo contrario — vuela
donde tú quieras, cuando tú quieras, a la altura que tú definas. Esa
libertad tiene un costo: solo cubre un área pequeña por vuelo, y alguien
tiene que operarlo. Esa es la tensión central que se retoma en el Bloque 2.

### Tipos de drones

**Por configuración aerodinámica:**

| Tipo | Despegue/aterrizaje | Autonomía típica | Cobertura por vuelo | Ejemplo |
|------|---------------------|-------------------|----------------------|---------|
| Multirotor (quad/hexa/octocóptero) | Vertical (VTOL), hace *hover* | 15–30 min | Pequeña (unas pocas hectáreas) | **P4M — el que vamos a volar hoy** |
| Ala fija | Necesita pista o catapulta, no hace *hover* | 45–90 min | Grande (cientos de hectáreas) | senseFly eBee, WingtraOne |
| Híbrido VTOL | Vertical como multirotor, vuelo horizontal como ala fija | Intermedia-alta | Intermedia-grande | Quantum Systems Trinity |

*"Nosotros usamos multirotor porque nuestras parcelas son pequeñas y
necesitamos poder despegar desde cualquier claro sin pista. Si tuviéramos
que mapear todo un municipio, un ala fija sería la opción correcta — más
autonomía, más área, menos detalle por batería."*

**Por sensor que carga (payload):**

| Sensor | Para qué sirve |
|--------|-----------------|
| RGB | Fotografía, inspección visual, cine |
| Multiespectral | Agricultura de precisión — **nuestro caso** |
| Térmico | Estrés hídrico, fugas, incendios, fauna nocturna |
| LiDAR | Modelos de elevación de alta precisión, forestal, ingeniería civil |
| Hiperespectral | Decenas/cientos de bandas — investigación avanzada, muy costoso |

**Por categoría regulatoria (peso y tipo de operación):** se explica en
detalle en el Bloque 5 (AEROCIVIL) — adelanta que existe y que el P4M cae
en la categoría más simple (Abierta).

### Cómo se maneja un dron

**Componentes de control:**
- **Control remoto (RC):** joysticks para *throttle* (altura), *yaw*
  (giro), *pitch/roll* (adelante-atrás, lateral). Un smartphone o tablet
  acoplado corre la app (DJI Pilot / GS Pro) que muestra video en vivo y
  telemetría.
- **GNSS (GPS/GLONASS/Beidou) + IMU** (unidad de medición inercial:
  acelerómetros + giroscopios): le dan al dron su posición y orientación en
  todo momento. Sin esto, el dron no sabe dónde está ni hacia dónde apunta.
  (El Bloque 3 profundiza en qué tan preciso es ese posicionamiento y en
  qué se calibra automáticamente vs. manualmente.)

**Modos de vuelo:**
- **Manual / ATTI:** el piloto controla todo; el dron solo estabiliza la
  actitud, sin usar GPS. Se usa cuando la señal GPS falla o en emergencias.
- **GPS / P-mode:** el dron mantiene posición y altura por sí solo; el
  piloto se concentra en la dirección. Es el modo de vuelo asistido normal.
- **Misión automática (waypoints / grid mission):** se programa una malla
  de vuelo — altura, velocidad, traslape — y el dron la ejecuta solo. **Es
  el modo que usamos hoy:** garantiza cobertura sistemática y repetible,
  algo que un vuelo 100% manual no puede asegurar con la precisión que
  necesita la fotogrametría.

**Return-to-Home (RTH):** el P4M calcula continuamente la energía necesaria
para volver al punto de despegue. Cuando la batería baja del 30% (o si se
pierde la señal del control), activa RTH automático: calcula la ruta, la
energía disponible, y regresa solo si detecta que el margen se agota. Esta
función ha evitado la pérdida de muchos drones — pero no reemplaza vigilar
el nivel de batería activamente.

---

## BLOQUE 2 — Dron y satélite: el P4M por dentro

### Por qué seguimos necesitando satélites si tenemos drones

| | Sentinel-2 | Dron P4M |
|--|-----------|----------|
| Resolución | 10 m/px | 5.3 cm/px (a 50 m) |
| Cobertura | Global, automática | Área pequeña, requiere operador |
| Frecuencia | Cada 5 días | Cuando el investigador quiere |
| Costo por vuelo | Gratis | Tiempo del piloto + batería |
| Para qué sirve | Monitoreo regional, series temporales | Parcelas experimentales, diagnóstico preciso |

*"Sentinel-2 te dice si hay un problema en 10 hectáreas. El dron te dice
exactamente en qué planta está el problema. Ninguno reemplaza al otro —
hoy vamos a ver la bananera a 5 centímetros con el dron, y en el Bloque 10
la vamos a ver a 10 metros pero con 7 años de historia, gracias a
Sentinel-2. Son dos preguntas distintas que necesitan dos herramientas
distintas."*

### El DJI Phantom 4 Multispectral: sus 6 cámaras

Haz que cada uno lo tome con las manos mientras explicas. El aprendizaje
táctil funciona.

**Las 6 cámaras:** una RGB (como la del celular) y cinco cámaras
multiespectrales, cada una con un filtro de interferencia que solo deja
pasar una longitud de onda específica.

| Cámara | λ central | Analogía |
|--------|-----------|---------|
| RGB | visible | *"La que ve lo que ven tus ojos"* |
| Blue | 450 nm | *"La que ve lo que ven tus ojos, pero solo el azul"* |
| Green | 560 nm | *"La que ve solo el verde"* |
| Red | 650 nm | *"La que ve solo el rojo — donde la clorofila absorbe"* |
| Red Edge | 730 nm | *"La que ve el borde del infrarrojo — invisible al ojo humano"* |
| NIR | 840 nm | *"La que ve el infrarrojo cercano — donde la vegetación sana refleja más"* |

**El GSD:** *"GSD significa Ground Sampling Distance — la distancia en el
suelo que representa cada píxel. A 50 metros de altura, el GSD del P4M es
5.29 centímetros. Eso significa que cada píxel representa un cuadrado de
poco más de 5 cm de lado en el suelo. ¿Qué tan grande es una hoja de
banano? Entre 20 y 30 cm de ancho. O sea, en cada hoja de banano caben
entre 4 y 6 píxeles por lado — lo suficiente para detectar manchas de
Sigatoka Negra."*

### Por qué el P4M multiespectral específicamente

Justifica la elección del instrumento — esto es lo que le explicarías a un
jurado de tesis o a un revisor de artículo si preguntara "¿por qué este
sensor y no otro?".

**Frente a un dron RGB genérico:** un dron de cámara normal solo captura 3
bandas visibles (Red, Green, Blue) — no tiene NIR, así que **no permite
calcular NDVI real**, solo aproximaciones con índices de color (como el
VARI) mucho menos confiables.

**Frente a un rig separado (ej. MicaSense RedEdge o Parrot Sequoia montado
en un dron aparte):** da más flexibilidad para elegir bandas específicas,
pero exige integrar tú mismo el sensor en un dron, sincronizar disparos,
calibrar por separado, y cargar con dos sistemas distintos (dron + cámara)
en vez de uno. Más control, mucha más complejidad operativa.

**El P4M:** todo integrado en una sola plataforma de un mismo fabricante —
5 bandas espectrales + RGB + sunshine sensor + GPS (con opción de RTK/GCPs
para mayor precisión, ver Bloque 3), un solo firmware, un solo flujo de
procesamiento con WebODM. Menor curva de aprendizaje, ideal para
investigación aplicada donde el objetivo es el dato, no la ingeniería del
sensor.

**Las bandas del P4M no son arbitrarias:** Blue/Green/Red/Red Edge/NIR
replican deliberadamente las bandas más usadas de Sentinel-2 — eso permite
**comparar directamente resultados de dron contra satélite**, algo que ya
van a hacer en el Bloque 10 de hoy y que es central para la tesis y para
el paper CONCAPAN 2022 que se menciona más adelante.

**Costo-beneficio:** frente a un sensor hiperespectral o LiDAR (varias
veces más costosos), el P4M da exactamente las bandas necesarias para
todos los índices espectrales estándar que ya dominan del curso — NDVI,
NDRE, SAVI, NDMI — al costo de un dron "prosumer" integrado, no de un
instrumento de investigación de laboratorio.

---

## BLOQUE 3 — Precisión de los datos: posicionamiento, calibración y georreferenciación

Este bloque agrupa las tres preguntas que un revisor de artículo o un
jurado de tesis va a hacer sobre cualquier mapa hecho con dron: *¿qué tan
bien ubicado está?*, *¿qué tan confiables son los valores?*, y *¿cómo sé
que apunta hacia donde dice que apunta?*

### GPS estándar, RTK y GCPs — qué tan bien ubicado está el dato

El GPS estándar que trae la mayoría de los drones — incluido nuestro
P4M — tiene un error típico de posición de **1.5 a 3 metros**. A la escala
de un mapa de Sentinel-2 (10 m/px) ese error es irrelevante. Pero cuando
trabajamos a 5 cm/px con el dron, un error de metros significa que el
punto que crees estar midiendo puede estar varias plantas más allá del
real.

**Qué es RTK (Real-Time Kinematic):** una técnica de corrección GNSS **en
tiempo real**. Una **estación base** — en un punto fijo cuya posición se
conoce con altísima precisión — recibe la misma señal satelital que el
dron (el "*rover*") y calcula, en ese instante y lugar, cuánto error tiene
la señal (por atmósfera, reloj del satélite, reflejos/*multipath*). Esa
corrección se transmite en tiempo real al rover (por radio o red móvil,
protocolo NTRIP), que la aplica a su propia posición GPS. Resultado:
**2–5 centímetros de error, en vez de 1.5–3 metros.**

**Analogía:** *"Imaginen que ustedes y un amigo miden la hora con su reloj,
pero su reloj se atrasa siempre 3 minutos y ustedes no lo saben. Si su
amigo tiene un reloj atómico perfecto al lado y les dice en tiempo real
'tu reloj va atrasado exactamente 3 minutos con 12 segundos ahora mismo',
ustedes corrigen al instante. Eso es RTK: la estación base es el reloj
perfecto que le dice al dron cuánto error tiene su GPS en cada momento."*

**Aclaración importante — nuestro P4M NO trae RTK integrado:** existe un
modelo específico, el "Phantom 4 RTK", con módulo RTK de fábrica. El
Phantom 4 **Multispectral** que usamos hoy trae GPS de consumo estándar,
sin RTK integrado. No asuman que "como es un P4, ya trae RTK" — es un
error común.

**La alternativa (o complemento): GCPs — Ground Control Points.** Sin un
dron con RTK integrado, se puede lograr precisión centimétrica de otra
forma: colocando **puntos de control terrestre** antes del vuelo —
marcadores visibles (placas blanco-y-negro, cruces pintadas) distribuidos
por el área, fotografiables claramente desde el aire. Sus coordenadas
exactas se miden **una sola vez**, con un GPS RTK de mano o equipo
topográfico. Esas coordenadas se cargan en WebODM durante el
procesamiento, y el software ajusta todo el ortomosaico para que esos
puntos caigan exactamente donde deben estar en el mundo real.

*"RTK mejora la posición del DRON mientras vuela — cada foto ya nace
georreferenciada con precisión. Los GCPs mejoran la posición del RESULTADO
después, durante el procesamiento. Se pueden usar juntos para máxima
precisión, o cualquiera de los dos por separado. Para el laboratorio de
hoy, el error de 1.5–3 metros del GPS estándar es aceptable — estamos
aprendiendo el flujo completo, no publicando resultados. Pero si van a
comparar el mismo surco de cultivo entre dos vuelos separados por semanas,
o a validar el NDVI del dron contra una medición hecha en el suelo, un
error de metros los deja midiendo la planta equivocada. Ahí es donde RTK o
GCPs dejan de ser un lujo y se vuelven obligatorios — así se trabajó en la
investigación de extracción de dosel que sostiene este curso."*

### Calibración: qué hace el dron solo y qué tienes que hacer tú

Igual que con la corrección radiométrica de Sentinel-2 (que para L2A "ya
viene hecha" antes de que descargues la imagen), el P4M también tiene una
parte de su calibración que corre sola, y una parte que depende de ti.

**Lo que el P4M hace automáticamente, sin que ustedes hagan nada:** el
**sunshine sensor** (sensor pequeño en la tapa del dron) mide la luz solar
ambiental en tiempo real, foto por foto, durante todo el vuelo, y el
firmware del dron aplica esa corrección automáticamente a cada captura.
*"Ustedes no tienen que hacer nada para esto — el dron ya lo resuelve
solo. Corrige que una foto tomada con sol pleno y otra tomada 2 minutos
después con una nube pasajera no den valores de reflectancia distintos por
culpa de la luz, no del suelo."* De la misma manera, la calibración de
brújula/IMU (el patrón en forma de "8" que a veces piden los drones de
consumo) en la práctica **el P4M la resuelve solo** al encender en la
mayoría de los casos — solo pide una recalibración manual si detecta una
inconsistencia real (por ejemplo, un cambio geográfico muy grande entre
sesiones de vuelo).

**Lo único que sigue siendo manual: el panel de calibración.**
*"Este rectángulo blanco que ven aquí es nuestro panel de calibración. Es
papel matte blanco — reflectancia aproximada 85%. Antes de despegar, pongo
el dron a 1 metro sobre el panel y tomo 5 fotos. Esas fotos le dicen al
software cuánta reflectancia absoluta corresponde a la luz que hay en este
momento específico. El software usa eso para convertir los valores
digitales crudos de cada cámara en valores de reflectancia física real,
comparables con datos de otros días o de otros lugares. Sin este paso — el
único que de verdad depende de ustedes — el NDVI de hoy no es comparable
con el NDVI de la semana pasada."*

*"Resumiendo: el sunshine sensor corrige la luz variable durante el vuelo,
automático. La calibración de brújula/IMU la resuelve el dron solo, casi
siempre. El panel de calibración es la única foto que ustedes tienen que
acordarse de tomar — y se hace una vez, al inicio de la jornada."*

### El problema de la georreferenciación — por qué la imagen manual "no mira al norte"

Este problema es distinto a los dos anteriores, y solo aparece en el
**camino manual** (el shift que van a hacer en el Bloque 7), no cuando
WebODM procesa el vuelo completo.

**El problema:** cuando ustedes alinean a mano las 5 bandas de una captura
(Bloque 7) y arman su composite, ese archivo resultante es solo una matriz
de píxeles — no tiene ningún sistema de coordenadas asignado, y su
orientación es la que tenía la cámara del dron en el instante exacto de la
foto, no necesariamente el norte geográfico. Si el dron estaba volando en
diagonal cuando disparó, "arriba" en su imagen es la dirección de vuelo del
dron en ese momento, no el norte. **La imagen queda "rotada" respecto al
mapa real, y sin ninguna coordenada real asociada.**

*"WebODM no tiene este problema porque usa el GPS y el compás de cada foto
más la reconstrucción 3D (Bloque 4) para calcular exactamente dónde y hacia
dónde apuntaba cada cámara, y reproyecta todo a un sistema de coordenadas
real, con el norte arriba. Cuando ustedes arman su composite a mano, se
saltan ese paso — así que hay que hacerlo aparte."*

**La solución — georreferenciar en QGIS con el Georeferencer:** se cargan
3–4 puntos reconocibles en la imagen (una esquina de un techo, un cruce de
caminos) y se les asigna su coordenada real (tomada con el GPS del celular,
o leída de un mapa base como Google Satellite dentro de QGIS). Con esos
puntos, QGIS calcula la transformación —rotación, escala y traslación—
necesaria para que la imagen quede correctamente orientada al norte y
ubicada en el mundo real, y exporta un GeoTIFF ya georreferenciado. Este
paso se hace en el Bloque 9, antes de armar el layout final.

*"El shift manual del Bloque 7 resuelve que las bandas coincidan ENTRE
ELLAS. Georreferenciar en el Bloque 9 resuelve que la imagen completa
coincida con EL MUNDO REAL. Son dos problemas distintos — uno es interno a
la foto, el otro es sobre dónde vive esa foto en el mapa."*

---

## BLOQUE 4 — El problema del shift y la fotogrametría automática

### La analogía de los dos ojos

*"Cierren un ojo y miren su dedo pulgar estirado frente a ustedes. Ahora
cambien de ojo sin mover el dedo. El dedo 'salta' — parece que se movió,
aunque no se movió nada. Eso es paralaje: cada ojo ve la misma escena desde
un punto ligeramente distinto en el espacio, así que la posición aparente
de las cosas cambia según desde qué ojo mires."*

*"El P4M tiene 6 lentes, no 1. Están montados a pocos milímetros/centímetros
de distancia entre sí, en una fila fija. Cuando el dron dispara, las 6
cámaras capturan la MISMA escena en el MISMO instante — pero cada una desde
su propio punto óptico, igual que cada uno de sus ojos. El resultado: el
borde de un árbol que aparece en el píxel (450, 320) de la banda Red puede
aparecer en el píxel (453, 322) de la banda NIR. Unos pocos píxeles de
diferencia — pero si los combinas sin corregir eso, el NDVI en cada borde
de objeto sale disparatado, porque estás dividiendo el NIR de un punto entre
el Red de OTRO punto."*

### Demo con fotos reales (proyectar 1–2 sets de ejemplo)

1. Cada banda por separado, en escala de grises — se ven "iguales" a
   simple vista.
2. Superponer dos bandas (ej. Red y NIR) con transparencia — ahí sí se nota
   el corrimiento en los bordes de objetos.
3. Calcular NDVI **sin corregir** sobre un borde marcado (árbol, techo) —
   mostrar el artefacto: una franja de valores absurdos justo en el borde.
4. Aplicar un desplazamiento manual (dx, dy en píxeles) a una banda con
   `numpy`/`rasterio` — mover la matriz de números unas filas/columnas, y
   recortar el borde que queda sin dato válido tras el corrimiento.
5. Recalcular el NDVI sobre el mismo borde — la franja de valores absurdos
   desaparece o se reduce mucho.

*"Ese desplazamiento (dx, dy) no es igual para cualquier altura de vuelo —
depende de la geometría fija de las cámaras y de a qué altura volaste. Por
eso en la práctica se mide una vez para una altura de referencia (los 50 m
que usamos siempre) y se reutiliza ese mismo shift mientras no cambien la
altura de vuelo."*

**Nota honesta de transparencia científica:** el shift manual es una
**aproximación** que asume terreno relativamente plano. En terreno con
relieve importante, el corrimiento real varía según la elevación de cada
punto — no es un valor único. Esa es exactamente la limitación que resuelve
la reconstrucción 3D completa que hace WebODM.

### Fotogrametría automática (SfM) y WebODM

**La analogía del mosaico roto:** *"Imaginen que tienen una fotografía
aérea enorme y la rompen en 500 pedazos pequeños. Eso es exactamente lo
que el dron hace — toma 500 fotografías pequeñas con mucho traslape entre
ellas. WebODM es el software que ensambla el mosaico de vuelta,
reconociendo en qué parte de cada foto aparecen los mismos puntos. Es un
rompecabezas gigante donde el software encuentra automáticamente qué
piezas van juntas."*

**Structure from Motion (SfM):** *"El algoritmo que usa WebODM se llama
Structure from Motion. Funciona igual que tu cerebro cuando estás en un
auto en movimiento — tu cerebro calcula la profundidad de los objetos
porque los ve desde distintos ángulos a medida que te mueves. WebODM hace
lo mismo: compara el mismo punto del terreno visto desde diferentes
ángulos en fotos consecutivas y calcula su posición 3D exacta. De miles de
esos puntos construye el modelo 3D del terreno y proyecta las fotos sobre
él para crear el ortomosaico — ya georreferenciado y con el norte arriba,
sin el problema del Bloque 3."*

**Por qué esto resuelve el shift mejor que el método manual:** *"El shift
manual que acabamos de ver asume que un solo número (dx, dy) sirve para
toda la imagen. La reconstrucción 3D no asume eso — calcula la posición
real de cada punto del terreno, así que corrige el paralaje de forma
exacta, punto por punto, sin importar si el terreno es plano o tiene
relieve. Por eso es mejor... pero también por eso toma minutos u horas en
vez de ser instantáneo."*

**Qué es WebODM concretamente:** software libre y gratuito que corre en
Docker (una especie de caja aislada donde vive el programa sin ensuciar el
resto del sistema). Recibe las ~500 fotos por banda del vuelo, hace la
reconstrucción 3D, corrige el shift entre bandas y la georreferenciación
como parte del mismo proceso, y entrega un ortomosaico: una sola imagen
gigante, con las 5 bandas ya alineadas entre sí y con el mundo real.

*"No estamos reinventando la rueda: en un rato ustedes van a hacer el shift
a mano sobre 1–2 fotos para entender el problema por dentro, y en paralelo
van a dejar que WebODM procese el vuelo completo — así comparan su propio
resultado manual contra lo que hace el software profesional. ¿Por qué no
usar siempre WebODM y saltarnos el shift manual? Porque si algún día no
tienen WebODM a mano, o necesitan un resultado rápido de una sola foto sin
esperar el procesamiento completo, van a necesitar saber hacerlo ustedes
mismos — eso es lo que se hizo en la investigación que sostiene este
curso."*

### Parámetros de vuelo — qué se configura y por qué

| Parámetro | Valor | Por qué |
|-----------|-------|---------|
| Altura | 50 m | GSD = 5.3 cm — suficiente para ver vegetación individual |
| Overlap frontal | 80% (70% en vuelos cortos de rotación) | Cada punto del terreno aparece en varias fotos = mejor reconstrucción |
| Overlap lateral | 75% (65% en vuelos cortos) | Evita huecos entre pasadas |
| Velocidad | 5 m/s | Más lento = fotos más nítidas, menos *blur* de movimiento |
| Patrón | Cuadrícula (doble para máxima precisión, simple si el tiempo apremia) | Fotos desde ángulos perpendiculares = modelo 3D más preciso |

*"Más overlap = más fotos = más tiempo de procesamiento, pero mejor
calidad. Para investigación, usamos 80/75. Para vuelos cortos de práctica
como los de hoy, 70/65 es suficiente y más rápido."*

---

## BLOQUE 5 — Preparación para volar: regulación AEROCIVIL y briefing

### Regulación AEROCIVIL (RAC 91)

*"En Colombia, volar un dron de más de 250 gramos sin registrarlo y sin
seguir las normas de AEROCIVIL es ilegal. El P4M pesa 1.39 kg. Este drone
está registrado y tiene permiso de vuelo. Les explico las reglas básicas
porque si alguno de ustedes quiere hacer investigación con drones en el
futuro, necesita conocerlas."*

Colombia adoptó el sistema de categorías de la OACI:

**Categoría Abierta** — bajo riesgo, sin autorización previa
- Peso < 25 kg
- Altura máxima: 120 metros sobre el nivel del suelo (AGL)
- Siempre en línea de visión (VLOS)
- Lejos de aeropuertos, personas no involucradas y edificios
- **Esto es donde operamos hoy en la universidad**

**Categoría Específica** — riesgo medio, requiere autorización de AEROCIVIL
- Vuelos sobre personas, en zonas urbanas densas
- Vuelos BVLOS (Beyond Visual Line of Sight)
- Requiere análisis de riesgo operacional (SORA)

**Categoría Certificada** — alto riesgo, equivalente a aeronave tripulada
- Transporte de personas o carga peligrosa
- No aplica para investigación académica

**Lo que debes hacer antes de volar:**
1. **Registrar el drone** en el RAAC (Registro Aeronáutico de Colombia) en
   el portal de AEROCIVIL — solo se hace una vez por drone, costo bajo
2. **Verificar zonas de vuelo** en la app oficial AirMap o en el mapa de
   AEROCIVIL antes de cada vuelo
3. **Respetar 120 m AGL** — es el límite máximo para categoría abierta
4. **No volar sobre personas** que no estén involucradas en la operación
5. **Mantener VLOS** — siempre ver el drone con los ojos

*"Regla simple: si estás en zona rural o en un campus universitario como
este, lejos del aeropuerto, con el drone registrado y volando por debajo de
120 metros, estás en regla. El error más común es suponer que 'como es
chiquito no pasa nada' — el dron tiene número de serie, está registrado, y
si alguien reporta un incidente, hay trazabilidad."*

### Briefing de seguridad + calibración del panel

Antes de salir al campo, haz el briefing de pie, con el dron en la mano. No
es burocracia — es para que los estudiantes entiendan qué están viendo
cuando el dron vuele.

Di: *"Antes de encender cualquier cosa, vamos a revisar 5 cosas juntos."*

1. **Propelas:** gira cada propela manualmente. Si tiene microfisura o
   grieta, se ve y se siente. Una propela que se rompe en vuelo causa un
   accidente.
2. **Batería:** encaja con clic audible. Revisa el indicador LED — debe
   parpadear lento (suficiente carga) no rápido (batería baja) ni color
   rojo.
3. **Tarjeta SD:** introducida completamente. Verifica que hay espacio.
4. **Control remoto:** enciende PRIMERO el control, DESPUÉS el drone.
   Nunca al revés.
5. **Zona de aterrizaje de emergencia:** señala dos puntos en el campo.
   *"Si el drone empieza a comportarse raro, aterrizamos aquí."*

*"Estas 5 cosas las reviso yo antes de CADA batería nueva que entra, no
solo al inicio — con varias rotaciones de grupos hoy, esta revisión se
repite cada vez que cambia la batería."*

*"Este rectángulo blanco es nuestro panel de calibración — como ya vimos
en el Bloque 3, es el único paso de calibración que de verdad depende de
nosotros. Pongo el drone a 1 metro sobre el panel y tomo 5 fotos antes del
primer despegue."* Esta calibración se hace **una vez al inicio de la
jornada** y sirve para todos los vuelos del día, mientras la luz no cambie
drásticamente (nublado ↔ despejado sí amerita recalibrar).

Si el grupo va a usar GCPs (Bloque 3), este es también el momento de
colocarlos en el terreno y medir sus coordenadas, antes de que empiece la
rotación de vuelos.

---

## BLOQUE 6 — El vuelo, rotativo por grupos

Con varios grupos pequeños rotando el pilotaje sobre un solo P4M (y sus
baterías disponibles), la lógica cambia frente a un vuelo único continuado:

### Cómo organizar la rotación

- Divide la clase en grupos pequeños antes de salir al campo.
- Cada grupo tiene una ventana corta: briefing de turno (2 min), despegue
  y vuelo asistido por ti (el grueso del tiempo), aterrizaje y entrega
  (2 min).
- **Mientras un grupo vuela, el grupo que acaba de aterrizar ya puede
  empezar a descargar sus fotos y prepararse para lanzar WebODM** — no hay
  tiempo muerto. El grupo que sigue hace su briefing de turno mientras
  tanto.
- Si el número de baterías es menor al número de grupos, algún grupo va a
  volar con una batería que ya usó otro grupo — ten un cargador corriendo
  desde el bloque anterior.

### Perímetro de seguridad (aplica a cada rotación)

- **Perímetro de seguridad:** 15 metros alrededor del drone durante
  despegue y aterrizaje. Nadie cruza esa línea.
- **Zona de observación:** el resto del grupo se ubica a 20 metros del
  punto de despegue, en un área designada.
- **1 acompañante del grupo en turno:** puede estar a tu lado como
  "observador visual". Rota con cada grupo.

### Qué decir mientras cada grupo vuela

El drone vuela en modo automático — tienes tiempo de hablar con el grupo en
turno.

Mientras vuela la primera pasada:
*"¿Ven cómo vuela en líneas rectas paralelas? Eso se llama patrón
*lawnmower* o de cortacésped. Es el patrón óptimo para garantizar que cada
metro del terreno aparezca en varias fotos desde distintos ángulos. El
software tiene que ver el mismo punto desde al menos 3 posiciones
diferentes para calcular su posición 3D."*

Cuando el drone gira para la segunda pasada:
*"En este momento están ocurriendo 5 disparos simultáneos — una foto por
cada cámara espectral. El drone está capturando luz a 450, 560, 650, 730 y
840 nanómetros al mismo tiempo. Ustedes están viendo en tiempo real las 6
cámaras disparando juntas — en un rato, cuando bajen las fotos, van a ver
con sus propios ojos el corrimiento entre bandas que expliqué en la
teoría (Bloque 4) — no es teoría abstracta, es literalmente lo que su
propio dron acaba de capturar."*

Si algún estudiante pregunta qué pasa si se cae la batería:
*"El P4M tiene Return-to-Home automático cuando la batería baja del 30%.
Calcula la distancia al punto de despegue, la energía necesaria para
regresar, y si ve que le queda justa, vuelve solo. Esa función ha salvado
muchos drones."*

---

## BLOQUE 7 — Procesamiento de las fotos, por grupo

Este bloque es el más largo de la jornada — cada grupo trabaja sobre sus
propias fotos, con estos 4 pasos en orden. El orden importa: WebODM tarda
en procesar, así que se lanza primero y corre en paralelo mientras el
grupo hace el resto a mano.

### Paso 1 — Lanzar WebODM (10 minutos)

Cada grupo sube su set completo de fotos a WebODM (`localhost:8000`) y
lanza el procesamiento apenas aterriza — corre en segundo plano durante
los siguientes tres pasos. Si el grupo colocó GCPs (Bloque 3/5), este es
el momento de cargar también el archivo de coordenadas de los GCPs.

*"Denle 'start' y sigan trabajando — no se queden esperando la barra de
progreso. Para cuando lleguemos al Bloque 9 debería estar listo."*

### Paso 2 — Shift manual de bandas (45 minutos)

Cada grupo trabaja sobre **una sola captura propia** (5 fotos de un mismo
instante), no sobre el vuelo completo — es rápido y no depende de esperar
ningún procesamiento.

1. Cargar las 5 bandas de esa captura con `rasterio`.
2. Visualizar cada banda y superponer dos con transparencia — ver el
   corrimiento explicado en el Bloque 4, ahora en su propia foto.
3. Aplicar el shift manual (dx, dy) sobre la banda desplazada.
4. Recortar el borde inválido tras el desplazamiento.
5. Calcular NDVI antes y después del shift sobre un borde marcado
   (sombra de un árbol, borde de un techo) — comparar el artefacto.

*"El número exacto de dx, dy que les va a funcionar mejor lo van a tener
que probar — no hay un valor universal, depende de la altura real de vuelo
de hoy. Prueben 2-3 valores y quédense con el que mejor alinea los bordes a
simple vista."*

*(Notebook pendiente de crear: `colab/02_shift_manual_bandas.ipynb`)*

### Paso 3 — Firmas espectrales (45–50 minutos)

Sobre la imagen corregida a mano en el Paso 2:

1. Identificar 3–4 clases de cobertura visibles en la captura (ej. pasto,
   árboles, suelo desnudo, agua/sombra).
2. Marcar 5–10 píxeles representativos de cada clase.
3. Graficar el perfil de reflectancia promedio por clase a lo largo de las
   5 bandas (Blue, Green, Red, Red Edge, NIR) — una línea por clase.
4. Comparar esas curvas contra las firmas espectrales de referencia ya
   vistas en Sesión 1 (`sesion-01/teoria/04 - Firmas espectrales.pdf`):
   vegetación sana (salto fuerte de Red a NIR), agua (reflectancia baja y
   plana), suelo desnudo (curva más uniforme, sin salto marcado).

*"Esto es lo mismo que hicimos con NDVI, pero ahora viendo las 5 bandas
completas en vez de resumir todo en un solo número — el perfil completo
les dice MÁS que un solo índice."*

*(Vive dentro de `colab/02_shift_manual_bandas.ipynb`, como sección final
del mismo notebook — no hace falta un archivo aparte.)*

### Paso 4 — Revisar lo que entregó WebODM

Cuando el procesamiento del grupo termine, muestra el reporte
(`odm_report.pdf`) y señala:

1. **GSD obtenido:** debe ser cercano al teórico (5.3 cm a 50 m). Si es muy
   diferente, el vuelo tuvo problema de altitud.
2. **Error de reproyección:** < 1 px es excelente. Es la precisión con que
   el software ubicó los puntos de coincidencia entre fotos.
3. **Número de fotos procesadas:** debe ser similar al total. Si muchas
   fueron rechazadas, hay problema de calidad (blur, poca luz, poco
   overlap).

**Errores comunes al procesar:**

- **"No reconoce las bandas multiespectrales"** → no activaron la opción
  `multispectral` en WebODM. Reiniciar con esa opción marcada.
- **"El ortomosaico tiene agujeros blancos"** → alguna zona tuvo pocas
  fotos (bordes, mucha sombra). No es crítico para este lab.
- **"El procesamiento es muy lento"** → computador con poca RAM (<8 GB).
  Reducir `orthophoto-resolution` de 1 a 3 cm/px.
- **"El ortomosaico no está georreferenciado correctamente"** → el GPS del
  P4M es de consumidor (±1.5 m de error, como ya vimos en el Bloque 3).
  *"Para este lab de aprendizaje, el error de 1.5 metros es aceptable.
  Para publicar mapas precisos de investigación, usaríamos RTK o GCPs
  medidos con GPS RTK en el suelo — eso reduce el error a 2–5
  centímetros."*

---

## BLOQUE 8 — Python: rasterio y Random Forest (Notebooks 07 y 08)

### Notebook 00 — rasterio y análisis de índices

*"En GEE, cuando calculamos NDVI, el servidor de Google hace todos los
cálculos — nosotros solo escribimos la fórmula. Aquí en Python, nosotros
cargamos la imagen en memoria, la convertimos en un array NumPy, y
calculamos todo localmente. La ventaja: control total sobre el proceso. La
desventaja: necesitamos el archivo descargado y suficiente RAM."*

**La analogía clave para rasterio:** *"Un GeoTIFF es como un Excel con
información geográfica. `rasterio.open()` abre el archivo. `src.read(1)`
lee la primera hoja (banda 1). `src.profile` te da los metadatos —
resolución, sistema de coordenadas, extensión geográfica. Lo que obtienes
es un array NumPy — de ahí en adelante, ya saben cómo manejarlo."*

**Fuente de datos:** cada grupo trabaja **sobre su propio ortomosaico de
WebODM** (si ya terminó de procesar) en vez del dataset de ejemplo
genérico. Si el procesamiento de algún grupo no ha terminado todavía, usa
como respaldo el ortomosaico de ejemplo incluido en el notebook.

*"Noten que los valores de NDVI del dron tienen mucha más variabilidad que
los de Sentinel-2. ¿Por qué? Porque a 5 cm de resolución, están viendo cada
hoja, cada sombra, cada espacio entre plantas. A 10 metros de Sentinel-2,
un pixel promedia decenas de plantas con el suelo entre ellas — eso suaviza
todo. Ninguno es mejor que el otro: son herramientas para preguntas
distintas."*

### Notebook 01 — Random Forest sobre imagen de dron

Comparte la figura del paper CONCAPAN 2022 en pantalla — la que muestra el
mapa de clasificación del bananal.

Di: *"Este mapa lo generamos con exactamente el mismo flujo que están
haciendo ahora, sobre SU propia imagen. Las clases eran 'dosel de banano' y
'entre-surco'. El clasificador RF entrenado sobre las 5 bandas del P4M
logró separar las dos clases con Kappa de 0.87. Eso le permitió a nuestro
equipo calcular el porcentaje de cobertura del dosel en cada parcela del
bananal — información que antes requería semanas de medición manual."*

**El error conceptual más común: overfitting.** Cuando los estudiantes vean
que el accuracy de entrenamiento es 100% y el de test es 95%, van a
preguntar por qué son diferentes. Explícalo así: *"El 100% de
entrenamiento no es un error — es esperado en Random Forest. El modelo
memoriza todas las muestras que le diste. El número que importa es el de
test: ese es sobre datos que el modelo nunca vio. Si test fuera también
100%, sospecharía que hicieron trampa mezclando datos de entrenamiento y
test. El 95% de test significa que de cada 100 píxeles nuevos, el modelo
clasifica 95 correctamente."*

**Importancia de variables:** pregunta al grupo *"¿Qué variable esperarían
que fuera la más importante para separar agua de vegetación?"* La
respuesta correcta es **NIR** — el agua absorbe casi toda la energía en
NIR (valores muy bajos), la vegetación la refleja (valores altos). Si NDVI
sale primero, es porque NDVI = f(NIR, Red), así que resume la información
de dos bandas.

---

## BLOQUE 9 — Cierre en QGIS: georreferenciar y armar el mapa final

Este bloque tiene dos partes: primero corregir la geografía (solo
necesario si se usó el camino manual del Bloque 7), y después el layout
de presentación.

### Parte A — Georreferenciar (solo para el resultado del shift manual)

Si el grupo trabaja con el ortomosaico de WebODM, esta parte se salta —
WebODM ya entrega el archivo correctamente georreferenciado. Si trabajan
con el composite armado a mano (Bloque 7, Paso 2), hace falta este paso
porque, como se explicó en el Bloque 3, esa imagen todavía no tiene
coordenadas reales ni está orientada al norte.

1. Abrir el complemento **Georeferencer** de QGIS (Capa → Georreferenciador).
2. Cargar la imagen del composite manual.
3. Marcar 3–4 puntos reconocibles (esquina de un techo, cruce de caminos)
   y asignarles su coordenada real — tomada con el GPS del celular en el
   campo, o leída sobre el mapa base de satélite dentro de QGIS.
4. Elegir una transformación (lineal o polinomial de primer orden alcanza
   para un terreno plano) y generar el GeoTIFF georreferenciado.

*"Este es el paso que hace que la imagen deje de estar 'flotando' sin
ubicación y pase a tener coordenadas reales, con el norte donde debe
estar."*

*(Guía pendiente de crear: `qgis/guia_georreferenciacion_y_layout.md`)*

### Parte B — Layout final

1. Cargar el ortomosaico de WebODM del propio grupo, o el resultado ya
   georreferenciado del Paso A.
2. Armar una composición de color (falso color: NIR-Red-Green) o cargar la
   capa de NDVI/clasificación si el grupo alcanzó a calcularla.
3. Panel de Composición de Impresión (*Print Layout*) de QGIS: agregar
   mapa, leyenda, barra de escala, flecha de norte, título.
4. Exportar como imagen (PNG/PDF) — ese es el entregable final del grupo.

*"Este mapa que están armando ahora es exactamente el tipo de figura que
va a ir en su artículo científico al final del curso — practicar el layout
ahora les ahorra tiempo entonces."*

Cierre grupal: cada grupo muestra en 2–3 minutos qué voló, qué encontró en
las firmas espectrales, su mapa final, y **la diferencia entre su shift
manual y el resultado de WebODM** — es el cierre conceptual de todo el
módulo de dron.

---

## BLOQUE 10 — GEE Demo: Serie NDVI 2018–2025 bananera (45 minutos)

### El puente entre lo pequeño y lo grande

*"Hoy vimos el bananal a 5 centímetros. Ahora vamos a verlo a 10 metros —
pero desde 2018 hasta hoy. El dron nos da el detalle de hoy; el satélite
nos da la historia en el tiempo."*

### Cómo presentar la serie temporal

Abre el script `04_ndvi_temporal_bananera.js` en el Code Editor de GEE.
Antes de ejecutarlo, señala la estructura del script:

*"Este script calcula el NDVI promedio de enero a marzo de cada año desde
2018. ¿Por qué enero-marzo? Porque es la temporada seca en el norte del
Magdalena — menos nubes, imágenes más limpias. Si analizara todo el año,
los meses lluviosos me darían imágenes llenas de nubes y valores
erróneos."*

Ejecuta el script. Mientras carga, pregunta al grupo:

*"¿Qué esperan ver en la gráfica? ¿El NDVI del bananal ha subido, bajado, o
se ha mantenido constante entre 2018 y 2025?"*

Deja que propongan hipótesis. Cuando aparezca la gráfica, discutan los
resultados juntos.

### Preguntas que guían la discusión

- *"Si hay un año donde el NDVI cae significativamente, ¿qué pudo haber
  pasado?"* — sequía (El Niño), cosecha masiva, cambio de cultivo,
  enfermedad
- *"¿Por qué el municipio de Ciénaga y el de Zona Bananera tienen valores
  diferentes?"* — diferencias en manejo agronómico, densidad de siembra,
  variedades
- *"¿Qué le pasaría al NDVI si hubiera un brote masivo de Sigatoka
  Negra?"* — caería, porque la clorofila se destruye y la reflectancia en
  rojo sube mientras el NIR baja

---

## BLOQUE 11 — Propuesta de proyecto final (30 minutos)

### Cómo crear el ambiente para que sea productivo

No digas "ahora tienen 30 minutos para llenar un formulario". Eso suena a
burocracia.

Di: *"En este momento tienen suficiente contexto para definir qué van a
investigar con teledetección. Procesaron imágenes Sentinel-2, calcularon
índices, clasificaron coberturas con Random Forest, volaron un dron y
vieron una serie temporal de 7 años. Ahora aplíquenlo a su propio problema
de investigación — su tesis, su trabajo, el territorio que conocen."*

Mientras llenan la plantilla, circula entre los grupos. Las preguntas que
más necesitan ayuda:

**"No sé qué dato usar"**
Di: *"¿Cuánta resolución necesitas? Si es para ver parcelas experimentales,
necesitas el dron. Si es para monitorear una cuenca o un municipio
completo, Sentinel-2 es suficiente. Si hay muchas nubes en tu zona,
considera SAR de Sentinel-1 — el radar atraviesa las nubes."*

**"No sé cómo formular la pregunta de investigación"**
Di: *"La pregunta debe ser respondible con un mapa. 'Cómo está la
vegetación' es demasiado vago. '¿Cambió la cobertura boscosa en la cuenca X
entre 2018 y 2024?' es respondible con teledetección."*

**"Mi área está cubierta de nubes casi siempre"**
Di: *"Eso es una restricción real. Opciones: (1) usar imágenes de temporada
seca solamente, (2) usar SAR Sentinel-1, (3) hacer mosaicos anuales que
combinan decenas de imágenes para llenar los huecos de nubes."*

---

## NOTAS DEL DOCENTE — Preguntas frecuentes sesión 4

**"¿Por qué no simplemente compramos un dron con RTK integrado y nos
ahorramos toda la explicación de GCPs?"**
Porque cuesta considerablemente más que el P4M estándar, y para los
propósitos formativos del curso el error de 1.5–3 m es aceptable. Vale la
pena que entiendan el concepto (RTK y GCPs) aunque hoy no lo usen en la
práctica — lo van a necesitar si su tesis exige precisión centimétrica.

**"¿Por qué el shift manual no corrige el problema de una vez por todas,
como para no tener que volver a medirlo?"**
Porque el desplazamiento (dx, dy) depende de la altura de vuelo. Si un día
vuelan a 30 m y otro a 80 m, el shift correcto es distinto en cada caso —
no es una constante del dron, es una constante de la geometría dron+altura.

**"¿Si ya tengo el ortomosaico de WebODM, para qué necesito el shift
manual?"**
Para entender qué está resolviendo WebODM por dentro. Un investigador que
solo sabe "darle click a WebODM" sin entender el problema de paralaje no
puede diagnosticar cuando algo sale mal en el ortomosaico, ni puede
trabajar en el campo si un día WebODM no está disponible.

**"¿La georreferenciación manual en QGIS reemplaza a WebODM?"**
No — solo corrige la posición y orientación de UNA imagen ya armada a
mano. WebODM hace mucho más: reconstruye la geometría 3D de cientos de
fotos y corrige el paralaje punto por punto. Georreferenciar en QGIS es
la solución rápida para el camino manual, no un sustituto del pipeline
fotogramétrico completo.

---

## RESUMEN DE CONCEPTOS CLAVE — Sesión 4

- **UAV/UAS:** vehículo aéreo no tripulado / el sistema completo
- **Multirotor vs. ala fija vs. híbrido:** cobertura vs. maniobrabilidad
- **RTH (Return-to-Home):** regreso automático cuando la batería baja del 30%
- **GPS estándar del P4M:** ±1.5–3 m de error
- **RTK:** corrección GNSS en tiempo real vía estación base — 2–5 cm
- **GCPs:** puntos de control terrestre medidos en el suelo, corrigen el
  resultado durante el procesamiento
- **Sunshine sensor:** corrección automática de luz variable, sin
  intervención del piloto
- **Panel de calibración:** el único paso de calibración manual — una vez
  al inicio de la jornada
- **Shift / paralaje:** desalineamiento entre bandas por la separación
  física de las 6 cámaras del P4M
- **Georreferenciación manual:** asignar coordenadas reales y orientación
  norte a un composite armado a mano — problema distinto del shift
- **SfM (Structure from Motion):** reconstrucción 3D a partir de fotos con
  traslape, usada por WebODM
- **GSD:** 5.3 cm/px a 50 m de altura con el P4M
- **Kappa / Overall Accuracy:** métricas de validación de la clasificación
  Random Forest

---

## CONSEJOS PARA EL DÍA COMPLETO

### Gestión de la energía

Es una sesión larga con trabajo de campo. Recomendaciones prácticas:
- **Lleva suficiente agua** — el campo al sol agota más de lo que parece
- **Las pausas son sagradas** — no las recortes para "recuperar tiempo
  perdido"
- **El almuerzo es real** — una tarde larga de Python requiere glucosa

### Plan B si el software falla

Si WebODM no procesa en tiempo razonable durante la clase:
- Usa el ortomosaico de ejemplo incluido en el Notebook 00 (se genera
  automáticamente) para que el grupo no se quede sin poder avanzar
- Los estudiantes igual aprenden todo el flujo Python con ese dato
- El WebODM de su propio vuelo lo terminan de procesar en casa y el
  resultado lo llevan a la sesión siguiente

Si el dron falla (batería dañada, problema de GPS):
- Usa fotos de un vuelo anterior tuyo directamente desde el inicio
- Pierde el momento "wow" del vuelo pero ganas el tiempo del procesamiento
- Muestra un video de un vuelo si tienes uno

### La frase que resume el día

Al cerrar, di esto:

*"Hoy pasaron de analizar imágenes de un satélite a 786 km hasta analizar
imágenes de un dron a 50 metros, capturadas por ustedes mismos. La
metodología es exactamente la misma — bandas espectrales, índices, Random
Forest, Kappa. La diferencia es la escala. En sus proyectos de
investigación van a elegir la escala correcta según la pregunta que quieran
responder. Eso es lo que hace un investigador en teledetección."*
