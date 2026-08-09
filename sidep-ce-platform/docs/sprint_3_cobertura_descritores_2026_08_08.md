# SIDEP-CE - Sprint 3: cobertura de descritores por turma

Data: 08/08/2026

## Contexto

Segunda lacuna estrutural registrada na Sprint 2: como as avaliações são
aplicadas em rodadas curtas (poucos descritores por vez), nada na
interface avisava quais descritores já tinham sido cobertos por uma
turma e quais ainda faltavam — dependia só da memória do usuário.

## O que foi implementado

Nova seção **"Cobertura de descritores por turma"** na aba Visão Geral
dos Relatórios (`app/src/App.tsx`, componente `Reports`), logo abaixo de
"Avaliações recentes":

- Para cada combinação escola + turma + curso que tenha pelo menos uma
  avaliação **com pelo menos 1 resposta registrada** (avaliação só
  criada, sem resposta, não conta como "aplicada"), calcula quais
  descritores do curso já foram cobertos (com base nas questões que
  entraram nas avaliações respondidas) e quais ainda faltam.
- Tabela: Escola | Turma | Curso | Cobertos (X/Y) | Descritores
  pendentes (lista, limitada a 8 itens + contagem do restante).
- Incluída também na exportação (Markdown/PDF) da Visão Geral.

## Teste

`tsc -b` e `npm run build`: sem erros. Testado em modo local ponta a
ponta: escola de teste, avaliação com 20 questões (3 descritores:
D01/D02/D03 de "Informática Básica"), aluno respondeu de verdade. A
tabela mostrou corretamente **"3/40 cobertos"** (3 descritores da rodada
testada, de um total de 40 no curso completo) e a lista de pendentes
formatada e limitada. Sem erro de console.

## Sprint 3 — status geral

Com isso, os dois itens estruturais herdados da Sprint 2 (vínculo
persistente do aluno e cobertura de descritores por turma) e a parte de
gráficos/níveis de aprendizagem/filtros interativos estão concluídos.
Seguem em aberto, fora do escopo técnico: revisão formal de LGPD/política
de privacidade (precisa de jurídico/DPO da SEDUC) e a demanda de
usabilidade da tela de edição de questão/descritor/componente, já
registrada para a Sprint 4.
