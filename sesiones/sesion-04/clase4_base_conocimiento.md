# Sesión 4 — Base de Conocimiento del Docente
## Drones + Python para Teledetección
### Maestría en Ingeniería — Universidad del Magdalena
#### Sábado 25 de julio de 2026 | 8:00 AM – 6:00 PM

> Esta es tu guía personal para dictar la sesión más práctica del curso.
> El hilo conductor de todo el día es tu investigación real:
> el paper CONCAPAN 2022 y el P4M que tienes en tus manos.
> Los estudiantes van a volar un dron, procesar imágenes y clasificarlas con Python —
> todo en un solo sábado. Es ambicioso. Es posible.

---

## DISTRIBUCIÓN DEL DÍA

| Horario | Bloque | Tipo |
|---------|--------|------|
| 8:00 – 8:15 | Apertura y conexión con S3 | Teoría |
| 8:15 – 9:00 | UAV y teledetección: el P4M por dentro | Teoría |
| 9:00 – 9:15 | Regulación AEROCIVIL (15 min exactos) | Teoría |
| 9:15 – 9:30 | Briefing de seguridad + calibración | Prep campo |
| 9:30 – 11:00 | Vuelo P4M en la universidad | **Lab campo** |
| 11:00 – 11:15 | Pausa | — |
| 11:15 – 12:30 | Procesamiento WebODM | **Lab software** |
| 12:30 – 13:30 | Almuerzo | — |
| 13:30 – 15:00 | Notebook 07: rasterio + índices | **Lab Python** |
| 15:00 – 16:30 | Notebook 08: Random Forest sobre dron | **Lab Python** |
| 16:30 – 16:45 | Pausa | — |
| 16:45 – 17:30 | GEE: serie NDVI 2018–2025 bananera | **Demo GEE** |
| 17:30 – 18:00 | Entrega propuesta proyecto final | Proyecto |

---

## BLOQUE 0 — Apertura (15 minutos)

### Cómo conectar S3 con S4

No empieces con teoría nueva. Empieza mostrando lo que hicieron la semana pasada y lo que van a hacer hoy.

Di: *"La semana pasada calculamos NDVI, NDRE y NDMI de Sentinel-2 — imágenes a 10 metros de resolución tomadas desde 786 km de altura. Hoy vamos a hacer exactamente lo mismo pero con una imagen tomada desde 50 metros de altura, con 5 centímetros de resolución. ¿Cuántas veces más detallada es esa imagen?"*

Deja que calculen: 10 m / 0.05 m = **200 veces más detallada**.

Luego: *"Y el instrumento lo tenemos aquí."* Pones el P4M sobre la mesa.

Pausa. Deja que lo vean. Deja que se acerquen si quieren.

Luego cuentas la historia en 2 minutos: *"Este es el mismo dron con el que publicamos el paper CONCAPAN 2022 — procesamos imágenes de un bananal en Norte del Magdalena, entrenamos un clasificador Random Forest para separar el dosel del banano del suelo entre-surcos, y calculamos el porcentaje de cobertura del cultivo desde el aire. Eso es exactamente lo que ustedes van a hacer hoy — primero aquí en la universidad con el lago y la vegetación, luego los que quieran pueden aplicarlo en sus proyectos de tesis."*

Eso es todo. Cuatro minutos de apertura y tienes la atención completa del grupo.

---

## BLOQUE 1 — Drones y teledetección: el P4M por dentro (45 minutos)

### ¿Por qué un dron y no siempre Sentinel-2?

Explica el trade-off antes de hablar del hardware:

| | Sentinel-2 | Dron P4M |
|--|-----------|----------|
| Resolución | 10 m/px | 5.3 cm/px (a 50 m) |
| Cobertura | Global, automática | Área pequeña, requiere operador |
| Frecuencia | Cada 5 días | Cuando el investigador quiere |
| Costo por vuelo | Gratis | Tiempo del piloto + batería |
| Para qué sirve | Monitoreo regional | Parcelas experimentales, diagnóstico preciso |

*"Sentinel-2 te dice si hay un problema en 10 hectáreas. El dron te dice exactamente en qué planta está el problema."*

### El DJI Phantom 4 Multispectral — lo que tienen frente a ellos

Haz que cada uno lo tome con las manos mientras explicas. El aprendizaje táctil funciona.

**Las 6 cámaras:**
El P4M tiene 6 cámaras apuntando hacia abajo: una RGB (como la del celular) y cinco cámaras multiespectrales, cada una con un filtro de interferencia que solo deja pasar una longitud de onda específica. Señala cada cámara mientras dices los nombres:

| Cámara | λ central | Analogía |
|--------|-----------|---------|
| Blue | 450 nm | *"La que ve lo que ven tus ojos, pero solo el azul"* |
| Green | 560 nm | *"La que ve solo el verde"* |
| Red | 650 nm | *"La que ve solo el rojo — donde la clorofila absorbe"* |
| Red Edge | 730 nm | *"La que ve el borde del infrarrojo — invisible al ojo humano"* |
| NIR | 840 nm | *"La que ve el infrarrojo cercano — donde la vegetación sana refleja más"* |

**El sunshine sensor:**
Señala el sensor pequeño en la tapa del P4M. Di: *"Este pequeño sensor mide la cantidad de luz solar ambiental en todo momento. Cada vez que la cámara toma una foto, el sunshine sensor registra cuánta luz había en ese momento. Eso permite que WebODM corrija las diferencias de iluminación entre una foto tomada con sol y otra tomada con una nube pasando — sin esa corrección, los valores de reflectancia de distintas partes del campo no serían comparables."*

**El GSD:**
*"GSD significa Ground Sampling Distance — la distancia en el suelo que representa cada píxel. A 50 metros de altura, el GSD del P4M es 5.29 centímetros. Eso significa que cada píxel representa un cuadrado de poco más de 5 cm de lado en el suelo. ¿Qué tan grande es una hoja de banano? Entre 20 y 30 cm de ancho. O sea, en cada hoja de banano caben entre 4 y 6 píxeles por lado — lo suficiente para detectar manchas de Sigatoka Negra."*

### ¿Cómo funciona la fotogrametría?

Esta es la magia que convierte 500 fotos en un mapa. Explícala con una analogía.

**Analogía del mosaico roto:**
*"Imaginen que tienen una fotografía aérea enorme y la rompen en 500 pedazos pequeños. Eso es exactamente lo que el dron hace — toma 500 fotografías pequeñas con mucho traslape entre ellas. WebODM es el software que ensambla el mosaico de vuelta, reconociendo en qué parte de cada foto aparecen los mismos puntos. Es un rompecabezas gigante donde el software encuentra automáticamente qué piezas van juntas."*

**Structure from Motion (SfM):**
*"El algoritmo que usa WebODM se llama Structure from Motion. Funciona igual que tu cerebro cuando estás en un auto en movimiento — tu cerebro calcula la profundidad de los objetos porque los ve desde distintos ángulos a medida que te mueves. WebODM hace lo mismo: compara el mismo punto del terreno visto desde diferentes ángulos en fotos consecutivas y calcula su posición 3D exacta. De miles de esos puntos construye el modelo 3D del terreno y proyecta las fotos sobre él para crear el ortomosaico."*

### Parámetros de vuelo — qué configuraste y por qué

| Parámetro | Valor | Por qué |
|-----------|-------|---------|
| Altura | 50 m | GSD = 5.3 cm — suficiente para ver vegetación individual |
| Overlap frontal | 80% | Cada punto del terreno aparece en ~5 fotos = mejor reconstrucción |
| Overlap lateral | 75% | Evita huecos entre pasadas |
| Velocidad | 5 m/s | Más lento = fotos más nítidas, menos blur de movimiento |
| Patrón | Cuadrícula doble | Fotos desde dos ángulos perpendiculares = modelo 3D más preciso |

*"Más overlap = más fotos = más tiempo de procesamiento, pero mejor calidad. Para investigación, usamos 80/75. Para monitoreo rápido operativo, 70/65 es suficiente."*

---

## BLOQUE 2 — Regulación AEROCIVIL (15 minutos EXACTOS)

### El mensaje clave — dilo primero

*"En Colombia, volar un dron de más de 250 gramos sin registrarlo y sin seguir las normas de AEROCIVIL es ilegal. El P4M pesa 1.39 kg. Este drone está registrado y tiene permiso de vuelo. Les explico las reglas básicas en 15 minutos porque si alguno de ustedes quiere hacer investigación con drones en el futuro, necesita conocerlas."*

### Las tres categorías de operación (RAC 91)

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

### Lo que debes hacer antes de volar

1. **Registrar el drone** en el RAAC (Registro Aeronáutico de Colombia) en el portal de AEROCIVIL — solo se hace una vez por drone, costo bajo
2. **Verificar zonas de vuelo** en la app oficial AirMap o en el mapa de AEROCIVIL antes de cada vuelo
3. **Respetar 120 m AGL** — es el límite máximo para categoría abierta
4. **No volar sobre personas** que no estén involucradas en la operación
5. **Mantener VLOS** — siempre ver el drone con los ojos

### La regla práctica que les explicas a los estudiantes

*"Regla simple: si estás en zona rural o en un campus universitario como este, lejos del aeropuerto, con el drone registrado y volando por debajo de 120 metros, estás en regla. Si vas a volar en el centro de una ciudad o cerca de un aeropuerto, primero consultas con AEROCIVIL y pides autorización. El error más común es suponer que 'como es chiquito no pasa nada' — el dron tiene número de serie, está registrado, y si alguien reporta un incidente, hay trazabilidad."*

---

## BLOQUE 3 — Briefing de seguridad y calibración (15 minutos)

### Cómo hacer el briefing de seguridad frente al grupo

Antes de salir al campo, haz el briefing de pie, con el dron en la mano. No es burocracia — es para que los estudiantes entiendan qué están viendo cuando el dron vuele.

Di: *"Antes de encender cualquier cosa, vamos a revisar 5 cosas juntos."*

1. **Propelas:** gira cada propela manualmente. Si tiene microfisura o grieta, se ve y se siente. Una propela que se rompe en vuelo causa un accidente.
2. **Batería:** encaja con clic audible. Revisa el indicador LED — debe parpadear lento (suficiente carga) no rápido (batería baja) ni color rojo.
3. **Tarjeta SD:** introducida completamente. Verifica que hay espacio.
4. **Control remoto:** enciende PRIMERO el control, DESPUÉS el drone. Nunca al revés.
5. **Zona de aterrizaje de emergencia:** señala dos puntos en el campo. *"Si el drone empieza a comportarse raro, aterrizamos aquí."*

### El panel de calibración

*"Este rectángulo blanco que ven aquí es nuestro panel de calibración. Es papel matte blanco — reflectancia aproximada 85%. Antes de despegar, pongo el drone a 1 metro sobre el panel y tomo 5 fotos. Esas fotos le dicen a WebODM cuánta luz estaba llegando al campo y con qué reflectancia. WebODM usa eso para convertir los valores digitales del sensor en valores de reflectancia reales, comparables con datos de otros días o de otros lugares. Sin calibración, el NDVI de hoy no es comparable con el NDVI de la semana pasada."*

---

## BLOQUE 4 — El vuelo (90 minutos)

### Cómo organizar al grupo para el vuelo

No dejes que todos rodeen el drone — es peligroso y distrae. Organiza así:

- **Perímetro de seguridad:** 15 metros alrededor del drone durante despegue y aterrizaje. Nadie cruza esa línea.
- **Zona de observación:** el grupo se pone a 20 metros del punto de despegue, en un área designada.
- **1 acompañante:** un estudiante voluntario puede estar a tu lado como "observador visual". Rota cada vuelo.

### Qué decir mientras el drone está en el aire

El drone vuela en modo automático — tienes tiempo de hablar.

Mientras vuela la primera pasada:
*"¿Ven cómo vuelo en líneas rectas paralelas? Eso se llama lawnmower pattern o patrón de cortacésped. Es el patrón óptimo para garantizar que cada metro del terreno aparezca en varias fotos desde distintos ángulos. El software tiene que ver el mismo punto desde al menos 3 posiciones diferentes para calcular su posición 3D."*

Cuando el drone gira para la segunda pasada:
*"En este momento están ocurriendo 5 disparos simultáneos — una foto por cada cámara espectral. El drone está capturando luz a 450, 560, 650, 730 y 840 nanómetros al mismo tiempo. Al final del vuelo tendremos aproximadamente 500 fotos por banda — 2,500 imágenes en total."*

Si algún estudiante pregunta qué pasa si se cae la batería:
*"El P4M tiene Return-to-Home automático cuando la batería baja del 30%. Calcula la distancia al punto de despegue, la energía necesaria para regresar, y si ve que le queda justa, vuelve solo. Esa función ha salvado muchos drones."*

---

## BLOQUE 5 — Procesamiento WebODM (75 minutos)

### Cómo presentarlo

Cuando regresen del campo y estén frente a los computadores, di:

*"Tenemos 500 fotos pequeñas. En 5 minutos van a subir esas fotos a WebODM. En 20–30 minutos van a tener un mapa georreferenciado de 5 centímetros de resolución de toda el área que acaban de volar. Eso que antes requería fotogrametría manual por semanas, hoy lo hace el software en media hora."*

### Errores comunes al procesar — tenlos presentes

**"No reconoce las bandas multiespectrales"**
Causa: no activaron la opción `multispectral` en WebODM.
Solución: reiniciar el proceso con esa opción marcada.

**"El ortomosaico tiene agujeros blancos"**
Causa: alguna zona tuvo muy pocas fotos (bordes del área, zona con mucha sombra).
Solución: para este lab no es crítico. En el mundo real se repite el vuelo sobre esas zonas.

**"El procesamiento es muy lento"**
Causa: computador con poca RAM (menos de 8 GB) procesando dataset grande.
Solución: reducir `orthophoto-resolution` de 1 a 3 cm/px. Pierde calidad pero termina en tiempo razonable.

**"El ortomosaico no está georreferenciado correctamente"**
Causa: el GPS del P4M es de consumidor (±1.5 m de error). Para investigación que requiere exactitud centimétrica, se necesitan GCPs (Ground Control Points) con GPS diferencial.
Di esto a los estudiantes: *"Para este lab de aprendizaje, el error de 1.5 metros es aceptable. Para publicar mapas precisos de investigación, usaríamos puntos de control medidos con GPS RTK en el suelo — eso reduce el error a 2–5 centímetros."*

### Lo que muestran los resultados de WebODM

Cuando el procesamiento termine, muestra el reporte (odm_report.pdf) y señala:

1. **GSD obtenido:** debe ser cercano al teórico (5.3 cm a 50 m). Si es muy diferente, el vuelo tuvo problema de altitud.
2. **Error de reproyección:** < 1 px es excelente. Es la precisión con que el software ubicó los puntos de coincidencia entre fotos.
3. **Número de fotos procesadas:** debe ser similar al total. Si muchas fueron rechazadas, hay problema de calidad (blur, poca luz, poco overlap).

---

## BLOQUE 6 — Python: rasterio y análisis de índices (Notebook 07, 90 minutos)

### Cómo presentar rasterio

Después del almuerzo, cuando los estudiantes estén frente a los computadores:

*"En GEE, cuando calculamos NDVI, el servidor de Google hace todos los cálculos — nosotros solo escribimos la fórmula. Aquí en Python, nosotros cargamos la imagen en memoria, la convertimos en un array NumPy, y calculamos todo localmente. La ventaja: control total sobre el proceso. La desventaja: necesitamos el archivo descargado y suficiente RAM."*

### La analogía clave para rasterio

*"Un GeoTIFF es como un Excel con información geográfica. `rasterio.open()` abre el archivo. `src.read(1)` lee la primera hoja (banda 1). `src.profile` te da los metadatos — resolución, sistema de coordenadas, extensión geográfica. Lo que obtienes es un array NumPy — de ahí en adelante, ya saben cómo manejarlo."*

### Lo que deben entender sobre la diferencia de escala P4M vs Sentinel-2

Cuando estén calculando NDVI, señala esto:

*"Noten que los valores de NDVI del dron tienen mucha más variabilidad que los de Sentinel-2. ¿Por qué? Porque a 5 cm de resolución, están viendo cada hoja, cada sombra, cada espacio entre plantas. A 10 metros de Sentinel-2, un pixel promedia decenas de plantas con el suelo entre ellas — eso suaviza todo. Ninguno es mejor que el otro: son herramientas para preguntas distintas."*

---

## BLOQUE 7 — Python: Random Forest sobre imagen de dron (Notebook 08, 90 minutos)

### Cómo conectar con el paper CONCAPAN 2022

Este es el momento de mostrar el paper. Comparte la figura del paper en pantalla — la que muestra el mapa de clasificación del bananal.

Di: *"Este mapa lo generamos con exactamente el mismo flujo que están haciendo ahora. Las clases eran 'dosel de banano' y 'entre-surco'. El clasificador RF entrenado sobre las 5 bandas del P4M logró separar las dos clases con Kappa de 0.87. Eso le permitió a nuestro equipo calcular el porcentaje de cobertura del dosel en cada parcela del bananal — información que antes requería semanas de medición manual."*

### El error conceptual más común: overfitting

Cuando los estudiantes vean que el accuracy de entrenamiento es 100% y el de test es 95%, van a preguntar por qué son diferentes.

Explícalo así: *"El 100% de entrenamiento no es un error — es esperado en Random Forest. El modelo memoriza todas las muestras que le diste. El número que importa es el de test: ese es sobre datos que el modelo nunca vio. Si test fuera también 100%, sospecharía que hicieron trampa mezclando datos de entrenamiento y test. El 95% de test significa que de cada 100 píxeles nuevos, el modelo clasifica 95 correctamente."*

### Cómo hablar de la importancia de variables

Cuando muestren el gráfico de importancia, pregunta al grupo:

*"¿Qué variable esperarían que fuera la más importante para separar agua de vegetación?"*

La respuesta correcta es **NIR** — el agua absorbe casi toda la energía en NIR (valores muy bajos), la vegetación la refleja (valores altos). Si NDVI sale primero, es porque NDVI = f(NIR, Red), así que resume la información de dos bandas.

---

## BLOQUE 8 — GEE Demo: Serie NDVI 2018–2025 bananera (45 minutos)

### El puente entre lo pequeño y lo grande

*"Esta mañana vimos el bananal a 5 centímetros. Ahora vamos a verlo a 10 metros — pero desde 2018 hasta hoy. El dron nos da el detalle de hoy; el satélite nos da la historia en el tiempo."*

### Cómo presentar la serie temporal

Abre el script `04_ndvi_temporal_bananera.js` en el Code Editor de GEE. Antes de ejecutarlo, señala la estructura del script:

*"Este script calcula el NDVI promedio de enero a marzo de cada año desde 2018. ¿Por qué enero-marzo? Porque es la temporada seca en el norte del Magdalena — menos nubes, imágenes más limpias. Si analizara todo el año, los meses lluviosos me darían imágenes llenas de nubes y valores erróneos."*

Ejecuta el script. Mientras carga, pregunta al grupo:

*"¿Qué esperan ver en la gráfica? ¿El NDVI del bananal ha subido, bajado, o se ha mantenido constante entre 2018 y 2025?"*

Deja que propongan hipótesis. Cuando aparezca la gráfica, discutan los resultados juntos.

### Preguntas que guían la discusión

- *"Si hay un año donde el NDVI cae significativamente, ¿qué pudo haber pasado?"* — sequía (El Niño), cosecha masiva, cambio de cultivo, enfermedad
- *"¿Por qué el municipio de Ciénaga y el de Zona Bananera tienen valores diferentes?"* — diferencias en manejo agronómico, densidad de siembra, variedades
- *"¿Qué le pasaría al NDVI si hubiera un brote masivo de Sigatoka Negra?"* — caería, porque la clorofila se destruye y la reflectancia en rojo sube mientras el NIR baja

---

## BLOQUE 9 — Propuesta de proyecto final (30 minutos)

### Cómo crear el ambiente para que sea productivo

No digas "ahora tienen 30 minutos para llenar un formulario". Eso suena a burocracia.

Di: *"En este momento tienen suficiente contexto para definir qué van a investigar con teledetección. En las últimas 4 sesiones procesaron imágenes Sentinel-2, calcularon índices, clasificaron coberturas con Random Forest, volaron un drone y vieron una serie temporal de 7 años. Ahora aplíquenlo a su propio problema de investigación — su tesis, su trabajo, el territorio que conocen."*

Mientras llenan la plantilla, circula entre los grupos. Las preguntas que más necesitan ayuda:

**"No sé qué dato usar"**
Di: *"¿Cuánta resolución necesitas? Si es para ver parcelas experimentales, necesitas el dron. Si es para monitorear una cuenca o un municipio completo, Sentinel-2 es suficiente. Si hay muchas nubes en tu zona, considera SAR de Sentinel-1 — el radar atraviesa las nubes."*

**"No sé cómo formular la pregunta de investigación"**
Di: *"La pregunta debe ser respondible con un mapa. 'Cómo está la vegetación' es demasiado vago. '¿Cambió la cobertura boscosa en la cuenca X entre 2018 y 2024?' es respondible con teledetección."*

**"Mi área está cubierta de nubes casi siempre"**
Di: *"Eso es una restricción real. Opciones: (1) usar imágenes de temporada seca solamente, (2) usar SAR Sentinel-1, (3) hacer mosaicos anuales que combinan decenas de imágenes para llenar los huecos de nubes."*

---

## CONSEJOS PARA EL DÍA COMPLETO

### Gestión de la energía

Son 10 horas activas con una sesión de campo. Recomendaciones prácticas:
- **Lleva suficiente agua** — el campo al sol agota más de lo que parece
- **La pausa de 11:00–11:15 es sagrada** — no la recortes para "recuperar tiempo perdido"
- **El almuerzo es real** — come bien, una tarde de 5 horas de Python requiere glucosa

### Plan B si el software falla

Si WebODM no procesa en tiempo razonable durante la clase:
- Usa el ortomosaico de ejemplo incluido en el Notebook 07 (se genera automáticamente)
- Los estudiantes igual aprenden todo el flujo Python con ese dato
- El WebODM lo terminan de procesar en casa con sus fotos y el resultado lo llevan a S5

Si el dron falla (batería dañada, problema de GPS):
- Usa las fotos del bananal directamente desde el inicio
- Pierde el momento "wow" del vuelo pero ganas el tiempo del procesamiento
- Muestra el video del vuelo del bananal si tienes uno

### La frase que resume el día

Al cerrar, di esto:

*"Hoy pasaron de analizar imágenes de un satélite a 786 km hasta analizar imágenes de un dron a 50 metros. La metodología es exactamente la misma — bandas espectrales, índices, Random Forest, Kappa. La diferencia es la escala. En sus proyectos de investigación van a elegir la escala correcta según la pregunta que quieran responder. Eso es lo que hace un investigador en teledetección."*
