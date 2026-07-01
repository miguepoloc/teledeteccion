# Cargar mapas clasificados
mapa_2000 = rasterio.open('Clasificacion_Coberturas_2000.tif')
mapa_2024 = rasterio.open('Clasificacion_Coberturas_2024.tif')

# Contar transiciones: Café (1) → Cacao (2)
cafe_a_cacao = contar_pixeles_donde(mapa_2000==1 AND mapa_2024==2)

# Convertir a hectáreas
hectareas = cafe_a_cacao * 0.01  # (10m × 10m = 100 m² = 0.01 ha)

print(f"Café convertido a cacao: {hectareas:,.0f} hectáreas")