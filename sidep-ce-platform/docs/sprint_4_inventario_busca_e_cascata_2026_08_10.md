# SIDEP-CE - Sprint 4: busca no Inventário e edição por Competência → Descritor

Data: 10/08/2026

## Contexto

Continuação direta da edição de questões (`sprint_4_edicao_questoes_2026_08_08.md`).
O usuário pediu, antes de avançar para a ponte com a Matriz Curricular v2:

1. Poder pesquisar questões no Inventário por competência e/ou descritor e/ou
   curso.
2. Ter os botões Editar e Validar ativos e funcionando direto no Inventário
   (antes era só uma tabela de leitura, sem nenhuma ação).
3. Poder mudar a competência da questão, não só o descritor, ao editar.
4. Reorganizar as telas do Banco de Itens sem remover nada existente, para
   ficarem mais alinhadas e didáticas.

## O que foi implementado

Em `app/src/App.tsx`, componente `ItemBank`:

### Inventário (aba "4. Inventário")

- Nova barra de filtros (reaproveitando o estilo `.review-filter-panel` já
  existente no projeto): busca por texto livre (código, enunciado,
  descritor ou competência), filtro por Competência e filtro por Descritor
  (a lista de descritores se ajusta à competência escolhida).
- O filtro de curso continua sendo o seletor global "Curso em trabalho", já
  visível no topo da tela — optei por não duplicar um segundo seletor de
  curso só para o Inventário, para não confundir com dois controles fazendo
  a mesma coisa. Deixei isso explicado no próprio texto de apoio da aba.
- A tabela (antes só leitura, via `DataTable` genérico) virou uma tabela
  própria com coluna **Competência** adicionada antes do Descritor, e uma
  coluna **Ações** com os botões **Editar** (abre o mesmo modal de edição
  já usado na Curadoria) e **Validar** (marca a questão como validada
  direto, desabilitado se já estiver validada) — mesmo padrão de botão já
  usado na Curadoria.
- Mostra até 150 questões filtradas (a Curadoria mostra 80); com aviso
  quando o filtro tem mais resultados do que isso.

### Modal de edição — Competência → Descritor → Componente

Antes, a seção "Questão" do modal deixava escolher **Componente** primeiro
e depois o **Descritor** filtrado por aquele componente — não dava para
escolher a competência diretamente, só trocando de descritor um a um.

Reorganizei para seguir a mesma hierarquia pedagógica que já é explicada no
topo da própria tela ("1. Competência → 2. Descritor → 3. Questão"):

- **Competência vinculada** (novo seletor): escolhe entre as competências
  do curso em trabalho.
- **Descritor vinculado**: a lista já vem filtrada pela competência
  escolhida acima.
- **Componente curricular**: agora é só leitura, derivado automaticamente
  do descritor escolhido (o componente é uma propriedade do descritor, não
  uma escolha independente — isso evita estados inconsistentes, como
  selecionar um componente e depois um descritor de outro componente).

Trocar a competência já seleciona automaticamente o primeiro descritor
dela e atualiza o componente; trocar o descritor mantém a competência em
sincronia. Quando a questão está travada (validada e usada em resposta
real), a Competência e o Descritor continuam bloqueados, como já era o
combinado.

O formulário de criação (aba "1. Cadastro") não foi alterado — continua
usando Componente → Descritor, que já funcionava bem para criar uma
questão nova; a mudança foi só no fluxo de edição, que era o que o usuário
pediu.

## Teste

Testado em modo local (sem tocar no banco real — mesmo processo das vezes
anteriores: `.env.local` trocado temporariamente e restaurado depois):

- Busca por código no Inventário: filtra corretamente combinada com o
  filtro de Situação (confirmei que o filtro de Situação, compartilhado
  com a Curadoria, também se aplica aqui — por isso é preciso trocar para
  "Todas" se a questão buscada não estiver "Em revisão", que é o padrão).
- Botão Validar: desabilitado corretamente quando a questão já está
  validada.
- Editar uma questão validada e já usada em resposta real (simulada):
  confirmei que a trava de segurança (da sprint anterior) continua
  funcionando igual, entrando tanto pela Curadoria quanto pelo Inventário.
- Editar uma questão não travada, mudando a Competência de C02 para C03: o
  Descritor mudou automaticamente para o primeiro da nova competência e o
  Componente acompanhou. Salvei e confirmei por inspeção direta do
  `localStorage`: total de questões seguiu 441 (sem duplicar), só 1
  registro com aquele código, `descritor_codigo` e `componente_curricular`
  atualizados corretamente.
- `npm run build` (`tsc -b && vite build`): sem erros.

## Pendências

- Item 1 da Sprint 4 (ponte Matriz Curricular v2 ↔ banco MVP) segue em
  aberto — é o próximo passo combinado com o usuário.
