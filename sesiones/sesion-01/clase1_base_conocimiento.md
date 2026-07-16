# Sesión 1 — Base de Conocimiento del Docente
## Teledetección: Fundamentos y Conceptos Básicos
### Maestría en Ingeniería — Universidad del Magdalena

> Este documento es tu guía personal. Está escrito para que tú entiendas cada concepto
> profundamente, sepas cómo explicarlo con analogías, y puedas responder cualquier
> pregunta que haga un ingeniero un viernes a las 6 PM.

---

## BLOQUE 0 — Apertura de la sesión (20 minutos)

### Cómo abrir la clase

No empieces con definiciones. Empieza con una imagen.

Muestra en pantalla una imagen satelital Sentinel-2 en falso color del norte del Magdalena
— las bananeras, la Ciénaga Grande, la Sierra Nevada al fondo. Deja que la vean 30 segundos
en silencio. Luego pregunta: **"¿Alguien sabe qué están viendo?"**

Deja que respondan. Luego dices: *"Esto es una imagen Sentinel-2, tomada desde un satélite
a 786 kilómetros de altura, con 10 metros de resolución. En este curso van a aprender no
solo a leer esta imagen sino a extraer de ella información que sirve para tomar decisiones
en agricultura, medio ambiente y planificación territorial."*

Después te presentas. No como hoja de vida. Muestra:
- Una imagen del proyecto TRITÓN (la boya oceanográfica del INVEMAR)
- Una imagen multiespectral del dron sobre el bananal
- El mapa de zonificación AHP del Mar Caribe de tu paper 2021

Y dices: *"Todo lo que vamos a ver en este curso yo lo he aplicado en investigación real
aquí en el Caribe colombiano. No es teoría abstracta."*

Luego 5 minutos para que cada estudiante diga nombre, especialidad, y por qué eligió
este curso. Escucha bien — te va a decir qué ejemplos usar durante el semestre.

---

## BLOQUE 1 — ¿Qué es la teledetección? (30 minutos)

### La definición técnica (para que la tengas clara)

Teledetección es la ciencia y técnica de obtener información sobre objetos, áreas o
fenómenos sin entrar en contacto físico directo con ellos, mediante el análisis de
la energía electromagnética que esos objetos emiten, reflejan o transmiten.

Esa definición tiene tres partes importantes:
1. **Sin contacto físico** — eso es lo que la hace "remota"
2. **Energía electromagnética** — ese es el medio de información
3. **Emiten, reflejan o transmiten** — hay tres formas en que un objeto interactúa con la energía

### Cómo explicárselo a un ingeniero

**Analogía 1 — El celular con cámara:**
Cuando tomas una foto con tu celular, el sensor de la cámara captura la luz que rebota
de los objetos frente a ti. No tocas los objetos — obtienes información de ellos a
distancia a través de la luz. Eso es teledetección. Ahora imagina que la cámara está
en un satélite a 786 km y en lugar de capturar solo luz visible captura también
infrarrojo, radar, y otras longitudes de onda que el ojo humano no ve. Eso es
teledetección satelital.

**Analogía 2 — El radar del aeropuerto:**
Un radar emite una señal de microondas, esa señal choca con un avión y regresa al radar.
El radar nunca tocó el avión, pero sabe exactamente dónde está, a qué velocidad va y
qué tamaño tiene. Eso es teledetección activa — el sensor emite su propia energía.

**Analogía 3 — El médico con el estetoscopio:**
El médico escucha tu corazón sin abrirte el pecho. Obtiene información interna sin
contacto invasivo. La teledetección hace lo mismo con la Tierra.

### Sensor proximal vs. sensor remoto

Esta distinción es importante y aparece en tu tesis doctoral.

**Sensor proximal:** está en contacto o muy cerca del objeto.
- Un sensor de pH enterrado en el suelo del cacaotal
- Un sensor de humedad relativa bajo el dosel del cacao
- Un espectrómetro de mano a 10 cm de una hoja
- Los nodos IoT de tu tesis doctoral

**Sensor remoto:** captura información desde una distancia significativa sin contacto.
- Sentinel-2 orbitando a 786 km
- Un dron con cámara multiespectral a 50 m sobre el cultivo
- El radar SAR de Sentinel-1

**La frase clave para la clase:**
*"La diferencia no es el tipo de tecnología sino la distancia y la ausencia de contacto.
En mi tesis uso los dos — los sensores IoT en el suelo me dan lo que el satélite no
puede ver, y el satélite me da la escala regional que el sensor puntual no puede cubrir."*

---

## BLOQUE 2 — El espectro electromagnético (40 minutos)

### Por qué es fundamental entender esto

Todo en teledetección depende del espectro electromagnético. Si no entiendes esto,
no puedes entender por qué una imagen satelital tiene múltiples bandas, por qué el
radar penetra las nubes, ni por qué el NDVI detecta vegetación sana. Es el fundamento
de todo lo demás.

### Qué es la energía electromagnética

La energía electromagnética es una forma de energía que se propaga en forma de ondas
a través del vacío y de la atmósfera. No necesita un medio material para propagarse
— por eso puede viajar desde el Sol hasta la Tierra atravesando el vacío del espacio.

Toda energía electromagnética tiene dos características fundamentales:
- **Longitud de onda (λ):** distancia entre dos crestas consecutivas de la onda.
  Se mide en metros, micrómetros (μm) o nanómetros (nm).
- **Frecuencia (f):** número de ciclos por segundo. Se mide en Hertz (Hz).

La relación entre ambas es: **λ × f = c** (velocidad de la luz = 3×10⁸ m/s)
Esto significa que longitud de onda y frecuencia son inversamente proporcionales:
onda larga = baja frecuencia, onda corta = alta frecuencia.

**Analogía para ingenieros:**
Es exactamente lo mismo que las ondas de radio. Un ingeniero de sistemas sabe que
WiFi opera en 2.4 GHz o 5 GHz, que 4G LTE opera en 700–2600 MHz. Todas son ondas
electromagnéticas, solo que en distintas frecuencias. La luz visible, el infrarrojo y
el radar son exactamente lo mismo — ondas electromagnéticas — solo que en frecuencias
muy distintas.

### Las regiones del espectro y su uso en teledetección

El espectro electromagnético se divide en regiones según la longitud de onda.
Las más relevantes para teledetección son:

**1. Visible (0.4 – 0.7 μm)**
- Lo que el ojo humano puede ver: violeta, azul, verde, amarillo, naranja, rojo
- Azul: 0.45–0.52 μm | Verde: 0.52–0.60 μm | Rojo: 0.63–0.69 μm
- Uso: fotografía aérea convencional, composiciones de color natural en satélites
- Ejemplo Sentinel-2: Banda B2 (azul), B3 (verde), B4 (rojo) → imagen a color natural

**2. Infrarrojo Cercano — NIR (0.7 – 1.3 μm)**
- El ojo humano no lo ve pero los sensores satelitales sí
- La vegetación sana refleja mucho en esta región (por eso el NDVI funciona)
- Uso: mapeo de vegetación, índices de salud de cultivos, detección de agua
- Ejemplo Sentinel-2: Banda B8 (NIR) → clave para calcular NDVI

**3. Infrarrojo de Onda Corta — SWIR (1.3 – 2.5 μm)**
- Muy sensible al contenido de agua en la vegetación y en el suelo
- Uso: estimación de humedad foliar, detección de incendios, mineralogía
- Ejemplo Sentinel-2: Bandas B11 y B12 → clave para calcular NDWI y NDMI

**4. Infrarrojo Térmico — TIR (8 – 14 μm)**
- Los objetos emiten energía en esta región según su temperatura
- Uso: temperatura superficial del suelo y el agua, detección de islas de calor
- Ejemplo: Landsat 8/9 banda B10 → temperatura superficial (LST)
- Nota importante: Sentinel-2 NO tiene banda térmica, por eso para temperatura
  se usa Landsat o MODIS

**5. Microondas — Radar (1 mm – 1 m)**
- Ondas mucho más largas que la luz visible
- Penetran las nubes, la lluvia y en algunos casos la vegetación
- Los satélites SAR emiten su propia señal (sensor activo) y miden el rebote
- Uso: monitoreo en regiones nubladas, humedad del suelo, estructura del dosel
- Ejemplo: Sentinel-1 (banda C, 5.6 cm) → el satélite que usamos en el Artículo 3

### La analogía del piano para explicar el espectro

Imagina un piano de cola. Las teclas de la izquierda son sonidos graves (baja frecuencia,
onda larga). Las de la derecha son agudos (alta frecuencia, onda corta). El espectro
electromagnético es como un piano infinito donde las teclas visibles para el ojo humano
son apenas una octava en el medio. Los satélites "tocan" muchas más octavas que el ojo.

Sentinel-2 toca 13 "teclas" distintas del espectro. Cada una le dice algo diferente
sobre lo que hay en el suelo.

### Por qué la atmósfera importa

No toda la energía solar llega al suelo y no toda la energía reflejada por el suelo
llega al satélite. La atmósfera absorbe y dispersa ciertas longitudes de onda.

**Ventanas atmosféricas:** regiones del espectro donde la atmósfera es relativamente
transparente y la energía puede pasar. Los sensores satelitales están diseñados para
operar dentro de estas ventanas.

Las principales ventanas útiles para teledetección son:
- Visible (0.4–0.7 μm) → transparente
- NIR (0.7–1.3 μm) → muy transparente
- SWIR (1.6–1.7 μm y 2.1–2.3 μm) → parcialmente transparente
- Microondas (>1 mm) → casi totalmente transparente (por eso radar penetra nubes)

**Por qué el radar penetra las nubes:**
Las nubes están formadas por gotitas de agua de 5–100 μm de diámetro. Una onda
de radar de 5.6 cm (Sentinel-1) es miles de veces más grande que esas gotitas —
simplemente las ignora y pasa a través. Es como intentar atrapar una pelota de
fútbol con una red de pescar: la pelota es demasiado grande para quedar atrapada.
La luz visible (0.5 μm) es del tamaño de las gotitas, por eso las nubes la bloquean.

---

**Referencia científica — Diapositiva 02 (ventanas atmosféricas):**
> Liou, K.N. (2002). *An Introduction to Atmospheric Radiation* (2nd ed.). Academic Press.
> El texto de referencia estándar sobre interacción radiación-atmósfera. Define las ventanas
> atmosféricas formalmente. Cita cuando expliques por qué Sentinel-2 tiene sus bandas donde las tiene.

> Vermote, E.F., Tanré, D., Deuze, J.L., Herman, M. & Morcrette, J.J. (1997).
> Second simulation of the satellite signal in the solar spectrum (6S): an overview.
> *IEEE Transactions on Geoscience and Remote Sensing*, 35(3), 675–686.
> https://doi.org/10.1109/36.581987
> El algoritmo 6S es el modelo de transferencia radiativa que subyace a muchos procesadores
> de corrección atmosférica. Puedes citar esta referencia en la diapositiva de corrección
> atmosférica de sesión 2 para dar solidez académica al concepto de ventanas atmosféricas.

---

## BLOQUE 3 — Interacción de la radiación con la materia (30 minutos)

### Los tres comportamientos fundamentales

Cuando la energía electromagnética incide sobre un objeto, ocurren tres cosas
(en distintas proporciones según el objeto y la longitud de onda):

**1. Reflexión:** la energía rebota de vuelta. Es la que los sensores pasivos detectan.
**2. Absorción:** la energía es absorbida por el material y se convierte en calor.
**3. Transmisión:** la energía atraviesa el material.

La suma de las tres siempre es igual al 100% de la energía incidente:
**Reflexión + Absorción + Transmisión = 1**

**Analogía con el vidrio:**
Un vidrio claro transmite casi toda la luz (alta transmisión), absorbe muy poco,
y refleja un poco (por eso ves tu reflejo tenue). Un vidrio de espejo refleja casi
todo. Un vidrio negro absorbe casi todo. El mismo principio aplica para cualquier
material en cualquier longitud de onda.

### Reflexión especular vs. reflexión difusa

**Reflexión especular:** como un espejo. El ángulo de entrada igual al ángulo de salida.
La energía rebota en una sola dirección.
- Ejemplo: superficie del agua calma vista desde un ángulo rasante
- Problema para teledetección: el satélite solo recibe energía si está en el ángulo exacto

**Reflexión difusa (Lambertiana):** la energía se dispersa en todas las direcciones.
La mayoría de las superficies naturales se comportan aproximadamente así.
- Ejemplo: suelo, vegetación, rocas
- Ventaja para teledetección: el satélite recibe señal desde cualquier ángulo

### Por qué esto importa en la práctica

Cuando tienes agua en una imagen satelital, el agua calma aparece muy oscura (casi negra)
en las bandas del visible e infrarrojo. ¿Por qué? Porque el agua absorbe mucho en NIR
y SWIR, y la reflexión especular va en otra dirección que no es hacia el satélite.
Eso es exactamente lo que hace funcionar el NDWI — el agua absorbe en NIR mientras
la vegetación refleja mucho, entonces el contraste es enorme.

---

**Referencia científica — Diapositiva 03 (interacción radiación-materia):**
> Jensen, J.R. (2015). *Introductory Digital Image Processing: A Remote Sensing Perspective*
> (4th ed.). Pearson/Prentice Hall. Capítulo 3.
> El capítulo 3 de Jensen es el referente estándar para reflexión especular vs. difusa
> y los tres comportamientos de la radiación. Esencial para maestría.

> Schowengerdt, R.A. (2007). *Remote Sensing: Models and Methods for Image Processing*
> (3rd ed.). Academic Press. Capítulo 2.
> Para profundizar en los modelos de reflexión de Lamberto y Fresnel. Nivel avanzado;
> útil si algún estudiante quiere modelar la radiometría en su tesis.

---

## BLOQUE 4 — Firmas espectrales (35 minutos)

### Qué es una firma espectral

Cada material en la superficie terrestre refleja, absorbe y transmite la energía
electromagnética de forma diferente según la longitud de onda. Esa "huella dactilar"
de reflexión a través del espectro se llama **firma espectral** o **curva de reflectancia**.

Si graficas el porcentaje de reflexión en el eje Y vs. la longitud de onda en el eje X,
obtienes una curva característica de cada material. Esa curva es única — como una huella
dactilar — lo que permite identificar materiales desde el espacio.

### Las firmas espectrales más importantes

**Vegetación sana:**
- Absorbe mucho en rojo (las clorofilas usan esa energía para la fotosíntesis)
- Absorbe mucho en azul (también para fotosíntesis)
- Refleja mucho en verde (por eso las plantas se ven verdes — ese es el color que "sobra")
- Refleja MUY mucho en NIR (la estructura celular de la hoja actúa como espejo en NIR)
- Absorbe en SWIR (el agua dentro de la hoja absorbe en esa región)

Este patrón — baja reflexión en rojo, alta en NIR — es la base del NDVI.

**Vegetación estresada o enferma:**
- La clorofila se degrada → menos absorción en rojo → más reflexión en rojo
- La estructura celular colapsa → menos reflexión en NIR
- El contenido de agua baja → menos absorción en SWIR
La curva espectral cambia antes de que aparezcan síntomas visuales.
Eso es el fundamento de por qué la teledetección puede detectar estrés antes que el ojo.

**Suelo desnudo:**
- Reflexión relativamente alta y uniforme a través del espectro visible
- Aumenta hacia el NIR pero sin el "salto" dramático de la vegetación
- La humedad del suelo baja la reflexión en todas las bandas

**Agua clara:**
- Alta reflexión en azul (el agua se ve azul)
- Reflexión decae hacia el verde
- Muy baja en rojo
- Casi cero en NIR y SWIR (el agua absorbe completamente en esas regiones)

**Agua turbia o con sedimentos:**
- La reflexión en visible aumenta y se desplaza hacia el verde/rojo
- Ejemplo: el agua del Río Magdalena en temporada de lluvias vs. en verano

### La analogía de las huellas dactilares

Imagina que cada material deja una huella dactilar diferente en cada longitud de onda.
El satélite es como un lector de huellas ultra sofisticado que compara lo que recibe
con una biblioteca de firmas conocidas. Si la huella del pixel coincide con la firma
del cacao sano, clasifica ese pixel como cacao sano. Si coincide con la firma de
suelo desnudo húmedo, lo clasifica así.

### Cómo se miden las firmas espectrales en campo

Con un **espectrorradiómetro de campo** (como el ASD FieldSpec o el mismo panel de
calibración del dron Parrot Sequoia). En la práctica del curso, cuando los estudiantes
vuelen el dron, calibran con un panel de reflexión conocida — ese panel tiene una
firma espectral plana y conocida, lo que permite convertir los valores digitales de
la imagen en reflectancia real comparable con la biblioteca espectral.

---

**Referencia científica — Diapositiva 04 (firmas espectrales):**
> Ustin, S.L. & Gamon, J.A. (2010). Remote sensing of plant functional types.
> *New Phytologist*, 186(4), 795–816. https://doi.org/10.1111/j.1469-8137.2010.03284.x
> Revisión definitiva sobre cómo las propiedades optícas de las plantas varían por especie,
> estado fenológico y estrés. Excelente para explicar por qué cacao y café tienen firmas similares.

> Jacquemoud, S. & Baret, F. (1990). PROSPECT: a model of leaf optical properties spectra.
> *Remote Sensing of Environment*, 34(2), 75–91. https://doi.org/10.1016/0034-4257(90)90100-Z
> El modelo físico que explica la firma espectral de la vegetación desde la estructura
> celular. Muestra por qué el NIR refleja tanto (el mesofílo esponjoso) y el rojo absorbe
> (la clorofila). **Poner en la diapositiva de firma espectral de la vegetación** como nota al pie.

> Datt, B. (1998). Remote sensing of chlorophyll a, chlorophyll b, chlorophyll a+b
> and total carotenoid content in eucalyptus leaves.
> *Remote Sensing of Environment*, 66(2), 111–121.
> https://doi.org/10.1016/S0034-4257(98)00046-7
> Muestra las diferencias de firma espectral entre plantas con distintos niveles de
> clorofila. Til para justificar por qué la degradación de clorofila (como en Moniliasis)
> es detectable espectralmente.

---

## BLOQUE 5 — Las cuatro resoluciones: sensor, plataforma, resolución (40 minutos)

### El sistema de teledetección: tres componentes

Un sistema de teledetección siempre tiene tres elementos:

**1. Fuente de energía:**
- Solar (para sensores pasivos): el sol ilumina la superficie y el sensor mide el rebote
- El propio sensor (para sensores activos): el radar emite su propia señal

**2. Plataforma:** el vehículo que lleva el sensor
- Satélite: Sentinel-2, Landsat, MODIS, Sentinel-1
- Avión o avioneta: fotografía aérea convencional
- Dron / UAV: tu Parrot Sequoia en el bananal
- Torre o mástil: sensores fijos sobre cultivos

**3. Sensor:** el instrumento que captura la energía
- Cámara multiespectral (pasiva): captura la luz reflejada por la superficie
- Radar SAR (activo): emite microondas y mide el rebote
- Espectrómetro: mide la reflectancia punto a punto con alta resolución espectral
- Sensor térmico: mide la emisión de calor de la superficie

### Sensores pasivos vs. activos

**Sensores pasivos:**
- Dependen de una fuente de energía externa (generalmente el Sol)
- Solo funcionan de día y con cielo despejado (las nubes los bloquean)
- Ejemplos: Sentinel-2, Landsat, MODIS, tu dron multiespectral
- Analogía: tu ojo. Solo ves si hay luz. En la oscuridad o con niebla densa, no ves nada.

**Sensores activos:**
- Generan su propia energía y miden el eco
- Funcionan de día y de noche, con nubes, lluvia y en la oscuridad
- Ejemplos: Sentinel-1 (SAR), LiDAR
- Analogía: el murciélago. Emite ultrasonido y "ve" con el eco. No necesita luz.
  O el sonar de un submarino.

**Por qué esto importa para el curso:**
En el Caribe colombiano hay entre 60–80% de días nublados durante la temporada
lluviosa. Sentinel-2 pierde esas imágenes. Sentinel-1 las captura igual.
Por eso en el Artículo 3 de investigación fusionamos ambos — cada uno aporta
lo que el otro no puede.

### Los cuatro tipos de resolución

Esta es la parte técnica más importante de la sesión 1 y la que más confunde.
Hay CUATRO tipos distintos de resolución. Cada una mide una cosa diferente.

---

#### Resolución Espacial

**Definición:** el tamaño mínimo del objeto que el sensor puede distinguir en el suelo.
Se expresa en metros. Un sensor de 10 m de resolución espacial "ve" pixels de 10×10 m.

**Analogía perfecta para ingenieros — la pantalla del celular:**
Tu pantalla tiene una resolución de X píxeles. Cada píxel es el elemento mínimo que
puede representar. Si tu pantalla tiene píxeles muy grandes, la imagen se ve borrosa
y no puedes distinguir detalles finos. Si tiene píxeles muy pequeños (alta resolución),
puedes ver detalles muy finos. Lo mismo pasa con los satélites: un pixel de 10 m
significa que todo lo que cabe en un cuadrado de 10×10 m en el suelo queda
representado por un solo valor de color/reflectancia.

**Implicación práctica:**
Si quieres distinguir una carretera de 8 m de ancho, necesitas un sensor con
resolución mejor que 8 m. Si tu sensor tiene 30 m de resolución (Landsat),
esa carretera queda "mezclada" con lo que la rodea dentro del pixel.

**Resoluciones típicas por plataforma:**

| Plataforma | Resolución espacial | Uso típico |
|------------|--------------------|----|
| Dron (UAV) | 3–10 cm | Análisis de parcela individual, planta por planta |
| Sentinel-2 | 10–20–60 m | Análisis de finca, municipio, región |
| Landsat 8/9 | 30 m | Análisis regional, nacional |
| MODIS | 250 m – 1 km | Análisis continental, global |
| Sentinel-1 (SAR) | 10–20 m | Análisis regional con nubes |

**La trampa del "mejor es más resolución":**
Mayor resolución espacial no siempre es mejor. Una imagen de dron a 5 cm de resolución
sobre toda la SNSM sería imposible de procesar — el archivo tendría terabytes.
Para monitorear una región, 10–30 m es perfectamente suficiente y manejable.
El dron es para la finca. El satélite es para el departamento.

---

#### Resolución Espectral

**Definición:** el número de bandas (rangos del espectro) que el sensor puede capturar
y el ancho de cada banda. Un sensor con alta resolución espectral captura muchas
bandas estrechas. Un sensor con baja resolución espectral captura pocas bandas anchas.

**Analogía — el prisma de Pink Floyd:**
Un prisma descompone la luz blanca en todos sus colores. Un sensor multiespectral
hace eso con el espectro: descompone la luz que llega en varias "rajas" del espectro
y mide cada una por separado. Cuantas más rajas, mayor resolución espectral.

**Tipos según resolución espectral:**

**Pancromático (1 banda):**
- Una sola banda ancha que cubre todo el visible
- Como una foto en blanco y negro
- Alta resolución espacial pero cero información espectral
- Ejemplo: banda pancromática de Landsat 8 (B8, 15 m)

**Multiespectral (3–15 bandas):**
- Varias bandas en regiones específicas del espectro
- El estándar para teledetección aplicada
- Ejemplo: Sentinel-2 (13 bandas), Landsat 8 (11 bandas), tu dron Parrot Sequoia (5 bandas)

**Hiperespectral (>100 bandas):**
- Cientos de bandas muy estrechas (1–10 nm de ancho)
- Permite identificar materiales con precisión química
- Ejemplo: sensores AVIRIS, PRISMA
- Muy útil para detección de enfermedades en plantas, mineralogía
- Datos muy pesados, procesamiento complejo

**Por qué las bandas Red Edge de Sentinel-2 son especiales:**
Sentinel-2 tiene 3 bandas en la región Red Edge (B5: 705 nm, B6: 740 nm, B7: 783 nm).
Esta región del espectro — entre el rojo y el NIR — es extremadamente sensible a
cambios en el contenido de clorofila. Cuando una planta empieza a estresarse, la
clorofila se degrada y el Red Edge "se mueve". Landsat no tiene bandas Red Edge.
Esa es una ventaja clave de Sentinel-2 para agricultura de precisión.

---

#### Resolución Radiométrica

**Definición:** la capacidad del sensor para distinguir diferencias en la intensidad
de la energía captada. Se expresa en bits. Un sensor de 8 bits puede representar
2⁸ = 256 niveles de gris. Uno de 12 bits puede representar 2¹² = 4096 niveles.

**Analogía — el volumen del estéreo:**
Un volumen con 8 posiciones (0–7) vs. un volumen con 4096 posiciones. Con el de
4096 posiciones puedes hacer ajustes mucho más finos y detectar diferencias de
intensidad mucho más sutiles.

**En términos de imagen:**
- 8 bits: como una foto JPEG de calidad media. 256 tonos de gris por banda.
  Suficiente para visualización pero puede perder información en zonas muy oscuras
  o muy brillantes.
- 12 bits: como una foto RAW de cámara profesional. 4096 tonos. Mucho más detalle
  en sombras y zonas brillantes.

**Sensores típicos:**
- Landsat colección 1 y 2: 16 bits (aunque los valores significativos son 12–13 bits)
- Sentinel-2: 12 bits (valores de 0 a 4095 en imágenes L1C/L2A)
- Drones multiespectrales: generalmente 12–16 bits

**Implicación práctica:**
Cuando calculas NDVI u otros índices, una mayor resolución radiométrica te da
valores de índice más precisos. La diferencia entre una planta sana y una levemente
estresada puede ser de apenas 0.02 en NDVI — para detectar eso necesitas suficiente
resolución radiométrica.

---

#### Resolución Temporal

**Definición:** la frecuencia con la que el sensor vuelve a capturar la misma zona.
También llamado "tiempo de revisita". Se expresa en días.

**Analogía — el médico y los análisis:**
Si un médico te manda hacer un análisis de sangre cada 6 meses, solo sabes cómo
estabas en esos dos momentos del año. Si te lo hace cada semana, puede detectar
cambios sutiles mucho antes. Un satélite con revisita de 5 días "analiza la sangre
de la Tierra" 73 veces al año. Uno con revisita de 16 días, solo 23 veces.

**Resoluciones temporales típicas:**

| Plataforma | Revisita | Implicación |
|------------|---------|-------------|
| MODIS | 1–2 días | Ideal para monitoreo diario, pero resolución espacial baja (250 m–1 km) |
| Sentinel-2 (constelación A+B) | 5 días | Balance ideal para agricultura |
| Landsat 8+9 (combinados) | 8 días | Buen archivo histórico desde 1972 |
| Landsat individual | 16 días | Más lento pero archivo histórico largo |
| Dron | Cuando tú quieras | Máxima flexibilidad temporal, mínima cobertura espacial |

**El dilema resolución espacial vs. temporal:**
Existe un trade-off fundamental: los sensores con muy alta resolución espacial (drones,
satélites comerciales de <1 m) generalmente tienen revisita lenta o son de pago.
Los de alta revisita (MODIS) tienen baja resolución espacial.
Sentinel-2 es el punto de equilibrio gratuito más valioso disponible hoy.

**Por qué 5 días de revisita importa para Moniliasis:**
La fase biotrófica asintomática de *M. roreri* dura 45–60 días. Si el satélite
vuelve cada 5 días, tienes 9–12 observaciones durante esa ventana crítica. Suficiente
para detectar si las condiciones del dosel están cambiando hacia el riesgo.

---

**Referencia científica — Diapositiva 05 (resoluciones):**
> Chuvieco, E. (2016). *Fundamentals of Satellite Remote Sensing: An Environmental Approach*
> (2nd ed.). CRC Press. Capítulos 2 y 3.
> El texto en español de referencia para teledeteccion en Latinoamérica. Cubre los cuatro
> tipos de resolución con ejemplos. **Poner en la primera diapositiva del bloque 5.**

> Wulder, M.A. et al. (2022). Fifty years of Landsat science and impacts.
> *Remote Sensing of Environment*, 280, 113195.
> https://doi.org/10.1016/j.rse.2022.113195
> Revisión del impacto de 50 años de Landsat. Útil para hablar del trade-off
> resolución espacial vs. temporal y por qué Sentinel-2 complementa a Landsat.

---

## BLOQUE 6 — Plataformas satelitales clave (20 minutos)

### Las plataformas que usarás en el curso

**Sentinel-2 (ESA/Copernicus):**
- Constelación de dos satélites: Sentinel-2A y 2B
- Órbita: 786 km de altura
- Resolución espacial: 10 m (bandas visibles y NIR), 20 m (Red Edge, SWIR), 60 m (otras)
- Resolución espectral: 13 bandas (442–2190 nm)
- Resolución radiométrica: 12 bits
- Revisita: 5 días (con ambos satélites)
- Disponibilidad: gratuito desde 2015 en Copernicus Open Access Hub y Google Earth Engine
- Mejor para: agricultura, vegetación, cambio de cobertura, índices espectrales

**Sentinel-1 (ESA/Copernicus):**
- Radar SAR banda C (5.6 cm de longitud de onda)
- Resolución espacial: 10–20 m (modo IW, el más usado)
- Revisita: 6–12 días
- Funciona con nubes y de noche
- Gratuito en GEE
- Mejor para: monitoreo en zonas nubladas (¡Caribe colombiano!), humedad de suelo,
  estructura del dosel, inundaciones

**Landsat 8/9 (NASA/USGS):**
- El archivo más largo de teledetección terrestre: desde 1972 (Landsat 1–9)
- Resolución espacial: 30 m (multibandas), 15 m (pancromática), 100 m (térmica)
- Revisita: 16 días por satélite, 8 días combinando Landsat 8 y 9
- Gratuito en EarthExplorer y GEE
- Mejor para: análisis histórico, largo plazo, temperatura superficial (tiene banda térmica)

**MODIS (NASA):**
- A bordo de Terra y Aqua
- Resolución espacial: 250 m, 500 m, 1 km según banda
- Revisita: 1–2 días
- Gratuito en GEE
- Mejor para: monitoreo global, incendios, temperatura, fenología a gran escala
- Limitación: demasiado grueso para análisis a nivel de parcela

**Referencia científica — Diapositiva 06 (plataformas):**
> Drusch, M. et al. (2012). Sentinel-2: ESA’s Optical High-Resolution Mission for GMES
> Operational Services. *Remote Sensing of Environment*, 120, 25–36.
> https://doi.org/10.1016/j.rse.2011.11.026
> El paper oficial de Sentinel-2. Define las 13 bandas, los 3 niveles de resolución espacial
> y el diseño de la misión. **Incluir el DOI en la diapositiva de Sentinel-2** como pie de página.

> Torres, R. et al. (2012). GMES Sentinel-1 mission. *Remote Sensing of Environment*, 120, 9–24.
> https://doi.org/10.1016/j.rse.2011.05.028
> El paper oficial de Sentinel-1. Define las características del SAR y los modos de operación.
> **Incluir en la diapositiva de Sentinel-1** junto a la analogía del radar del aeropuerto.

> Moreira, A. et al. (2013). A tutorial on synthetic aperture radar.
> *IEEE Geoscience and Remote Sensing Magazine*, 1(1), 6–43.
> https://doi.org/10.1109/MGRS.2013.2248301
> La revisión más accesible de SAR para principiantes. Recomendada como lectura de apoyo
> en la diapositiva del Bloque 6 para quienes quieran profundizar en el SAR.

---

### Tabla comparativa para memorizar

| Satélite | Res. Espacial | Revisita | Bandas | Térmico | SAR | Gratuito |
|----------|--------------|---------|--------|---------|-----|---------|
| Sentinel-2 | 10–60 m | 5 días | 13 | No | No | Sí |
| Sentinel-1 | 10–20 m | 6–12 días | SAR VV/VH | No | Sí | Sí |
| Landsat 8/9 | 15–30–100 m | 8–16 días | 11 | Sí | No | Sí |
| MODIS | 250 m–1 km | 1–2 días | 36 | Sí | No | Sí |
| Dron UAV | 3–10 cm | Flexible | 5 (MS) | No | No | Propio |

---

## BLOQUE 7 — Tarea para casa

Los estudiantes deben hacer esto antes de la Sesión 2:

1. **Instalar SNAP 10.x** (step.esa.int) y QGIS 3.x (qgis.org)
2. **Registrarse en Copernicus Data Space** (browser.dataspace.copernicus.eu)
3. **Buscar una imagen Sentinel-2** de la zona del Magdalena y descargarla
   (te darás cuenta de cuántas bandas tiene y lo pesada que es)
4. **Lectura opcional:** Chuvieco (2002), Capítulo 1: "Conceptos básicos de teledetección"

---

## NOTAS DEL DOCENTE — Preguntas frecuentes que te pueden hacer

**"¿Por qué no usar solo el dron si tiene mejor resolución?"**
Porque un dron cubre hectáreas. Sentinel-2 cubre 290 km de franja de un solo paso.
Para monitorear todos los cacaotales del Magdalena necesitas el satélite.
El dron es para la finca, el satélite para el departamento.

**"¿Sentinel-2 es mejor que Landsat?"**
Depende del objetivo. Para agricultura y vegetación con análisis reciente, Sentinel-2
gana (mejor resolución espacial, Red Edge, revisita de 5 días). Para análisis histórico
desde los 80 o para temperatura superficial, Landsat gana (archivo desde 1972, banda térmica).
En el curso usamos los dos con propósitos distintos.

**"¿Por qué hay que pagar por algunos satélites comerciales si los de la ESA son gratis?"**
Los satélites comerciales (Planet, Maxar, SPOT) ofrecen imágenes de 30 cm a 3 m de
resolución, revisita diaria o bajo pedido. Esa combinación de ultra-alta resolución
y alta revisita tiene un costo. Los satélites de agencias espaciales (ESA, NASA) tienen
mandato público — sus datos son abiertos por política. Para investigación académica,
Sentinel y Landsat son suficientes en casi todos los casos.

**"¿El NDVI lo calculamos nosotros o el satélite lo da calculado?"**
Lo calculamos nosotros. El satélite entrega valores de reflectancia por banda.
Con esos valores calculamos los índices que nos interesan. En la Sesión 2 haremos
exactamente eso en SNAP.

---

## RESUMEN DE CONCEPTOS CLAVE — Para repasar antes de la clase

- **Teledetección:** obtener información sin contacto, mediante energía electromagnética
- **Sensor proximal:** en contacto o muy cerca (IoT, espectrómetro de mano)
- **Sensor remoto:** a distancia significativa (satélite, dron)
- **Sensor pasivo:** depende del Sol (Sentinel-2, Landsat)
- **Sensor activo:** emite su propia energía (Sentinel-1 SAR)
- **Espectro EM:** continuo de longitudes de onda, desde rayos gamma hasta radio
- **Firma espectral:** huella dactilar de reflexión de cada material
- **Resolución espacial:** tamaño del pixel en el suelo (metros)
- **Resolución espectral:** número y ancho de bandas
- **Resolución radiométrica:** niveles de gris distinguibles (bits)
- **Resolución temporal:** frecuencia de revisita (días)
- **NIR:** infrarrojo cercano — clave para detectar vegetación
- **SWIR:** infrarrojo de onda corta — sensible al agua
- **SAR:** radar de apertura sintética — penetra nubes

---

*Documento elaborado para uso interno del docente. Sesión 1 — Viernes 17 de julio de 2026.*
*Miguel Ángel Polo Castañeda — Maestría en Ingeniería, Universidad del Magdalena.*
