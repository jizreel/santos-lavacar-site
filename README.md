# Santos Lavação — mock navegável, SEO local e acompanhamento

Abra **`index.html`** no navegador para avaliar o site. Mantenha a pasta `assets` e os arquivos `styles.css`, `config.js` e `app.js` ao lado do HTML. Não é preciso instalar dependências para navegar no mock.

**Status:** mock publicado para avaliação em GitHub Pages (`https://jizreel.github.io/santos-lavacar-site/`). Permanece com `noindex`, sitemap sem URLs de produção e Google Analytics desativado. Não é site operacional: sem pagamento, login ou reserva efetiva.

## O contexto aplicado ao site

A referência mais recente é a **identidade aprovada em 06/10/2026**, não a proposta inicial de branding. O site reutiliza o **escudo 03b com base geométrica**, com uma composição tipográfica de trabalho. Não usa o conceito 03 original como marca principal.

A paleta segue azul-marinho `#0B1F33`, ciano `#00B8D9`, grafite `#1F2933`, branco espuma `#F5F7FA` e âmbar `#FFC857`. O ciano conduz a ação com texto escuro para preservar contraste. O âmbar destaca informação de agenda e avisos, sem dominar a identidade. A tipografia Manrope é distribuída localmente com sua licença SIL Open Font License em `assets/Manrope-OFL.txt`.

O posicionamento escolhido para o layout é **profissional, próximo e transparente**. Em vez de depoimentos, estrelas ou superlativos sem comprovação, o site explica a oferta, mostra as condições de agenda e facilita uma conversa objetiva. “Cuidado que você vê, confiança que permanece” está na página inicial, na faixa **O que priorizamos**, entre os veículos atendidos e os serviços.

**Informações confirmadas nos materiais revisados:** Santos Lavação; Rua Guilherme, nº 1533, Costa e Silva, CEP 89218-500, Joinville/SC; acesso pelos fundos da Auto Peças Mecânica e Borracharia Peçaville; atendimento a motos, carros, SUVs e camionetes; serviços descritos no projeto; WhatsApp **(47) 9 8885-4331**, registrado como confirmado no plano de posts.

**Informações não confirmadas:** perfis oficiais do Instagram/TikTok/Facebook, pin de Perfil da Empresa no Google, horários, preços, prazos, depoimentos e fotos autorizadas. Esses dados não foram inventados. Documentos particulares, contratos, comprovantes e informações de Pix não foram copiados para o site.

A Peçaville é apresentada exclusivamente como **referência de localização**, não como parceria comercial formal.

## O que funciona no mock

- Navegação por seções e menu próprio para celular.
- Catálogo com filtros: lavação/cuidado extra, sob agenda, sob análise e todos.
- **12 serviços**, além de um módulo de orientação: parcial interna, parcial externa, completa, completa com cera, limpeza técnica de motor, higienização interna, lavação inferior, polimento automotivo, polimento de faróis, cristalização de vidros, vitrificação de couro e revitalização de plásticos.
- Comparador de antes/depois com controle arrastável, teclado e botões Antes/Dividido/Depois.
- Perguntas frequentes expansíveis.
- Botões de WhatsApp com mensagens contextualizadas por serviço.
- Formulário que prepara modelo + serviço e abre o WhatsApp. **Não armazena dados e não confirma agendamento.**
- Seção de redes sociais: os links reais são gerados a partir da configuração. Sem perfil informado, o botão abre um aviso de pendência, não uma conta fictícia.
- Maps: com o endereço confirmado, **Como chegar** abre o trajeto e a seção mostra o mapa desse endereço. A Peçaville permanece como referência de acesso. Sem pin de Perfil da Empresa, o mapa não é apresentado como ficha verificada do Google.
- Preferências de estatísticas, página de privacidade e página 404.

As duas imagens do comparador foram geradas em um par ilustrativo e separadas em arquivos. **Não são trabalhos reais da Santos Lavação.** A foto de destaque também é conceitual e não representa a instalação do negócio. As notas permanecem visíveis. Para um portfólio real, usar fotos autorizadas, do mesmo veículo, com ângulo, distância e iluminação consistentes, sem placas ou rostos identificáveis sem autorização.

## Arquivos e edição

- `index.html`: página completa já gerada; contém o conteúdo mesmo sem JavaScript.
- `styles.css`: design, cores e regras responsivas.
- `app.js`: menu, filtros, comparador, WhatsApp e consentimento.
- `site.config.json`: contatos, perfis, endereço, domínio, Analytics e modo de publicação.
- `config.js`: configuração pública para o navegador, gerada pelo script.
- `scripts/index.template.html`: fonte editável do HTML. **Edite este arquivo para mudanças duráveis no texto**; o script sobrescreve `index.html`.
- `scripts/configurar.mjs`: gera HTML, dados estruturados, links, robots e sitemap. Usa apenas módulos nativos do Node.
- `assets/`: imagens WebP, logo, ícones, fonte licenciada e imagem de compartilhamento.
- `privacidade.html`, `404.html`, `robots.txt`, `sitemap.xml` e `.nojekyll`.

Depois de alterar `site.config.json` ou o template, execute na pasta do site:

```powershell
node scripts/configurar.mjs
```

Para testar por HTTP, opcionalmente:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Acesse `http://127.0.0.1:8765/`. Não é necessário backend, banco de dados ou framework. Não coloque segredos, tokens de API ou documentos pessoais em nenhum arquivo do site ou repositório público.

## Conectar os canais reais

Em `site.config.json`, preencha `social.instagram`, `social.tiktok` e, se existir, `social.facebook` com URLs HTTPS dos perfis oficiais. Não coloque links de busca nem contas inferidas pelo nome. Preencha `mapsUrl` com o link correto do estabelecimento. Execute o gerador novamente.

O número de WhatsApp já está preenchido como `5547988854331`. Confirme se continua sendo o contato operacional antes da publicação. Os links `wa.me` funcionam em desktop e celular conforme a disponibilidade do WhatsApp no dispositivo; abrir o link não envia a mensagem automaticamente.

## GitHub Pages: compatibilidade técnica e ressalva de uso

O pacote contém HTML, CSS, JavaScript e assets estáticos, com caminhos relativos. Isso permite servir o site tanto na raiz de um domínio quanto em um caminho de projeto, como o formato `https://USUARIO.github.io/REPOSITORIO/` — **esse formato é apenas um exemplo, não um domínio atribuído à Santos Lavação**.[1]

**Importante:** a documentação do GitHub Pages restringe seu uso como hospedagem gratuita para negócios online, comércio eletrônico e sites primordialmente voltados a facilitar transações comerciais.[2] Este material é um mock institucional sem pagamento, login ou reserva efetiva; isso **não permite garantir** que seu futuro uso comercial esteja de acordo com os termos. Revise as condições antes do uso operacional. Para um site de aquisição comercial, a recomendação é avaliar uma hospedagem apropriada, como Cloudflare Pages, Netlify ou outro provedor, após conferir os termos do plano escolhido. O mesmo código pode ser hospedado nesses serviços, sem reconstrução.

Demonstração configurada neste repositório:

1. Repositório exclusivo: `jizreel/santos-lavacar-site` (somente o código do site).
2. `siteUrl` aponta para `https://jizreel.github.io/santos-lavacar-site/` com `mode: "mock"`.
3. Deploy via GitHub Actions (`.github/workflows/pages.yml`): gera o site, publica o artefato estático e ativa Pages com `build_type: workflow`.
4. O arquivo `.nojekyll` evita o processamento pelo Jekyll.
5. Após cada push em `main`, confira a URL, HTTPS, imagens, fonte, WhatsApp, navegação mobile e página 404.

### Passagem de mock para site operacional

Preencha o domínio real em `siteUrl`, incluindo o caminho do projeto quando houver e a barra final. Confirme endereço completo e CEP, link exato do Maps, ao menos um perfil social e horários. Atualize os textos que ainda dizem “mock”, especialmente a FAQ de imagens e a política de privacidade. Substitua o antes/depois por um portfólio real autorizado e atualize a legenda e os textos alternativos. A imagem social em `assets/social-card.png` é uma **proposta**; substitua por uma versão aprovada para uso operacional.

O script exige as confirmações `publication.contentApproved`, `hostingTermsReviewed`, `privacyReviewed` e `realPortfolioConfirmed`, além dos dados essenciais. Mude-as para `true` **somente depois de resolver de fato cada item**, e então use `mode: "production"`. As confirmações são travas técnicas de completude, não certificações jurídicas nem autorizações dadas por terceiros.

Sem esse preenchimento, o gerador recusa produção. Em produção, ele emite `index,follow`, canonical, URLs absolutas de compartilhamento e sitemap com a página inicial. A política de privacidade e a página 404 permanecem com `noindex` e fora do sitemap. Não basta trocar o modo para validar informações ou garantir indexação.

## SEO implementado e como concluir

O **HTML inicial** contém título, descrição, H1, H2, texto local, serviços, FAQ e links. Não depende de uma aplicação vazia que só ganha conteúdo depois do JavaScript. O template tem Open Graph, idioma `pt-BR`, Twitter Card, favicon e cor da marca.

O gerador adiciona canonical, `og:url`, `og:image` e `twitter:image` somente quando uma URL pública real foi configurada. A imagem social de 1200 × 630 está incluída. Nenhum domínio, usuário de GitHub ou URL canônica foi adivinhado.

O JSON-LD usa o subtipo **`CarWash`** de negócio local, nome, telefone, região e localização informada. Não inclui preço, avaliações, estrelas, horários ou coordenadas inventados. Endereço completo, `sameAs`, Maps e horário estruturado são acrescentados conforme dados reais. A versão com endereço parcial não deve ser anunciada como elegível a todos os recursos de resultados locais do Google. Dados estruturados ajudam a interpretar conteúdo; **não garantem posições nem rich results**.[3]

Depois da publicação operacional:

1. Cadastre a URL final no **Google Search Console**. Em endereço GitHub de projeto, use propriedade de **prefixo de URL** que inclua o caminho exato; em domínio próprio, escolha o método adequado e faça a verificação necessária.
2. Se usar verificação por meta tag, coloque o valor fornecido pelo Google em `googleSiteVerification` e regenere. O token é público por natureza; não inclua credenciais de conta.
3. Envie `sitemap.xml`, inspecione a página inicial e confira o HTML recebido sem executar JavaScript.
4. Valide o JSON-LD no Rich Results Test e o compartilhamento social com a URL pública, inclusive a resposta HTTP da imagem.
5. Confira título, descrição, canonical, robots e sitemap depois de qualquer mudança de domínio. Não use canonical para apontar a uma URL diferente do site final.
6. Revise o comportamento real da página 404 na hospedagem; um HTML de “não encontrado” servido com 200 é um soft-404.

**Atenção aos sites de projeto em `github.io`:** o protocolo de robots procura `/robots.txt` na raiz do host, não em `/REPOSITORIO/robots.txt`.[5] O arquivo dentro do projeto não controla todo `github.io`. O mock permite rastreamento para que a diretiva `noindex` do HTML possa ser lida, mas não anuncia sitemap de produção. Não bloqueie o rastreamento se depender da leitura dessa meta tag. Para controle próprio da raiz, um domínio próprio ou site de organização é mais adequado. `robots.txt` e `noindex` não tornam o site privado; use uma hospedagem com controle de acesso se houver material reservado.

## Acompanhamento: preparação, não conta configurada

O código suporta **Google Analytics 4**, mas não foi criada ou acessada uma conta, não há ID fictício e não há tag ativa no mock. Para ativar, configure a propriedade/fluxo web, obtenha o ID real `G-...`, preencha `analytics.measurementId` e `analytics.enabled: true`, em modo de produção.

**Antes de ativar:** revise a política de privacidade; identifique o responsável, finalidade, retenção e fornecedores; configure no GA4 a medição desejada e **desative medição aprimorada automática de formulários e cliques externos**, pois o site usa eventos próprios e links com mensagens. Não envie dados pessoais em UTMs, URLs ou nomes de campanha. Revise as opções de coleta e publicidade na conta: o código não substitui as configurações do provedor.

O consentimento segue a direção do **modo básico**: nenhuma tag de Analytics é carregada antes de autorização, e a recusa não envia pings de Analytics.[4] As escolhas têm o mesmo nível de acesso visual. A preferência é lembrada por até 180 dias. Ao retirar um consentimento já concedido, o código bloqueia eventos, remove cookies `_ga` acessíveis ao site e recarrega a página para encerrar o script carregado. Isso não apaga dados já tratados no provedor; pedidos de eliminação exigem o procedimento apropriado.

Eventos preparados:

- `page_view`: visualização, somente após consentimento.
- `click_whatsapp`: intenção de contato, com posição do botão e serviço quando aplicável.
- `click_social`: canal e posição.
- `click_maps`: intenção de consultar localização.
- `filter_services`: grupo de serviço.
- `compare_before_after`: interação com o comparador, identificado como demonstração nesta versão.

**Clique não é agendamento, venda nem conversa concluída.** Não usar `generate_lead`, `purchase` ou métricas de reservas confirmadas para simples abertura de WhatsApp. O formulário não envia o modelo ou o texto da mensagem ao Analytics pelo código implementado.

Sugestões de UTMs, sem representar campanhas existentes: `utm_source=instagram&utm_medium=social&utm_campaign=perfil`, `utm_source=google&utm_medium=organic&utm_campaign=perfil_empresa`, e `utm_source=placa&utm_medium=offline&utm_campaign=acesso`. O código aceita apenas `utm_source`, `utm_medium` e `utm_campaign` com rótulos simples na URL enviada pelos eventos próprios. Padronize nomes e nunca use nome/telefone do cliente.

Acompanhe semanalmente cliques por canal e serviço, impressões/cliques de busca no Search Console e, no atendimento, a origem declarada, orçamentos e agendamentos **realmente confirmados**. Um registro operacional autorizado complementa as métricas do site; não confunda os dois.

## Visibilidade local e retenção — sugestões a validar

O site deve trabalhar junto do **Perfil da Empresa no Google**, se existente ou após sua configuração correta: nome consistente, categoria correspondente, telefone, endereço real, horário atualizado e fotos do acesso pelos fundos da Peçaville. Não criar locais duplicados nem afirmar parceria formal inexistente.

Conectar a URL final ao perfil de Google, à bio das redes e aos materiais físicos. Publicar antes/depois real com autorização e legendas que expliquem serviço e limitações. Pedir avaliações honestas depois do atendimento, sem fabricar depoimentos nem comprar prova social.

Para retenção, uma sugestão é registrar veículo, serviço e data no atendimento, com consentimento apropriado para contatos futuros, e testar lembretes ou indicação com regras e margem definidas. **Não há programa de fidelidade, desconto, campanha ou evento anunciado como existente neste site.**

## Checklist antes da publicação operacional

- [ ] Aprovar layout, textos e composição tipográfica da marca.
- [ ] Confirmar contato, perfis oficiais, endereço/CEP, acesso e horários.
- [ ] Substituir demonstrações por fotos reais autorizadas e revisar legendas/FAQ.
- [ ] Aprovar a arte de compartilhamento e atualizar notas de proposta.
- [ ] Revisar termos da hospedagem escolhida para o uso comercial pretendido.
- [ ] Finalizar a política de privacidade e as configurações do GA4, se utilizado.
- [ ] Preencher URL pública real, gerar arquivos em produção e conferir metadados.
- [ ] Conferir links em celular, fotos, fonte, contraste, teclado e página 404 publicada.
- [ ] Validar Search Console, sitemap, JSON-LD e imagem social na URL pública.
- [ ] Registrar agendamentos e vendas reais separadamente dos cliques do site.

## Validação realizada

O mock foi testado diretamente pelos arquivos locais em Chrome automatizado nas larguras **1440, 1024, 820, 768, 560, 390 e 360 pixels**, sem rolagem horizontal indevida, erros JavaScript ou requisições externas. Foram verificados filtros, menu mobile, FAQ, aviso de rede pendente, comparador por botões e teclado, preparação de mensagem pelo formulário e leitura do conteúdo sem JavaScript.

O consentimento foi testado com uma tag totalmente simulada: bloqueio inicial, recusa, autorização, retirada e ausência do modelo do veículo no payload dos eventos próprios. A geração de canonical, OG, robots, sitemap, caminho de projeto e link da 404 foi testada em uma cópia privada, com dados explicitamente fictícios, sem publicação. O pacote entregue continua em modo mock.

A prévia HTTP local não respondeu neste ambiente; a validação funcional e visual foi concluída via arquivos. **Resposta HTTP pública, indexação real, permissões de contas sociais e envio ao GA4 ainda dependem da hospedagem e das contas reais.** Não foram apresentados como validados.

## Referências

[1]: https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages "O que é GitHub Pages"
[2]: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits "Limites e usos restringidos do GitHub Pages"
[3]: https://developers.google.com/search/docs/appearance/structured-data/local-business "Dados estruturados de negócios locais — Google Search Central"
[4]: https://developers.google.com/tag-platform/security/concepts/consent-mode "Modo de consentimento — Google Tag Platform"
[5]: https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt "Criar e publicar robots.txt — Google Search Central"
