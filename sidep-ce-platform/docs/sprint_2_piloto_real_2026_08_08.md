# SIDEP-CE - Sprint 2: Piloto Real em Andamento

Data: 08/08/2026
Contexto: o checklist original de piloto controlado
(`sprint_1_teste_piloto_controlado_2026_07_17.md`) nunca foi executado
formalmente, mas a realidade avançou: **4 avaliações reais já foram
aplicadas** por escolas/professores de verdade, com **70 respostas de
alunos reais** registradas, antes desta sprint começar.

**Atenção durante toda a sprint**: nenhuma ação aqui apagou, alterou ou
interferiu nas avaliações/respostas reais. Toda investigação foi feita com
consultas SQL somente leitura, validadas item por item com o usuário antes
de rodar.

## Estado real confirmado (08/08/2026)

| Avaliação | Escola (INEP) | Professor | Status | Respostas |
|---|---|---|---|---|
| `INF26-D-3M9FQJ` | 23008300 | 07286 | aberta | 7 |
| `INF26-D-4SPHKM` | 23008300 | 07286 | aberta | 21 |
| `INF26-D-GR76RC` | 23545445 | 06797 | encerrada | 19 |
| `INF26-D-W5NJKK` | 23545445 | 06797 | encerrada | 23 |

Total: 70 respostas reais, todas com nomes distintos e plausíveis (sem
sinal de dado de teste ou duplicidade).

## Achado 1: incidente de acesso do aluno já estava corrigido

O histórico do repositório mostra que em 02/08/2026 houve um bug real: a
RPC `sidep_obter_avaliacao_publica` referenciava uma coluna
(`v_avaliacao.regional_codigo`) que **não existe** em `avaliacao_mvp`,
provavelmente bloqueando o acesso de aluno a qualquer avaliação até ser
corrigido (`git log` — commit `6488117`, com diagnóstico específico do
código `INF26-D-A498LH`). Confirmado nesta sprint que a versão em produção
já reflete a correção (`regional_codigo` retorna `null` em vez de
referenciar a coluna inexistente).

## Achado 2: relatórios "confusos" — causa raiz identificada

O usuário relatou números de respostas/acertos confusos em todas as abas
de relatório. Investigação:

1. **Não é duplicidade nem dado de teste** — os 70 registros de resposta
   são de alunos reais e distintos.
2. **Causa real**: duas avaliações diferentes (`3M9FQJ` na escola
   23008300 e `W5NJKK` na escola 23545445) usam o mesmo texto de turma
   ("1ª TEC. INF.") — `turma_codigo` é campo de texto livre, não vinculado
   a uma entidade de turma real. As tabelas de relatório mostravam turma
   sem mostrar a escola, então duas turmas de escolas diferentes com o
   mesmo nome pareciam ser a mesma, inflando a leitura do total.
3. **Achado pedagógico adicional, não é bug**: o relatório pedagógico
   (Descritores/Componentes/Competências) mostrava só os descritores
   `IB-D01` (90% das questões respondidas) e `IB-D02` (10%) — confirmado
   com o usuário que isso é proposital: as avaliações estão sendo
   aplicadas em rodadas de 2 descritores por vez, para não gerar provas
   longas. O relatório está certo — ele reflete só a cobertura aplicada
   até agora, e vai acumular conforme mais rodadas forem aplicadas.

## Correção implementada

Adicionada coluna **Escola** em todas as tabelas de relatório que mostram
avaliação/turma (`app/src/App.tsx`, componente `Reports`): visão geral
("Avaliações recentes"), lista de alunos por avaliação, histórico
individual no escopo, e as exportações Markdown/HTML correspondentes.
Nenhuma mudança de cálculo — só deixa explícito de qual escola é cada
linha, resolvendo a ambiguidade de turmas com nomes iguais.

`tsc -b` e `npm run build` sem erros. Mudança é só de exibição (nova
coluna derivada de dado já carregado), sem alterar nenhum cálculo
existente nem tocar nas tabelas `avaliacao_mvp`/`resposta_avaliacao`.

## Lacunas identificadas para estudo futuro (não implementadas agora)

Discutido com o usuário, registrado para uma sprint futura de relatórios
(Sprint 3):

1. **Sem identificador persistente do aluno entre rodadas de avaliação.**
   Como o acesso é só por código+nome, se o mesmo aluno responder a
   rodada de descritores 1-2 e depois a de 3-4, não há hoje como o sistema
   ligar automaticamente as duas respostas à mesma pessoa (dependeria do
   nome ser digitado de forma idêntica nas duas vezes). O usuário
   considerou a ideia de um vínculo mais forte, mas apontou que isso
   tende a complicar o acesso do aluno (hoje deliberadamente simples: só
   código da prova + nome). Decisão: estudar uma forma de vincular sem
   pesar o acesso, antes de implementar.
2. **Sem controle de cobertura de descritores por turma.** Nada na
   interface indica quais descritores já foram aplicados para uma turma e
   quais ainda faltam nas próximas rodadas — hoje isso é acompanhado só
   de cabeça pelo usuário.

## Próximo passo

Retomar com o usuário se quer seguir aprofundando a Sprint 2 (mais
frentes do piloto real) ou migrar para a Sprint 3 (dashboard/relatórios),
já que as duas lacunas acima se encaixam melhor lá.
