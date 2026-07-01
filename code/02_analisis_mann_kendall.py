"""
SCRIPT 2: Análisis Mann-Kendall de Series Temporales NDVI
Autor: Miguel Ángel Polo Castañeda
Fecha: Junio 2026
Universidad del Magdalena | Maestría en Ingeniería

Descripción:
    Realiza el test de Mann-Kendall y calcula la pendiente de Sen para detectar
    tendencias estadísticamente significativas en el NDVI de tres franjas
    altitudinales de la Sierra Nevada de Santa Marta (2000–2025).

Prerrequisitos:
    - CSV exportado desde Google Earth Engine (script 01_gee_ndvi_series.js)
    - Librerías instaladas: pip install -r requirements.txt

Uso:
    python 02_analisis_mann_kendall.py
"""

from pathlib import Path

import pandas as pd
from scipy import stats
from pymannkendall import original_test
import matplotlib.pyplot as plt


# ============================================================================
# 1. CARGAR DATOS DESDE GEE (CSV exportado)
# ============================================================================
ROOT_DIR    = Path(__file__).parent.parent
DATA_DIR    = ROOT_DIR / 'datos'
RESULTS_DIR = ROOT_DIR / 'datos' / 'resultados'
RESULTS_DIR.mkdir(exist_ok=True)

df = pd.read_csv(DATA_DIR / 'NDVI_Series_Temporal_SierraNevada_2000_2025.csv')

print("Datos cargados:")
print(df.head())

# ============================================================================
# 2. EXTRAER SERIES POR FRANJA ALTITUDINAL
# ============================================================================
anos       = df['year'].values
ndvi_baja  = df['NDVI_franja_baja'].values
ndvi_media = df['NDVI_franja_media'].values
ndvi_alta  = df['NDVI_franja_alta'].values


# ============================================================================
# 3. FUNCIÓN PARA REALIZAR MANN-KENDALL
# ============================================================================
def mann_kendall_analysis(years, ndvi_values, franja_name):
    """
    Realiza test Mann-Kendall sobre una serie temporal de NDVI.

    Parámetros:
        years       : array con los años (eje x)
        ndvi_values : array con los valores NDVI (eje y)
        franja_name : nombre descriptivo de la franja altitudinal

    Retorna:
        dict con tau, p_value, slope, significancia y tendencia
    """
    # Eliminar valores NaN
    mask        = ~pd.isna(ndvi_values)
    years_clean = years[mask]
    ndvi_clean  = ndvi_values[mask]

    # Test de Mann-Kendall
    tau, p_value = stats.kendalltau(years_clean, ndvi_clean)

    # Pendiente de Sen (cambio promedio por año)
    result = original_test(ndvi_clean)
    slope  = result.slope

    # Interpretación
    significancia = "SÍ" if p_value < 0.05 else "NO"
    tendencia     = "CRECIENTE" if tau > 0 else "DECRECIENTE"

    print(f"\n{'='*60}")
    print(f"FRANJA: {franja_name}")
    print(f"{'='*60}")
    print(f"Tau (correlación):        {tau:.4f}")
    print(f"p-value:                  {p_value:.6f}")
    print(f"¿Significativa (p<0.05)?: {significancia}")
    print(f"Tendencia:                {tendencia}")
    print(f"Pendiente de Sen:         {slope:.6f} NDVI/año")
    print(f"Cambio total 2000–2025:   {slope * 25:.4f}")

    return {
        'franja':        franja_name,
        'tau':           tau,
        'p_value':       p_value,
        'slope':         slope,
        'significancia': significancia,
        'tendencia':     tendencia,
    }


# ============================================================================
# 4. ANALIZAR CADA FRANJA
# ============================================================================
franjas = [
    (ndvi_baja,  'Franja Baja (400–700 m)'),
    (ndvi_media, 'Franja Media (700–1200 m)'),
    (ndvi_alta,  'Franja Alta (1200–1800 m)'),
]

resultados = []
for ndvi_vals, nombre in franjas:
    res = mann_kendall_analysis(anos, ndvi_vals, nombre)
    resultados.append(res)


# ============================================================================
# 5. GUARDAR RESULTADOS EN CSV (para el artículo)
# ============================================================================
resultados_df = pd.DataFrame(resultados)
out_csv = RESULTS_DIR / 'mann_kendall_resultados.csv'
resultados_df.to_csv(out_csv, index=False)
print(f"\n✓ Resultados guardados en '{out_csv}'")


# ============================================================================
# 6. GRAFICAR SERIES TEMPORALES
# ============================================================================
plt.figure(figsize=(12, 6))

plt.plot(anos, ndvi_baja,  'o-', label='Franja Baja (400–700 m)',   linewidth=2, markersize=6)
plt.plot(anos, ndvi_media, 's-', label='Franja Media (700–1200 m)', linewidth=2, markersize=6)
plt.plot(anos, ndvi_alta,  '^-', label='Franja Alta (1200–1800 m)', linewidth=2, markersize=6)

plt.xlabel('Año', fontsize=12)
plt.ylabel('NDVI', fontsize=12)
plt.title('Series Temporal NDVI por Franja Altitudinal (2000–2025)',
          fontsize=14, fontweight='bold')
plt.legend(loc='best', fontsize=11)
plt.grid(True, alpha=0.3)
plt.tight_layout()

out_png = RESULTS_DIR / 'NDVI_series_temporal.png'
plt.savefig(out_png, dpi=300)
print(f"✓ Gráfica guardada en '{out_png}'")
