# SIDEP-CE - Sprint 0: Blindagem Urgente (P0)

**Status: ✅ Encerrada em 08/08/2026**

Data: 08/08/2026
Responsável: Paulo Cunha (validação) + coorientação técnica assistida
Contexto: auditoria técnica completa do repositório identificou uma senha
padrão hardcoded (`AGzzcso1$`) presente em código-fonte, script operacional e
documentação versionada. Esta sprint trata só desse risco pontual, antes de
iniciar a Sprint 1 (blindagem de segurança planejada).

**Decisão de arquitetura registrada nesta sprint**: o projeto não tem ambiente
de staging — desenvolvimento local (`npm run dev`) e produção usam o mesmo
projeto Supabase real. Decisão consciente do usuário: manter banco único, com
cautela manual reforçada em vez de separar ambientes. Isso eleva o cuidado
exigido em qualquer sprint futura que toque o banco (ver Sprint 2, que já tem
4 avaliações reais aplicadas: 2 encerradas, 2 abertas).

## Escopo

Achados de origem (auditoria de 08/08/2026):
1. `DEFAULT_ACCESS_PASSWORD = "AGzzcso1$"` hardcoded no bundle do frontend
   (`app/src/App.tsx`), usada como senha do admin master no modo de login
   local (sem Supabase configurado).
2. A mesma senha, em texto claro, em `docs/runbook_ajuste_supabase_seguro.md`
   e `docs/criacao_usuarios_auth_em_lote.md`, como valor de
   `SIDEP_INITIAL_PASSWORD` — senha real usada para criar usuários no
   Supabase Auth via `app/scripts/bootstrap-auth-users.mjs`.
3. **Achado adicional durante a implementação** (não estava no escopo
   original, veio da investigação do item 1): o próprio script
   `bootstrap-auth-users.mjs` tinha essa mesma senha como **fallback
   automático no código** (`process.env.SIDEP_INITIAL_PASSWORD ?? "AGzzcso1$"`)
   — se a variável de ambiente não fosse definida, o script criava contas
   reais com essa senha conhecida, silenciosamente.
4. Migrations do piloto (`policies_mvp_piloto`,
   `storage_imagens_questoes` original, `professor_vinculo_multi_escola`
   original) com policies `to anon using(true)` soltas na pasta principal do
   banco, sob risco de reexecução acidental.
5. URL real do projeto Supabase (`qmfrxrvsoiwsfbjlwkfa.supabase.co`) em texto
   claro em `docs/runbook_ajuste_supabase_seguro.md`.

## O que foi feito nesta sprint (código e documentação, sem tocar produção)

- **`app/src/App.tsx`**: removida a constante `DEFAULT_ACCESS_PASSWORD`. A
  senha do admin master no modo local agora vem de
  `VITE_LOCAL_MASTER_PASSWORD` (variável de ambiente opcional, só para
  `.env.local`, nunca commitada). Sem essa variável definida — e sem uma
  senha já customizada salva no navegador via "alterar senha no primeiro
  login" — o login local do master fica desabilitado (não há mais senha
  padrão conhecida). Login institucional via Supabase Auth (o caminho
  realmente usado em produção) não foi alterado.
- **`app/.env.example`**: documentada a nova variável
  `VITE_LOCAL_MASTER_PASSWORD`, com aviso explícito de nunca configurá-la no
  Vercel/produção.
- **`app/scripts/bootstrap-auth-users.mjs`**: removido o fallback hardcoded
  da senha inicial. Agora, rodar o script com `--execute` sem
  `SIDEP_INITIAL_PASSWORD` definida falha imediatamente com mensagem clara,
  em vez de criar contas reais com senha conhecida.
- **`docs/runbook_ajuste_supabase_seguro.md`** e
  **`docs/criacao_usuarios_auth_em_lote.md`**: removidos a senha e a URL real
  do Supabase em texto claro; substituídos por placeholders com instrução
  explícita de nunca reutilizar a mesma senha entre execuções e nunca
  commitar o valor real.
- **`database/`**: os 3 arquivos de migration do piloto com `anon
  using(true)` foram movidos para `database/historico-nao-executar/`, com um
  aviso `NAO EXECUTAR EM PRODUCAO` inserido no topo de cada arquivo,
  explicando o risco e apontando para a versão segura equivalente.
  `database/README.md` atualizado para refletir o novo caminho.

## Itens que dependiam de ação direta do usuário em produção

Estes itens exigiam o usuário executar no painel do Supabase (fora do
alcance de execução direta desta sessão):

1. **Trocar a senha real do usuário administrador master no Supabase Auth**
   (painel Supabase > Authentication > Users), já que o valor antigo esteve
   exposto no repositório. **Confirmado feito pelo usuário em 08/08/2026.**
2. **Verificar usuários com `alterar_senha_primeiro_login = true`** —
   consulta somente leitura deixada disponível para checagem futura caso
   surjam dúvidas sobre alguma conta específica:
   ```sql
   select nome, email, perfil, alterar_senha_primeiro_login
   from sidep_usuario_perfil
   where alterar_senha_primeiro_login = true
   order by perfil, nome;
   ```
   **Sprint encerrada sem execução formal desta consulta** — decisão do
   usuário em 08/08/2026 ao fechar a sprint. Não é um risco crítico
   remanescente por si só (a senha exposta já foi trocada no master e as
   senhas legadas de escola/professor já foram limpas no item 3), mas fica
   registrado aqui para retomar se necessário.
3. **Rodar a limpeza de `senha_inicial_hash` legada.** Usuário confirmou em
   08/08/2026 que todos os professores/gestões escolares ativos já acessam
   via Supabase Auth — pré-condição para essa limpeza ser segura. Preparado
   nesta sprint (não executado, pois não há acesso direto ao banco de
   produção a partir daqui):
   - `database/backup_2026_08_08_senhas_legadas_pre_cleanup.sql` — rodar
     PRIMEIRO no SQL Editor do Supabase (só leitura + cria tabelas de
     backup, não apaga nada).
   - `database/cleanup_2026_07_14_senhas_legadas_pos_auth.sql` — rodar
     DEPOIS de confirmar o backup.
   Nenhum dos dois toca `avaliacao_mvp`/`resposta_avaliacao`/`questao_mvp`.
   **Backup executado em 08/08/2026**: 0 escolas e 2 professores com
   `senha_inicial_hash` legada, copiados para
   `backup_20260808_professor_senha_legada` antes da limpeza.
   **Limpeza executada em 08/08/2026**: confirmado 0 escolas e 0 professores
   com `senha_inicial_hash` restante após rodar
   `cleanup_2026_07_14_senhas_legadas_pos_auth.sql`. Item concluído.

## Observação sobre backups locais

Os snapshots em `backups/pre-multicurso-20260709-093151/` e
`backups/pre-vinculos-avaliacao-impressa-20260711-103140/` ainda contêm a
senha antiga em `src/App.tsx` congelada no ponto no tempo do backup. Não
foram alterados propositalmente — são cópias históricas locais, nunca
versionadas no GitHub (pasta `backups/` está fora do controle de versão).
Se quiser, posso limpá-los também, mas isso reescreveria um backup histórico
- avise se prefere isso.

## Critérios de aceite

- [x] Nenhuma senha padrão fixa em código-fonte versionado.
- [x] Nenhuma senha/URL real em texto claro em documentação versionada.
- [x] Script de bootstrap falha explicitamente em vez de usar senha padrão
      silenciosa.
- [x] Migrations permissivas do piloto isoladas e sinalizadas.
- [x] Senha real do admin master trocada no Supabase Auth (confirmado pelo
      usuário em 08/08/2026).
- [~] Usuários com `alterar_senha_primeiro_login = true` — consulta de
      verificação disponível, mas não executada; sprint encerrada mesmo
      assim por decisão do usuário (risco residual baixo, ver seção acima).
- [x] Limpeza de `senha_inicial_hash` legada executada e confirmada
      (0 escolas, 0 professores em 08/08/2026).

## Próxima sprint recomendada

Sprint 1 — Blindagem de Segurança (fechamento das pendências de RLS
identificadas na auditoria de 08/08/2026): escopo de escrita em
`questao_mvp`/`descritor_mvp`/`competencia_mvp` por autoria/escola,
`WITH CHECK` de `professor_vinculo`/`avaliacao_mvp`/`resposta_avaliacao`,
tela administrativa de usuários, auditoria de ações críticas, policy de
Storage por status da questão.

---

# Sprint 1 — Blindagem de Segurança (RLS), parte 1: WITH CHECK

**Status: ✅ Parte 1 concluída em 08/08/2026** (demais itens da Sprint 1 —
tela de usuários, auditoria, Storage — seguem pendentes, ver seção final)

## Decisão de escopo registrada

Perguntado se o banco de itens (`competencia_mvp`/`descritor_mvp`/`questao_mvp`)
deveria ser restrito por curso/escola do professor, o usuário confirmou em
08/08/2026 que é **proposital** ser um banco compartilhado entre todos os
professores (curadoria em equipe via fluxo rascunho/em_revisão/validada).
Nenhuma mudança feita aqui — documentado como regra de negócio, não como
pendência de segurança.

## O que foi corrigido

Dois gaps reais onde `WITH CHECK` (regra de escrita) era mais fraco que
`USING` (regra de leitura), permitindo em teoria escrita fora do escopo
institucional do usuário:

1. **`professor_vinculo`**: escrita validava só o papel do usuário, não a
   escola/regional do vínculo. Corrigido: gestão escolar só vincula
   professor à própria escola; CREDE/SEFOR só dentro da própria regional.
2. **`avaliacao_mvp`, `avaliacao_codigo_bloqueado`, `resposta_avaliacao`**:
   escrita de professor liberada só por bater a matrícula, sem checar se a
   `escola_inep` gravada era uma escola onde ele tem vínculo. Corrigido:
   agora exige matrícula E vínculo com a escola.

Aplicado via `database/migration_2026_08_08_rls_scope_hardening_sprint1.sql`.
Só altera `WITH CHECK` — `USING` (leitura) não mudou, nenhum acesso de
leitura foi removido.

## Verificação de segurança antes de aplicar

Antes de rodar, verificado com
`database/diagnostico_2026_08_08_vinculo_avaliacoes_reais.sql` que as 4
avaliações reais existentes (2 abertas, 2 encerradas) já tinham vínculo
correto entre professor e escola — a migração não bloqueia nenhuma delas.
Confirmado também no código (`App.tsx:5046-5060`, `alterarStatusAvaliacao`)
que a ação "Encerrar avaliação" sempre preserva `escola_inep`/
`professor_matricula` do registro original, então continua funcionando
normalmente com a regra nova.

## Verificação pós-migração

Rodada em produção em 08/08/2026, confirmada via consulta a `pg_policies`:
as 7 policies esperadas foram recriadas corretamente em
`professor_vinculo`, `avaliacao_mvp`, `avaliacao_codigo_bloqueado` e
`resposta_avaliacao`.

---

# Sprint 1 — Blindagem de Segurança, parte 3: auditoria de avaliações

## O que foi feito

`log_auditoria` já cobria criação/sincronização de usuário (Edge Function) e
envio de resposta do aluno. Faltava abertura/encerramento e exclusão de
avaliação — adicionado em `App.tsx` (`alterarStatusAvaliacao`,
`excluirAvaliacao`), reaproveitando o helper `registrarAuditoria` já
existente (usado antes só para exportação de relatório). Alteração de
perfil de usuário já era coberta server-side pela Edge Function
`admin-create-user`, então não precisou de mudança adicional.

## Teste

`tsc -b` e `npm run build` sem erros. Ação é só um `INSERT` adicional em
`log_auditoria` (RLS já permite insert para qualquer autenticado com perfil
válido) — sem risco para o fluxo de avaliação em si.

---

# Sprint 1 — Blindagem de Segurança, parte 4: Storage de imagens por status

## Investigação

Descoberta mais séria do que o esperado: o caminho de cada imagem
(`questoes/{codigo}/...`) é prevísivel, e como o bucket era **público**
(`public = true`), a policy de leitura não bastava — buckets públicos no
Supabase servem objetos por um endpoint que **ignora RLS por completo**.
Isso significa que qualquer pessoa, sem login, podia **listar e baixar
todas as imagens do banco de itens, inclusive rascunhos nunca publicados**,
sem precisar adivinhar nome de arquivo algum.

Confirmado com o usuário em 08/08/2026: nenhuma questão tem imagem em uso
hoje — por isso foi possível implementar a correção completa (não uma
mitigação parcial) sem nenhum risco de quebrar imagem já publicada.

## O que foi implementado

- **`database/migration_2026_08_08_storage_imagens_por_status.sql`**:
  bucket passa a ser **privado**; policy de leitura para `authenticated`
  (staff, qualquer perfil institucional ativo, vê qualquer imagem
  independente do status — necessário para curadoria); policy de leitura
  para `anon` (aluno) só quando a questão correspondente tem
  `status = 'validada'`.
- **`app/src/services/itemBankRepository.ts`**: nova função
  `resolverUrlImagemQuestao()` — gera URL assinada sob demanda (bucket
  privado não tem mais URL pública fixa); aceita também valores já prontos
  (`data:` base64 do modo local, ou `http(s)` colado manualmente pelo
  professor no campo de URL externa) e devolve sem alteração.
- **`app/src/App.tsx`**: upload passa a guardar o **caminho** do arquivo em
  `imagem_url` (não mais a URL pública); novo componente `QuestionImage`
  resolve a URL assinada sob demanda em todos os pontos de exibição (tela
  do aluno, prévia de upload, modal de leitura da questão); versão impressa
  da avaliação (`abrirVersaoImpressa`) passou a ser assíncrona, resolvendo
  URLs assinadas com validade de 7 dias antes de montar o HTML estático.
- **Regressão encontrada e corrigida durante a implementação**: tornar
  `abrirVersaoImpressa` assíncrona quebraria a abertura da janela de
  impressão (bloqueio de pop-up do navegador, que só permite `window.open`
  síncrono dentro do clique). Corrigido abrindo a janela imediatamente e
  preenchendo o conteúdo depois que as URLs resolvem.

## Teste

`tsc -b` e `npm run build` sem erros. **Não foi possível testar upload real
de imagem nem a resolução de URL assinada contra produção nesta sessão**
(exigiria enviar um arquivo de teste real ao Storage) — pedir para o
usuário testar após o deploy: cadastrar uma questão com imagem, verificar
que aparece normalmente para staff, e que a versão impressa carrega a
imagem.

## Risco residual a observar

Entre rodar a migration do banco (bucket fica privado) e o deploy do
frontend novo terminar no Vercel, se alguém usar a versão **antiga** do
frontend (ainda pedindo URL pública) para subir uma imagem nesse intervalo,
o link ficaria quebrado até o deploy novo entrar no ar. Janela pequena
(minutos), e não há imagem real hoje, mas por segurança recomendo rodar a
migration e o push próximos no tempo.

## Achado urgente durante a verificação (fora do escopo planejado)

Ao rodar a query de conferência da migration acima, apareceram 3 policies
que **não vieram desta sprint**: `sidep_questoes_imagens_select_anon`,
`sidep_questoes_imagens_insert_anon` e `sidep_questoes_imagens_update_anon`
— resquícios da migration do piloto de 09/07/2026. A migration "segura" de
14/07/2026 (`migration_2026_07_14_storage_imagens_seguro.sql`) já mandava
remover essas policies, mas **elas continuavam ativas em produção até
08/08/2026** — ou seja, até este exato momento, qualquer pessoa sem login
podia listar, ler, **enviar e sobrescrever** arquivos no bucket de imagens
de questões. Corrigido imediatamente via
`database/fix_2026_08_08_remove_policies_anon_storage_imagens.sql`,
confirmado em produção: restam só `sidep_questoes_imagens_select_staff` e
`sidep_questoes_imagens_select_validada`.

**Lição registrada**: pelo menos uma migration "histórica" já dada como
resolvida (14/07/2026) não tinha sido totalmente aplicada em produção.
Recomendo, numa próxima sprint, uma auditoria completa comparando
`pg_policies` real de produção contra o que cada migration do histórico
deveria ter deixado, para garantir que não haja mais divergências como
essa.

## O que ainda falta na Sprint 1

Nada — os quatro itens planejados (RLS `WITH CHECK`, tela de usuários
Regionais/SEDUC, auditoria de avaliações, Storage por status) estão
concluídos, além da correção urgente encontrada no caminho.

---

# Sprint 1 — Blindagem de Segurança, parte 2: tela de usuários Regionais/SEDUC

## Investigação e escopo

Ao investigar "tela administrativa de usuários", descobri que Escola e
Professor **já sincronizam Supabase Auth automaticamente** ao salvar
(`App.tsx`, chamadas a `sincronizarUsuarioInstitucionalAuth` já existentes) —
essa parte não era mais uma pendência real. O gap de verdade: não havia
nenhuma tela para criar/gerenciar contas `regional` (CREDE/SEFOR) ou `seduc`
— só possível via script de terminal ou SQL direto.

Escopo confirmado com o usuário em 08/08/2026: construir só a tela de
CREDE/SEFOR e SEDUC (não uma tela unificada de todos os perfis), reaproveitando
a Edge Function `admin-create-user` já existente e testada.

## O que foi implementado

- **`database/migration_2026_08_08_rls_seduc_visualiza_perfis.sql`**: amplia
  a policy de `SELECT` em `sidep_usuario_perfil` para incluir `seduc` (antes
  só `administrador` via `sidep_is_admin()`), consistente com o resto do
  sistema onde SEDUC já tem o mesmo nível de acesso que administrador.
- **`app/src/services/institutionalUserRepository.ts`**: nova função
  `carregarUsuariosRegionaisSeduc()` (lista perfis `regional`/`seduc`).
- **`app/src/App.tsx`**: nova tela `RegionalUsers` ("Usuários Regionais e
  SEDUC"), visível só para `seduc`/`administrador` — cadastro de conta
  vinculada a uma das 23 CREDE/SEFOR já existentes (`regionaisSeed`) ou conta
  SEDUC, listagem com status ativo/inativo e "aguardando troca de senha",
  ações de inativar/reativar e redefinir senha (gera senha aleatória seguindo
  o mesmo padrão criptográfico já usado para código de avaliação).

## Testes realizados

- `tsc -b` e `npm run build` sem erros.
- Teste funcional em modo local (sem tocar produção): login como
  administrador, tela renderiza corretamente com as 23 CREDE/SEFOR no
  dropdown, formulário e listagem sem erros.
- `migration_2026_08_08_rls_seduc_visualiza_perfis.sql` **confirmada como
  executada em produção pelo usuário em 08/08/2026**.
- **Ainda pendente**: teste ponta a ponta com conta real (`administrador` ou
  `seduc`) contra o Supabase de produção — precisa ser feito pelo usuário
  após o deploy, já que não há credenciais de admin disponíveis nesta sessão.
