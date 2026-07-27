# Sesión 3 — Base de Conocimiento del Docente
## Sensores Hiperespectrales, Clasificación Supervisada e Índices Avanzados
### Maestría en Ingeniería — Universidad del Magdalena
#### Viernes 24 de julio de 2026 | 6:00 PM – 10:00 PM

> Este documento es tu guía personal. Está escrito para que tú entiendas cada concepto
> profundamente, sepas cómo explicarlo con analogías, y puedas responder cualquier
> pregunta que haga un ingeniero un viernes a las 6 PM después de haber trabajado todo el día.
> El hilo conductor de la sesión es pasar de "ver" la imagen satelital a "extraer
> información cuantitativa precisa" usando índices avanzados, clasificación supervisada
> y la perspectiva del sensor de dron que ya conocen de campo.

---

## DISTRIBUCIÓN DE LAS 4 HORAS

| Horario | Bloque | Tipo | Duración |
|---------|--------|------|---------|
| 6:00 – 6:10 | Apertura y conexión con sesión 2 | Plenaria | 10 min |
| 6:10 – 7:00 | Sensores hiperespectrales y firmas espectrales avanzadas | Teoría | 50 min |
| 7:00 – 7:50 | Clasificación supervisada en SNAP + validación | Teoría + Demo | 50 min |
| 7:50 – 8:00 | Pausa activa | — | 10 min |
| 8:00 – 8:50 | Índices avanzados: EVI, NDRE, LAI, NDMI + P4M | Teoría + Demo GEE | 50 min |
| 8:50 – 9:30 | Laboratorio guiado: GEE + SNAP (clasificación e índices) | Práctica | 40 min |
| 9:30 – 10:00 | Plenaria: propuestas de proyecto integrador + tarea | Cierre | 30 min |

---

## BLOQUE 0 — Apertura (10 minutos)

### Cómo arrancar sin perder tiempo

Son las 6 PM, los estudiantes llegaron del trabajo o de clase. No empieces con diapositivas.
Empieza con una pregunta que ya saben responder, para que sientan que van avanzando:

*"La semana pasada calculamos NDVI en SNAP sobre la imagen de la Sierra Nevada.
¿Alguien recuerda qué valor de NDVI tenían las zonas de cacao vs. las zonas de café?"*

Deja que respondan. Luego dices:

*"Hoy vamos a ir más allá del NDVI. El NDVI fue diseñado en los 70 para satélites con
pocas bandas. Hoy tenemos sensores que capturan 200 bandas, drones que capturan
5 bandas con precisión submétrica, y herramientas cloud como Google Earth Engine que
procesan todo eso sin instalar nada. Eso es lo que vemos esta noche."*

Luego conecta con el P4M (Phantom 4 Multispectral) directamente:

*"Y para que no sea solo teoría satelital: todo lo de índices avanzados que vemos
hoy, yo lo apliqué con un Phantom 4 Multispectral sobre bananales. Al final de la
noche van a entender exactamente qué hace ese dron y por qué sus 5 bandas son más
útiles que solo tomar una foto normal."*

---

## BLOQUE 1 — Sensores Hiperespectrales (50 minutos)

### Por qué necesitas explicar esto bien

Los estudiantes ya saben que Sentinel-2 tiene 13 bandas. Esta sesión les dice:
"¿qué pasa si tienes no 13 sino 200 o 400 bandas?" Eso es hiperspectral. Pero más
importante que el dato de las 200 bandas es entender **por qué importa** y cuándo
realmente lo necesitas.

---

### 1.1 De multiespectral a hiperespectral: la diferencia fundamental

**Sensor multiespectral** (como Sentinel-2 o el P4M):
Captura unas pocas bandas amplias y separadas del espectro.
Sentinel-2 tiene 13 bandas, cada una con un ancho de 10 a 180 nm.
Es como tener 13 fotografías del mismo lugar, cada una con un filtro de color diferente.

**Sensor hiperespectral:**
Captura cientos de bandas estrechas y contiguas (típicamente 2–10 nm de ancho cada una),
cubriendo el espectro de forma continua desde el visible hasta el SWIR.
Es como tener un espectrómetro completo para cada pixel de la imagen.

**La analogía del estéreo vs. el audiómetro:**
Un estéreo convencional tiene un ecualizador con 7–10 bandas (bajos, medios, agudos, etc.).
Con eso puedes decir si la música tiene mucho bajo o poco agudo.
Un audiómetro clínico mide frecuencia a frecuencia con precisión de 1 Hz.
Con él puedes detectar pérdida auditiva exacta en 4.000 Hz causada por daño de cóclea.
El multiespectral es el estéreo. El hiperespectral es el audiómetro.

**En números concretos:**

| Tipo de sensor | Número de bandas | Ancho de banda típico | Ejemplo |
|---|---|---|---|
| Multiespectral | 3–13 bandas | 30–180 nm | Sentinel-2, Landsat, P4M |
| Superspectral | 14–30 bandas | 10–30 nm | WorldView-3 (SWIR) |
| Hiperespectral | 100–400 bandas | 2–10 nm | AVIRIS, PRISMA, EnMAP |
| Ultraespectral | >400 bandas | <2 nm | Laboratorio de campo |

**Referencia científica:**
Goetz, A.F.H. (2009). Three decades of hyperspectral remote sensing of the Earth:
A personal view. *Remote Sensing of Environment*, 113(S1), S5–S16.
https://doi.org/10.1016/j.rse.2007.12.014
> El artículo fundacional que define los principios de la espectroscopía de imagen.
> Goetz acuñó el término "hiperspectral" en los años 80. Esencial para entender
> la historia y el principio físico.

---

### 1.2 La firma espectral continua: la huella dactilar completa

En la sesión 1 vimos que cada material tiene una firma espectral.
Con un sensor multiespectral ves la firma en 13 puntos — como reconocer una cara
viendo solo 13 píxeles dispersos.
Con un sensor hiperespectral ves la firma completa — la cara a plena resolución.

**¿Por qué la firma continua importa?**

Porque muchos fenómenos agrícolas y ecológicos producen cambios muy localizados
en el espectro, en regiones estrechas que los sensores multiespectrales no capturan:

**Ejemplo 1 — Estrés hídrico en cacao:**
El contenido de agua en la hoja produce cambios de absorción localizados exactamente
en 970 nm, 1.200 nm y 1.450 nm. Una banda de 30 nm de ancho "promedia" ese detalle.
Una banda de 5 nm de ancho lo captura con precisión.

**Ejemplo 2 — Contenido de clorofila:**
La clorofila a tiene un pico de absorción exactamente en 680 nm y otro en 430 nm.
Si tu banda "roja" va de 630 a 690 nm estás mezclando señal de clorofila a con
otras señales. Una banda de 5 nm en 680 nm es específica.

**Ejemplo 3 — Detección de enfermedades fúngicas:**
Un estudio clave demostró que *Moniliophthora roreri* (la moniliasis del cacao)
produce cambios espectrales detectables en la región 700–730 nm (borde del rojo)
antes de que aparezcan síntomas visuales. Esa región requiere bandas estrechas
para detectarse.

**Referencia científica:**
Croft, H., Chen, J.M. & Zhang, Y. (2014). The applicability of empirical vegetation
indices for determining leaf chlorophyll content over different leaf and canopy
structures. *Ecological Complexity*, 17, 119–130.
https://doi.org/10.1016/j.ecocom.2013.11.005
> Demuestra por qué la posición exacta de la banda en el espectro importa para
> estimar clorofila. Sustenta el uso de bandas estrechas del Red Edge.

---

### 1.3 Sensores hiperespectrales que existen hoy

**AVIRIS-NG (NASA / JPL):**
- Acrónimo: Airborne Visible/Infrared Imaging Spectrometer — Next Generation
- Plataforma: aeronave (avión de investigación)
- Bandas: 480 bandas de 380 a 2.510 nm, ancho de banda 5 nm
- Resolución espacial: 0.3–4 m según altitud de vuelo
- Uso principal: investigación de calibración, ecología, geología
- Limitación: no es un satélite, se alquila por misión, alto costo operativo
- Desarrollado en NASA JPL, Pasadena, California

**PRISMA (ASI — Agencia Espacial Italiana):**
- Lanzado: marzo 2019
- Plataforma: satélite orbital (615 km de altura)
- Bandas: 237 bandas de 400 a 2.505 nm, ancho de banda ~12 nm
- Resolución espacial: 30 m
- Revisita: 29 días
- Acceso: gratuito para investigación (registro en ASI)
- Por qué importa para ti: es el hiperespectral satelital gratuito más accesible hoy

**EnMAP (DLR — Alemania):**
- Lanzado: abril 2022
- Plataforma: satélite orbital (653 km)
- Bandas: 244 bandas de 420 a 2.450 nm, ancho de banda ~6 nm en VNIR, ~12 nm en SWIR
- Resolución espacial: 30 m
- Revisita: 27 días, programable bajo demanda
- Acceso: gratuito para investigación a través del portal EnMAP (enmap.org)
- Por qué importa: es la misión hiperespectral más reciente y de mejor calidad espectral

**DESIS (DLR en ISS):**
- Instalado en la Estación Espacial Internacional (ISS) desde 2018
- Bandas: 235 bandas de 400 a 1.000 nm (solo VNIR, no llega al SWIR)
- Resolución espacial: 30 m
- Revisita: variable por la órbita de la ISS
- Limitación: no cubre el SWIR — pierde información de humedad y minerales

**HySpex (Norsk Electro Optikk — plataforma aérea):**
- Sensor de alta gama para aeronaves de investigación
- Bandas: hasta 480 bandas, VNIR + SWIR
- Resolución espacial: <50 cm desde 1.000 m de altura
- Uso: inventarios forestales, minería, arqueología
- Es el sensor que usan varios grupos de investigación europeos en misiones de calibración

**Hyperion (NASA EO-1 — ya retirado):**
- Primer sensor hiperespectral satelital operacional (2000–2017)
- Bandas: 242 bandas de 400 a 2.500 nm
- Resolución espacial: 30 m
- Importancia histórica: generó la mayoría de los estudios hipespectrales satelitales de 2000–2017
- Archivos disponibles en USGS EarthExplorer — útil para estudios históricos

**Referencia científica:**
Transon, J., d'Andrimont, R., Maugnard, A. & Defourny, P. (2018). Survey of hyperspectral
Earth Observation applications from space in the Sentinel-2 context.
*Remote Sensing*, 10(2), 157.
https://doi.org/10.3390/rs10020157
> Revisión sistemática de aplicaciones hiperespectrales y cómo conviven con Sentinel-2.
> Muy útil para enmarcar el hiperspectral en el contexto que ya conocen tus estudiantes.

---

### 1.4 Hiperspectral en drones: el presente de la agricultura de precisión

Para los estudiantes de maestría en ingeniería, el hiperspectral más relevante no
está en el satélite sino en el dron. Hoy existen cámaras hiperespectrales compactas
montables en UAV:

**Specim AFX10 / AFX17:**
- 200–400 bandas en VNIR o SWIR
- Peso: ~400–700 g (compatible con drones de carga media)
- Precio: 20.000–50.000 USD — fuera del alcance de investigación típica en Colombia

**Resonon Pika L:**
- 150 bandas de 400 a 900 nm
- Peso: 340 g
- Precio: ~15.000 USD

**Por qué el P4M es la alternativa real:**
El Phantom 4 Multispectral no es hiperespectral. Tiene solo 5 bandas multiespectrales.
Pero sus bandas están estratégicamente ubicadas en las regiones más informativas del
espectro para agricultura. Eso lo hace extremadamente eficiente en relación costo-utilidad.
Es el sensor que tienes y con el que trabajamos en este curso.

La frase para los estudiantes: *"No necesitas 200 bandas para hacer agricultura de precisión.
Necesitas las bandas correctas. El P4M tiene exactamente las correctas."*

---

### 1.5 Adquisición de firmas espectrales en campo: el espectrómetro de mano

Para construir librerías espectrales que alimenten la clasificación supervisada,
se miden firmas espectrales directamente en campo con espectrómetros portátiles.

**ASD FieldSpec 4 (Malvern Panalytical):**
- Rango: 350 a 2.500 nm (todo el VNIR + SWIR de interés agrícola)
- Resolución espectral: 3 nm en VNIR, 10 nm en SWIR
- Peso: ~2.5 kg (portátil pero requiere porteo en campo)
- Protocolo estándar: medir siempre con referencia de panel blanco Spectralon cada 15 min
- Es el estándar de oro para calibración de sensores satelitales

**SVC HR-1024 (Spectra Vista Corporation):**
- Similar en capacidad, más compacto que el ASD
- Usado en varios proyectos de calibración en América Latina

**Protocolo de medición en campo (para explicar en clase):**
1. Medir entre 9:30 AM y 2:30 PM (ángulo solar alto, iluminación estable)
2. Panel de referencia blanco al inicio, cada 15 minutos y al final
3. Mínimo 10 mediciones por muestra, promediar
4. Anotar: hora, coordenadas GPS, condición de la hoja (sana, enferma, joven, madura)
5. Guardar en formato .asd y convertir a CSV para análisis

**Por qué esto importa para la clasificación supervisada:**
Las firmas espectrales medidas en campo son el "patrón de oro" con el que comparas
las firmas que el satélite o el dron registran desde arriba. Si la firma de una hoja
de cacao sana medida en campo no coincide con lo que registra el P4M, algo está
mal en la calibración del sensor o en las condiciones de iluminación.

**Referencia científica:**
Milton, E.J., Schaepman, M.E., Anderson, K., Kneubühler, M. & Fox, N. (2009).
Progress in field spectroscopy. *Remote Sensing of Environment*, 113(S1), S92–S109.
https://doi.org/10.1016/j.rse.2007.08.001
> El artículo de referencia para protocolos de espectroscopía de campo.
> Define los estándares que siguen los grupos de investigación en calibración.

---

### 1.6 El problema de la dimensionalidad: ¿200 bandas son siempre mejor?

Aquí está la trampa del hiperspectral que debes explicar con claridad.

**La maldición de la dimensionalidad (Hughes phenomenon):**
En clasificación estadística, a partir de cierto número de bandas la precisión
del clasificador empieza a DECRECER si no tienes suficientes muestras de entrenamiento.
Con 200 bandas y solo 50 muestras de entrenamiento, el clasificador tiene más
variables que observaciones — empieza a sobreajustarse al ruido.

**La regla empírica:**
Para clasificación hiperespectral se recomienda al menos 10–30 muestras de
entrenamiento POR BANDA. Con 200 bandas necesitas entre 2.000 y 6.000 muestras.
Eso es viable en imagen pero difícil de validar en campo.

**Solución: reducción de dimensionalidad antes de clasificar.**

Los tres métodos principales que debes conocer:

**PCA — Análisis de Componentes Principales:**
Transforma las 200 bandas correlacionadas en un número menor de componentes
ortogonales (no correlacionados). El PC1 captura la mayor varianza de la imagen,
el PC2 la segunda mayor, y así sucesivamente. Típicamente los primeros 5–10
componentes capturan el 95–99% de la información.
Analogía: en lugar de 200 preguntas del mismo tema, haces 10 preguntas
que cubren lo mismo sin repetición.

**MNF — Minimum Noise Fraction:**
Similar a PCA pero separa primero el ruido del sensor de la señal de interés.
Es el estándar para datos hiperespectrales — PCA funciona en datos limpios,
MNF funciona mejor cuando hay ruido del sensor.

**SAM — Spectral Angle Mapper:**
No es reducción de dimensionalidad sino un algoritmo de clasificación que
compara la "dirección" de la firma espectral (como un vector en espacio
n-dimensional) con las firmas de referencia. Mide el ángulo entre vectores.
Si el ángulo es pequeño (< 0.1 radianes), las firmas son similares.
Es robusto ante variaciones de iluminación porque el ángulo no depende
de la magnitud del vector, solo de su dirección.

**Referencia científica:**
Hughes, G.F. (1968). On the mean accuracy of statistical pattern recognizers.
*IEEE Transactions on Information Theory*, 14(1), 55–63.
https://doi.org/10.1109/TIT.1968.1054102
> El artículo de 1968 que describió la maldición de la dimensionalidad.
> Es uno de los artículos más citados en clasificación de imágenes.

Kruse, F.A., Lefkoff, A.B., Boardman, J.W., et al. (1993). The Spectral Image
Processing System (SIPS) — interactive visualization and analysis of imaging
spectrometer data. *Remote Sensing of Environment*, 44(2–3), 145–163.
https://doi.org/10.1016/0034-4257(93)90013-N
> El artículo que introdujo el algoritmo SAM. Aún el artículo de referencia
> para cualquier aplicación de SAM en teledetección.

---

## BLOQUE 2 — Clasificación Supervisada: el laboratorio que no hicieron completo (50 minutos)

### Por qué este bloque es práctico

En la sesión 2 mostraste la clasificación pero no la ejecutaron completa.
Esta noche la ejecutan. El objetivo es que al final del bloque cada estudiante
tenga un mapa clasificado de la zona cacaotera con su matriz de confusión
y sepa interpretar el Kappa.

---

### 2.1 Repaso rápido del flujo de clasificación supervisada

No repitas todo lo de la sesión 2. Solo el flujo de 5 pasos, muy rápido:

1. **Definir clases** — ¿qué quieres mapear? (cacao, café, bosque, suelo, agua)
2. **Dibujar ROIs** — áreas de entrenamiento sobre zonas que CONOCES en campo
3. **Entrenar el clasificador** — el algoritmo aprende la firma espectral de cada clase
4. **Clasificar toda la imagen** — el algoritmo etiqueta cada pixel
5. **Validar** — comparar resultado con puntos de campo no usados en entrenamiento

El énfasis esta noche está en el paso 2 (cómo hacer ROIs bien) y el paso 5 (cómo validar).

---

### 2.2 Cómo hacer ROIs que sirvan para publicación

Este es el paso que más mal hacen los estudiantes — y los investigadores novatos.
Hay cinco reglas no negociables:

**Regla 1 — Pureza espectral:**
Un ROI debe caer sobre una zona 100% de la clase que quieres representar.
Si dibuja un polígono sobre una zona de cacao que tiene árboles de sombra,
estás mezclando firmas. El clasificador aprende una firma "promedio" que no
representa ni al cacao ni al árbol de sombra.

**Regla 2 — Representatividad de la variabilidad:**
Una clase no tiene una sola firma espectral — tiene un rango.
El cacao joven tiene una firma diferente al cacao adulto. El cacao bajo sombra
diferente al cacao a pleno sol. Debes dibujar ROIs que capturen esa variabilidad.
Mínimo: ROIs en al menos 3 zonas geográficamente separadas de cada clase.

**Regla 3 — Número mínimo:**
Para clasificación supervisada con imágenes de 10 m de resolución y publicación en revista Q1:
- Mínimo 50 ROIs por clase (algunos autores sugieren 100)
- O al menos 10 × el número de bandas pixels totales por clase

**Regla 4 — Separación entrenamiento/validación:**
Los puntos de validación NUNCA pueden estar dentro de los ROIs de entrenamiento.
Si usas los mismos puntos para entrenar y para validar, tu Overall Accuracy será
artificialmente alta. Esto es uno de los errores más comunes que los revisores
de revistas detectan y que llevan al rechazo del artículo.
La práctica estándar: 70% de los puntos para entrenamiento, 30% para validación.

**Regla 5 — Verificación en campo o con imágenes de alta resolución:**
Cada ROI debe tener una fuente de verdad de campo. Puede ser:
- Visita de campo con GPS
- Google Earth Pro (en la misma fecha que la imagen) con imágenes de alta resolución
- Fotografías geolocalizadas tomadas con el dron

**Referencia científica:**
Foody, G.M. (2002). Status of land cover classification accuracy assessment.
*Remote Sensing of Environment*, 80(1), 185–203.
https://doi.org/10.1016/S0034-4257(01)00295-4
> El artículo que sistematizó los estándares de validación en clasificación de imágenes.
> Si tu estudiante pregunta por qué el 30% de validación, esta es la referencia.

---

### 2.3 Algoritmos de clasificación: cuál usar y cuándo

**Random Forest (RF) — el estándar actual:**

Qué es: un conjunto (ensemble) de árboles de decisión. Cada árbol se construye
con una muestra aleatoria de los datos de entrenamiento y usa solo un subconjunto
aleatorio de las bandas en cada nodo. La decisión final es la clase con más votos.

Por qué funciona tan bien en teledetección:
- Robusto ante datos no normales (que es el caso típico en reflectancia espectral)
- Maneja bien muchas bandas (ideal para hiperspectral)
- Reduce el sobreajuste por el mecanismo de aleatoriedad doble
- Provee un score de importancia de cada banda — sabes cuáles bandas importan más

Hiperparámetros clave:
- **n_estimators:** número de árboles (típicamente 100–500)
- **max_features:** número de bandas consideradas en cada nodo (√n_bandas es el default)
- **max_depth:** profundidad máxima de cada árbol (None = sin límite, puede sobreajustar)

En GEE la sintaxis es:
```javascript
var classifier = ee.Classifier.smileRandomForest(100);
var trained = classifier.train(training, 'class', bands);
var classified = image.classify(trained);
```

**Support Vector Machine (SVM):**

Qué es: busca el hiperplano de máximo margen que separa las clases en el espacio
espectral. Si las clases no son linealmente separables, usa un "kernel" para
proyectarlas a un espacio de mayor dimensión donde sí son separables.

Cuándo usarlo:
- Pocas muestras de entrenamiento (funciona bien con 20–30 ROIs)
- Clases con firmas espectrales muy similares (mayor capacidad de discriminación)
- Datos hiperespectrales con alta dimensionalidad

Limitación: el tiempo de entrenamiento crece cuadráticamente con el número de muestras.
Con millones de pixels, RF es más práctico.

**Máxima Verosimilitud (Maximum Likelihood — ML):**

Qué es: el clasificador clásico, base de la mayoría de sistemas de los años 80–90.
Asume que los datos de cada clase siguen una distribución normal multivariada.
Calcula la probabilidad de que cada pixel pertenezca a cada clase y asigna la
clase de mayor probabilidad.

Cuándo usarlo todavía:
- Pocas bandas (2–6) y clases bien separadas
- Cuando necesitas comparabilidad con estudios históricos que lo usaron
- Cuando las clases realmente tienen distribución normal (raro en datos reales)

Por qué ya no es el estándar:
La distribución real de la reflectancia en cultivos tropicales raramente es normal.
El RF y el SVM no asumen ninguna distribución, lo que los hace más flexibles.

**Referencia científica clave:**
Belgiu, M. & Drăguţ, L. (2016). Random forest in remote sensing: A review of
applications and future directions. *ISPRS Journal of Photogrammetry and Remote
Sensing*, 114, 24–31.
https://doi.org/10.1016/j.isprsjprs.2016.01.011
> La revisión sistemática de RF en teledetección. 3.000+ citas. Si un estudiante
> pregunta por qué RF es el estándar, este es el artículo que debes citar.

---

### 2.4 Validación: la parte que más importa para publicar

**La Matriz de Confusión: cómo leerla**

La matriz de confusión es una tabla donde:
- Las filas representan las clases REALES (lo que hay en campo)
- Las columnas representan las clases PREDICHAS (lo que dijo el clasificador)
- Los valores en la diagonal son los pixels clasificados correctamente
- Los valores fuera de la diagonal son errores

Ejemplo para una clasificación de 4 clases en la SNSM:

```
               Predicho
               Cacao  Café  Bosque  Suelo
Real  Cacao  [  45      3      0      2  ]
      Café   [   4     38      1      0  ]
      Bosque [   0      1     49      0  ]
      Suelo  [   1      0      0     46  ]
```

Leer esta matriz:
- La diagonal (45, 38, 49, 46) son los aciertos
- El "3" en fila Cacao / columna Café significa que 3 parcelas de cacao fueron
  clasificadas como café — error de omisión del cacao
- El "4" en fila Café / columna Cacao significa que 4 parcelas de café fueron
  clasificadas como cacao — error de comisión del cacao

**Métricas que reportar:**

**Overall Accuracy (OA):**
Suma de la diagonal dividida entre el total de puntos.
OA = (45+38+49+46) / 190 = 178/190 = 93.7%
Meta mínima para publicación: ≥ 85% en revistas de acceso abierto, ≥ 90% en Q1.

**Coeficiente Kappa de Cohen:**
Corrige la accuracy por el acuerdo esperado al azar.
Kappa = (OA − Pe) / (1 − Pe), donde Pe es la proporción de acuerdo al azar.
Interpretación:
- < 0.40: acuerdo pobre
- 0.40–0.60: acuerdo moderado
- 0.60–0.80: acuerdo sustancial
- > 0.80: acuerdo casi perfecto (meta para publicación)

**Producer's Accuracy (Sensibilidad por clase):**
¿Qué proporción de los pixels reales de una clase fueron correctamente identificados?
Para cacao: 45 / (45+3+0+2) = 45/50 = 90%
Detecta errores de omisión (cuánto de la clase real "se perdió").

**User's Accuracy (Precisión por clase):**
¿Qué proporción de los pixels clasificados como esta clase realmente pertenecen a ella?
Para cacao: 45 / (45+4+0+1) = 45/50 = 90%
Detecta errores de comisión (cuánto del mapa clasificado "contamina" la clase).

**La confusión más común en cultivos tropicales:**
Café con sombra vs. cacao con sombra es el par más difícil de separar solo con bandas
visibles. Las dos coberturas tienen dosel denso, biomasa similar, misma región.
Para separarlas necesitas el Red Edge (banda en 717 nm de Sentinel-2 o banda RE
del P4M) o datos de textura (SAR de Sentinel-1).

**Referencia científica:**
Congalton, R.G. (1991). A review of assessing the accuracy of classifications
of remotely sensed data. *Remote Sensing of Environment*, 37(1), 35–46.
https://doi.org/10.1016/0034-4257(91)90048-B
> El artículo fundacional de la validación en clasificación satelital.
> Define la matriz de confusión y el Kappa como estándares del campo.

---

### 2.5 Clasificación en SNAP: pasos concretos para el laboratorio

Los estudiantes ya tienen la imagen Sentinel-2 L2A de la SNSM que procesaron en sesión 2.

**Paso 1 — Crear el stack de bandas útiles:**
En SNAP: Radar > Coregistration > Stack Creator
Seleccionar B2, B3, B4, B5 (Red Edge), B8 (NIR), B11 (SWIR)
6 bandas es suficiente para discriminar las clases objetivo.

**Paso 2 — Dibujar ROIs (llamadas "pins" o "masks" en SNAP):**
- Usar la herramienta Mask Manager (Window > Mask Manager)
- Crear una máscara por clase: cacao, café, bosque_nativo, suelo_desnudo, agua
- Dibujar polígonos sobre zonas conocidas (verificar con Google Earth en paralelo)
- Meta rápida para clase: mínimo 15–20 polígonos por clase (en un laboratorio de 40 min)

**Paso 3 — Clasificar con Random Forest:**
- Tools > Supervised Classification > Random Forest Classification
- Seleccionar las clases definidas como ROIs
- n_trees: 100 (suficiente para esta imagen)
- Exportar resultado como GeoTIFF

**Paso 4 — Calcular la matriz de confusión:**
- Tools > Supervised Classification > Accuracy Assessment
- Cargar el mapa clasificado y los puntos de validación (reservados previamente)
- SNAP genera automáticamente la matriz de confusión y el Kappa

**Si SNAP da problemas de instalación → usar GEE:**
El mismo flujo está disponible en Google Earth Engine de forma más confiable
para los estudiantes que no pudieron instalar SNAP correctamente.
(El script de GEE lo ven en el Bloque 4.)

---

## BLOQUE 3 — Índices Espectrales Avanzados (50 minutos)

### El hilo conductor: del NDVI a los índices que se publican

El NDVI fue propuesto en 1973 por Rouse et al. y formalizado matemáticamente en su
forma actual por Tucker (1979). Fue diseñado para satélites Landsat con solo 4 bandas.
Funciona bien para estimar vigor vegetal general. Pero hoy tenemos sensores con bandas
que en 1973 no existían. Los índices de este bloque aprovechan esas bandas nuevas
para responder preguntas que el NDVI no puede responder.

Pregunta para arrancar el bloque: *"¿Cuál es la limitación más grande del NDVI?"*
La respuesta completa tiene tres partes:
1. Se satura en vegetación muy densa (NDVI > 0.8 ya no discrimina bien)
2. No es específico para ningún pigmento — responde a clorofila, agua, estructura
3. Es sensible al suelo expuesto cuando la cobertura es parcial

Los índices de este bloque atacan exactamente esas tres limitaciones.

---

### 3.1 EVI — Enhanced Vegetation Index

**Quién lo creó y por qué:**
Huete et al. (1994, 2002) desarrollaron el EVI para el sensor MODIS de NASA.
El problema con el NDVI sobre dosel tropical denso (Amazonia, bosques lluviosos,
cacaotales con sombra) es que se satura — cuando la vegetación es muy densa,
el rojo ya está casi completamente absorbido y cualquier aumento adicional de
biomasa no cambia el NDVI. El EVI fue diseñado para seguir siendo sensible
incluso en vegetación muy densa.

**Fórmula:**
```
EVI = G × (NIR − Rojo) / (NIR + C1×Rojo − C2×Azul + L)

Donde:
G = 2.5  (factor de ganancia)
C1 = 6   (coeficiente de corrección atmosférica para el rojo)
C2 = 7.5 (coeficiente de corrección atmosférica para el azul)
L = 1    (factor de ajuste de suelo)
```

**En Sentinel-2:**
```
EVI = 2.5 × (B8 − B4) / (B8 + 6×B4 − 7.5×B2 + 1)
```

> **Nota sobre EVI2 en Sentinel-2:** En zonas tropicales, la banda azul (B2) de Sentinel-2
> puede presentar artefactos por aerosoles y nubes delgadas. Algunos autores prefieren
> usar **EVI2** (sin banda azul) para evitar este problema:
> ```
> EVI2 = 2.5 × (B8 − B4) / (B8 + 2.4×B4 + 1)
> ```
> Referencia: Jiang, Z. et al. (2008). Development of a two-band enhanced vegetation index.
> *Remote Sensing of Environment*, 112(10), 4133–4142.
> https://doi.org/10.1016/j.rse.2008.06.006

**En el P4M (Phantom 4 Multispectral):**
El P4M tiene las bandas: Azul (450nm), Verde (560nm), Rojo (650nm), Red Edge (730nm), NIR (840nm)
```
EVI = 2.5 × (NIR − Red) / (NIR + 6×Red − 7.5×Blue + 1)
EVI = 2.5 × (B840 − B650) / (B840 + 6×B650 − 7.5×B450 + 1)
```

**Diferencias clave EVI vs NDVI:**

| Característica | NDVI | EVI |
|---|---|---|
| Rango | −1 a +1 | −1 a +1 |
| Saturación en dosel denso | Sí (a ~0.8) | No (sigue siendo sensible) |
| Sensible al suelo | Sí | Menos (corrección L) |
| Sensible a aerosoles atmosféricos | Moderadamente | Menos (corrección C1, C2, azul) |
| Bandas requeridas | NIR + Rojo | NIR + Rojo + Azul |
| Sensor mínimo | 2 bandas | 3 bandas (necesita azul) |

**Cuándo usar EVI en lugar de NDVI:**
- Sobre dosel muy denso: selva, bosque húmedo, cacao con alto porcentaje de sombra
- En regiones con alta carga de aerosoles (quemas, polvo del Sahara en el Caribe)
- Para comparaciones de alta precisión donde la saturación del NDVI introduce sesgo

**Referencia científica:**
Huete, A., Didan, K., Miura, T., Rodriguez, E.P., Gao, X. & Ferreira, L.G. (2002).
Overview of the radiometric and biophysical performance of the MODIS vegetation indices.
*Remote Sensing of Environment*, 83(1–2), 195–213.
https://doi.org/10.1016/S0034-4257(02)00096-2
> El artículo principal del EVI. 7.000+ citas. Demuestra la superioridad del EVI
> sobre el NDVI en vegetación densa tropical. Cita este en cualquier paper que use EVI.

---

### 3.2 NDRE — Normalized Difference Red Edge Index

**Por qué el Red Edge es especial:**

El "Red Edge" es la región espectral entre 680 y 780 nm donde la reflectancia
de la vegetación cambia drásticamente — de muy baja (absorción del rojo por
la clorofila) a muy alta (reflectancia NIR por la estructura celular).
Esta transición es como un "filo de cuchillo" espectral.

La posición y la pendiente de ese filo cambian según:
- El contenido de clorofila (clorofila alta → filo se desplaza hacia longitudes mayores)
- El estrés hídrico (déficit de agua → filo se desplaza hacia longitudes menores)
- El estrés por nitrógeno (deficiencia de N → filo más suave, menos pronunciado)

**Fórmula:**
```
NDRE = (NIR − Red Edge) / (NIR + Red Edge)
```

**En Sentinel-2 (usando banda B5 = 705 nm, el Red Edge de Sentinel):**
```
NDRE = (B8 − B5) / (B8 + B5)
```

**En el P4M:**
```
NDRE = (B840 − B730) / (B840 + B730)
```

**Por qué el NDRE detecta estrés antes que el NDVI:**

Cuando una planta empieza a estresarse (por falta de agua, enfermedades, plagas),
lo primero que cambia es la concentración de clorofila. Eso afecta la región del Red Edge
antes de que el NDVI cambie significativamente. Es como comparar un análisis de sangre
(que detecta la anemia antes de que el paciente sienta síntomas) vs. ver al paciente
caminar (el síntoma visible llega después).

En estudios de moniliasis del cacao, la degradación de clorofila en hojas infectadas
es detectable con el NDRE hasta 2–3 semanas antes de que los síntomas sean visibles
a ojo. Eso abre una ventana de intervención temprana.

**En qué se diferencia de NDVI:**

| | NDVI | NDRE |
|---|---|---|
| Bandas | NIR + Rojo (650–680 nm) | NIR + Red Edge (700–730 nm) |
| Sensible a | Biomasa verde total | Contenido de clorofila |
| Saturación | Temprana en dosel denso | Más tardía |
| Detección de estrés | Síntomas avanzados | Estrés temprano pre-visual |
| Requiere Red Edge | No | Sí (P4M tiene, Sentinel-2 tiene B5) |

**Referencia científica:**
Filella, I. & Penuelas, J. (1994). The red edge position and shape as indicators of
plant chlorophyll content, biomass and hydric status.
*International Journal of Remote Sensing*, 15(7), 1459–1470.
https://doi.org/10.1080/01431169408954177
> El artículo que estableció el Red Edge como indicador de clorofila y estrés hídrico.
> Fundacional para entender por qué el NDRE detecta estrés antes que el NDVI.

Moreira da Cruz Trevizan, R., Nardini, C., González-Flórez, C., et al. (2022).
Detection of *Moniliophthora roreri* early infection in cacao using hyperspectral
remote sensing and machine learning. *Computers and Electronics in Agriculture*, 193, 106699.
https://doi.org/10.1016/j.compag.2022.106699
> Demuestra que la infección de *Moniliophthora roreri* en cacao es detectable espectralmente
> en las regiones del Red Edge (700–730 nm) antes de que los síntomas sean visibles a ojo.
> Sustenta directamente la afirmación sobre detección temprana con el NDRE.

Zarco-Tejada, P.J., Camino, C., Beck, P.S.A., et al. (2018).
Previsual symptoms of *Xylella fastidiosa* infection revealed in spectral plant-trait
alterations. *Nature Plants*, 4, 432–439.
https://doi.org/10.1038/s41477-018-0189-7
> Estudio paradigmático de detección pre-visual de enfermedad con sensores de Red Edge
> (aunque en olivos, no cacao). El mecanismo espectral es el mismo que en la moniliasis.
> Referencia de alto impacto para justificar la ventana de intervención temprana.

---

### 3.3 LAI — Leaf Area Index

**Qué es:**
El LAI (Índice de Área Foliar) es la superficie total de hojas por unidad de
superficie de suelo. Un LAI de 4.0 significa que hay 4 m² de hoja por cada
m² de suelo que ocupas.

**Por qué es importante:**
El LAI está directamente relacionado con:
- La cantidad de radiación solar que intercepta el cultivo (y por ende la fotosíntesis)
- La evapotranspiración del cultivo
- El potencial de producción de biomasa
- La susceptibilidad a enfermedades (dosel muy denso → mayor humedad → más moniliasis)

**Valores de referencia para cultivos:**

| Cultivo | LAI típico | Condición |
|---|---|---|
| Cacao adulto bajo sombra | 4–7 | Dosel cerrado |
| Cacao joven | 1–3 | Dosel abierto |
| Banano en producción | 3–6 | Planta adulta |
| Maíz en máximo crecimiento | 3–5 | |
| Pastura degradada | 0.5–1.5 | |
| Bosque nativo tropical | 5–9 | |

**Cómo se estima por teledetección:**
El LAI no se mide directamente con el satélite o el dron.
Se estima a través de relaciones empíricas con índices espectrales,
principalmente con el NDVI o con índices más complejos:

Modelo simple (empírico):
```
LAI = −(1/k) × ln(1 − NDVI / NDVI_max)
```

Modelo con bandas múltiples — el más usado en GEE (producto MODIS LAI):
Usa un modelo de transferencia radiativa que incorpora NIR, Rojo, Azul y las
propiedades del suelo. En GEE está disponible el producto MOD15A2H (resolución 500 m)
que entrega LAI cada 8 días a nivel global.

Para estimaciones de alta precisión a nivel de parcela con el P4M:
Se usan regresiones entrenadas con mediciones de campo (LAI-2200, método destructivo)
como referencia, y se ajustan modelos sobre los índices del dron.

**Referencia científica:**
Bréda, N.J.J. (2003). Ground-based measurements of leaf area index: a review of
methods, instruments and current controversies. *Journal of Experimental Botany*,
54(392), 2403–2417.
https://doi.org/10.1093/jxb/erg263
> La revisión de referencia sobre métodos de medición de LAI. Define los métodos
> de campo que sirven como datos de calibración para estimaciones remotas.

Chen, J.M. & Black, T.A. (1992). Defining leaf area index for non-flat leaves.
*Plant, Cell and Environment*, 15(4), 421–429.
https://doi.org/10.1111/j.1365-3040.1992.tb00992.x
> Define formalmente el LAI para geometrías de hoja no plana — relevante para
> cacao y banano, ambas con hojas grandes y geometría compleja.

---

### 3.4 NDMI / NDWI — Índices de Humedad

**Hay dos índices de "agua" y hay que distinguirlos:**

**NDWI de Gao (1996) — agua en la vegetación:**
```
NDWI_Gao = (NIR − SWIR) / (NIR + SWIR)
```
En Sentinel-2: (B8 − B11) / (B8 + B11)
En el P4M: el P4M NO tiene banda SWIR — esto es una limitación importante del sensor.

Detecta: contenido de agua en las hojas (agua foliar)
Rango: −1 a +1. Valores altos = hoja bien hidratada. Valores bajos = estrés hídrico.

**NDWI de McFeeters (1996) — agua superficial libre (lagunas, ríos):**
```
NDWI_McFeeters = (Verde − NIR) / (Verde + NIR)
```
En Sentinel-2: (B3 − B8) / (B3 + B8)
Detecta: cuerpos de agua libre (ciénagas, embalses, ríos, inundaciones)
No confundir con el de Gao — usan bandas diferentes para propósitos diferentes.

**NDMI — Normalized Difference Moisture Index:**
```
NDMI = (NIR − SWIR1) / (NIR + SWIR1)
```
En Sentinel-2: (B8 − B11) / (B8 + B11)
Es matemáticamente idéntico al NDWI de Gao. Algunos autores lo llaman NDWI,
otros NDMI. Para evitar confusión con el NDWI de McFeeters, en agricultura
se prefiere el término NDMI para referirse al índice de humedad foliar.

**Limitación del P4M para humedad:**
El Phantom 4 Multispectral NO tiene banda SWIR (sus bandas van hasta 840 nm en NIR).
El NDMI/NDWI de Gao requiere SWIR (alrededor de 1.600 nm).
Por esta razón, con el P4M no puedes calcular directamente el índice de humedad
del dosel. Alternativas con el P4M:
- Usar el NDRE como proxy de estrés (detecta el efecto del estrés hídrico en la clorofila)
- Fusionar datos del P4M con Sentinel-2 que sí tiene B11 (SWIR)
- Usar la temperatura como proxy de estrés hídrico (requiere sensor térmico adicional)

Esto es algo que debes explicar con claridad cuando hablas del P4M — sus 5 bandas
son poderosas para indices de clorofila (NDRE) y vigor (EVI, NDVI) pero no llegan
al SWIR para humedad directa.

**Referencia científica:**
Gao, B.C. (1996). NDWI — A normalized difference water index for remote sensing
of vegetation liquid water from space. *Remote Sensing of Environment*, 58(3), 257–266.
https://doi.org/10.1016/S0034-4257(96)00067-3
> El artículo original del NDWI de Gao (el de humedad foliar). 5.000+ citas.
> Fundamental para entender el índice de humedad basado en SWIR.

McFeeters, S.K. (1996). The use of the Normalized Difference Water Index (NDWI)
in the delineation of open water features. *International Journal of Remote Sensing*,
17(7), 1425–1432.
https://doi.org/10.1080/01431169608948714
> El NDWI de McFeeters para agua superficial. Mismo año que Gao — por eso la
> confusión en la nomenclatura. Explícale esto a los estudiantes para que no
> mezclen las fórmulas.

---

### 3.5 El Phantom 4 Multispectral (P4M): el sensor de dron del curso

**Especificaciones técnicas:**

| Parámetro | Especificación |
|---|---|
| Plataforma | DJI Phantom 4 Pro con cargas Multispectral |
| Número de bandas | 5 bandas multiespectrales + 1 banda RGB visible |
| Banda Azul (B) | 450 nm ± 16 nm (FWHM) |
| Banda Verde (G) | 560 nm ± 16 nm |
| Banda Roja (R) | 650 nm ± 16 nm |
| Banda Red Edge (RE) | 730 nm ± 16 nm |
| Banda NIR | 840 nm ± 26 nm |
| Resolución de imagen | 2.08 MPx por banda (1600 × 1300 px) |
| Resolución espacial típica | 5.29 cm/px a 100 m de altura |
| Sensor de radiancia | Panel de sensores upwelling para corrección radiométrica en tiempo real |
| GSD a 100 m | ~5.3 cm/pixel |
| Cobertura por vuelo | ~0.4–0.8 km² a 100 m según velocidad |
| Tiempo de vuelo | ~27 minutos por batería |
| Peso | 1.487 g (con batería) |
| Software de procesamiento | DJI Terra, Pix4Dmapper, Agisoft Metashape |

**Por qué el P4M tiene un panel de sensores en la parte superior:**
El P4M tiene una cámara adicional mirando al cielo (el panel de irradiancia).
Esta cámara mide la cantidad de luz solar incidente en el mismo momento en que
las otras 5 cámaras toman la imagen del suelo.

¿Por qué importa? Porque la reflectancia de un objeto es:
```
Reflectancia = Luz reflejada / Luz incidente
```

Si solo mides la luz reflejada pero no la incidente, no puedes calcular la reflectancia
real — solo la radiancia, que cambia con las nubes, el ángulo solar y la hora del día.
El panel de irradiancia permite que el P4M calcule reflectancia absoluta aunque las
condiciones de iluminación cambien durante el vuelo.

Esta es una ventaja significativa del P4M sobre cámaras más simples.

**Flujo de trabajo con el P4M:**

```
1. Planificación de vuelo (DJI Terra o PIX4Dcapture)
   ↓ Definir altitud, solapamiento, velocidad
2. Vuelo + captura (GPS + IMU para georreferenciación directa)
   ↓ ~500–1000 fotos por vuelo de 15 min
3. Procesamiento fotogramétrico (Pix4Dmapper / Metashape / DJI Terra)
   ↓ Structure from Motion (SfM) → nube de puntos → ortomosaico
4. Corrección radiométrica (usando el panel de irradiancia del P4M)
   ↓ DN → Reflectancia de superficie
5. Calibración con panel reflectante en campo (Spectralon o equivalente)
   ↓ Verificar que la corrección es correcta
6. Cálculo de índices (NDVI, EVI, NDRE) sobre el ortomosaico
   ↓ En QGIS o ArcGIS o Python
7. Análisis y mapa final
```

**Solapamiento recomendado para agricultura:**
- Solapamiento lateral: 80%
- Solapamiento frontal: 80%
- Altitud de vuelo: 80–120 m (balance entre GSD y cobertura)
- A 100 m con solapamiento 80%/80%: GSD ~5 cm, cobertura ~0.8 km²/vuelo

**Referencia científica:**
Maresma, A., Ariza, M., Martínez, E., Lloveras, J. & Martínez-Casasnovas, J.A. (2016).
Analysis of vegetation indices to determine nitrogen application and yield prediction
in maize (*Zea mays* L.) from a standard UAV service.
*Remote Sensing*, 8(12), 973.
https://doi.org/10.3390/rs8120973
> Establece el protocolo estándar de uso de cámaras multiespectrales en UAV
> para estimación de índices en cultivos. Aplicable directamente con el P4M.

Candiago, S., Remondino, F., De Giglio, M., Dubbini, M. & Gattelli, M. (2015).
Evaluating multispectral images and vegetation indices for precision farming
applications from UAV images. *Remote Sensing*, 7(4), 4026–4047.
https://doi.org/10.3390/rs7044026
> Compara NDVI, NDRE, NDWI y otros índices calculados desde imágenes UAV multiespectrales.
> Primer artículo de referencia para índices en UAV agrícola.

---

## BLOQUE 4 — Laboratorio Google Earth Engine + SNAP (40 minutos)

### Estrategia del laboratorio

Los estudiantes tienen dos opciones en paralelo esta noche:
- **Opción A:** Google Earth Engine (GEE) — no requiere instalar nada, corre en el navegador.
  Recomendado para quienes no pudieron instalar SNAP o tienen PCs lentos.
- **Opción B:** SNAP — para quienes ya lo tienen instalado y quieren practicar en local.

El objetivo del laboratorio es el mismo en ambas opciones:
1. Calcular EVI y NDRE sobre la imagen de la SNSM
2. Ejecutar la clasificación supervisada y obtener la matriz de confusión
3. Comparar el EVI vs. NDVI en zonas de cacao denso (ver dónde el NDVI se satura)

---

### 4.1 Laboratorio en Google Earth Engine

**Qué es GEE (para quien no lo haya visto):**
Google Earth Engine es una plataforma cloud de análisis geoespacial de Google.
Tiene almacenados los archivos completos de Sentinel-2, Landsat, MODIS y decenas
de otros conjuntos de datos. No descargas nada — el código se ejecuta en los
servidores de Google. Es gratuito para investigación y educación.

Registro: code.earthengine.google.com (requiere cuenta Google y solicitud de acceso
educativo — si los estudiantes no tienen acceso, puedes compartir tu pantalla)

**Script GEE para calcular EVI y NDRE sobre la SNSM:**

```javascript
// ============================================================
// SESIÓN 3 — Índices Avanzados en GEE
// Zona: Sierra Nevada de Santa Marta, Colombia
// Imagen: Sentinel-2 L2A
// ============================================================

// 1. Definir área de interés (SNSM - zona cacaotera)
var aoi = ee.Geometry.Rectangle([-74.2, 10.5, -73.5, 11.2]);

// 2. Cargar imagen Sentinel-2 L2A con baja nubosidad
var imagen = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2024-01-01', '2024-03-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median()  // composición por mediana para eliminar nubes residuales
  .clip(aoi);

// 3. Calcular NDVI (ya lo conocen)
var ndvi = imagen.normalizedDifference(['B8', 'B4']).rename('NDVI');

// 4. Calcular EVI
var evi = imagen.expression(
  '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
    'NIR': imagen.select('B8').divide(10000),
    'RED': imagen.select('B4').divide(10000),
    'BLUE': imagen.select('B2').divide(10000)
  }).rename('EVI');

// 5. Calcular NDRE (Red Edge)
var ndre = imagen.normalizedDifference(['B8', 'B5']).rename('NDRE');

// 6. Calcular NDMI (humedad foliar, requiere SWIR)
var ndmi = imagen.normalizedDifference(['B8', 'B11']).rename('NDMI');

// 7. Visualización en mapa
var vizNDVI = {min: -0.2, max: 0.9, palette: ['red', 'yellow', 'green']};
var vizEVI  = {min: -0.2, max: 0.8, palette: ['red', 'yellow', 'darkgreen']};
var vizNDRE = {min: -0.1, max: 0.7, palette: ['red', 'orange', 'darkgreen']};

Map.centerObject(aoi, 10);
Map.addLayer(ndvi, vizNDVI, 'NDVI');
Map.addLayer(evi,  vizEVI,  'EVI');
Map.addLayer(ndre, vizNDRE, 'NDRE');

// 8. Mostrar en la consola los valores promedio por zona
print('EVI promedio:', evi.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi,
  scale: 10
}));
```

**Qué deben observar los estudiantes:**
- En zonas de bosque muy denso (Sierra Nevada alta): ¿el EVI sigue siendo alto cuando el NDVI ya está saturado?
- En zonas de cacao adulto con sombra: ¿el NDRE da valores diferentes al NDVI?
- En la Ciénaga Grande (que aparece en la esquina norte): ¿el NDMI detecta bien el agua?

---

### 4.2 Script GEE para clasificación supervisada

```javascript
// ============================================================
// CLASIFICACIÓN SUPERVISADA en GEE — Sesión 3
// ============================================================

// Usar la misma imagen cargada arriba
// Crear stack de índices + bandas espectrales para clasificar
var stack = imagen.select(['B2','B3','B4','B5','B8','B11'])
  .addBands(ndvi).addBands(ndre).addBands(evi);

// PASO 1: Definir puntos de entrenamiento
// (En clase, los estudiantes los dibujan en el mapa interactivo de GEE)
// Ejemplo de código para 4 clases:
var cacao  = ee.FeatureCollection(/* geometry dibujada */);
var cafe   = ee.FeatureCollection(/* geometry dibujada */);
var bosque = ee.FeatureCollection(/* geometry dibujada */);
var suelo  = ee.FeatureCollection(/* geometry dibujada */);

// PASO 2: Merge y muestreo
var training_points = cacao.merge(cafe).merge(bosque).merge(suelo);
var training = stack.sampleRegions({
  collection: training_points,
  properties: ['class'],
  scale: 10
});

// PASO 3: Entrenar Random Forest
var classifier = ee.Classifier.smileRandomForest(100).train({
  features: training,
  classProperty: 'class',
  inputProperties: stack.bandNames()
});

// PASO 4: Clasificar
var classified = stack.classify(classifier);

// PASO 5: Visualizar
var palette = ['#8B4513', '#6B8E23', '#228B22', '#D2B48C'];  // cacao, café, bosque, suelo
Map.addLayer(classified, {min: 0, max: 3, palette: palette}, 'Clasificación');

// PASO 6: Validación (accuracy assessment en GEE)
var validation = stack.sampleRegions({
  collection: training_points,  // En la práctica: usar puntos SEPARADOS
  properties: ['class'],
  scale: 10
});
var validated = validation.classify(classifier);
var errorMatrix = validated.errorMatrix('class', 'classification');
print('Matriz de confusión:', errorMatrix);
print('Overall Accuracy:', errorMatrix.accuracy());
print('Kappa:', errorMatrix.kappa());
```

**Nota para el docente:**
GEE tiene la ventaja de que no hay que descargar datos, instalar nada, ni preocuparse
por el tamaño del archivo. La desventaja es que requiere conexión a internet estable
y el código es en JavaScript, lo que puede intimidar inicialmente.
Muestra el script paso a paso, no todo de golpe.

---

## BLOQUE 5 — Plenaria: Propuestas de Proyecto Integrador (30 minutos)

### Qué es el proyecto integrador

El plan del curso contempla que cada estudiante (o grupo) desarrolle un proyecto
de investigación aplicada usando los conceptos del curso sobre un área de su interés.
Esta noche es la primera presentación pública de esas ideas.

### Formato de la presentación de propuesta (5 min por grupo)

Cada grupo presenta:
1. **Área de estudio:** dónde (municipio, departamento, tipo de ecosistema)
2. **Pregunta de investigación:** ¿qué quieren saber? (debe ser respondible con teledetección)
3. **Sensor propuesto:** ¿Sentinel-2, Landsat, P4M, SAR? ¿Por qué ese?
4. **Índice o producto:** ¿qué índice van a calcular o qué mapa van a producir?

### Preguntas que debes hacerles para guiar cada propuesta

*"¿Por qué ese sensor y no otro? ¿Qué resolución necesitas?"*
*"¿Tienes datos de campo para validar?"*
*"¿Hay nubosidad en esa zona? ¿Cómo la van a manejar?"*
*"¿La pregunta es temporal (cambio en el tiempo) o espacial (diferencias en el espacio)?"*

### Ideas de proyectos para sugerir si alguien no tiene claro el tema

- Mapeo de cobertura en la Ciénaga Grande de Santa Marta con Sentinel-2
- Detección de cambio en manglar con Sentinel-1 (SAR) ante eventos de El Niño
- Estimación de LAI en cultivos de banano de la zona norte del Magdalena con P4M
- Zonificación de riesgo de inundación en el Bajo Magdalena con Landsat + SAR

---

## TAREA PARA CASA (antes de la Sesión 4)

La sesión 4 es el sábado 25 de julio (8 AM – 6 PM) y cubre drones + Python para
teledetección. Para llegar preparados:

**Tarea obligatoria:**
1. En GEE: calcular el NDRE y el EVI de la imagen de la SNSM usada hoy
   y exportar ambos como GeoTIFF (File > Export > Image to Drive)
2. Ejecutar la clasificación supervisada en GEE con mínimo 4 clases
3. Obtener y reportar: Overall Accuracy, Kappa y la Matriz de Confusión
4. En media página: ¿en qué zonas el EVI y el NDVI difieren más? ¿Por qué crees que ocurre?

**Tarea opcional (para quienes tienen SNAP instalado):**
- Repetir la clasificación en SNAP y comparar los resultados con GEE
- ¿Cambia la Overall Accuracy? ¿Por qué podría cambiar?

**Lectura sugerida:**
Belgiu & Drăguţ (2016) — el artículo de Random Forest en teledetección
(ver referencia completa en Bloque 2). Páginas 24–28.

---

## NOTAS DEL DOCENTE — Preguntas frecuentes Sesión 3

**"¿Para qué usar hiperespectral si Sentinel-2 ya tiene 13 bandas?"**
Porque 13 bandas no pueden detectar características químicas específicas como
concentraciones de clorofila a vs. b, contenidos de antocianinas, o diferencias
sutiles en la composición bioquímica de la hoja. Para mapeo de coberturas generales,
Sentinel-2 es suficiente. Para detectar enfermedades en fases tempranas o estimar
calidad del grano, necesitas bandas estrechas.

**"¿Por qué el P4M no tiene SWIR si es tan importante para humedad?"**
Porque los sensores SWIR requieren detectores de InGaAs (Indium Gallium Arsenide)
que son caros, pesados y requieren enfriamiento criogénico. Un sensor SWIR compacto
para dron cuesta 30.000–80.000 USD adicionales. El P4M es un compromiso entre
capacidad y precio (~6.000–8.000 USD). Para humedad con el P4M, usas el NDRE
como proxy o combinas con Sentinel-2.

**"¿La clasificación en GEE da los mismos resultados que en SNAP?"**
En teoría sí si usas los mismos datos, ROIs y algoritmo. En la práctica hay
diferencias pequeñas por la forma en que cada plataforma maneja el muestreo
y los parámetros del clasificador. Si las diferencias son grandes (>5% en OA),
revisa los ROIs — probablemente hay diferencia en los puntos de entrenamiento.

**"¿El Kappa siempre debe ser > 0.80?"**
Para publicación en revistas Q1 en teledetección agrícola, sí. Pero hay contextos
donde 0.70–0.80 es aceptable si las clases son muy difíciles de separar espectralmente
y lo justificas con discusión. Lo que NO es aceptable es reportar solo el Overall Accuracy
sin el Kappa — los revisores lo piden siempre.

**"¿GEE reemplaza a SNAP?"**
No, son complementarios. GEE es ideal para procesamiento de grandes volúmenes,
composiciones multitemporales y análisis de series de tiempo. SNAP es ideal para
procesamiento específico de Sentinel (corrección atmosférica con Sen2Cor, análisis
de polarimetría SAR). En tu investigación seguramente usarás ambos.

**"¿Se puede calcular LAI con el P4M directamente?"**
No directamente — el LAI no es un índice que el P4M mide, es una variable que
se estima mediante modelos. Con el P4M calculas NDVI o NDRE, y luego aplicas
un modelo de regresión (entrenado con mediciones de LAI-2200 en campo) para
estimar el LAI. El modelo es específico para cada cultivo y zona, no es universal.

---

## RESUMEN DE CONCEPTOS CLAVE — Sesión 3

**Sensores hiperespectrales:**
- **Hiperespectral:** >100 bandas estrechas (2–10 nm), firma espectral continua
- **Multiespectral:** pocas bandas amplias (Sentinel-2: 13, P4M: 5)
- **AVIRIS, PRISMA, EnMAP:** los hiperespectrales satelitales más importantes
- **Maldición de la dimensionalidad:** más bandas no siempre = mejor clasificación
- **PCA / MNF:** reducción de dimensionalidad antes de clasificar datos hiperespectrales
- **SAM:** Spectral Angle Mapper, clasifica por ángulo entre firmas espectrales

**Clasificación supervisada:**
- **ROI:** Region of Interest — área de entrenamiento de clase conocida
- **Random Forest:** estándar actual, ensemble de árboles de decisión, ≥100 árboles
- **SVM:** bueno con pocas muestras y clases difíciles de separar
- **Máxima Verosimilitud:** clásico, asume distribución normal, ya no es el estándar
- **Overall Accuracy:** % pixels correctos, meta ≥ 85–90% para publicación
- **Kappa:** acuerdo corregido por azar, meta > 0.80, SIEMPRE reportar con OA
- **Matriz de confusión:** tabla de aciertos y errores por clase

**Índices avanzados:**
- **EVI:** corregido para dosel denso y aerosoles, necesita azul + rojo + NIR
- **NDRE:** contenido de clorofila, Red Edge, detecta estrés antes que NDVI
- **LAI:** área foliar por unidad de suelo, se estima por modelos no directamente
- **NDMI/NDWI Gao:** humedad foliar, requiere SWIR (no disponible en P4M)
- **NDWI McFeeters:** agua superficial libre (ríos, ciénagas), diferente del de Gao

**Phantom 4 Multispectral:**
- **5 bandas:** Azul 450 nm, Verde 560 nm, Rojo 650 nm, Red Edge 730 nm, NIR 840 nm
- **GSD a 100 m:** ~5.3 cm/pixel
- **Panel de irradiancia:** mide luz incidente para calcular reflectancia absoluta
- **Limitación:** NO tiene SWIR → no calcula NDMI directamente
- **Fortaleza:** Red Edge 730 nm → NDRE para estrés temprano y clorofila

**Google Earth Engine:**
- **Sin instalación:** corre en el navegador, datos Sentinel-2 ya cargados
- **ee.Classifier.smileRandomForest(100):** Random Forest en GEE
- **errorMatrix():** genera automáticamente la matriz de confusión
- **Complementario a SNAP:** GEE para series de tiempo, SNAP para procesamiento local

---

## REFERENCIAS CIENTÍFICAS COMPLETAS

1. **Goetz, A.F.H. (2009).** Three decades of hyperspectral remote sensing of the Earth:
   A personal view. *Remote Sensing of Environment*, 113(S1), S5–S16.
   https://doi.org/10.1016/j.rse.2007.12.014

2. **Transon, J. et al. (2018).** Survey of hyperspectral Earth Observation applications
   from space in the Sentinel-2 context. *Remote Sensing*, 10(2), 157.
   https://doi.org/10.3390/rs10020157

3. **Hughes, G.F. (1968).** On the mean accuracy of statistical pattern recognizers.
   *IEEE Transactions on Information Theory*, 14(1), 55–63.
   https://doi.org/10.1109/TIT.1968.1054102

4. **Kruse, F.A. et al. (1993).** The Spectral Image Processing System (SIPS).
   *Remote Sensing of Environment*, 44(2–3), 145–163.
   https://doi.org/10.1016/0034-4257(93)90013-N

5. **Croft, H., Chen, J.M. & Zhang, Y. (2014).** The applicability of empirical
   vegetation indices for determining leaf chlorophyll content.
   *Ecological Complexity*, 17, 119–130.
   https://doi.org/10.1016/j.ecocom.2013.11.005

6. **Milton, E.J. et al. (2009).** Progress in field spectroscopy.
   *Remote Sensing of Environment*, 113(S1), S92–S109.
   https://doi.org/10.1016/j.rse.2007.08.001

7. **Foody, G.M. (2002).** Status of land cover classification accuracy assessment.
   *Remote Sensing of Environment*, 80(1), 185–203.
   https://doi.org/10.1016/S0034-4257(01)00295-4

8. **Congalton, R.G. (1991).** A review of assessing the accuracy of classifications
   of remotely sensed data. *Remote Sensing of Environment*, 37(1), 35–46.
   https://doi.org/10.1016/0034-4257(91)90048-B

9. **Belgiu, M. & Drăguţ, L. (2016).** Random forest in remote sensing: A review
   of applications and future directions. *ISPRS Journal of Photogrammetry and
   Remote Sensing*, 114, 24–31.
   https://doi.org/10.1016/j.isprsjprs.2016.01.011

10. **Huete, A. et al. (2002).** Overview of the radiometric and biophysical
    performance of the MODIS vegetation indices.
    *Remote Sensing of Environment*, 83(1–2), 195–213.
    https://doi.org/10.1016/S0034-4257(02)00096-2

11. **Filella, I. & Penuelas, J. (1994).** The red edge position and shape as
    indicators of plant chlorophyll content, biomass and hydric status.
    *International Journal of Remote Sensing*, 15(7), 1459–1470.
    https://doi.org/10.1080/01431169408954177

12. **Gao, B.C. (1996).** NDWI — A normalized difference water index for remote
    sensing of vegetation liquid water from space.
    *Remote Sensing of Environment*, 58(3), 257–266.
    https://doi.org/10.1016/S0034-4257(96)00067-3

13. **McFeeters, S.K. (1996).** The use of the Normalized Difference Water Index
    (NDWI) in the delineation of open water features.
    *International Journal of Remote Sensing*, 17(7), 1425–1432.
    https://doi.org/10.1080/01431169608948714

14. **Bréda, N.J.J. (2003).** Ground-based measurements of leaf area index:
    a review of methods, instruments and current controversies.
    *Journal of Experimental Botany*, 54(392), 2403–2417.
    https://doi.org/10.1093/jxb/erg263

15. **Chen, J.M. & Black, T.A. (1992).** Defining leaf area index for non-flat leaves.
    *Plant, Cell and Environment*, 15(4), 421–429.
    https://doi.org/10.1111/j.1365-3040.1992.tb00992.x

16. **Candiago, S. et al. (2015).** Evaluating multispectral images and vegetation
    indices for precision farming applications from UAV images.
    *Remote Sensing*, 7(4), 4026–4047.
    https://doi.org/10.3390/rs7044026

17. **Maresma, A. et al. (2016).** Analysis of vegetation indices to determine
    nitrogen application and yield prediction in maize from a standard UAV service.
    *Remote Sensing*, 8(12), 973.
    https://doi.org/10.3390/rs8120973

18. **Rouse, J.W., Haas, R.H., Schell, J.A. & Deering, D.W. (1973).** Monitoring
    vegetation systems in the Great Plains with ERTS.
    *Third ERTS Symposium*, NASA SP-351, 309–317.
    > La propuesta original del índice. Referencia histórica esencial (memoria de congreso,
    > no revista indexada — citar junto a Tucker 1979 en publicaciones).

19. **Tucker, C.J. (1979).** Red and photographic infrared linear combinations for monitoring
    vegetation. *Remote Sensing of Environment*, 8(2), 127–150.
    https://doi.org/10.1016/0034-4257(79)90013-0
    > La formalización del NDVI en revista indexada. Es la cita más apropiada para artículos
    > científicos y tesis de maestría. Más de 20.000 citas en Scopus.

20. **Breiman, L. (2001).** Random Forests. *Machine Learning*, 45(1), 5–32.
    https://doi.org/10.1023/A:1010933404324
    > El artículo original del algoritmo Random Forest. Esencial si los estudiantes lo
    > usan en sus tesis — los revisores siempre piden esta cita junto a Belgiu & Dragut 2016.

---

*Documento elaborado para uso interno del docente. Sesión 3 — Viernes 24 de julio de 2026.*
*Miguel Ángel Polo Castañeda — Maestría en Ingeniería, Universidad del Magdalena.*