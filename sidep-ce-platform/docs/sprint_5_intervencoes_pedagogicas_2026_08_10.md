# SIDEP-CE - Sprint 5, parte 3: registro de intervenções pedagógicas

Data: 10/08/2026

## Contexto

Última frente da Sprint 5. Diferente das partes 1 e 2 (que só reorganizaram
dados já existentes), esta é uma feature nova do zero — não havia nenhuma
tabela ou tela funcional para isso hoje. A tabela legada
`intervencao_pedagogica`, que fazia parte do modelo relacional "amplo"
original, foi removida do `schema.sql` de referência na Sprint 4 por nunca
ter tido uso real — esta implementação **não a reaproveita**, é uma tabela
nova seguindo o padrão MVP do restante do projeto.

## Regras de negócio confirmadas com o usuário

- **Quem registra**: professor (suas próprias turmas) e gestão escolar
  (sua escola). Regional e SEDUC só visualizam (acompanhamento) — não
  aparecem com o formulário de cadastro.
- **Administrador** mantém acesso total de escrita, como em toda tabela
  do projeto (papel de suporte/operação) — não estava explícito na
  pergunta original, mas segue a convenção já usada em 100% das outras
  tabelas do sistema.
- **Sem campo de "resultado observado"** por enquanto — fica pra uma
  próxima iteração, se fizer falta com uso real.
- `professor_matricula` é opcional no banco (gestão escolar pode
  registrar sem estar necessariamente associada a um professor
  específico).

## O que foi implementado

### Banco (aguardando confirmação de execução em produção)

`database/migration_2026_08_10_intervencao_pedagogica_mvp.sql` — cria a
tabela `intervencao_pedagogica_mvp` (escola, professor opcional, turma,
curso, descritor alvo opcional com FK para `descritor_mvp`, tipo,
status, data planejada, observações) com RLS espelhando o padrão já
usado em `avaliacao_mvp`: leitura por escopo (professor vê as suas,
escola/regional vê as da escola/regional, seduc/admin veem tudo);
escrita restrita a professor (suas próprias, escola vinculada), gestão
escolar (sua escola) e administrador — regional e seduc ficam de fora da
escrita de propósito. `database/schema.sql` atualizado para refletir a
tabela nova.

### Frontend

- `types.ts`: novo `IntervencaoPedagogicaDraft`.
- `app/src/services/intervencaoRepository.ts` (novo arquivo):
  `carregarIntervencoes`/`salvarIntervencao`, mesmo padrão local+Supabase
  já usado em todo o projeto.
- Nova aba **"Intervenções"** em Relatórios (`App.tsx`, componente
  `Reports`):
  - Formulário de registro (só visível para professor/gestão
    escolar/administrador): escola (se houver mais de uma no escopo),
    turma, curso técnico, descritor alvo opcional (lista os descritores
    já em uso no escopo), tipo (reforço/recuperação/atendimento
    individual/outro), status (planejada/realizada/cancelada), data
    planejada, observações.
  - Tabela "Intervenções registradas", sempre visível a todos os perfis
    dentro do escopo (regional/SEDUC também acompanham).

**Simplificação assumida**: a proposta original mencionava um atalho
"Registrar intervenção" direto na lista de descritores críticos. Como
esse gráfico usa Chart.js (canvas, sem clique por barra hoje), implementar
esse atalho exigiria modificar o componente de gráfico compartilhado — 
ficou fora do escopo desta parte. O vínculo com o descritor continua
disponível, só que selecionado manualmente no formulário da aba
Intervenções.

## Teste

Testado em modo local, sem tocar nos dados reais de produção. Logado como
administrador (que tem acesso de escrita), preenchi e salvei uma
intervenção de teste (Escola Teste A, turma, curso, tipo reforço, status
planejada) — confirmado por leitura direta do `localStorage` que foi
persistida com id gerado, e a tabela "Intervenções registradas" mostrou a
linha corretamente. `npm run build` (`tsc -b && vite build`): sem erros.
Nenhum erro no console.

## Sequenciamento com produção

Como o código novo já faz `select`/`upsert` em `intervencao_pedagogica_mvp`,
a migration precisa rodar em produção **antes** do deploy do frontend
(senão a aba "Intervenções" quebraria ao carregar). Aguardando
confirmação do usuário antes de subir o código.

## Sprint 5 — encerrada

Com isso as 4 frentes escolhidas pelo usuário na Sprint 5 estão
concluídas: painel regional por escola, comparação entre etapas, e
registro de intervenções pedagógicas (descritores críticos por escola já
estava coberto dentro do painel regional, parte 1).
