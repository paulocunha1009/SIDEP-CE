# SIDEP-CE - Sprint 4: ponte entre a Matriz Curricular v2 e o banco MVP

Data: 10/08/2026

## Contexto

Último item estrutural da Sprint 4. Investigação anterior (08/08/2026) já
tinha mapeado que existem três modelos curriculares no banco: o legado
uuid (órfão), o MVP (o que realmente alimenta as avaliações, com cadastro
100% manual/texto livre) e a matriz v2 (rica, com FK e versionamento, mas
só leitura na tela). Antes de desenhar a ponte, confirmei com uma consulta
somente leitura que a matriz v2 realmente está carregada em produção: 1
matriz (`EC-INF-2025`, Técnico em Informática - Escolas do Campo), 17
componentes, 17 competências, 236 descritores reais — não é só doc
"concluída" sem o SQL ter rodado, como já aconteceu antes neste projeto.

## Regra de negócio confirmada com o usuário

- A ponte só entra no fluxo de **criação** de novas competências/descritores
  no MVP — nunca renomeia nem sobrescreve nada já cadastrado.
- Cursos sem matriz v2 continuam no cadastro manual de sempre.
- Adicionar coluna de rastreio (`origem_v2_codigo`) no banco real, para
  saber depois quais registros vieram da matriz v2 e evitar importar o
  mesmo item duas vezes — usuário confirmou essa opção em vez de deixar
  só como conveniência de tela sem gravar a origem.

## O que foi implementado

### Banco (produção)

`database/migration_2026_08_10_ponte_matriz_v2_mvp.sql` — migration
aditiva e reversível, confirmada pelo usuário como executada com sucesso
no Supabase antes do deploy do frontend:

- `competencia_mvp.origem_v2_codigo` (nullable, FK para
  `competencia_curricular_v2.codigo`, `on delete set null`).
- `descritor_mvp.origem_v2_codigo` (nullable, FK para
  `descritor_curricular_v2.codigo`, `on delete set null`).
- Índices nas duas colunas novas.
- `database/schema.sql` atualizado para refletir as colunas novas.

### Frontend (`app/src/App.tsx`, componente `ItemBank`)

- O painel "Catálogo curricular versionado" (antes só leitura) ganhou uma
  seção **"Importar da matriz v2 para o banco MVP"**, com filtro por
  componente e duas listas (Competências da matriz v2 / Descritores da
  matriz v2), cada uma com um botão de ação por item.
- **"Usar esta competência"**: pré-preenche o formulário de cadastro de
  competência (código curto, descrição, fonte referenciando a matriz/versão
  de origem) e troca para a aba Competências. O usuário revisa e clica em
  "Salvar competência" — nada é salvo automaticamente.
- **"Usar este descritor"**: pré-preenche o formulário de descritor (código
  curto, descrição, nível — `nivel_tri_inicial` da v2 já usa exatamente os
  mesmos valores `basico/intermediario/avancado` do MVP, encaixe direto).
  Se a competência correspondente já foi importada, vincula automaticamente;
  senão, avisa que é preciso importar a competência primeiro ou selecionar
  manualmente.
- Itens já importados (mesmo `origem_v2_codigo` já presente no MVP) ficam
  marcados como "Já importada"/"Já importado" com o botão desabilitado,
  evitando duplicidade.
- As listas de competências/descritores já cadastrados (abas Competências e
  Descritores) agora mostram "· Importado da matriz v2" quando aplicável.
- `types.ts`: `origem_v2_codigo?: string` adicionado a `CompetenciaDraft` e
  `DescritorDraft`. `itemBankRepository.ts`: campo incluído no `select` de
  leitura e already fluía automaticamente no `upsert` (que já espalha o
  objeto inteiro).

## Teste

Testado em modo local, sem tocar nos dados reais de produção
(`.env.local` trocado temporariamente e restaurado depois). Como o
catálogo v2 só existe via Supabase (não há fallback local), usei uma
matriz de teste temporária só em memória durante o teste (revertida antes
do commit — confirmado por `git diff` vazio no arquivo depois):

- Importar uma competência de teste: formulário pré-preenchido
  corretamente, salvo com sucesso, `origem_v2_codigo` persistido.
- Voltar ao painel v2: a competência aparece "Já importada", botão
  desabilitado.
- Importar um descritor vinculado a essa competência: vínculo automático
  correto (`competencia_codigo` preenchido), nível e descrição corretos,
  salvo com sucesso.
- Badge "Importado da matriz v2" aparece corretamente na lista de
  descritores cadastrados.
- `npm run build` (`tsc -b && vite build`): sem erros, antes e depois de
  reverter o mock de teste.

## Sequenciamento com produção

Como o código novo já lê a coluna `origem_v2_codigo` no `select`, a
migration precisava rodar em produção **antes** do deploy do frontend
(senão o Banco de Itens quebraria ao carregar competências/descritores).
Usuário confirmou que rodou a migration com sucesso antes da liberação do
código.

## Sprint 4 — status geral

Com isso, os quatro itens da Sprint 4 (limpeza de código morto/tabelas
legadas, edição de questão/descritor/componente, busca e ações no
Inventário, e a ponte com a matriz v2) estão concluídos.
