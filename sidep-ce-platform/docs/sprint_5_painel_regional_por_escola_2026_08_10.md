# SIDEP-CE - Sprint 5, parte 1: painel regional por escola

Data: 10/08/2026

## Contexto

Início da Sprint 5 (backlog original "Sprint 8 - Gestão escolar e
regional"). Investigação prévia mostrou que boa parte da base já existia:
escopo por regional (CREDE/SEFOR) já funcionando no frontend
(`scopedSchools`/`scopedTeachers`/`scopedAssessments`, `App.tsx:1276-1314`)
e já reforçado na RLS do Supabase desde 14/07/2026. O que faltava de
verdade era um painel comparando escolas lado a lado — hoje os KPIs do
Painel e da aba "Visão Geral" de Relatórios só mostram números agregados
(um total só), sem quebra por escola.

Do backlog original de 7 histórias, o usuário optou por seguir com:
painel regional por escola, descritores críticos por escola (parte 1,
este documento), comparação diagnóstico/formativo/final e registro de
intervenções pedagógicas (partes seguintes).

## Regra de negócio confirmada com o usuário

Mostrar **todas** as escolas do escopo do usuário, inclusive as que ainda
têm zero respostas — para quem gerencia várias escolas (regional/SEDUC/
administrador), saber quais escolas ainda não engajaram é tão importante
quanto o desempenho das que já participaram.

## O que foi implementado

Nova aba **"Regional"** em Relatórios (`app/src/App.tsx`, componente
`Reports`), entre "Visão Geral" e "Por Avaliação". Só aparece quando o
usuário enxerga mais de uma escola no escopo (`schoolsProp.length > 1`,
mesma regra já usada no filtro de Escola) — sem valor para professor ou
gestão de escola única.

Tabela com uma linha por escola:
- Alunos que responderam (contagem de `estudante_chave` únicos)
- Avaliações aplicadas (avaliações com pelo menos 1 resposta)
- Respostas totais
- Cobertura de descritores (reaproveita o cálculo já existente de
  "Cobertura de descritores por turma", agregado por escola)
- Média geral (%)
- Descritores críticos (quantos descritores dessa escola estão na faixa
  🔴 crítico, usando o mesmo corte de 40% já definido em `charts.tsx`)

A tabela respeita os filtros já existentes na tela (turma, período); se o
filtro de Escola estiver ativo, a tabela naturalmente mostra só 1 linha —
comportamento consistente com as outras abas, sem regra especial.

Reaproveita integralmente cálculos já existentes (`coberturaPorTurma`,
`descritoresPorCurso`, `nivelAprendizagem`) em vez de duplicar lógica —
só agrega por escola em vez de por turma.

## Teste

Testado em modo local, sem tocar nos dados reais de produção (`.env.local`
trocado temporariamente e restaurado depois). Como não havia escolas de
teste suficientes no ambiente local, criei 2 escolas fictícias via
localStorage (não afeta o banco real, que é Supabase e só é usado quando
`.env.local` aponta pra produção):

- Escola Teste A: 2 alunos responderam (1 acerto de 3 questões cada, no
  total 1/6 = 16,67%), 1 avaliação aplicada, cobertura 1/40 descritores,
  1 descritor crítico (16,67% está abaixo dos 40% do corte).
- Escola Teste B: nenhuma resposta — apareceu corretamente com todos os
  indicadores zerados (0 alunos, 0 avaliações, 0/0 cobertura, 0%, 0
  críticos), confirmando o caso "ainda não engajou".
- A aba "Regional" só apareceu com as 2 escolas no escopo (regra
  `schoolsProp.length > 1` funcionando).
- `npm run build` (`tsc -b && vite build`): sem erros.
- Nenhum erro no console durante o teste.

**Responsividade**: a tabela reaproveita o componente `DataTable`
genérico já existente (mesmas classes `.table-wrap`/`table`), já
verificado responsivo em sprint anterior (rolagem horizontal em telas
pequenas) — nenhum CSS novo foi introduzido, então não há comportamento
novo a testar nesse quesito.

## Próximos passos da Sprint 5

- Comparação entre diagnóstico/formativo/final.
- Registro de intervenções pedagógicas (feature nova — a tabela legada
  `intervencao_pedagogica` foi removida na Sprint 4 por não ter uso real;
  precisa de desenho novo).
