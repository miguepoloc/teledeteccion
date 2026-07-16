# Propuestas de artículos de teledetección derivados de tesis (v2)

**Maestría en Ingeniería — Universidad del Magdalena**
Docente: Ing. Miguel Ángel Polo Castañeda · Curso de Teledetección · Julio 2026

**Alcance de esta versión:** las **tres** propuestas de cada tesis son de teledetección aplicada (SIG, Google Earth Engine, Google Colab, Sentinel-1/2, Landsat, MODIS, InSAR y/o drones UAV multiespectrales/térmicos). En las tesis cuyo núcleo temático es distante de la observación de la Tierra (perovskitas, silenitas, RAG de código), las tres ideas exploran **roles distintos** de la teledetección —(a) caracterizar el *problema*, (b) usarla como *herramienta* del flujo, (c) *validación multitemporal*— manteniendo el vínculo con el perfil del estudiante.

**Formato por idea:** título del artículo · título de investigación · resumen · brecha/novedad · datos y sensor · método breve · 2 referencias.

> Criterio editorial aplicado (tipo revisor MDPI *Remote Sensing*): cada propuesta debe tener (i) una brecha explícita, no un "también aplico X aquí"; (ii) datos abiertos o adquiribles y reproducibles; (iii) un método con validación cuantitativa (matriz de confusión/Kappa, RMSE/R², AUC, o comparación contra *ground-truth*); (iv) área de estudio delimitada. Se evita el "review disfrazado de investigación".

---

## Ingeniería Ambiental y Sanitaria

### Tesis 1 — Modelo no estacionario de amenaza por inundación en microcuencas urbanas del Caribe colombiano

**Propuesta 1.1 — SAR multitemporal para inundación no estacionaria**
- **Título del artículo:** Delimitación no estacionaria de amenaza por inundación en microcuencas urbanas del Caribe colombiano mediante series temporales Sentinel-1 SAR en Google Earth Engine
- **Título de investigación:** "Integración de retrodispersión Sentinel-1 y tendencias hidroclimáticas para un modelo dinámico de amenaza por inundación urbana"
- **Resumen:** Se construye en GEE una serie histórica de extensión de inundación con umbralización de retrodispersión Sentinel-1 (VV/VH) y se acopla a un análisis de no estacionariedad (tendencia en precipitación y en área impermeabilizada) para producir mapas de amenaza que cambian en el tiempo, en vez de un único mapa estático.
- **Brecha/novedad:** los estudios locales usan modelos estacionarios; la novedad es incorporar la tendencia temporal de la urbanización como covariable del modelo de amenaza en microcuencas urbanas costeras tropicales.
- **Datos y sensor:** Sentinel-1 GRD (C-band, 10 m), Copernicus DEM/ALOS PALSAR, precipitación CHIRPS; todo accesible en GEE.
- **Método breve:** extracción de láminas de agua por *thresholding* + filtrado de coherencia; series anuales; test de tendencia (Mann-Kendall); validación con registros municipales de eventos y puntos de campo (matriz de confusión, índice Kappa).
- **Referencias:** (1) Mehravar et al. (2023), detección de inundación con SVR y Sentinel-1, en *Improving flood hazard susceptibility assessment...*, Natural Hazards, DOI: 10.1007/s11069-025-07109-2. (2) *Urban Flood-Related Remote Sensing: Research Trends, Gaps and Opportunities*, Remote Sensing (2022), DOI: 10.3390/rs14215505.

**Propuesta 1.2 — Machine learning de susceptibilidad con insumos satelitales**
- **Título del artículo:** Mapeo de susceptibilidad a inundación urbana no estacionaria mediante Random Forest y XGBoost con variables de teledetección
- **Título de investigación:** "Modelos de aprendizaje automático con NDVI, LULC y DEM para susceptibilidad a inundación en microcuencas urbanas del Caribe colombiano"
- **Resumen:** Se entrena en Colab un ensamble (RF/XGBoost) con factores condicionantes derivados de teledetección para clasificar susceptibilidad, comparando un escenario base estacionario contra uno que añade el cambio de cobertura interanual como predictor.
- **Brecha/novedad:** contrastar cuantitativamente el aporte marginal de la variable "cambio de cobertura temporal" al desempeño del modelo (rara vez aislada en la literatura regional).
- **Datos y sensor:** Sentinel-2 (NDVI, LULC), Copernicus DEM, curvatura/TWI, CHIRPS; inventario de inundación como etiqueta.
- **Método breve:** extracción de factores en GEE; entrenamiento RF/XGBoost con validación cruzada espacial; interpretabilidad con SHAP; métrica ROC-AUC y RMSE.
- **Referencias:** (1) *Urban flood susceptibility mapping using remote sensing, social sensing and an ensemble machine learning model*, Sustainable Cities and Society (2024), URL: https://www.sciencedirect.com/science/article/abs/pii/S2210670724003342. (2) *Improving flood hazard susceptibility assessment by integrating hydrodynamic modeling with remote sensing and ensemble machine learning*, Natural Hazards (2025), DOI: 10.1007/s11069-025-07109-2.

**Propuesta 1.3 — Fusión óptico-radar del cambio de cobertura como driver de amenaza**
- **Título del artículo:** Fusión Sentinel-1/Sentinel-2 para cuantificar el cambio de cobertura impermeable y su efecto en la amenaza por inundación urbana
- **Título de investigación:** "Detección de cambio de superficies impermeables mediante fusión óptico-radar y su vínculo con la dinámica de inundación en microcuencas urbanas"
- **Resumen:** Se cuantifica la expansión de superficie impermeable (2016–2025) por fusión SAR-óptico y se correlaciona con la evolución de la extensión inundable, dando soporte empírico al carácter "no estacionario" del riesgo para el Ordenamiento Territorial.
- **Brecha/novedad:** vincular explícitamente la *tasa* de impermeabilización detectada por fusión con el aumento observado de amenaza, no solo mapear cobertura.
- **Datos y sensor:** Sentinel-1 (VV/VH) + Sentinel-2 (NDVI, NDBI) en GEE; validación con imágenes de muy alta resolución (Google Earth histórico).
- **Método breve:** clasificación LULC anual con RF sobre stack fusionado; detección de cambio; regresión entre impermeabilización y extensión inundable; Kappa por año.
- **Referencias:** (1) *Fusion of Sentinel-1 SAR and Sentinel-2 MSI data for accurate urban land use-land cover classification*, Environmental Systems Research (2023), DOI: 10.1186/s40068-023-00324-5. (2) *Tracking U.S. Land Cover Changes: Sentinel-2 Imagery and Dynamic World Labels*, Data/MDPI (2025), DOI: 10.3390/data10050067.

---

### Tesis 2 — Transporte intercontinental de masas de aire africanas y PM10/PM2.5 en Colombia

**Propuesta 2.1 — Detección satelital de intrusiones de polvo (el "problema" observado desde el espacio)**
- **Título del artículo:** Detección de intrusiones de polvo sahariano sobre el Caribe colombiano mediante AOD satelital y su relación con PM10/PM2.5
- **Título de investigación:** "Trayectorias de transporte transatlántico de polvo africano y su influencia en la calidad del aire de ciudades costeras colombianas"
- **Resumen:** Se identifican eventos de intrusión de polvo sobre Santa Marta/Barranquilla combinando profundidad óptica de aerosol (AOD MODIS/CAMS) con retrotrayectorias HYSPLIT, y se contrastan con series de PM10/PM2.5 de estaciones SISAIRE.
- **Brecha/novedad:** el fenómeno está bien documentado para el Caribe insular y EE. UU., pero cuantificado de forma escasa para la costa Caribe colombiana continental.
- **Datos y sensor:** MODIS MAIAC AOD, CAMS reanalysis, HYSPLIT (back-trajectories), estaciones terrestres PM.
- **Método breve:** identificación de días-evento por umbral de AOD; asociación evento–pico de PM; análisis de correlación y desfase temporal; validación con AERONET si disponible.
- **Referencias:** (1) *Frequent Saharan dust storms tracked across the Atlantic... first half of 2025*, Copernicus/CAMS (documenta plumas sobre el Caribe con picos de PM10), URL: https://atmosphere.copernicus.eu/copernicus-frequent-saharan-dust-storms-tracked-across-atlantic-and-over-europe. (2) *The Expanded Regulatory Significance of Saharan Dust Plumes in the United States* (2024), PMC12461923.

**Propuesta 2.2 — Modelo espacio-temporal de contribución del polvo (herramienta predictiva)**
- **Título del artículo:** Cuantificación de la contribución del polvo africano a episodios de PM en Colombia mediante series multianuales de AOD y machine learning
- **Título de investigación:** "Modelo estadístico-espacial del aporte del transporte transatlántico de polvo a la calidad del aire urbana en el Caribe colombiano"
- **Resumen:** Se construye en GEE/Colab una serie multianual de AOD y variables meteorológicas para modelar el aporte marginal del polvo africano frente a fuentes locales, generando mapas de riesgo por temporada.
- **Brecha/novedad:** separar la fracción de PM atribuible a fuente externa (polvo) vs. local, con un modelo reproducible para gestión de la calidad del aire.
- **Datos y sensor:** MODIS/CAMS AOD, ERA5 (viento, humedad), PM in situ como variable respuesta.
- **Método breve:** *feature engineering* temporal; regresión/GBM; validación temporal *hold-out*; métrica R²/RMSE; mapas estacionales de aporte.
- **Referencias:** (1) *Extreme Saharan dust events expand northward... record-breaking PM10 and PM2.5*, ACP (2024), DOI: 10.5194/acp-24-12031-2024. (2) *The influence of long-range transported Saharan dust on the inflammatory potency of ambient PM2.5 and PM10*, Environ. Int./ScienceDirect (2024), URL: https://www.sciencedirect.com/science/article/pii/S0013935124009125.

**Propuesta 2.3 — Validación multitemporal AOD vs. red terrestre (calibración regional)**
- **Título del artículo:** Validación y calibración regional de productos AOD satelitales frente a estaciones de PM en el Caribe colombiano
- **Título de investigación:** "Evaluación del desempeño de productos AOD (MODIS/CAMS) para estimar PM10/PM2.5 en condiciones de intrusión de polvo africano"
- **Resumen:** Se evalúa qué producto y qué corrección atmosférica estiman mejor el PM superficial durante eventos de polvo, entregando un factor de calibración local útil para monitoreo operativo.
- **Brecha/novedad:** trabajo de validación local (poco frecuente en Colombia) que habilita el uso operacional de AOD donde no hay estaciones.
- **Datos y sensor:** MODIS MAIAC vs. CAMS AOD; PM in situ; AERONET.
- **Método breve:** emparejamiento espacio-temporal AOD–PM; regresión con corrección por humedad/altura de capa; métricas de error; separación evento/no-evento.
- **Referencias:** (1) *Study of Saharan dust influence on PM10 measures in Sicily* (2020), arXiv:2005.06192. (2) *Frequent Saharan dust plumes tracked across the Atlantic and over Europe*, Copernicus/CAMS, URL: https://atmosphere.copernicus.eu/frequent-saharan-dust-plumes-tracked-across-atlantic-and-over-europe.

---

### Tesis 3 — Sistemas híbridos con Soluciones basadas en la Naturaleza (SbN) para tratamiento descentralizado en Buenavista, Ciénaga Grande de Santa Marta

**Propuesta 3.1 — Zonificación multicriterio AHP-SIG de sitios óptimos (herramienta de decisión)**
- **Título del artículo:** Zonificación AHP-SIG de sitios óptimos para humedales construidos híbridos en asentamientos palafíticos de la Ciénaga Grande de Santa Marta
- **Título de investigación:** "Análisis multicriterio geoespacial para la localización de sistemas híbridos SbN de tratamiento descentralizado en viviendas palafíticas"
- **Resumen:** Empleando la línea AHP-SIG del docente, se ponderan variables (hidroperiodo InSAR, batimetría, cercanía a viviendas, accesibilidad, salinidad) para priorizar ubicaciones viables de humedales híbridos en Buenavista.
- **Brecha/novedad:** aplicar AHP-SIG a un contexto palafítico (viviendas sobre agua), donde la restricción espacial es atípica frente a la literatura de SbN en tierra firme.
- **Datos y sensor:** Sentinel-1 InSAR (hidroperiodo/conectividad), Sentinel-2 (calidad de agua proxy), DEM, cartografía de viviendas.
- **Método breve:** capas normalizadas; matriz de comparación pareada (AHP) con consistencia CR<0.1; mapa de aptitud; análisis de sensibilidad de pesos.
- **Referencias:** (1) Polo-Castañeda et al. (2021), *Application of AHP and GIS for Determination of Suitable Wireless Sensor Network Zones...*, IJASEIT 11(5), DOI: 10.18517/ijaseit.11.5.14293 (referencia metodológica propia). (2) *Nature based wastewater treatment using artificial wetland technique...* (uso de GIS/RS para planificación de NbS descentralizada), ResearchGate (2023).

**Propuesta 3.2 — Hidroperiodo y conectividad hidrológica por InSAR (el "problema" del sitio)**
- **Título del artículo:** Caracterización del hidroperiodo y la conectividad hidrológica de la Ciénaga Grande de Santa Marta mediante InSAR Sentinel-1 como soporte al diseño de SbN
- **Título de investigación:** "Dinámica hidrológica del complejo lagunar de la Ciénaga Grande derivada de InSAR para el dimensionamiento de sistemas de tratamiento descentralizado"
- **Resumen:** Se replica y actualiza el enfoque Wetland-InSAR para mapear niveles y conectividad del agua alrededor de Buenavista, insumo crítico para dimensionar y ubicar los humedales híbridos.
- **Brecha/novedad:** actualizar con Sentinel-1 (2015–2025) el análisis de conectividad de la CGSM y orientarlo, por primera vez, al diseño de saneamiento descentralizado.
- **Datos y sensor:** Sentinel-1 SLC (InSAR), caudales de ríos tributarios, mareas.
- **Método breve:** interferometría diferencial; series de nivel relativo; mapas de conectividad; validación con datos hidrológicos/observaciones INVEMAR.
- **Referencias:** (1) *Assessment of hydrologic connectivity in an ungauged wetland with InSAR observations*, Environmental Research Letters (2018), DOI: 10.1088/1748-9326/aa9d23 (aplicado a la CGSM). (2) Simard et al. (2008), *A systematic method for 3D mapping of mangrove forests... Application to Ciénaga Grande de Santa Marta*, Remote Sensing of Environment 112:2131-2144.

**Propuesta 3.3 — Monitoreo multitemporal de calidad de agua antes/después (validación temporal)**
- **Título del artículo:** Monitoreo multitemporal de indicadores de calidad de agua en la Ciénaga Grande mediante Sentinel-2 para evaluar el efecto de intervenciones SbN
- **Título de investigación:** "Seguimiento satelital de turbidez y clorofila-a como indicadores de desempeño de sistemas híbridos de tratamiento en la CGSM"
- **Resumen:** Se establece una línea base y un protocolo de seguimiento Sentinel-2 (turbidez, Chl-a, materia orgánica disuelta) en el entorno de Buenavista, para evaluar en el tiempo el efecto de las SbN sobre el cuerpo de agua receptor.
- **Brecha/novedad:** dotar a los proyectos de saneamiento descentralizado de una métrica de impacto satelital reproducible y de bajo costo.
- **Datos y sensor:** Sentinel-2 L2A en GEE; validación con muestreo in situ.
- **Método breve:** algoritmos empíricos de turbidez/Chl-a; series temporales; comparación pre/post intervención; correlación con datos de campo (R²/RMSE).
- **Referencias:** (1) *Automatic Mapping and Monitoring of Marine Water Quality Parameters... Sentinel-2 Image Time-Series and GEE*, Frontiers in Marine Science (2022), DOI: 10.3389/fmars.2022.871470. (2) *Estimating turbidity concentrations in highly dynamic rivers using Sentinel-2 imagery in Google Earth Engine*, Environ. Sci. Pollut. Res. (2024), DOI: 10.1007/s11356-024-33344-4.

---

### Tesis 4 — Monitoreo multitemporal de coberturas del suelo (análisis jerárquico de intensidad + IA)

**Propuesta 4.1 — Intensity Analysis + IA sobre series Sentinel-2**
- **Título del artículo:** Análisis jerárquico de intensidad de cambio de cobertura combinado con clasificación por IA sobre series Sentinel-2 en Google Earth Engine
- **Título de investigación:** "Monitoreo multitemporal de coberturas del suelo mediante Intensity Analysis y redes neuronales/Random Forest en el Caribe colombiano"
- **Resumen:** Se integra el Intensity Analysis (Aldwaik & Pontius) con clasificadores de IA en GEE para no solo detectar el cambio, sino cuantificar su intensidad por categoría a nivel interanual y por transición.
- **Brecha/novedad:** el Intensity Analysis rara vez se acopla a clasificación por IA en el mismo flujo reproducible; aquí se combinan.
- **Datos y sensor:** Sentinel-2 (composites anuales), Sentinel-1 opcional para reducir nubosidad; muestras de campo.
- **Método breve:** clasificación RF/CNN por año; matrices de transición; Intensity Analysis en tres niveles (intervalo, categoría, transición); Kappa y precisión temática.
- **Referencias:** (1) *A Comparative Assessment of Machine and Deep Learning Approaches for Grassland Mapping with Sentinel-1, Sentinel-2 and Ancillary Data*, Land/MDPI (2025), DOI: 10.3390/land15071215. (2) *Fusion of Sentinel-1 SAR and Sentinel-2 MSI data for accurate urban LULC classification*, Environmental Systems Research (2023), DOI: 10.1186/s40068-023-00324-5.

**Propuesta 4.2 — Fusión óptico-radar para robustez en trópico nuboso**
- **Título del artículo:** Fusión Sentinel-1/Sentinel-2 y aprendizaje profundo para clasificación multitemporal robusta de coberturas en zonas de alta nubosidad
- **Título de investigación:** "Detección de cambio de cobertura del suelo con fusión óptico-radar y CNN en el Caribe colombiano tropical"
- **Resumen:** Se evalúa cuánto mejora la fusión SAR-óptico la clasificación multitemporal frente a solo óptico, en un entorno tropical donde las nubes limitan Sentinel-2.
- **Brecha/novedad:** cuantificar la ganancia de exactitud atribuible a la fusión en condiciones de nubosidad persistente del Caribe.
- **Datos y sensor:** Sentinel-1 (VV/VH) + Sentinel-2; Dynamic World como referencia.
- **Método breve:** stack fusionado; CNN (U-Net/TempCNN); comparación óptico vs. fusión; Kappa, F1 por clase.
- **Referencias:** (1) *Urban Expansion Monitoring Using Sentinel-1 and Sentinel-2 Data Fusion on Google Earth Engine*, ResearchGate (2025). (2) *Tracking U.S. Land Cover Changes: Sentinel-2 Imagery and Dynamic World Labels*, Data/MDPI (2025), DOI: 10.3390/data10050067.

**Propuesta 4.3 — Protocolo de validación de precisión temática multitemporal**
- **Título del artículo:** Protocolo reproducible de evaluación de precisión temática para mapas multitemporales de cobertura generados con IA
- **Título de investigación:** "Diseño de muestreo y evaluación de exactitud de series de mapas de cobertura del suelo en el Caribe colombiano"
- **Resumen:** Se propone un protocolo de validación (muestreo estratificado, matrices de confusión por año, estimación de área con intervalos de confianza) frecuentemente débil en tesis de teledetección, elevando el rigor publicable.
- **Brecha/novedad:** aportar el componente de exactitud con estimación de área e incertidumbre (Olofsson et al.), poco aplicado en la región.
- **Datos y sensor:** productos de clasificación propios + puntos de referencia de muy alta resolución.
- **Método breve:** diseño de muestreo probabilístico; matriz de error; estimación de área ajustada por exactitud; intervalos de confianza.
- **Referencias:** (1) Chuvieco, E. (2010). *Teledetección Ambiental: La Observación de la Tierra desde el Espacio*, Ariel (base del curso). (2) *A Comparative Assessment of Machine and Deep Learning Approaches for Grassland Mapping...*, Land/MDPI (2025), DOI: 10.3390/land15071215.

---

## Ingeniería Agronómica

### Tesis 5 — Aptitud edafoclimática del cultivo de la vid en Tigrera, Sierra Nevada de Santa Marta

**Propuesta 5.1 — Zonificación AHP-SIG de aptitud edafoclimática**
- **Título del artículo:** Zonificación de aptitud edafoclimática para vid mediante AHP-SIG y variables satelitales en la Sierra Nevada de Santa Marta
- **Título de investigación:** "Aplicación de Analytic Hierarchy Process y SIG para determinar zonas aptas para vid en Tigrera, Sierra Nevada de Santa Marta"
- **Resumen:** Se integran pendiente, orientación, LST (MODIS), precipitación (CHIRPS) y variables de suelo en un modelo AHP-SIG para mapear aptitud vitícola en la zona.
- **Brecha/novedad:** primera zonificación vitícola AHP-SIG documentada para la Sierra Nevada de Santa Marta, un terroir tropical de altura atípico.
- **Datos y sensor:** MODIS LST, CHIRPS, SRTM/Copernicus DEM, SoilGrids.
- **Método breve:** reclasificación de factores; AHP (CR<0.1); mapa de aptitud multiclase; validación con parcelas existentes/juicio experto.
- **Referencias:** (1) Polo-Castañeda et al. (2021), *Application of AHP and GIS...*, IJASEIT 11(5), DOI: 10.18517/ijaseit.11.5.14293 (metodología propia). (2) *Applying Geospatial Tools and Techniques to Viticulture*, Geography Compass (2013), DOI: 10.1111/gec3.12018.

**Propuesta 5.2 — Vigor del viñedo con dron multiespectral**
- **Título del artículo:** Estimación del vigor vegetativo de vid mediante índices espectrales derivados de UAV multiespectral en la Sierra Nevada de Santa Marta
- **Título de investigación:** "Uso de NDVI/GNDVI de dron multiespectral para el monitoreo del vigor de la vid en fase de establecimiento"
- **Resumen:** Vuelos UAV con cámara multiespectral para calcular índices de vegetación y correlacionarlos con variables agronómicas de campo (vigor, área foliar, brotación), replicando la experiencia previa del docente en dosel de banano.
- **Brecha/novedad:** transferir el flujo UAV de dosel (probado en banano) a un cultivo perenne emergente en el Caribe, con resolución centimétrica.
- **Datos y sensor:** UAV multiespectral (rojo, borde-rojo, NIR); GPS RTK.
- **Método breve:** ortomosaico; NDVI/GNDVI/NDRE; muestreo de campo; regresión índice–vigor; validación cruzada.
- **Referencias:** (1) Espinosa-Valdez, Polo-Castañeda et al. (2022), *Canopy Extraction in a Banana Crop From UAV Captured Multispectral Images*, IEEE CONCAPAN, DOI: 10.1109/CONCAPAN48024.2022.9997598 (referencia propia). (2) *Synergistic Use of Sentinel-2 and UAV Multispectral Data to Improve and Optimize Viticulture Management*, Drones/MDPI (2022), DOI: 10.3390/drones6110366.

**Propuesta 5.3 — Fenología del viñedo con series temporales Sentinel-2**
- **Título del artículo:** Caracterización de la fenología de la vid mediante series temporales NDVI/EVI2 Sentinel-2 en un terroir tropical de altura
- **Título de investigación:** "Land Surface Phenology de la vid a partir de series Sentinel-2 en la Sierra Nevada de Santa Marta"
- **Resumen:** Se extraen métricas fenológicas (inicio/fin de estación, pico de vigor) de series Sentinel-2 para caracterizar el ciclo de la vid en condiciones tropicales de altura, donde la fenología difiere de zonas templadas clásicas.
- **Brecha/novedad:** la mayoría de estudios fenológicos de vid son en clima templado; el aporte es documentar el ciclo en un contexto ecuatorial de montaña.
- **Datos y sensor:** Sentinel-2 L2A (NDVI/EVI2), GDD desde datos meteorológicos.
- **Método breve:** suavizado de series (Savitzky-Golay); extracción de métricas LSP; correlación NDVI–GDD; validación con observaciones de campo.
- **Referencias:** (1) *Monitoring soil substrate influence in vineyards using Sentinel-2 time series and land surface phenology*, Int. J. Appl. Earth Obs. Geoinf./ScienceDirect (2025), URL: https://www.sciencedirect.com/science/article/pii/S1569843225006247. (2) *Assessing spatial and temporal patterns of grapevine vigor and yield using satellite remote sensing*, Frontiers in Horticulture (2026), DOI: 10.3389/fhort.2026.1816162.

---

## Ingeniería Ambiental y Sanitaria (fotocatálisis de materiales)

### Tesis 6 — Perovskitas dobles MCaFeMnO6 (M = Gd, Ho, Dy) para contaminantes emergentes en el Río Manzanares

> Tesis "dura": las 3 ideas usan teledetección en roles distintos (problema, herramienta, validación temporal) manteniendo el foco en el Río Manzanares que la tesis busca descontaminar.

**Propuesta 6.1 — Caracterización espacial de la contaminación del Manzanares (el problema)**
- **Título del artículo:** Caracterización espacial de la contaminación del Río Manzanares mediante Sentinel-2 para priorizar puntos de muestreo en estudios de fotocatálisis
- **Título de investigación:** "Mapeo satelital de indicadores de calidad de agua del Río Manzanares como soporte a la evaluación de perovskitas fotocatalíticas"
- **Resumen:** Se mapea con Sentinel-2 en GEE la variabilidad espacial de turbidez, materia orgánica disuelta y usos del suelo ribereños, definiendo de forma objetiva y trazable los puntos de muestreo que alimentarán los ensayos con las perovskitas.
- **Brecha/novedad:** dar trazabilidad geoespacial reproducible a la selección de muestras, algo ausente en la mayoría de estudios de materiales fotocatalíticos.
- **Datos y sensor:** Sentinel-2 L2A (turbidez/CDOM proxy), LULC ribereño; muestreo in situ de contaminantes emergentes.
- **Método breve:** algoritmos empíricos de calidad de agua; mapas de puntos críticos; selección estratificada de estaciones; validación con laboratorio.
- **Referencias:** (1) *The role of remote sensing in the evolution of water pollution detection and monitoring: A comprehensive review*, ScienceDirect (2024), URL: https://www.sciencedirect.com/science/article/abs/pii/S1474706524001700. (2) *Estimating turbidity concentrations in highly dynamic rivers using Sentinel-2 imagery in GEE*, Environ. Sci. Pollut. Res. (2024), DOI: 10.1007/s11356-024-33344-4.

**Propuesta 6.2 — Dron térmico/multiespectral como herramienta de monitoreo fino del cauce**
- **Título del artículo:** Monitoreo de alta resolución del Río Manzanares con UAV multiespectral para localizar focos de vertimiento previo a tratamiento fotocatalítico
- **Título de investigación:** "Detección de descargas y anomalías de calidad de agua en el Río Manzanares mediante dron multiespectral"
- **Resumen:** Vuelos UAV para detectar, a escala centimétrica, plumas de vertimiento y anomalías espectrales/térmicas a lo largo del cauce urbano, complementando el satélite donde su resolución es insuficiente.
- **Brecha/novedad:** el satélite (10 m) no resuelve un río urbano estrecho; el dron cubre esa brecha de escala.
- **Datos y sensor:** UAV multiespectral + térmico; GPS.
- **Método breve:** ortomosaicos; índices de agua y anomalía térmica; identificación de descargas; correlación con muestreo puntual.
- **Referencias:** (1) *Advances in Remote Sensing Technologies for Monitoring River Water Quality* (UAV/satélite para detección temprana), Cyient (2023). (2) *Development of Autonomous Electric USV for Water Quality Detection*, Sensors/PMC (2024), PMC12197029.

**Propuesta 6.3 — Validación temporal del efecto del tratamiento sobre el cuerpo receptor**
- **Título del artículo:** Seguimiento multitemporal Sentinel-2 de la calidad del Río Manzanares como métrica de impacto de procesos de oxidación avanzada
- **Título de investigación:** "Evaluación satelital pre/post del efecto de tratamientos fotocatalíticos sobre indicadores de calidad de agua del Río Manzanares"
- **Resumen:** Se establece una línea base multianual Sentinel-2 y un protocolo de seguimiento para evaluar, en el tiempo, cambios en indicadores de calidad asociados a intervenciones de tratamiento.
- **Brecha/novedad:** conectar el desempeño de laboratorio del material con una métrica de impacto ambiental observable desde el espacio.
- **Datos y sensor:** Sentinel-2 L2A (series 2019–2025) en GEE; muestreo de validación.
- **Método breve:** series temporales de turbidez/Chl-a; análisis de tendencia; comparación pre/post; validación in situ (R²/RMSE).
- **Referencias:** (1) *Quality monitoring of inland water bodies using Google Earth Engine*, Journal of Hydroinformatics/IWA (2023), DOI: 10.2166/hydro.2023.089. (2) *Bismuth Sillenite Crystals as Recent Photocatalysts for Water Treatment...* (contexto de procesos de oxidación avanzada), Catalysts/MDPI (2022), DOI: 10.3390/catal12050500.

---

## Ingeniería Química

### Tesis 7 — Silenitas funcionalizadas con metales de transición (síntesis por combustión) para contaminantes orgánicos en agua

> Tesis "dura": las 3 ideas conectan la validación del material con cuerpos de agua reales observados por teledetección.

**Propuesta 7.1 — Priorización satelital de matrices reales (el problema)**
- **Título del artículo:** Identificación satelital de cuerpos de agua urbanos con carga orgánica como matrices de validación para silenitas fotocatalíticas
- **Título de investigación:** "Selección geoespacial de matrices acuosas reales para ensayos de silenitas funcionalizadas mediante Sentinel-2 y GEE"
- **Resumen:** Se generan índices proxy de calidad de agua (turbidez, Chl-a, CDOM) en cuerpos de agua del área metropolitana de Santa Marta para elegir objetivamente las matrices reales sobre las que se probará el material.
- **Brecha/novedad:** conecta la química de materiales de laboratorio con teledetección aplicada para escoger matrices representativas, no arbitrarias.
- **Datos y sensor:** Sentinel-2 L2A en GEE; verificación in situ.
- **Método breve:** cálculo de índices; ranking de cuerpos de agua por carga; selección; validación con muestreo.
- **Referencias:** (1) *Application of remote sensing technology in water quality monitoring: From traditional approaches to artificial intelligence*, Water Research/ScienceDirect (2024), URL: https://www.sciencedirect.com/science/article/abs/pii/S0043135424014453. (2) *Trends in remote sensing of water quality parameters in inland water bodies: a systematic review*, Frontiers in Environmental Science (2025), DOI: 10.3389/fenvs.2025.1549301.

**Propuesta 7.2 — Machine learning + Sentinel-2 para estimar contaminantes (herramienta)**
- **Título del artículo:** Estimación de indicadores de contaminación orgánica en aguas superficiales mediante machine learning y Sentinel-2 para focalizar tratamientos con silenitas
- **Título de investigación:** "Modelo ML de calidad de agua sobre Sentinel-2 para priorización espacial de intervención con fotocatalizadores"
- **Resumen:** Se entrena un modelo (CatBoost/RF) que estima indicadores de calidad de agua a partir de reflectancia Sentinel-2 corregida, para producir mapas de focalización de tratamiento.
- **Brecha/novedad:** aportar un modelo espacial de priorización que oriente dónde el material tendría mayor impacto.
- **Datos y sensor:** Sentinel-2 L2A (corrección atmosférica), estaciones de monitoreo como etiquetas.
- **Método breve:** extracción espectral en GEE; ML supervisado; validación *hold-out*; mapas de riesgo; métricas R²/RMSE.
- **Referencias:** (1) *Monitoring water contaminants in coastal areas through ML algorithms leveraging atmospherically corrected Sentinel-2 data*, arXiv:2401.03792. (2) *Integration of Google Earth Engine, Sentinel-2 images, and machine learning for temporal mapping of total dissolved solids in river systems*, Scientific Reports (2025), DOI: 10.1038/s41598-025-12548-9.

**Propuesta 7.3 — Validación multitemporal del cuerpo receptor (validación temporal)**
- **Título del artículo:** Monitoreo multitemporal Sentinel-2 del efecto de tratamientos con silenitas sobre cuerpos de agua urbanos
- **Título de investigación:** "Seguimiento satelital pre/post de indicadores de calidad de agua asociado a intervenciones fotocatalíticas"
- **Resumen:** Se define una línea base y protocolo de seguimiento para evaluar en el tiempo el efecto de las intervenciones sobre el cuerpo de agua receptor.
- **Brecha/novedad:** métrica ambiental observable y reproducible para cerrar el ciclo material→impacto.
- **Datos y sensor:** Sentinel-2 L2A (series) en GEE; muestreo de validación.
- **Método breve:** series de turbidez/Chl-a; comparación pre/post; tendencia; validación in situ.
- **Referencias:** (1) *Performance of Landsat-8 and Sentinel-2 surface reflectance products for river remote sensing retrievals of chlorophyll-a and turbidity*, Remote Sensing of Environment (2019), URL: https://www.sciencedirect.com/science/article/abs/pii/S0034425719300288. (2) *Application of Bi12ZnO20 Sillenite as an Efficient Photocatalyst for Wastewater Treatment*, Materials/MDPI (2021), DOI: 10.3390/ma14185409.

---

## Ingeniería de Sistemas

### Tesis 8 — Estrategias de representación del conocimiento del código en la comprensión arquitectónica mediante pipelines RAG

> Tesis "dura": el dominio de aplicación se fija en **código geoespacial/teledetección** (Google Earth Engine, librerías de RS), lo que convierte la tesis en una contribución publicable en la intersección RAG × Observación de la Tierra.

**Propuesta 8.1 — RAG sobre repositorios de código Google Earth Engine (herramienta para teledetección)**
- **Título del artículo:** Impacto de las estrategias de representación del código en un sistema RAG para la comprensión de pipelines de Google Earth Engine
- **Título de investigación:** "Evaluación de estrategias de chunking y grafos de dependencia en RAG aplicado a la comprensión arquitectónica de código de teledetección (GEE)"
- **Resumen:** Se compara cómo distintas representaciones del conocimiento del código (por función, por módulo, por grafo de llamadas) afectan la comprensión arquitectónica de repositorios reales de procesamiento satelital en GEE.
- **Brecha/novedad:** aplicar RAG de comprensión de código a un dominio con jerga y APIs propias (GEE), donde existe evidencia de mejora con bases de conocimiento de operadores.
- **Datos y sensor (corpus):** repositorios open-source de GEE/RS en GitHub; base de operadores GEE.
- **Método breve:** construir índices con distintas estrategias; evaluar recuperación (precisión/recall) y calidad de explicación arquitectónica; benchmark tipo AutoGEEval.
- **Referencias:** (1) *GEE-OPs: An Operator Knowledge Base for Geospatial Code Generation on the Google Earth Engine Platform Powered by LLMs*, arXiv:2412.05587. (2) *GeoColab: an LLM-based multi-agent collaborative framework for geospatial code generation*, Int. J. Digital Earth (2025), DOI: 10.1080/17538947.2025.2569405.

**Propuesta 8.2 — Grafos de código para comprensión de arquitecturas RS (representación del problema)**
- **Título del artículo:** Representación basada en grafos de dependencia para la comprensión arquitectónica de sistemas de procesamiento de imágenes satelitales mediante RAG
- **Título de investigación:** "Graph-RAG para la comprensión de arquitecturas de software en pipelines de teledetección"
- **Resumen:** Se evalúa si integrar la estructura de grafo del repositorio (dependencias entre módulos) mejora la comprensión arquitectónica frente a RAG textual plano, en código de teledetección.
- **Brecha/novedad:** el código RS suele tener fuertes dependencias inter-módulo (pre-proceso→índice→clasificación); un enfoque de grafo debería superar al RAG plano.
- **Datos y sensor (corpus):** repositorios RS con dependencias complejas; grafos de llamadas.
- **Método breve:** construcción de grafo de código; Graph-RAG vs. RAG textual; métricas de resolución de tareas a nivel repositorio.
- **Referencias:** (1) *Code Graph Model (CGM): A Graph-Integrated LLM for Repository-Level Software Engineering Tasks*, arXiv:2505.16901. (2) *An LLM Agent for Automatic Geospatial Data Analysis* (GeoAgent, RAG + GEE), arXiv:2410.18792.

**Propuesta 8.3 — Verificación/reproducibilidad de código geoespacial generado (validación)**
- **Título del artículo:** Reducción de "alucinaciones" en código de teledetección mediante RAG con verificación y grounding sobre APIs de Earth Engine
- **Título de investigación:** "Grounding y verificación en RAG para la generación reproducible de código geoespacial en Google Earth Engine"
- **Resumen:** Se estudia cómo la recuperación de documentación/operadores reduce errores y mejora la reproducibilidad del código RS generado, midiendo tasa de ejecución correcta.
- **Brecha/novedad:** enfoque en *verificabilidad* (que el código corra y produzca el mapa esperado), no solo en la fluidez del texto generado.
- **Datos y sensor (corpus):** AutoGEEval (1325 casos), documentación GEE.
- **Método breve:** pipeline RAG con verificación por ejecución; comparación con/ sin recuperación; métrica de éxito de ejecución y exactitud del resultado geoespacial.
- **Referencias:** (1) *Risk-Aware LLM Agents for Geospatial Data Retrieval* (menciona GEE-OPs +20–30% y AutoGEEval), arXiv:2606.15077. (2) *GeoContra: From Fluent GIS Code to Verifiable Spatial Analysis with Geography-Grounded Repair*, arXiv:2605.00782.

---

## Ingeniería Civil (Cohorte 2026-I)

### Tesis 9 — Modelamiento geotécnico con el método del punto material (MPM) y funciones B-spline cuadráticas

> Tesis "dura": la teledetección aporta la **geometría real** (DEM de dron/satélite) y el **campo de desplazamiento** (InSAR) que alimentan y validan las simulaciones MPM.

**Propuesta 9.1 — DEM UAV de alta resolución como geometría de entrada del MPM (herramienta)**
- **Título del artículo:** Efecto de la resolución del modelo digital de elevación derivado de UAV en simulaciones de deslizamiento con B-spline MPM
- **Título de investigación:** "Fotogrametría UAV para la generación de geometría de entrada en modelos del método del punto material de laderas"
- **Resumen:** Se genera un DEM centimétrico por fotogrametría UAV de una ladera de estudio y se evalúa la sensibilidad del factor de seguridad y del patrón de falla simulado con B-spline MPM a la resolución topográfica.
- **Brecha/novedad:** pocos trabajos MPM analizan explícitamente el efecto de la fuente/resolución del DEM (dron vs. satélite) sobre el resultado geotécnico.
- **Datos y sensor:** UAV fotogramétrico (SfM), SRTM/Copernicus DEM como comparación.
- **Método breve:** DEM SfM; discretización de partículas; MPM B-spline; comparación de FoS y zona de falla por resolución.
- **Referencias:** (1) *A practical stability/instability chart analysis for slope large deformations using the material point method*, Engineering Geology/ScienceDirect (2024), URL: https://www.sciencedirect.com/science/article/abs/pii/S0013795224002114. (2) *B-spline-based material point method with dynamic load balancing technique for large-scale simulation*, Engineering with Computers (2024), DOI: 10.1007/s00366-024-02099-4.

**Propuesta 9.2 — Desplazamientos InSAR como condición de contorno/validación (validación temporal)**
- **Título del artículo:** Validación de simulaciones B-spline MPM de laderas mediante campos de desplazamiento InSAR Sentinel-1
- **Título de investigación:** "Uso de series de deformación InSAR para la calibración y validación de modelos del método del punto material en taludes"
- **Resumen:** Se extrae con MT-InSAR (Sentinel-1) el campo de desplazamiento real de una ladera lenta y se usa para calibrar/validar la simulación MPM, cerrando la brecha entre modelo numérico y observación satelital.
- **Brecha/novedad:** acoplar observación InSAR real como referencia cuantitativa del MPM es infrecuente y de alto valor para revisores.
- **Datos y sensor:** Sentinel-1 SLC (PSI/SBAS), DEM.
- **Método breve:** procesamiento MT-InSAR (SNAP/StaMPS o LiCSBAS); serie de velocidad; comparación desplazamiento simulado vs. observado (RMSE).
- **Referencias:** (1) *InSAR Integrated Machine Learning Approach for Landslide Susceptibility Mapping*, Remote Sensing/MDPI (2024), DOI: 10.3390/rs16193574. (2) *InSAR-informed in situ monitoring for deep-seated landslides: insights from El Forn (Andorra)*, NHESS (2024), DOI: 10.5194/nhess-24-3651-2024.

**Propuesta 9.3 — Susceptibilidad regional como marco de casos MPM (el problema)**
- **Título del artículo:** Priorización de laderas críticas mediante susceptibilidad InSAR-ML para la selección de casos de estudio de modelamiento MPM
- **Título de investigación:** "Mapeo de susceptibilidad a deslizamiento con InSAR y machine learning como marco para el modelamiento geotécnico de detalle"
- **Resumen:** Se mapea la susceptibilidad a deslizamientos de una región (Sierra Nevada/vías del Magdalena) integrando velocidad InSAR y factores de teledetección, para seleccionar objetivamente las laderas donde aplicar el MPM de detalle.
- **Brecha/novedad:** enlazar escala regional (satélite) con escala de sitio (MPM), un puente metodológico poco explorado.
- **Datos y sensor:** Sentinel-1 (velocidad InSAR), Sentinel-2 (NDVI/LULC), DEM (pendiente/curvatura).
- **Método breve:** MT-InSAR; RF multiclase de susceptibilidad; ranking de laderas; validación con inventario; AUC.
- **Referencias:** (1) *New method for landslide susceptibility evaluation... suitability of InSAR monitoring and deformation rate grading*, Geo-spatial Information Science (2023), DOI: 10.1080/10095020.2023.2270218. (2) *Ground Stability Monitoring of Undermined and Landslide Prone Areas by Means of Sentinel-1 Multi-Temporal InSAR*, Geosciences/MDPI (2017), DOI: 10.3390/geosciences7030087.

---

## Ingeniería Electrónica (Cohorte 2025-II)

### Tesis 10 — Modelo cuantitativo de riesgo de seguridad en redes WiFi abiertas (vulnerabilidades + ISO/IEC 27001) en IES de Santa Marta

> Tesis "dura": la teledetección/geomática aporta la dimensión **espacial** del riesgo (georreferenciación de puntos de acceso, modelado de propagación sobre modelos 3D/DEM del campus).

**Propuesta 10.1 — Mapa SIG de riesgo por punto de acceso (herramienta)**
- **Título del artículo:** Zonificación SIG del riesgo de seguridad en redes WiFi abiertas de campus universitarios a partir de puntos de acceso georreferenciados
- **Título de investigación:** "Mapa de calor de riesgo de ciberseguridad WiFi mediante integración de vulnerabilidades técnicas, ISO/IEC 27001 y SIG en IES de Santa Marta"
- **Resumen:** El puntaje de riesgo (vulnerabilidades + cumplimiento ISO/IEC 27001) se georreferencia por punto de acceso y se interpola en SIG para generar un mapa de calor de riesgo físico-espacial que priorice intervenciones.
- **Brecha/novedad:** la mayoría de modelos de riesgo WiFi son tabulares; la novedad es su representación espacial accionable a escala de campus.
- **Datos y sensor:** inventario georreferenciado de APs, planos/DEM del campus, escaneo de vulnerabilidades.
- **Método breve:** cálculo del índice de riesgo; georreferenciación; interpolación (IDW/kriging); mapa de calor; análisis de zonas críticas.
- **Referencias:** (1) *Campus Wi-Fi Coverage Mapping and Analysis*, arXiv:2004.01561. (2) *Using GIS in Designing and Deploying Wireless Network in City Plans*, ResearchGate (2022).

**Propuesta 10.2 — Modelado de propagación/cobertura sobre modelo 3D del campus (el problema)**
- **Título del artículo:** Estimación de exposición de redes WiFi abiertas mediante modelado de propagación RF sobre modelos 3D derivados de fotogrametría UAV
- **Título de investigación:** "Modelos digitales 3D del campus (UAV/LiDAR) para estimar la huella espacial de exposición de redes WiFi abiertas"
- **Resumen:** Se construye un modelo 3D del campus (fotogrametría UAV) y se simula la cobertura/propagación de las señales WiFi abiertas para estimar la superficie de exposición fuera de los edificios (donde un atacante podría conectarse).
- **Brecha/novedad:** vincular la superficie de riesgo con la propagación real sobre geometría 3D, más allá del conteo de vulnerabilidades.
- **Datos y sensor:** UAV fotogramétrico (modelo 3D/DSM), datos de APs.
- **Método breve:** reconstrucción 3D (SfM); ray-tracing/estimación RSSI; mapa de exposición; contraste con mediciones de campo.
- **Referencias:** (1) *Campus5G: A Campus Scale Private 5G Open RAN Testbed* (estimación de cobertura por ray-tracing sobre escena 3D), arXiv:2506.23740. (2) *Mapping a Wireless World* (DEM/terreno para línea de vista y propagación), Esri/ArcGIS StoryMaps (2024).

**Propuesta 10.3 — Priorización espacial multicriterio AHP-SIG del riesgo (validación/decisión)**
- **Título del artículo:** Priorización multicriterio AHP-SIG de intervención en redes WiFi abiertas de instituciones de educación superior
- **Título de investigación:** "Integración de vulnerabilidades técnicas, cumplimiento ISO/IEC 27001 y variables espaciales mediante AHP-SIG para priorizar la remediación de riesgo WiFi"
- **Resumen:** Se combinan criterios técnicos, normativos y espaciales (densidad de usuarios, exposición exterior) en un modelo AHP-SIG que jerarquiza qué APs/zonas intervenir primero.
- **Brecha/novedad:** aporta un marco de decisión espacial reproducible que integra la norma ISO/IEC 27001 con geomática (línea AHP-SIG del docente aplicada a ciberseguridad).
- **Datos y sensor:** capas de vulnerabilidad, cumplimiento, densidad de uso, exposición espacial.
- **Método breve:** AHP (CR<0.1); superposición ponderada en SIG; mapa de prioridad; análisis de sensibilidad.
- **Referencias:** (1) Polo-Castañeda et al. (2021), *Application of AHP and GIS...*, IJASEIT 11(5), DOI: 10.18517/ijaseit.11.5.14293 (metodología propia). (2) *Development and Implementation of an Advanced Fuzzy Information Security Risk Assessment Model* (NIST 800-30, ISO/IEC 27001, BS 7799), JCCE/Bon View (2025).

---

## Ingeniería Civil (Cohorte 2025-II)

### Tesis 11 — Modelado hidromecánico de pavimentos asfálticos permeables (porosidad + prototipo a escala real)

**Propuesta 11.1 — Termografía UAV para porosidad y humedad (herramienta no destructiva)**
- **Título del artículo:** Evaluación no destructiva de porosidad y comportamiento hidromecánico de pavimentos permeables mediante termografía infrarroja aerotransportada por UAV
- **Título de investigación:** "Termografía UAV como método no destructivo para caracterizar porosidad y drenaje en pavimentos asfálticos permeables a escala real"
- **Resumen:** Vuelos con cámara térmica UAV sobre el prototipo a escala real para detectar patrones de temperatura asociados a zonas de mayor/menor porosidad y retención de humedad, validados contra ensayos hidromecánicos de laboratorio.
- **Brecha/novedad:** aplicar termografía aérea (usada en detección de vacíos/humedad de pavimentos) específicamente a la caracterización de porosidad de pavimentos *permeables*.
- **Datos y sensor:** UAV térmico (IR), cámara RGB; ensayos de permeabilidad de referencia.
- **Método breve:** ortomosaico térmico bajo ciclo de secado; correlación temperatura–porosidad/humedad; validación con permeámetro; RMSE.
- **Referencias:** (1) *Detecting Subsurface Voids in Roadways Using UAS with Infrared*, US DOT/NTL, URL: https://rosap.ntl.bts.gov/view/dot/61030/dot_61030_DS1.pdf. (2) *Automatic recognition of earth rock embankment leakage based on UAV passive infrared thermography and deep learning* (termografía UAV para permeabilidad), ISPRS J./ScienceDirect (2022).

**Propuesta 11.2 — Monitoreo térmico del desempeño hidrológico y efecto isla de calor (el problema urbano)**
- **Título del artículo:** Contribución de pavimentos permeables a la mitigación térmica urbana evaluada con termografía UAV y datos satelitales LST
- **Título de investigación:** "Evaluación del efecto de pavimentos permeables sobre la temperatura superficial urbana mediante teledetección térmica multiescala"
- **Resumen:** Se combina termografía UAV (detalle) con LST satelital (contexto) para evaluar cómo el pavimento permeable modifica la temperatura superficial y el escurrimiento térmico frente a superficies impermeables.
- **Brecha/novedad:** vincular el desempeño hidromecánico del pavimento con un co-beneficio térmico medido por teledetección, ángulo poco explorado en el Caribe.
- **Datos y sensor:** UAV térmico; Landsat/Sentinel-3 LST; datos meteorológicos.
- **Método breve:** LST UAV vs. satélite; comparación por tipo de superficie; balance de energía simplificado; validación in situ.
- **Referencias:** (1) *Urban Land Surface Temperature Monitoring and Surface Thermal Runoff Pollution Evaluation Using UAV Thermal Remote Sensing Technology*, Sustainability/MDPI (2021), DOI: 10.3390/su132011203. (2) *A UAV-derived thermal infrared remote sensing three-temperature model... urban micro-environments*, ISPRS J./ScienceDirect (2022).

**Propuesta 11.3 — Detección de colmatación y pérdida de infiltración en el tiempo (validación temporal)**
- **Título del artículo:** Detección multitemporal de colmatación en pavimentos permeables mediante termografía UAV seriada
- **Título de investigación:** "Seguimiento temporal del desempeño de infiltración de pavimentos permeables usando termografía aérea repetida"
- **Resumen:** Se realizan campañas UAV térmicas periódicas para detectar la pérdida progresiva de capacidad de infiltración (colmatación) a partir de cambios en el patrón térmico durante ciclos de humedecimiento-secado.
- **Brecha/novedad:** monitoreo no destructivo y espacialmente continuo de la colmatación, principal causa de falla funcional de estos pavimentos.
- **Datos y sensor:** UAV térmico en serie temporal; ensayos de infiltración puntuales de control.
- **Método breve:** series térmicas bajo protocolo de riego controlado; índice de anomalía térmica; correlación con caída de infiltración; validación con ensayos.
- **Referencias:** (1) *Permeable pavement monitoring system*, US Patent 11,656,116 (marco de monitoreo de drenaje/colmatación). (2) *A UAV-derived thermal infrared remote sensing three-temperature model...*, ISPRS J./ScienceDirect (2022).

---

## Tabla resumen (para tu clase)

| # | Programa | Tesis | Rol teledetección — 3 propuestas |
|---|---|---|---|
| 1 | Amb. y Sanitaria | Inundación no estacionaria | SAR Sentinel-1 · ML susceptibilidad · fusión óptico-radar |
| 2 | Amb. y Sanitaria | Polvo africano PM10/PM2.5 | AOD/HYSPLIT (problema) · modelo aporte (herramienta) · validación AOD-PM |
| 3 | Amb. y Sanitaria | SbN palafíticas Buenavista | AHP-SIG sitios · InSAR hidroperiodo · monitoreo Chl-a/turbidez |
| 4 | Amb. y Sanitaria | Coberturas multitemporal | Intensity Analysis+IA · fusión óptico-radar · validación precisión |
| 5 | Agronomía | Vid Tigrera | AHP-SIG aptitud · UAV vigor · fenología Sentinel-2 |
| 6 | Amb. y Sanitaria | Perovskitas río Manzanares | Sentinel-2 problema · UAV herramienta · validación temporal |
| 7 | Química | Silenitas | Sentinel-2 matrices · ML calidad agua · validación temporal |
| 8 | Sistemas | RAG comprensión de código | RAG sobre GEE · Graph-RAG RS · verificación código geoespacial |
| 9 | Civil (2026-I) | MPM B-spline | DEM UAV geometría · InSAR validación · susceptibilidad InSAR-ML |
| 10 | Electrónica | Riesgo WiFi ISO 27001 | mapa SIG riesgo · propagación 3D UAV · AHP-SIG priorización |
| 11 | Civil (2025-II) | Pavimentos permeables | termografía UAV porosidad · LST isla de calor · colmatación temporal |

---

*Documento v2 — apoyo a la sesión de asesoría de propuestas de artículo, Curso de Teledetección, Maestría en Ingeniería, Universidad del Magdalena, julio 2026. Las referencias fueron verificadas por búsqueda web; conviene que cada estudiante confirme DOI y disponibilidad de acceso antes de citar en su propuesta formal.*