# SIDEP-CE - Sprint 0: Blindagem Urgente (P0)

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

## O que NÃO foi feito nesta sprint (requer ação sua em produção)

Estes itens exigem você mesmo executar no painel do Supabase (ou autorizar
explicitamente a execução), porque tocam o único banco existente (produção):

1. **Trocar a senha real do usuário administrador master no Supabase Auth**
   (painel Supabase > Authentication > Users), já que o valor antigo esteve
   exposto no repositório.
2. **Verificar quais usuários reais (professor/gestão escolar) ainda estão
   com `alterar_senha_primeiro_login = true`** — esses são os que podem
   ainda estar usando a senha exposta `AGzzcso1$` para autenticar de
   verdade. Consulta sugerida (somente leitura, sem risco):
   ```sql
   select nome, email, perfil, alterar_senha_primeiro_login
   from sidep_usuario_perfil
   where alterar_senha_primeiro_login = true
   order by perfil, nome;
   ```
   Para quem aparecer nessa lista, recomendo forçar redefinição de senha
   antes de considerar o risco fechado.
3. **Confirmar se `database/cleanup_2026_07_14_senhas_legadas_pos_auth.sql`
   já rodou** em produção (limpeza de `senha_inicial_hash` legada) — ainda
   pendente de confirmação.

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
- [ ] Senha real do admin master trocada no Supabase Auth (ação do usuário).
- [ ] Usuários com `alterar_senha_primeiro_login = true` verificados/força
      de redefinição aplicada (ação do usuário).
- [ ] Limpeza de `senha_inicial_hash` legada confirmada como executada.

## Próxima sprint recomendada

Sprint 1 — Blindagem de Segurança (fechamento das pendências de RLS
identificadas na auditoria de 08/08/2026): escopo de escrita em
`questao_mvp`/`descritor_mvp`/`competencia_mvp` por autoria/escola,
`WITH CHECK` de `professor_vinculo`/`avaliacao_mvp`/`resposta_avaliacao`,
tela administrativa de usuários, auditoria de ações críticas, policy de
Storage por status da questão.
