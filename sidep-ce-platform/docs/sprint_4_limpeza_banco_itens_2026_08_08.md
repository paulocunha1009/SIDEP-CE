# SIDEP-CE - Sprint 4: itens rápidos de consolidação

Data: 08/08/2026

## Item 3 — unificar limite de questões (20–40 vs 20–80)

Investigado: existiam dois componentes de criação de avaliação no código
(`Assessments`, com limite 20–40, e `AssessmentsV2`, com 20–80), mas só o
`AssessmentsV2` é renderizado em algum lugar da aplicação — confirmado
por busca de `<Assessments` no código, sem nenhum resultado. O componente
antigo era **código morto**, nunca alcançável por nenhum usuário.

**Ação**: removido o componente `Assessments` (linhas mortas) de
`app/src/App.tsx`. Não havia o que "unificar" de fato — só uma coisa
para apagar. `npm run build` sem erros após a remoção.

## Item 4 — tabelas legadas e modelo de domínio órfão

Confirmado com o usuário antes de remover:

- **Tabelas do fluxo de avaliação "amplo"** (`questao`, `avaliacao`,
  `avaliacao_questao`, `estudante_aplicacao`, `resposta`,
  `resultado_individual`, `intervencao_pedagogica`): nunca usadas em
  produção, bloqueadas por RLS sem nenhuma policy desde 14/07/2026.
  Confirmado por busca em todas as migrations e no código do app — as
  únicas ocorrências eram um alias de CTE (`with avaliacao as (select
  ... from avaliacao_mvp ...)`) num script de diagnóstico, não a tabela
  real, e a lista de bloqueio de segurança de 14/07 (que travou todas as
  tabelas em bloco, não é evidência de uso).
  Removidas do **arquivo de referência** `database/schema.sql`.
  **Não removidas do banco real** — decisão do usuário de deixar as
  tabelas vazias/bloqueadas como estão por enquanto, sem operação
  adicional em produção hoje.
- **`src/domain/models.ts`**: modelo de domínio TypeScript nunca
  importado em nenhum lugar do código (confirmado por busca). Removido
  o arquivo e a pasta `src/domain/` (ficava fora de `app/`, não fazia
  parte do bundle do frontend).

## Teste

`tsc -b` e `npm run build`: sem erros nas duas remoções. Como
`schema.sql` não é reaplicado automaticamente em produção (é só
documentação/referência inicial), essa mudança não tem nenhum efeito no
banco real.

## Itens restantes da Sprint 4

- Ponte entre a Matriz Curricular v2 e o banco de questões usado nas
  avaliações.
- Usabilidade da edição de questão/descritor/componente (demanda do
  usuário, registrada em 08/08/2026).
