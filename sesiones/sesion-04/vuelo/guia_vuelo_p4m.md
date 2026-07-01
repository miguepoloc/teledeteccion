# Guía de Vuelo — DJI Phantom 4 Multispectral
## Sesión 4 | Universidad del Magdalena | Sábado 25 Jul 2026

> Esta guía es para el docente. Cúbrela paso a paso frente a los estudiantes antes de encender el drone.
> El objetivo no es ser piloto — es entender el flujo completo desde misión hasta dato.

---

## 1. Antes de salir al campo (noche anterior)

- [ ] Cargar todas las baterías del P4M al 100% (mínimo 3 baterías = ~45 min de vuelo)
- [ ] Cargar la batería del control remoto
- [ ] Verificar que la tarjeta microSD esté vacía o con espacio suficiente (vuelo de 1 ha → ~500–800 fotos → ~4 GB)
- [ ] Instalar/actualizar DJI Pilot en el tablet/teléfono del control remoto
- [ ] Descargar el área de vuelo en DJI Pilot para uso offline
- [ ] Preparar el panel de calibración (ver sección 3)

---

## 2. Especificaciones técnicas del P4M

| Parámetro | Valor |
|-----------|-------|
| Cámara multiespectral | 5 bandas individuales (Blue, Green, Red, RedEdge, NIR) |
| Resolución por banda | 1600 × 1300 px (2.08 MP) |
| Sensor de luz solar | Integrado (sunshine sensor en la tapa) |
| Altura recomendada | 50–100 m AGL |
| GSD a 50 m | 5.29 cm/px |
| GSD a 100 m | 10.6 cm/px |
| Tiempo de vuelo | ~27 min por batería |
| Frontal overlap | 80% recomendado |
| Lateral overlap | 75% recomendado |
| Formato de salida | TIF individual por banda + JPG RGB |

### Nombres de archivos del P4M
```
DJI_0001_MS_B.TIF    ← Blue (450 nm)
DJI_0001_MS_G.TIF    ← Green (560 nm)
DJI_0001_MS_R.TIF    ← Red (650 nm)
DJI_0001_MS_RE.TIF   ← Red Edge (730 nm)
DJI_0001_MS_NIR.TIF  ← NIR (840 nm)
DJI_0001.JPG         ← Foto RGB de referencia
DJI_0001_D.TIF       ← Datos del sunshine sensor (luz ambiental)
```

---

## 3. Panel de calibración — cómo hacerlo y usarlo

### Opción A: Imprimir en papel matte (gratis)
- Imprime una hoja A4 en papel matte blanco sin brillo
- Reflectancia aproximada: **85%** (anotar este valor para WebODM)
- Pégala sobre cartón rígido para que quede plana

### Opción B: Tarjeta gris fotográfica (mejor, ~$10–15)
- Reflectancia: **18%** (estándar fotográfico Kodak/X-Rite)
- Tamaño mínimo: 30 × 30 cm para verla bien desde 1 m de altura

### Procedimiento de calibración
1. Coloca el panel en el suelo antes de despegar, en zona sin sombras
2. Sube el P4M a 1–1.5 m de altura directamente sobre el panel
3. Apunta la cámara hacia abajo y toma **5 fotos consecutivas**
4. Repite el mismo procedimiento al aterrizar (fotos post-vuelo)
5. Estas fotos (antes y después) se cargan en WebODM como referencia

> **Nota:** El sunshine sensor del P4M realiza corrección de iluminación automática. El panel es para calibración cuantitativa (valores de reflectancia absoluta). Para este lab introductorio, si no tienes el panel, el sunshine sensor es suficiente.

---

## 4. Checklist de seguridad — ANTES de encender

**Área:**
- [ ] Inspeccionar visualmente el área de vuelo (personas, cables eléctricos, árboles altos)
- [ ] Definir zona de aterrizaje de emergencia (al menos 2 opciones)
- [ ] Verificar dirección del viento (máx 10 m/s para el P4M)
- [ ] Verificar que no hay lluvia ni pronóstico de lluvia

**Equipo:**
- [ ] Propelas bien ajustadas y sin grietas
- [ ] Batería encajada correctamente (escuchar el clic)
- [ ] Tarjeta SD insertada
- [ ] Control remoto encendido PRIMERO, luego el drone
- [ ] Esperar a que los LEDs traseros del drone parpadeen lentamente (listo para volar)

**App DJI Pilot:**
- [ ] Señal GPS: mínimo 10 satélites antes de despegar
- [ ] Return-to-Home (RTH) configurado a 50 m de altura
- [ ] Batería baja programada en 30% (RTH automático)

---

## 5. Planificación de la misión en DJI Pilot

### Parámetros para el vuelo en la universidad

```
Modo:              Misión automática (Waypoint Mission)
Altura de vuelo:   50 m AGL
Velocidad:         5–7 m/s (vuelo más lento = más calidad)
Overlap frontal:   80%
Overlap lateral:   75%
Patrón:            Cuadrícula (grid) doble (para mayor detalle)
Área cubierta:     ~3–5 ha (lago + vegetación adyacente)
Tiempo estimado:   ~20–25 min (1 batería)
```

### Cómo crear la misión paso a paso
1. Abre DJI Pilot → toca el ícono de misión (bandera)
2. Selecciona **Mapping Mission** (no Waypoint ni FPV)
3. Dibuja el polígono sobre el mapa marcando las 4 esquinas del área
4. Ajusta los parámetros de overlap y altura
5. La app calcula automáticamente el número de fotos (~300–600)
6. Revisa el tiempo estimado en pantalla
7. Toca **Upload** para cargar la misión al drone
8. Toca **Start** — el drone despega y vuela solo

---

## 6. Durante el vuelo

- Mantente siempre en línea de visión con el drone (VLOS — Visual Line of Sight)
- Ten el control en mano para intervenir si es necesario
- Observa el porcentaje de batería: si baja de 30% antes de terminar, el drone regresa solo
- Si ves que el drone activa RTH inesperadamente, es por viento, batería baja o pérdida de señal GPS

---

## 7. Después del vuelo

1. Vuelve a poner el drone en el suelo y toma las **fotos post-vuelo del panel** de calibración
2. Retira la batería antes de apagar el control
3. Saca la tarjeta SD y copia las fotos al computador
4. Organiza los archivos en carpetas:

```
vuelo_universidad_2026-07-25/
├── calibracion_pre/        ← fotos del panel antes del vuelo
├── fotos_mision/           ← todas las DJI_XXXX_MS_*.TIF
└── calibracion_post/       ← fotos del panel después del vuelo
```

5. Carga las fotos a WebODM para procesamiento (ver guía WebODM)

---

## 8. Qué mostrar y decir a los estudiantes durante el vuelo

**Antes de despegar:**
> "Este drone tiene 5 cámaras independientes, cada una captura una longitud de onda diferente del espectro. Cuando lo ven despegar, cada segundo que vuela está tomando 5 fotos simultáneas — una por banda. Al final del vuelo tendremos miles de imágenes pequeñas que el software va a unir como un rompecabezas para formar el mapa completo."

**Mientras vuela:**
> "¿Ven cómo vuela en líneas paralelas? Eso se llama patrón en cuadrícula — garantiza que cada metro del terreno aparezca en al menos dos fotos diferentes, lo que permite al software calcular la profundidad y la posición exacta de cada punto."

**Al aterrizar:**
> "Ahora tenemos las piezas del rompecabezas. El trabajo del software — WebODM — es reconstruir el mapa completo. Ese proceso se llama fotogrametría y es lo que haremos ahora."
