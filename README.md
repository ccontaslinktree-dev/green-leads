# Escritório IA

Página de apresentação em português do Brasil para um prompt de organização de agentes de IA para infoprodutos.

## Oferta

- Produto: prompt Escritório IA, para usar no Claude.
- Preço: R$ 9,99, pagamento único pelo prompt.
- Lote definido pelo responsável: 50 acessos. A página não simula vendas nem disponibilidade restante.
- Contas, assinaturas e integrações externas são separadas. Não há promessa de renda ou vendas.
- Esta etapa implementa a estrutura da página. Checkout e publicação serão configurados posteriormente.

## Configuração

Edite `src/data/office-offer.ts` para trocar nome, preço, checkout e vídeos. Quando `checkoutUrl` estiver preenchido, o botão da oferta passa a abrir o pagamento, preservando os parâmetros da campanha. Sem URL, o acesso é apresentado honestamente como em breve.

Os vídeos enviados estão disponíveis em `public/videos/apresentacao.mp4` e `public/videos/mineracao.mp4`. Os originais enviados na raiz são preservados. Os arquivos são a mesma mídia, reaproveitada por referência no Git, sem reenviar os vídeos. Apenas o vídeo escolhido carrega após o clique. O player abre em um diálogo de tela inteira, com som, sem controles nativos, com progresso real e saída acessível por botão e Escape. Há fallback de reprodução e detecção de espera de 8 segundos.

## Desenvolvimento

`bun install --frozen-lockfile`

`npm run dev`

`npm run build`

`npx tsc --noEmit`

Stack: React, TanStack Start e Tailwind. Não adicionar plugins de framework duplicados no Vite. Fontes locais Manrope e Sora, com licenças OFL em public/fonts. Imagens ilustrativas em WebP geradas para este projeto.

## Lovable

Projeto: https://lovable.dev/projects/5b072c83-f037-4993-8304-9d78aa27e5d1

As alterações são feitas diretamente no código e no GitHub; nenhum pedido ao agente do Lovable é necessário. Não reescrever o histórico publicado.

## Rastreamento

Pixel público: `1418598996441763`. PageView uma vez por carregamento, ViewContent ao chegar à oferta, ClickParaOferta nos links internos e VSL_Play/25/50/75/Complete por vídeo. InitiateCheckout é disparado somente se houver um checkout configurado e a pessoa clicar nele. Não há evento Purchase na landing page.

O navegador e a API usam o mesmo `event_id` para deduplicação. O endpoint `/api/meta-events` valida origem, tamanho, tipos e eventos permitidos; aplica limite por IP e não aceita email/telefone nem encaminha a query string. Nenhum token é retornado ao visitante.

O Cloud foi habilitado. O token é provisionado separadamente no Supabase Vault como `office_ia_meta_access_token`. A migração concede acesso somente ao serviço do servidor, nunca aos papéis `anon`/`authenticated`.

Para o relay usar o Vault, o runtime precisa de `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` ou `SUPABASE_SECRET_KEY`. Alternativamente, configure `META_CAPI_ACCESS_TOKEN` diretamente nos segredos do servidor do Lovable. Nunca use o prefixo `VITE_` para uma credencial. Sem esse vínculo no runtime, o endpoint responde `server_configuration_pending` e o Pixel continua funcionando. Ativar Cloud ou gravar o segredo no Vault não prova que a API já está conectada; verificar a resposta do endpoint no ambiente hospedado.

## Validação

`node --experimental-strip-types --test tests/meta-events.test.ts`

O teste usa fetch simulado, sem gerar conversões reais. As verificações de navegador cobrem 320, 390, 768 e 1440 px, nenhum download de MP4 no carregamento inicial, tabs/teclado, FAQ, rolagem e o player dedicado. O áudio não é verificável no host de testes sem saída de som; os arquivos originais mantêm AAC.
