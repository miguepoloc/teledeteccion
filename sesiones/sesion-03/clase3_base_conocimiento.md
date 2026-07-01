# Sesión 3 — Base de Conocimiento del Docente
## Índices Espectrales Avanzados & Clasificación Supervisada
### Maestría en Ingeniería — Universidad del Magdalena
#### Viernes 24 de julio de 2026 | 18:00 – 22:00 (4 h)

> Esta es tu guía personal para un viernes de 4 horas.
> El hilo conductor de toda la sesión es la tesis de Marcelo Bonivento —
> tu tutoría activa, hecha con el mismo P4M que usarás mañana en S4,
> en el mismo lote experimental de la universidad.
> No es teoría abstracta: es la investigación que diriges tú.

---

## DISTRIBUCIÓN DE LA SESIÓN

| Hora | Bloque | Tipo |
|------|--------|------|
| 18:00 – 18:15 | Apertura: mini-caso desde tu propia tutoría | Teoría |
| 18:15 – 19:15 | Índices avanzados: NDRE, EVI, NDMI, LAI | Teoría |
| 19:15 – 19:45 | Notebook 05: índices avanzados en GEE | Lab Colab |
| 19:45 – 20:00 | Pausa | — |
| 20:00 – 20:45 | Clasificación supervisada: ROIs, Random Forest, validación | Teoría |
| 20:45 – 21:30 | Notebook 06: clasificación supervisada con GEE + scikit-learn | Lab Colab |
| 21:30 – 22:00 | Avance de proyecto: presentaciones orales de 2 min | Proyecto |

---

## BLOQUE 0 — Apertura: el caso Bonivento (15 minutos)

### Cómo abrir esta sesión

No empieces con "hoy vamos a ver índices avanzados". Empieza con una imagen.

Abre en pantalla la figura de la tesis que muestra la película de agua sobre una hoja de banano — es la foto de la hoja mojada con la lámina de agua libre visible. Déjala 15 segundos.

Luego dices:

*"Eso es agua libre sobre una hoja de banano. No es lluvia, no es rocío decorativo — es el requisito biológico de la Sigatoka negra para germinar. La Sigatoka necesita que esa película esté presente mínimo 12 horas para infectar la hoja. Si pudiéramos detectar esa película desde un dron antes de que el ojo humano la vea, podríamos optimizar las fumigaciones. Ese es exactamente el problema que está resolviendo Marcelo Bonivento, estudiante de maestría de este programa, en su tesis que yo dirijo junto con Alexander Espinosa."*

Pausa. Dejas que conecten.

*"Marcelo usó el mismo dron que vamos a volar mañana — el DJI Phantom P4M. Hizo 44 experimentos controlados en el lote experimental de la universidad: ponía una hoja de banano en el suelo, le aplicaba volúmenes de agua con una jeringa graduada — 0 cc, 5 cc, 10 cc... hasta 60 cc — y tomaba imágenes con el dron a dos metros de altura. Cada experimento tenía etiqueta exacta de cuánta agua había. Luego evaluó 13 índices espectrales diferentes para ver cuál detectaba mejor el agua."*

*"¿Cuál esperan que haya ganado?"*

Deja que adivinen. Probablemente digan NDVI, NDWI o NDMI. Luego:

*"No fue ninguno de esos. El ganador fue NIR/Verde — una razón simple, no un índice normalizado. Y la Regresión Lineal Múltiple le ganó al Random Forest. Hoy vamos a entender exactamente por qué esos resultados tienen sentido físico. Esa es la razón por la que los índices que vamos a ver esta noche no son arbitrarios — tienen una física detrás."*

Eso pone al grupo en modo activo. Han escuchado algo que no esperaban, sobre investigación real, con datos que tú mismo has visto.

---

## BLOQUE 1 — Índices espectrales avanzados (60 minutos)

### El problema fundamental del NDVI: saturación

Antes de hablar de los índices nuevos, explica por qué son necesarios.

*"El NDVI tiene un problema que nadie te dice en los tutoriales básicos: se satura. Cuando la vegetación es muy densa — un bosque, un bananal adulto, un cultivo de cacao con mucho dosel — el NDVI se queda 'pegado' alrededor de 0.8–0.9 aunque la salud del cultivo esté cambiando. Es como intentar pesar a alguien en una báscula que solo llega a 100 kg: una vez que pasa ese límite, ya no te dice nada."*

Di esto como tabla visual en la pizarra:

| Situación | NDVI típico | El NDVI te dice |
|-----------|-------------|-----------------|
| Suelo desnudo | 0.05–0.15 | Funciona bien |
| Pastizal | 0.2–0.4 | Funciona bien |
| Cultivo joven | 0.4–0.6 | Funciona bien |
| Cacao adulto | 0.75–0.85 | **Se satura** |
| Cacao adulto enfermo | 0.72–0.82 | Casi idéntico al sano |
| Bosque denso | 0.80–0.90 | **Se satura** |

*"Para los estudiantes que trabajan en zonas con vegetación tropical densa — la Sierra Nevada, la Ciénaga Grande, cultivos de exportación — el NDVI ya no es suficiente. Necesitan índices que sigan funcionando en ese rango."*

---

### NDRE — Normalized Difference Red Edge

**El concepto físico — dilo antes de la fórmula:**

*"Recuerden la curva de reflectancia de la vegetación. Entre 650 nm (rojo) y 750 nm (NIR) hay una zona donde la reflectancia sube dramáticamente — del ~5% al ~50% en pocos nanómetros. Eso se llama el Red Edge. La pendiente de ese salto y dónde está el punto de inflexión dependen directamente de la concentración de clorofila en la hoja: más clorofila = salto más pronunciado, punto de inflexión desplazado hacia el rojo. Sentinel-2 tiene tres bandas exactamente en esa zona (B5=705nm, B6=740nm, B7=783nm) para capturar esa información."*

La fórmula:
```
NDRE = (B8A − B5) / (B8A + B5)
```

*"B5 está en 705 nm — justo al inicio del Red Edge, donde la clorofila aún absorbe. B8A está en 865 nm — en el NIR donde la vegetación refleja fuerte. La diferencia entre esos dos captura exactamente la transición. Valores altos = mucha clorofila. Valores bajos en un cultivo que antes tenía NDRE alto = señal de estrés nutricional o inicio de enfermedad."*

**La analogía del termómetro clínico:**
*"El NDVI es como medir temperatura con la mano — te dice si hay fiebre, pero no te dice 37.8 o 39.5. El NDRE es el termómetro clínico: es sensible a diferencias pequeñas en el estado fisiológico de la planta. Para decisiones de manejo en cultivos — ¿fumigo hoy o espero? ¿cuánto nitrógeno aplico? — esa diferencia pequeña importa."*

**Conexión con la tesis Bonivento:**
La tesis usó NDRE como una de las cinco características para segmentar las hojas de banano mediante k-means — no para detectar agua, sino para distinguir tejido foliar vivo de suelo y vegetación de fondo. El NDRE identifica específicamente tejido con clorofila activa, lo que lo hace mucho mejor que el NDVI para segmentar hojas individuales contra un fondo heterogéneo.

---

### NDMI — Normalized Difference Moisture Index

**El concepto físico:**

*"El agua líquida absorbe fuertemente en el infrarrojo de onda corta — lo que llamamos SWIR, alrededor de 1600 nm. Sentinel-2 tiene la banda B11 ahí. Si la hoja tiene mucha agua en sus células (o sobre su superficie), esa banda cae. Si la hoja está estresada hídricamentee, las células se deshidratan y la reflectancia en SWIR sube."*

La fórmula:
```
NDMI = (B8A − B11) / (B8A + B11)
```

*"NDMI > 0.2: hoja bien hidratada. NDMI 0 a 0.2: estrés hídrico moderado. NDMI < 0: estrés severo, suelo desnudo, o quizás agua superficial."*

**El giro interesante — la limitación del P4M y la tesis Bonivento:**

*"¿Por qué el NDMI no fue el índice ganador en la tesis de Marcelo? Por una razón muy concreta: el P4M no tiene banda SWIR. El sensor tiene bandas hasta 840 nm. La absorción del agua libre en la superficie foliar ocurre principalmente en la región SWIR — que el P4M no puede ver. Entonces Marcelo tuvo que buscar otro índice que detectara el agua de forma indirecta."*

*"Y lo encontró: el índice NIR/Verde. ¿Por qué funciona? Cuando hay una película de agua sobre la hoja, dos cosas pasan simultáneamente: el NIR baja, porque la película de agua absorbe parcialmente en esa región. Y el Verde sube, porque la superficie mojada tiene reflexión especular — como cuando ves un espejo mojado que brilla más. La razón NIR/Verde captura ambos efectos a la vez. Eso explica por qué superó al NDWI convencional con dJM=1.236."*

*"Esto es un resultado original de la tesis. No está en los libros de texto. Marcelo lo encontró empíricamente con 44 experimentos."*

**Aplicación en Sentinel-2 — dónde sí podemos usar NDMI:**
Sentinel-2 tiene B11 (1610 nm). Con imágenes satelitales, el NDMI estándar funciona perfectamente para detectar estrés hídrico en cultivos a escala regional. Es una de las variables más útiles para monitoreo de sequía en el Magdalena.

---

### EVI — Enhanced Vegetation Index

**El concepto físico:**

*"El EVI corrige dos problemas del NDVI: la influencia del suelo (que es fuerte cuando el dosel es escaso) y la distorsión de los aerosoles (que es fuerte en zonas con mucho polvo o humedad). Para hacer eso usa tres bandas en lugar de dos: añade el azul (B2) para corregir la atmósfera."*

La fórmula:
```
EVI = 2.5 × (B8 − B4) / (B8 + 6·B4 − 7.5·B2 + 1)
```

*"Los números 6, 7.5 y 2.5 no son arbitrarios — son coeficientes calibrados por Huete et al. (1997) con mediciones de campo en diferentes ecosistemas. El 6 corrige la dispersión Rayleigh atmosférica; el 7.5 corrige los aerosoles; el 2.5 es el factor de ganancia."*

**Cuándo usarlo:**
- Zonas con vegetación muy densa donde el NDVI se satura
- Imágenes con neblina o aerosoles (frecuentes en el Caribe colombiano en ciertos meses)
- Cuando necesitas comparar índices entre regiones geográficas distintas

---

### LAI — Leaf Area Index

**Aclaración conceptual importante:**

*"El LAI no es un índice espectral — es una variable biofísica: metros cuadrados de hoja por metro cuadrado de suelo. Un LAI de 4 significa que si sumas toda la superficie foliar de un metro cuadrado de cultivo, obtienes 4 metros cuadrados de hoja. No se mide directamente desde el satélite — se estima por regresión desde NDVI o NDRE."*

La ecuación de Beer-Lambert simplificada:
```
LAI ≈ −ln((0.69 − NDVI) / 0.59) / 0.91
```

*"Esta fórmula viene de la ley de extinción de luz en el dosel: más hojas = más interceptación de luz solar. Tiene limitaciones importantes: se satura también, no funciona bien con NDVI > 0.85, y es diferente para cada tipo de cultivo. Pero como estimación de primer orden para comparar zonas dentro de la misma imagen, es útil."*

**Para qué sirve en la práctica:**
- Modelos de producción agrícola: más LAI = más área fotosintética = más potencial de rendimiento
- Estimación de biomasa
- Calibración de modelos de transferencia radiativa

**La pregunta que puedes hacer al grupo:**
*"¿Un LAI de 6 es bueno o malo para un cultivo de cacao?"* Respuesta esperada: depende — para cacao adulto es normal (3–6 m²/m²), para cacao recién sembrado sería altísimo y sospechoso.

---

### La tabla resumen — escríbela en la pizarra

| Índice | Bandas S-2 | Detecta | Cuándo usarlo |
|--------|-----------|---------|---------------|
| NDVI | B8, B4 | Vigor general | Siempre como línea base |
| NDRE | B8A, B5 | Clorofila en dosel denso | Cuando NDVI se satura |
| NDMI | B8A, B11 | Agua en hoja (estrés hídrico) | Monitoreo de sequía, riego |
| EVI | B8, B4, B2 | Vigor corrigiendo atmósfera | Imágenes con neblina, zonas áridas |
| LAI | estimado de NDVI | Área foliar total | Modelos de producción |

---

## BLOQUE 2 — Notebook 05 (30 minutos)

### Cómo presentarlo antes de abrir el notebook

*"Van a abrir el Notebook 05 en Colab. Vamos a calcular NDRE, NDMI, EVI y LAI sobre la zona bananera del Norte del Magdalena con Sentinel-2 de Ene–Mar 2024. También vamos a hacer algo específico de la tesis Bonivento: comparar el NDMI en temporada seca vs lluvia — para ver si el satélite detecta las diferencias de hidratación foliar que Marcelo midió en el experimento controlado."*

### Errores típicos de los estudiantes en este notebook

**"El NDMI da valores muy negativos"**
Causa: confundieron el orden de las bandas — pusieron B11 antes de B8A.
Solución: recordar que la fórmula es (B8A − B11) / (B8A + B11). Como B8A > B11 en vegetación sana, el resultado debe ser positivo.

**"El EVI da valores mayores a 1"**
Causa: olvidaron dividir las bandas entre 10000 antes de aplicar la fórmula. Sentinel-2 entrega valores en escala DN (0–10000), no en reflectancia (0–1).
Solución: `imagen.select('B8').divide(10000)` antes de calcular.

**"No entiendo para qué sirve comparar seca vs lluvia"**
Explica: *"El NDMI en temporada lluviosa debe ser mayor que en seca — las hojas están más hidratadas. Si vemos eso en los datos satelitales, estamos observando exactamente el mismo fenómeno que Marcelo midió con el dron, pero a escala de miles de hectáreas y a lo largo del año."*

---

## BLOQUE 3 — Pausa (15 minutos)

Aprovecha para hacer una pregunta rápida al grupo al volver:

*"Una pregunta rápida: ¿cuál es la diferencia entre clasificación supervisada y no supervisada?"*

Si alguien lo sabe, perfecto. Si nadie lo sabe, mejor — tienes toda la atención para explicarlo.

---

## BLOQUE 4 — Clasificación supervisada (45 minutos)

### La analogía del médico residente

Esta es la analogía central. Escríbela como esquema en la pizarra mientras la explicas.

*"Imaginen que tienen un hospital con mil radiografías de pacientes, sin diagnóstico. Les piden a una persona sin entrenamiento médico que las agrupe por 'qué tan parecidas se ven'. Esa persona va a agrupar las radiografías en, digamos, 5 grupos — pero no sabe qué significa cada grupo. Eso es la clasificación no supervisada que vieron en S2: K-means agrupa píxeles similares, pero tú tienes que interpretar qué significa cada grupo."*

*"Ahora imaginen que toman a un residente de medicina y le muestran 200 radiografías ya diagnosticadas por un experto: 'esta es neumonía, esta es normal, esta es tuberculosis'. El residente aprende los patrones. Después, al ver una radiografía nueva, puede clasificarla correctamente porque fue entrenado con ejemplos etiquetados. Eso es la clasificación supervisada."*

*"Los ROIs — Regions of Interest — son las 200 radiografías etiquetadas. Son los píxeles que tú, como experto que conoce el terreno, marcas diciendo: 'aquí sé con certeza que hay agua', 'aquí hay suelo desnudo', 'aquí hay bosque'. El algoritmo aprende el patrón espectral de cada clase y después los aplica a toda la imagen."*

Una segunda analogía si quieres reforzar:

*"Es la diferencia entre pedirle a alguien que organice tu biblioteca 'como quiera' versus darle una lista de géneros predefinidos y mostrarle 50 libros ya clasificados. En el segundo caso el resultado es predecible, reproducible y validable. En el primero, depende completamente del criterio de quien organiza."*

---

### Random Forest para imágenes satelitales

*"¿Por qué Random Forest y no otro clasificador?"*

*"Random Forest construye cientos de árboles de decisión, cada uno entrenado con una muestra aleatoria de tus datos y usando solo un subconjunto aleatorio de las bandas. Cada árbol vota por una clase. La clase que recibe más votos gana. Este mecanismo de votación hace que el RF sea muy robusto: si un árbol 'se equivoca' porque le tocó una muestra rara, los otros 99 lo corrigen."*

*"¿Por qué no una red neuronal?"* — Pregunta que puede surgir.

*"En teledetección, con datasets de tamaño moderado (miles a millones de píxeles de entrenamiento), Random Forest y SVM normalmente empatan o superan a las redes neuronales. Las redes neuronales necesitan millones de muestras etiquetadas para mostrar su ventaja real. Y esto lo confirma la tesis Bonivento: con 39 escenas de entrenamiento, el RF fue superado por la regresión lineal más simple. Con pocos datos, los modelos simples ganan."*

---

### La regla de oro de los ROIs

*"La calidad del clasificador es exactamente igual a la calidad de tus ROIs. Si dibujas un ROI de 'bosque' en una zona que en realidad tiene vegetación mixta con suelo, el clasificador aprende un patrón incorrecto y clasifica mal toda la imagen. El principio es: si no estás 100% seguro de la cobertura en esa zona, no dibujes el ROI ahí."*

Tres reglas prácticas:
1. **Más polígonos, más pequeños:** 10 polígonos de 100 px cada uno es mejor que 1 polígono de 1000 px — captura la variabilidad espacial de la clase
2. **Distribuidos en el área:** no pongas todos los ROIs de "agua" en una esquina del mapa — el clasificador aprende que el agua solo está en esa zona
3. **Muéstralos en el mapa antes de entrenar:** visualiza siempre los ROIs sobre la imagen antes de ejecutar el clasificador — te permite detectar errores antes de que el modelo los aprenda

---

### Matriz de confusión y Kappa — cómo explicarlos sin que sean un formulario

**La matriz de confusión:**

*"La matriz de confusión responde a una pregunta muy simple: de todos los píxeles que yo sé que son bosque (porque los marqué como ROI de validación), ¿cuántos clasificó el modelo como bosque, cuántos como pastizal, cuántos como agua? Si el modelo es perfecto, la diagonal de la matriz está llena y todo lo demás es cero."*

Dibuja esto en la pizarra:

```
               PREDICHO
               Agua  Suelo  Cultivo  Bosque
REAL  Agua      45     2      0        3      → 90% correcto
      Suelo      1    38      4        2      → 84% correcto
      Cultivo    0     3     42        5      → 84% correcto
      Bosque     2     1      3       44      → 88% correcto
```

*"La precisión global es la suma de la diagonal dividida por el total: (45+38+42+44)/233 = 72%. Pero hay un problema: si el 80% de tu imagen es bosque, un clasificador que diga 'todo es bosque' tendría 80% de precisión global sin aprender nada. El Kappa corrige eso."*

**El índice Kappa:**

*"Kappa mide el acuerdo entre la clasificación y la realidad, descontando el acuerdo que ocurriría por puro azar. Kappa = 0 significa que el clasificador no es mejor que lanzar una moneda. Kappa = 1 significa clasificación perfecta."*

La escala que van a ver en la literatura (Landis & Koch, 1977):

| Kappa | Interpretación |
|-------|---------------|
| < 0.20 | Leve |
| 0.20–0.40 | Regular |
| 0.40–0.60 | Moderado |
| 0.60–0.80 | Substancial |
| > 0.80 | Casi perfecto |

*"Para una clasificación de uso del suelo que van a publicar o usar para toma de decisiones, apunten a Kappa > 0.75. Menos que eso y hay clases que el modelo confunde sistemáticamente — y eso significa que sus ROIs necesitan revisión."*

---

### Los tres errores más comunes con la validación — díselos antes de que los cometan

**Error 1: Usar las mismas muestras para entrenar y validar**

*"Si entrenas el modelo con todos tus ROIs y luego lo evalúas sobre esos mismos ROIs, vas a obtener Kappa = 0.99 siempre. Es como hacerle el examen a alguien con las mismas preguntas del repaso. El modelo solo 'memorizó'. Siempre separa: 70% de los píxeles para entrenar, 30% para validar — y esos 30% nunca los ve el modelo hasta la evaluación final."*

**Error 2: Confundir Accuracy alta con Kappa bajo**

*"Es posible tener Accuracy = 85% y Kappa = 0.45. Eso ocurre cuando tienes clases muy desbalanceadas: si el 80% de tu imagen es bosque y el modelo clasifica todo como bosque, tiene 80% de accuracy pero no aprendió nada. El Kappa te lo dice. Cuando vean esa combinación, revisen la distribución de clases."*

**Error 3: Evaluar con ROIs del mismo sector que los de entrenamiento**

*"Si entrenas con ROIs de 'cultivo' todos en la zona norte del mapa y validas con ROIs de 'cultivo' también en la zona norte, el modelo parece funcionar bien. Pero si lo aplicas a la zona sur, puede fallar. Siempre distribuye los ROIs de validación en distintas partes del área de estudio."*

---

## BLOQUE 5 — Notebook 06 (45 minutos)

### Cómo presentarlo antes de abrir el notebook

*"Van a entrenar un clasificador Random Forest con 5 clases sobre el Norte del Magdalena: agua, suelo desnudo, pastizal, cultivos (banano/cacao) y bosque. El modelo usará 7 bandas de Sentinel-2 más 5 índices espectrales — los mismos que calculamos en el Notebook 05. Al final van a tener un mapa de cobertura del suelo con su matriz de confusión y su Kappa."*

*"Y van a ver algo interesante: qué variable le importa más al Random Forest para clasificar. Spoiler basado en la tesis Bonivento: el NIR y los índices que lo involucran suelen dominar — porque el NIR es el que más varía entre coberturas."*

### Qué hacer si el Kappa es bajo (< 0.6)

Cuando un estudiante muestre un Kappa bajo, no digas "está mal". Di:

*"Miremos la matriz de confusión juntos. ¿Cuáles dos clases se confunden más?" * Generalmente es cultivo↔pastizal o suelo↔suelo húmedo.

*"Esa confusión te está diciendo algo sobre los ROIs o sobre la escena. ¿Pusiste ROIs de cultivo en zonas donde el cultivo tiene el mismo NDVI que el pastizal? ¿Hay nubes residuales en tu imagen? Cada error en la matriz de confusión es información sobre dónde el modelo necesita más datos o mejores ROIs."*

---

## BLOQUE 6 — Avance de proyecto (30 minutos, flexible)

### Cómo facilitar las presentaciones de 2 minutos

*"Vamos a escuchar brevemente a cada uno sobre su propuesta de área de estudio. No es evaluación — es para que yo entienda qué necesitan para S4 y S5, y para que escuchen las ideas de sus compañeros."*

Cada estudiante dice tres cosas, en este orden:
1. **Dónde** — nombra y ubica el área (cuál municipio, cuál ecosistema, cuál cultivo)
2. **Qué pregunta** — una oración: "quiero saber si..."
3. **Con qué dato** — Sentinel-2, Landsat, SAR, dron

Tú tomas nota en papel o en el computador de las áreas de estudio. Esta información la usas en S4 para personalizar los ejemplos de GEE.

**Si alguien no tiene área definida todavía:**
No lo presiones. Di: *"¿Hay alguna zona relacionada con tu tesis o con tu trabajo? No tiene que ser perfecta — en S4 lo afinamos."* Casi siempre tienen algo, solo necesitan permiso para que no sea perfecto aún.

**Si alguien propone un área muy grande o una pregunta imposible:**
*"Esa es una pregunta de investigación completa. Para el proyecto del curso, ¿cuál sería la versión más pequeña que puedas responder con datos satelitales en 3 semanas? A veces una pregunta de tesis de 3 años se convierte en un capítulo metodológico de 3 semanas."*

### Cierre de la sesión

Di esto antes de que salgan:

*"Esta noche pasaron de NDVI a NDRE, NDMI, EVI y LAI — índices que sus colegas sin formación en teledetección no conocen. Y clasificaron coberturas con Random Forest y validaron con Kappa. Eso es lo que hacen los investigadores en teledetección."*

*"Mañana vamos a cerrar el ciclo: van a volar el dron que generó los datos de la tesis Bonivento, van a procesar las imágenes con WebODM, y van a aplicar el mismo Random Forest — no sobre Sentinel-2, sino sobre el ortomosaico a 5 centímetros de resolución. Descansen."*

---

## NOTAS PARA PREPARACIÓN

### Lo que debes tener abierto antes de las 18:00
- La foto de la hoja de banano con película de agua (`pelicula de agua 2.jpeg` en la carpeta de la tesis) en pantalla
- El gráfico de separabilidad JM de la tesis (`fig_tesis_03_separabilidad_jm.png`) listo para mostrar cuando expliques por qué NIR_G ganó
- Colab con el Notebook 05 precargado y autenticado en GEE (comprueba que funciona antes de clase)
- El script GEE `03_clasificacion_gee.js` en una pestaña del Code Editor

### Plan B si el internet falla o GEE no responde
El Notebook 05 genera una imagen de ejemplo sintética automáticamente si no puede conectarse a GEE — los estudiantes hacen los cálculos de índices sobre esa imagen simulada. El aprendizaje del código es idéntico; solo cambia el dato.

### Conexión explícita con las otras sesiones
- S2 → S3: "el sábado pasado calcularon NDVI con SNAP y en GEE — hoy van más profundo"
- S3 → S4: "mañana aplican todo esto sobre datos del dron que van a generar ustedes mismos"
- S3 → S6: "el mapa clasificado que hagan hoy es el prototipo de lo que presentan en S6 sobre su propia área"
