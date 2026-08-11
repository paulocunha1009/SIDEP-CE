# SIDEP-CE - Sprint 6: análise clássica de itens (preparação TRI)

Data: 10/08/2026

## Contexto

Backlog original "Sprint 9 - Análise clássica e preparação TRI", 7
histórias. O modelo de dados já guardava tudo que era necessário: cada
resposta registra a alternativa exata escolhida por questão (`resposta.
respostas[codigo_questao]`), não só certo/errado — não precisou de
nenhuma mudança de schema.

**Ressalva colocada para o usuário antes de implementar**: com o volume
atual do piloto (poucas respostas por questão), a discriminação
estatística fica sem sentido em amostras pequenas — isso é literalmente
o último item do backlog original ("definição de volume mínimo para
calibração TRI").

## Regra de negócio confirmada com o usuário

Volume mínimo de **10 respostas por questão** para calcular discriminação;
abaixo disso, mostra "amostra insuficiente" em vez de um número
estatisticamente enganoso.

## O que foi implementado

Nova sub-aba **"5. Análise de Itens"** dentro de Banco de Itens →
Questões (`app/src/App.tsx`, componente `ItemBank`), com uma tabela por
questão do curso em trabalho:

- **Nº de respostas** e **índice de acerto** (% de acerto bruto).
- **Dificuldade empírica** (fácil ≥70% de acerto, médio ≥40%, difícil
  abaixo disso) — diferente do campo manual "dificuldade inicial pré-TRI"
  já existente no cadastro, que é só uma estimativa digitada, não
  calculada.
- **Discriminação**: compara o grupo de melhor desempenho (top 27%) com
  o de pior desempenho (bottom 27%, método de Kelley) na própria
  avaliação de cada aluno — `discriminação = %acerto(grupo superior) -
  %acerto(grupo inferior)`. Só calculado com 10+ respostas.
- **Distratores fracos**: alternativas erradas que ninguém escolheu.
- **Sinalização**: um item vira **"Problemático"** quando a discriminação
  é menor que 0,15 (baixo poder de distinguir quem sabe de quem não sabe)
  ou quando o grupo de melhor desempenho escolheu uma alternativa errada
  mais que o gabarito (possível indício de erro no gabarito). Vira
  **"Candidato a âncora"** quando já está validado, tem discriminação boa
  (≥0,30) e dificuldade equilibrada (índice de acerto entre 30% e 70%).
- Filtro "Só itens problemáticos" isola a lista — essa mesma tabela já
  cobre o "relatório de itens problemáticos" do backlog original, sem
  precisar de uma tela separada.
- Callout fixo no topo explicando o volume mínimo e os critérios de
  sinalização — resposta direta ao item "definição de volume mínimo para
  calibração TRI" do backlog.

**Item do backlog não implementado nesta parte**: "marcação de itens
candidatos a âncora" como uma ação persistida (ex: um botão pra marcar
manualmente um item como âncora reutilizável). Implementei só a
sinalização automática calculada — marcar manualmente exigiria um campo
novo no banco; avaliar se faz falta depois que houver volume real de
dados.

## Teste

Testado em modo local, sem tocar nos dados reais de produção. Como o
piloto local não tinha volume suficiente por questão, criei 12 respostas
sintéticas para 3 questões conhecidas (`Q-INF-0001`, `Q-INF-0003`,
`Q-INF-0004`) com desempenho geral e alternativas escolhidas controladas
à mão, e conferi os três cenários por cálculo manual antes de comparar
com a tela:

- **Q-INF-0001** (cenário "candidato a âncora"): 12 respostas, grupo
  superior 100% de acerto, grupo inferior 0% → discriminação = 1,
  índice de acerto 50%, questão já validada → sinalizado corretamente
  como "Candidato a âncora", distratores fracos D e E (bateu exatamente
  com o esperado).
- **Q-INF-0003** (cenário "problemático" duplo): grupo superior escolheu
  a alternativa D (errada) nas 3 respostas, grupo inferior acertou 100%
  → discriminação = -1 (negativa) e alternativa errada mais escolhida
  pelo topo → sinalizado "Problemático" pelos dois critérios
  simultaneamente, como esperado.
- **Q-INF-0004** (cenário "item fácil demais"): todo mundo acertou →
  índice de acerto 100%, discriminação = 0 (ninguém erra, então não
  discrimina nada) → sinalizado "Problemático" corretamente (item sem
  nenhum poder de diferenciar quem sabe de quem não sabe).
- Filtro "Só itens problemáticos" isolou corretamente só as 2 questões
  sinalizadas, escondendo a "Candidato a âncora" e as demais sem dados
  suficientes.
- `npm run build` (`tsc -b && vite build`): sem erros. Nenhum erro no
  console.

## Sprint 6 — status

Concluída a primeira e principal parte (índice de acerto, dificuldade
empírica, discriminação, distratores, relatório de problemáticos, volume
mínimo). Marcação manual de âncora fica como possível próximo passo, se
fizer falta com dados reais.
