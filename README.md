# Escritório IA

Página de apresentação em português do Brasil para um prompt de organização de agentes de IA para infoprodutos.

## Oferta

- Produto: prompt Escritório IA, para usar no Claude.
- Preço: R$ 9,99, pagamento único pelo prompt.
- Contas, assinaturas e integrações externas são separadas. Não há promessa de renda ou vendas.
- Esta etapa implementa a estrutura da página. Checkout e publicação serão configurados posteriormente.

## Configuração

Edite `src/data/office-offer.ts` para trocar nome, preço, checkout e vídeos. Quando `checkoutUrl` estiver preenchido, o botão da oferta passa a abrir o pagamento, preservando os parâmetros da campanha. Sem URL, o acesso é apresentado honestamente como em breve.

Os vídeos enviados estão disponíveis em `public/videos/apresentacao.mp4` e `public/videos/mineracao.mp4`. Os originais enviados na raiz são preservados. Os arquivos são a mesma mídia, reaproveitada por referência no Git, sem reenviar os vídeos. Apenas o vídeo escolhido carrega e toca, com som e controles nativos.

## Desenvolvimento

`bun install --frozen-lockfile`

`npm run dev`

`npm run build`

`npx tsc --noEmit`

Stack: React, TanStack Start e Tailwind. Não adicionar plugins de framework duplicados no Vite. Fontes locais Manrope e Sora, com licenças OFL em public/fonts. Imagens ilustrativas em WebP geradas para este projeto.

## Lovable

Projeto: https://lovable.dev/projects/5b072c83-f037-4993-8304-9d78aa27e5d1

As alterações são feitas diretamente no código e no GitHub; nenhum pedido ao agente do Lovable é necessário. Não reescrever o histórico publicado.
