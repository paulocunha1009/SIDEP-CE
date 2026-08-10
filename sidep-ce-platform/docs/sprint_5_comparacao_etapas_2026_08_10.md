# SIDEP-CE - Sprint 5, parte 2: comparação diagnóstico/formativo/final

Data: 10/08/2026

## Contexto

Segunda frente da Sprint 5 aprovada pelo usuário. O modelo de dados já
guardava `etapa` (`diagnostica`/`formativa`/`final`) em cada avaliação e em
cada resposta — não precisou de nenhuma mudança no banco.

## Regra de negócio confirmada com o usuário

Escopo simples para começar: só a média geral por etapa (3 barras), não
quebrado por descritor. Comparação por descritor entre etapas fica como
possível próximo passo, se fizer falta depois de ver dados reais.

## O que foi implementado

Novo card **"Comparação entre etapas"** na aba "Visão Geral" de
Relatórios (`app/src/App.tsx`, componente `Reports`), entre "Status das
avaliações" e "Descritores críticos do escopo". Gráfico de barra
(`PerformanceBarChart`, já existente) mostrando a média geral (%) de cada
uma das 3 etapas, com a contagem de respostas de cada uma, sempre
mostrando as 3 (mesmo com zero respostas em alguma) — mesma lógica de
transparência já usada no painel regional (parte 1) de mostrar o que
ainda não tem dado, não só o que já tem.

Respeita os filtros já ativos na tela (escola/turma/período), como todo o
resto da aba "Visão Geral".

## Teste

Testado em modo local, sem tocar nos dados reais de produção. Usando os
mesmos dados fictícios da parte 1 (2 escolas de teste) mais uma terceira
resposta de teste com etapa "final":

- Diagnóstica: 2 respostas, média 16,67%.
- Formativa: 0 respostas, média 0%.
- Final: 1 resposta, média 100%.

Confirmado por recálculo independente direto sobre os dados brutos do
`localStorage` (contornando a limitação de leitura de gráfico em canvas)
que os valores batem exatamente com o esperado. `npm run build`
(`tsc -b && vite build`): sem erros. Nenhum erro no console.

**Observação de ferramenta**: a captura de tela do navegador de teste
apresentou problema técnico nesta sessão (tela em branco mesmo após
interação) — não foi possível confirmar visualmente as barras do
gráfico, mas a confiança na implementação vem da build limpa, ausência de
erros de console, canvas renderizado com dimensões corretas, e
verificação matemática independente dos dados exibidos.

## Sprint 5 — o que falta

- Registro de intervenções pedagógicas (feature nova do zero).
