"""Render real exercises and diagrams from the 16-page authorial sample."""
from pathlib import Path
import fitz
from PIL import Image

out = Path(__file__).resolve().parents[1] / 'public/paes/visual'
out.mkdir(parents=True, exist_ok=True)
doc = fitz.open(out.parent / 'muestra-visual.pdf')
for page in [3, 7, 8, 11, 13, 9]:
    pix = doc[page - 1].get_pixmap(matrix=fitz.Matrix(1.5, 1.5), clip=fitz.Rect(32, 94, 568, 800), alpha=False)
    Image.frombytes('RGB', [pix.width, pix.height], pix.samples).save(out / f'corte-{page:02}.webp', quality=87, method=6)
for page in [3, 9, 15, 16]:
    pix = doc[page - 1].get_pixmap(matrix=fitz.Matrix(1.3, 1.3), alpha=False)
    Image.frombytes('RGB', [pix.width, pix.height], pix.samples).save(out / f'pagina-{page:02}.webp', quality=86, method=6)
print('Six excerpt cards and four full-page previews rendered from the PDF.')
