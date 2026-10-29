# DAVI AYRES — Portfólio completo para GitHub Pages

Esta pasta contém o site completo e editável: HTML, CSS, JavaScript, cinco fotos otimizadas, fontes locais, logotipos, bibliotecas de animação e vídeo demonstrativo em MP4 e WebM. Não precisa instalar Node, executar build ou usar o ChatGPT para abrir o site publicado no GitHub Pages.

A frase foi alterada para: **Mais do que conteúdo, crio conexões**.
O contato agora oferece WhatsApp e e-mail em vez de baixar o briefing.

## Contato configurado

- WhatsApp: +55 (19) 99926-0429 — destino `5519999260429`.
- E-mail: davi.ayressouza@gmail.com.
- Ambos já estão ativos em `config.js`.

O visitante preenche o formulário e escolhe o canal. O WhatsApp abre uma conversa para o número configurado com a mensagem preenchida. O e-mail abre o aplicativo de e-mail do visitante com destinatário, assunto e mensagem. O visitante revisa e confirma o envio no aplicativo escolhido. O site não afirma que a mensagem já foi enviada.

O e-mail usa `mailto:`: depende de um aplicativo ou serviço de e-mail configurado no dispositivo. Não existe servidor de envio automático nesta versão. Não coloque senhas, tokens nem chaves de API no `config.js`.

## Publicar pelo navegador — passo a passo

### 1. Extraia o ZIP

No Windows, clique com o botão direito no ZIP e escolha **Extrair Tudo**. Abra a pasta extraída. Você deve ver o arquivo `index.html` junto de `style.css`, `app.js`, `config.js` e das pastas `assets` e `vendor`.

### 2. Crie um repositório

1. Entre em sua conta no GitHub.
2. Clique em **+ → New repository**.
3. Use um nome como **davi-ayres-portfolio**.
4. Para usar GitHub Pages no plano gratuito, selecione **Public**.
5. Pode deixar a criação automática de README desmarcada: este pacote já tem um.
6. Clique em **Create repository**.

### 3. Envie os arquivos extraídos

1. No repositório vazio, clique em **uploading an existing file**. Se já houver arquivos, use **Add file → Upload files**.
2. Arraste **o conteúdo da pasta extraída** para a área de envio: arquivos e pastas, preservando a estrutura.
3. Inclua `assets`, `vendor` e `.nojekyll` quando visível.
4. Não envie apenas o ZIP. O GitHub Pages não extrai o ZIP para montar o site.
5. Não envie uma pasta externa contendo tudo: `index.html` precisa ficar na primeira página do repositório, na raiz.
6. Na mensagem de commit, escreva **Adicionar portfólio Davi Ayres** e clique em **Commit changes**.

Todos os arquivos deste pacote são menores que o limite de 25 MiB por arquivo do upload pelo navegador. Se futuramente adicionar vídeos maiores, use Git/GitHub Desktop ou hospede os vídeos separadamente, respeitando os limites do serviço.

### 4. Ative o GitHub Pages

1. No repositório, abra **Settings**.
2. Na barra lateral, clique em **Pages**.
3. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
4. Em **Branch**, escolha **main** (ou a branch em que você enviou os arquivos).
5. Ao lado, escolha **/(root)**.
6. Clique em **Save**.
7. Aguarde a publicação. Em **Settings → Pages**, use **Visit site** para abrir o endereço correto.

O formato usual do endereço de um repositório de projeto é `https://SEU-USUARIO.github.io/davi-ayres-portfolio/`. Copie o endereço exibido pelo GitHub, pois o nome do usuário e do repositório definem a URL. Não é preciso comprar domínio. O site no GitHub Pages terá o acesso definido pelo GitHub e não terá a tela de login do ChatGPT.

### 5. Teste a versão publicada

- Abra a página no computador e no celular.
- Confira as fotos, fontes, filtros, carrosséis e o vídeo demonstrativo.
- Em **Vamos conversar**, preencha o formulário e confira se o WhatsApp abre o número correto.
- Confira o destinatário no aplicativo de e-mail.
- Se os botões estiverem desativados, revise os valores de `config.js` e confira se o arquivo atualizado foi publicado.

## Atualizar depois

Para alterar textos, edite `index.html`. Para aparência, edite `style.css`. Para contatos, edite `config.js`. Para trocar os projetos demonstrativos, edite a coleção `demoProjects` em `app.js` e acrescente as mídias em `assets`.

Faça um novo commit com os arquivos alterados. O GitHub Pages publicará a atualização a partir da mesma branch. Se não aparecer, confira a aba **Actions** e atualize a página com **Ctrl + F5**.

Os caminhos são relativos; o site pode funcionar na raiz de um domínio ou em uma pasta de repositório, sem mudar todos os links.

## Painel “Adicionar conteúdo”

Ao clicar em **Adicionar conteúdo**, aparece um painel de senha. Use a senha solicitada nesta conversa (não incluída em texto no pacote). Senha incorreta não abre o organizador. **Bloquear painel** encerra o acesso e oculta os rascunhos. Recarregar a página também bloqueia. A senha é verificada por PBKDF2 no navegador.

**Limite essencial:** isso é uma trava de interface local, não autenticação segura. Código executado no navegador pode ser alterado ou contornado. O GitHub Pages não executa servidor para proteger um painel com senha. O acesso à sua conta/repositório GitHub é o que controla as alterações públicas. Não conceda permissão de escrita a terceiros. Para uploads publicados diretamente pelo painel, será necessário integrar um backend/CMS com autenticação e regras de acesso no servidor.

Esse recurso salva rascunhos **somente no navegador**, em IndexedDB. Não envia seus projetos para o GitHub nem muda a galeria para outras pessoas. Use **Exportar rascunhos** para guardar um JSON com as mídias e enviar a curadoria quando for incorporar os trabalhos ao código.

Se você já adicionou projetos no endereço anterior, exporte-os lá e importe-os no endereço do GitHub. Cada endereço possui seu próprio armazenamento do navegador. Este ZIP contém os seis projetos demonstrativos do código, não rascunhos que existam apenas no seu navegador.

## Mídias e downloads

O site bloqueia o menu de contexto e o arraste sobre imagens, vídeos e áreas de mídia. Os players usam `controlslist="nodownload"` quando o navegador oferece suporte; não há links públicos de download. A impressão oculta as mídias. O teclado, zoom, formulários e seleção de texto permanecem acessíveis.

**Não é possível impedir totalmente downloads, capturas de tela ou gravações de tela de material exibido publicamente.** Os arquivos que o navegador recebe podem ser recuperados pela rede ou URL direta. Um repositório público também permite obter esses arquivos. Não há DRM ou proteção de acesso aos arquivos neste pacote.

Não há PDFs no portfólio atual. Se publicar um PDF ou qualquer arquivo diretamente em `assets`, sua URL ficará acessível, mesmo sem botão de download. Para apresentar PDFs com menos exposição, publique prévias em imagens; para arquivos confidenciais, use armazenamento privado com autorização no servidor. O botão de exportar rascunhos continua disponível apenas no organizador desbloqueado.

## Arquivos principais

| Arquivo ou pasta | Função |
| --- | --- |
| index.html | Estrutura, textos e formulários |
| style.css | Layout responsivo e efeitos visuais |
| app.js | Galeria, filtros, animações e rascunhos locais |
| config.js | Número de WhatsApp e endereço de e-mail |
| panel-lock.js | Verificação da senha local (não substitui autenticação de servidor) |
| media-guard.js | Redução dos atalhos de salvar mídias |
| contact.js | Validação dos destinos e montagem das mensagens |
| satoshi.css | Fontes Satoshi locais |
| assets/ | Fotos, fontes, logotipos e vídeos demonstrativos |
| vendor/ | GSAP, ScrollTrigger, Three.js e geometria Bow |
| .nojekyll | Indica publicação estática, sem processamento Jekyll |

O símbolo 3D tem uma imagem alternativa para navegadores sem WebGL. Os projetos demonstrativos continuam identificados como demonstração. Arquivos de fontes e bibliotecas mantêm seus respectivos direitos e termos.

## Referências oficiais

- Criar um site: https://docs.github.com/pt/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Configurar publicação: https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Enviar arquivos: https://docs.github.com/pt/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Links de WhatsApp: https://faq.whatsapp.com/5913398998672934

Documentação consultada em 29/10/2026.
