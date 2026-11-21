# Real PDF previews and printed-workbook illustration

The automatic carousel displays six actual excerpts from the original 16-page PAES en Foco sample: percentages (3), geometry (7), data chart (8), M1 practice (11), commented solutions (13), and reading (9). The excerpts preserve the content and remove only page margins/header/footer. Each opens in the existing enlargement dialog. Full-page previews in the materials/bonus sections are pages 3, 9, 15 and 16. `scripts/create-visual-previews.py` recreates all previews from `public/paes/muestra-visual.pdf`.

The downloadable sample is the new 16-page authorial PDF, with compressed embedded photographs and selectable text. The original six-page assets are retained for rollback but no longer used by the current homepage.

`public/paes/apostila-en-manos.webp` is an AI-generated illustrative staged photograph of an adult woman holding a spiral-bound printout of the sample. It is not a customer testimonial. The nearby caption explains that delivery is digital and printing/binding are not included. The existing hero mockup and offer scope remain intact.

Image brief: photorealistic adult Latina woman holding an A4 spiral-bound copy of the supplied PAES en Foco cover, clean light blue background, soft studio light, no price or testimonial. Built-in image generation used; reference was the actual PDF cover.

UI checks: automatic movement retained, hover/focus pause retained, reduced-motion horizontal scrolling retained, native enlargement dialog retained, and all new imagery uses WebP with intrinsic dimensions. Carousel excerpts load eagerly with low fetch priority to avoid blank cards entering the viewport; larger static illustrations remain lazy-loaded.
