# Creativos de fútbol — tres variaciones para probar

Tres anuncios verticales en español dirigidos a entrenadores y jugadores. Se alternan los siete vídeos de entrenamiento proporcionados por el propietario. La web y su checkout no se modifican.

## Variaciones

| Archivo | Gancho | Desarrollo | Tratamiento |
| --- | --- | --- | --- |
| `01-rompe-la-rutina.mp4` | «¿Otra semana repitiendo los mismos ejercicios?» | Rutina → objetivo → pases/control/definición → intención → plataforma | Editorial deportivo, lima sobre negro |
| `02-sin-ideas.mp4` | «¿Sin ideas para cambiar?» | Rutina → objetivo → preparar la sesión con intención → plataforma | Rojo coral, composición compacta |
| `03-ultima-hora.mp4` | «¿Todo a última hora?» | Imaginar una sesión con intención → elegir un objetivo → plataforma | Cian, enfoque de planificación |

Los vídeos 2 y 3 reutilizan frases de la misma locución, editadas en límites de frase y a velocidad natural. El primer intento de una locución independiente no comenzó por saturación; otro falló. No se regeneraron. Las tres piezas tienen audio completo y distinto montaje, sin presentar tres locuciones independientes como resultado.

La oferta fue identificada por el propietario como una **plataforma de fútbol**. No se proporcionó nombre, URL, precio ni inventario de funciones. El CTA es «Haz clic para conocerla». No se atribuyen resultados, testimonios, seguimiento automático, planes personalizados o cifras de ejercicios a la plataforma. Las imágenes son material ilustrativo de entrenamiento, no una demostración de su interfaz. Los textos y marcas incrustados en los originales se conservan.

## Reproducir

Requisitos: Python 3.12, FFmpeg con libx264/libass, `numpy`, `Pillow` y la fuente Nimbus Sans (paquete URW Base35). `render.py` guarda las versiones, la correspondencia exacta entre audio fuente y audio final, el montaje de imagen, las palabras alineadas y las decisiones de subtitulado. Música instrumental original generada por código con semillas fijas. No requiere credenciales.

```bash
python -m pip install numpy Pillow
python creative/futbol/render.py
# Solo una variante:
python creative/futbol/render.py --version 2
```

Copiar los siete originales a `assets/clip-01.mp4` … `clip-07.mp4`, siguiendo `assets.json`; copiar la locución autorizada a `assets/narration.mp3`. El paquete editable entregado en la conversación contiene estos medios y el código. No se incorporan los medios pesados al historial git. Los vídeos finales se encuentran en `output/`.

Entrega: 1080×1920, 30 fps, SDR Rec.709, H.264/AAC, MP4 con faststart. El metraje fuente es 576×1024 y se escala uniformemente, sin recorte, a 1080×1920. Los textos nuevos se renderizan a resolución de entrega. Las acciones se mantienen a velocidad original. El sonido original de los vídeos no se utiliza, para evitar música o voces simultáneas con la locución.

Los SRT contienen toda la voz retenida. No activar simultáneamente el SRT y los subtítulos ya incrustados en el vídeo. La colocación utiliza un perfil móvil conservador provisional; revisar la previsualización del gestor de anuncios antes de publicar para comprobar sus controles y zonas de interfaz.

## Prueba sugerida

Usar el mismo público, destino y presupuesto por variante. Estas piezas prueban conceptos completos: cambian gancho, orden del cuerpo, metraje y estilo. No permiten atribuir una diferencia exclusivamente al gancho. Comparar retención inicial, visualización, clics y conversiones. Para aislar después el gancho, mantener cuerpo, clips y estilo constantes y cambiar solo la apertura ganadora.

Los vídeos no incluyen un enlace de compra de la oferta anterior de IA. Confirmar el destino de la plataforma de fútbol al configurar la campaña.
