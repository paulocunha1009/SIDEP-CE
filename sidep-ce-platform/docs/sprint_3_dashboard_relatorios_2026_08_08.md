# SIDEP-CE - Sprint 3: Dashboard e Relatórios Pedagógicos, parte 1

Data: 08/08/2026
Escopo desta parte: gráficos de verdade na Visão Geral e no Pedagógico,
substituindo as barras HTML/CSS feitas à mão por uma biblioteca de
gráfico, mais níveis de aprendizagem por faixa fixa.

## Decisões validadas com o usuário antes de implementar

1. **Biblioteca de gráfico**: adicionar `chart.js` + `react-chartjs-2`
   (únicas duas dependências novas do projeto até agora, que era
   deliberadamente enxuto — só Supabase, lucide-react, react/react-dom).
2. **Níveis de aprendizagem por faixa fixa** (decisão pedagógica, não só
   técnica): proposto e aceito pelo usuário como ponto de partida —
   - 🔴 Crítico: 0–40%
   - 🟡 Atenção: 40–70%
   - 🟢 Adequado: 70–100%
   Cortes ajustáveis futuramente em `app/src/charts.tsx`
   (`NIVEL_CORTES`), sem precisar mexer em nenhuma outra tela.
3. **Prioridade de escopo**: gráficos primeiro (Visão Geral e
   Pedagógico), antes das duas lacunas estruturais da Sprint 2 (vínculo
   do aluno entre rodadas, cobertura de descritores por turma) e antes
   dos filtros interativos.

## O que foi implementado

- **`app/src/charts.tsx`** (novo arquivo): `PerformanceBarChart` (barra
  horizontal colorida pela faixa de nível), `StatusDoughnutChart`
  (rosca de status das avaliações), `NivelLegend` (legenda das 3
  faixas), função `nivelAprendizagem()` reutilizável.
- **Visão Geral**: "Desempenho por componente" e "Descritores críticos
  do escopo" agora são gráficos de barra reais (antes eram
  `MiniBarList`, barra HTML/CSS sem cor por faixa). "Status das
  avaliações" agora é um gráfico de rosca.
- **Pedagógico**: "Descritores que exigem intervenção", "Descritores
  consolidados", "Componentes curriculares" e "Competências amplas"
  também convertidos para o gráfico de barra novo, com legenda de
  faixas visível no topo da aba.
- Paleta de cores reaproveitada do projeto (`--green`, `--orange`,
  `--red-orange` já existentes em `styles.css`), sem introduzir cores
  novas fora do padrão visual do SIDEP-CE.
- `MiniBarList` não foi removido — continua em uso na aba "Individual"
  (resumo por aluno), fora do escopo desta parte.

## Teste

- `tsc -b` e `npm run build`: sem erros. Bundle cresceu de ~857KB para
  ~1023KB (+166KB, +57KB gzip) — aumento esperado e aceitável pela
  biblioteca de gráfico nova.
- `npm audit` após a instalação: 4 vulnerabilidades reportadas, todas
  em dependências de build do Vite (`esbuild`, `postcss`, `nanoid`) já
  existentes antes desta mudança — confirmado via `git diff` do
  `package-lock.json` que `chart.js`/`react-chartjs-2` não têm relação
  com elas. Não são dependências de produção (não vão para o bundle do
  navegador), mas ficam registradas aqui para acompanhamento futuro.
- **Teste funcional completo em modo local**: criada escola e avaliação
  de teste (20 questões reais do banco seed), respondida de verdade
  através do fluxo do aluno (login por código + nome, 20 questões
  respondidas, envio confirmado). Voltando como administrador:
  - Gráfico de barra "Desempenho por componente" renderizou com a cor
    correta (vermelho, resultado de 5% ficou na faixa "Crítico").
  - Gráfico de rosca "Status das avaliações" renderizou corretamente
    (verde, avaliação "aberta").
  - Legenda das 3 faixas visível e com as cores certas.
  - Tabela "Avaliações recentes" já mostrando a coluna Escola (Sprint 2).
  - Nenhum erro no console em nenhuma etapa.

## O que ainda falta na Sprint 3

- As duas lacunas estruturais registradas na Sprint 2: vínculo
  persistente do aluno entre rodadas de avaliação, e controle de
  cobertura de descritores por turma.
- Avaliar se vale estender os gráficos para a aba "Individual"
  (hoje ainda usa `MiniBarList`).
- Validar com o usuário se os cortes de 40%/70% fazem sentido depois de
  ver dados reais de mais avaliações.

---

# Sprint 3, parte 2: filtros interativos

## O que foi implementado

Barra de filtros no topo da tela de Relatórios, aplicada a **todas** as
abas (Visão Geral, Por Avaliação, Individual, Pedagógico, Exportações),
porque todos os cálculos já derivavam de duas variáveis centrais
(`respostasEscopo` e `assessments`) — filtrar ali propaga para a tela
inteira sem precisar mexer em cada gráfico/tabela individualmente:

- **Escola**: só aparece se o perfil do usuário enxerga mais de uma
  escola (professor/gestão de escola única não precisa).
- **Turma**: opções calculadas dinamicamente a partir das avaliações do
  escopo, filtradas pela escola selecionada (se houver).
- **Período**: data de início/fim do envio da resposta.
- Aviso "Filtro ativo" e botão "Limpar filtros" quando algum filtro
  estiver em uso.

## Detalhe técnico da implementação

Os parâmetros `schools`, `teachers`, `assessments` e `respostas` do
componente `Reports` foram renomeados internamente para
`schoolsProp`/`teachersProp`/`assessmentsProp`/`respostasProp`, e
variáveis locais com o nome original (`schools`, `teachers`,
`assessments`, `respostas`) foram recriadas já filtradas pelos novos
controles. Como o resto do componente (mais de 900 linhas) já usava
esses nomes, todo o código existente passou a respeitar o filtro
automaticamente, sem precisar editar cada ponto individualmente.

**Cuidado tomado**: os indicadores de qualidade de dado
("avaliação sem turma", "resposta sem avaliação vinculada") continuam
lendo o escopo completo por perfil, não o filtro escolhido pelo
usuário — filtrar um problema de vínculo quebrado pelo próprio campo
que está quebrado não faria sentido.

**Achado incidental, fora do escopo desta sprint**: `respostasSemVinculo`
já era estruturalmente sempre igual a zero antes desta mudança (a
variável de onde ele lê já era pré-filtrada pelo mesmo critério que ele
testa). Não é uma regressão introduzida agora, mas fica registrado para
revisão futura.

## Teste

`tsc -b` e `npm run build`: sem erros, nenhum aviso de tipo mesmo após a
renomeação de props. Teste funcional em modo local: criadas 2 escolas
de teste — dropdown "Escola" só apareceu depois da segunda (confirma a
regra de "só mostrar com mais de uma escola"); selecionar uma escola
atualizou corretamente o KPI "Escolas" de 2 para 1, mostrou o aviso
"Filtro ativo" e o botão "Limpar filtros"; limpar o filtro voltou ao
estado original. Nenhum erro de console em nenhuma etapa.
