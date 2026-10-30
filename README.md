# DAVI AYRES — Portfólio com Supabase

Site: https://daviayressouza.github.io/portfolio/

Portfólio pessoal estático, com cinco fotos, animações, projetos demonstrativos e painel online. A frase principal é **Mais do que conteúdo, crio conexões**. O rodapé apresenta a participação de Davi na Bow Studio.

## O que já está configurado

- GitHub Pages publica a branch `main`, pasta raiz.
- Supabase guarda os projetos no banco e as mídias em um bucket privado.
- Apenas a conta confirmada de `davi.ayressouza@gmail.com` está autorizada a editar.
- Visitantes leem somente trabalhos publicados.
- WhatsApp: +55 (19) 99926-0429. E-mail: davi.ayressouza@gmail.com.

Não é necessário ativar o banco novamente. A migração `database/portfolio_setup.sql` já foi aplicada no projeto `caseptwmaqtenirdsuzn`. Ela está no repositório para documentação, não deve ser executada de novo no mesmo banco. As áreas anteriores do projeto Supabase foram preservadas.

## Como adicionar seus trabalhos

1. Abra o site e clique em **Adicionar conteúdo**, no rodapé.
2. Entre com seu e-mail e a senha da conta de usuário existente no **Supabase Auth deste projeto**. Não confunda com a senha do painel administrativo do Supabase. A antiga senha local do portfólio não autoriza uploads. Nenhuma senha foi alterada nesta integração.
3. Preencha título, categoria, ano e descrição, e selecione as mídias na ordem desejada.
4. Marque **Publicar no portfólio** para exibir aos visitantes. Deixe desmarcado para salvar oculto.
5. Clique em **Salvar projeto** e aguarde a confirmação.

No painel, **Editar** altera os dados. Deixar o campo de arquivos vazio mantém as mídias atuais; selecionar novos arquivos substitui o conjunto exibido. **Ocultar** retira o trabalho da galeria, mantendo-o salvo. **Publicar** torna-o visível novamente. Não é necessário enviar os novos trabalhos ao GitHub.

Aceita JPG, PNG, WebP, MP4, WebM e PDF: até 20 arquivos por trabalho, 50 MB por arquivo e 150 MB por envio. A capacidade total depende do plano e das cotas do projeto Supabase. Arquivos substituídos são preservados no Storage; a versão atual não faz limpeza definitiva automática.

A sessão fica apenas na memória da página. Recarregar exige entrar novamente. Use **Sair da conta** ao terminar. Não compartilhe a senha. Se não lembrar a senha do usuário do aplicativo, recupere o acesso pelo seu projeto Supabase; nunca coloque a senha no código ou no GitHub.

Os seis exemplos aparecem enquanto nenhum trabalho real estiver publicado. Ao publicar o primeiro, a galeria passa a mostrar apenas seus trabalhos reais.

## Fotos e conteúdo antigo

As cinco fotos já estão em `assets/portrait-hero.webp`, `portrait-camera.webp`, `portrait-warm.webp`, `portrait-blue.webp` e `portrait-studio.webp`. Preserve nomes e maiúsculas/minúsculas: caminhos no GitHub Pages distinguem letras maiúsculas.

Se uma foto não aparecer após um commit, confira a publicação na aba **Actions**, aguarde a conclusão e atualize com **Ctrl + F5**. Não envie apenas um ZIP ao repositório: o GitHub Pages precisa dos arquivos extraídos.

Rascunhos salvos na versão anterior permanecem somente no navegador e endereço em que foram criados. Não são incluídos automaticamente neste pacote. Se você tiver o JSON exportado pela versão antiga, use **Importar rascunhos** no novo painel. A importação salva tudo online como oculto para revisão. Não importe o mesmo JSON repetidamente, pois cada importação cria novos projetos. Guarde seu JSON original como cópia de segurança.

## Proteção das mídias

O banco usa RLS para autorizar escrita no servidor. O bucket `portfolio-media` é privado; o site recebe URLs temporárias de uma hora somente para mídias publicadas ou pertencentes ao administrador conectado. Ocultar um projeto impede novas autorizações públicas; links já emitidos podem funcionar até expirarem. A página renova os links periodicamente.

O site reduz atalhos de salvar, arrastar e imprimir mídias, e oculta controles de download quando o navegador permite. **Nenhum site pode impedir totalmente a cópia de conteúdo que exibe**: capturas, gravações e arquivos recebidos pelo navegador continuam possíveis. Fotos e exemplos em `assets` fazem parte de um repositório público. Não publique originais confidenciais. Um PDF exibido também pode ser salvo pelo visitante.

A chave `sb_publishable_…` em `config.js` é pública por definição. As políticas RLS protegem os dados. Nunca coloque `service_role`, chaves secretas ou senhas nesse arquivo. Não há cadastro público no portfólio, e um usuário autenticado sem autorização na tabela de administradores não pode editar.

O diagnóstico do projeto Supabase apontou a proteção contra senhas vazadas desativada. Veja a configuração e disponibilidade em: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

## Contato

O formulário abre o WhatsApp ou o aplicativo de e-mail do visitante com a mensagem preenchida. A pessoa revisa e confirma o envio nesse aplicativo. O site não envia e-mails automaticamente nem armazena mensagens.

## Como atualizar ou republicar pelo GitHub

O repositório atual é https://github.com/DaviAyresSouza/portfolio e já tem publicação configurada.

1. Extraia o ZIP e preserve a estrutura de pastas.
2. Use **Add file → Upload files** para enviar os arquivos e as pastas `assets` e `vendor`. `index.html` deve ficar na raiz do repositório.
3. Confirme o commit na branch `main`.
4. Em **Settings → Pages**, mantenha **Deploy from a branch → main → /(root)**.
5. Aguarde a execução da aba **Actions** terminar e abra o site.

Não precisa instalar Node nem executar build para publicar: as dependências do navegador já estão em `vendor`. Para textos, edite `index.html`; para o visual, `style.css`; para contatos e configuração pública, `config.js`.

## Desenvolvimento e verificações

- `npm ci`: instala a versão fixada do SDK.
- `npm run vendor`: atualiza a cópia local do SDK e sua licença.
- `npm test`: testa validação, autorização antes do upload e reversão de uploads incompletos com um cliente simulado.
- `tests/rls.sql`: verifica políticas no banco dentro de uma transação revertida. É específico para este projeto e não deve ser executado casualmente em outro ambiente.

Foram verificadas leitura pública, regras de acesso do banco, carregamento das fotos e testes automatizados. O fluxo completo com a senha real do proprietário precisa ser validado pelo próprio usuário; a senha não foi acessada nem modificada.

## Arquivos

| Arquivo | Função |
| --- | --- |
| `index.html`, `style.css` | Estrutura e visual |
| `app.js` | Animações, galeria e interface do painel |
| `cloud-data.js` | Auth, consultas e uploads |
| `config.js` | Contatos e configuração pública do Supabase |
| `contact.js`, `media-guard.js` | Canais de contato e redução de atalhos de mídia |
| `assets/` | Fotos, fontes, logotipos e exemplos |
| `vendor/` | Bibliotecas locais e licenças |
| `database/` | Migração já aplicada |
| `tests/` | Testes do cliente e das políticas |

O símbolo 3D usa uma alternativa visual quando WebGL não está disponível. Bibliotecas, fontes e elementos da Bow mantêm seus respectivos direitos.
