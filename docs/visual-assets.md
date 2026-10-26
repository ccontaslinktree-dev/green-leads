# Direção visual — Escritório IA

A página usa cores claras, verde-petróleo e lima, fontes locais Manrope e Sora, cartões com profundidade e animações leves. As ilustrações são conceituais e não representam telas de software incluído na compra. Os vídeos são demonstrações fornecidas pelo responsável pela oferta.

## Imagens geradas

Geração com a ferramenta de imagens integrada. Os arquivos de produção são WebP para reduzir a transferência.

- `public/images/escritorio-ia.webp`: escritório isométrico em 3D, com cinco áreas conectadas — pesquisa, copy, páginas, criativos e entregáveis. Vidro verde, alumínio, superfícies marfim, iluminação suave. Sem robôs, dinheiro, resultados de vendas, marcas ou texto.
- `public/images/prompt-escritorio.webp`: embalagem digital conceitual, laptop e cartões de pesquisa, texto e vídeo, conectados a um cubo verde. Iluminação comercial, fundo marfim e materiais realistas. Sem moeda, promessa de renda ou telas falsas de resultados.

## Movimento

- Apresentação suave das seções com IntersectionObserver.
- Seleção real das cinco funções por clique ou teclado.
- Cartões de saída com entrada em sequência.
- Perspectiva discreta ao mover o ponteiro no painel, somente em dispositivos com mouse.
- Respeito a prefers-reduced-motion.
- Nenhuma biblioteca pesada de animação ou canvas 3D na página.

## Vídeos

Os dois vídeos originais foram preservados. As rotas em `public/videos` reaproveitam os mesmos blobs já enviados no GitHub. O navegador não precisa baixar os vídeos para abrir a página: preload=none, capas WebP e início por clique. A reprodução usa controles nativos e apenas um vídeo toca por vez.
