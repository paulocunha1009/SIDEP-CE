# SIDEP-CE - reestruturação: Banco de Itens vs Questões (+ IA supervisionada)

Data: 16/08/2026

## Contexto

Duas frentes desta sessão, ambas em `app/src/App.tsx` e infraestrutura relacionada:

1. **IA generativa supervisionada** (Sprint 7 do plano): primeira história do
   backlog original ("apoiar revisão linguística de itens"), escolhida por
   ser a mais simples e segura para começar — não envolve dado de aluno, só
   texto de questão.
2. **Reestruturação de tela**: o usuário relatou que "Banco de Itens" tinha
   informação demais antes de chegar nas questões (matriz curricular,
   catálogo v2, KPIs...) e pediu para separar "Questões" como item de menu
   próprio, no mesmo padrão de "Avaliações".

## Parte 1 — Revisão linguística de questões com IA

### Regras de negócio confirmadas com o usuário

- Só sugere melhoria de clareza/gramática — nunca muda o gabarito nem o
  conteúdo técnico da questão.
- Nunca aplica sozinha: só devolve um rascunho para o professor revisar e
  decidir aplicar ou não (revisão humana obrigatória, item explícito do
  backlog original).
- Não envolve dado de aluno — só o texto da própria questão (conteúdo
  curricular, não dado pessoal), então não precisou de rotina de
  anonimização.
- Provedor: Google Gemini (camada gratuita, sem cartão de crédito), por
  escolha do usuário em vez de um provedor pago.

### O que foi implementado

- `supabase/functions/revisar-linguagem-questao/index.ts` (nova Edge
  Function): recebe o texto da questão, valida sessão e perfil
  institucional (mesmo padrão de `admin-create-user`), chama a API do
  Gemini (`gemini-2.5-flash`) com um prompt que proíbe mudar o gabarito ou
  o significado técnico, registra a chamada em `log_auditoria`. A chave
  (`GEMINI_API_KEY`) fica só como secret do Supabase — nunca no código nem
  no navegador do usuário final, exatamente porque uma chave de IA exposta
  no bundle do frontend poderia ser roubada e usada por qualquer pessoa.
- `app/src/services/aiRepository.ts` (novo): chama a Edge Function via
  `supabase.functions.invoke`, só disponível em modo online.
- Botão **"Revisar linguagem com IA"** no modal de edição de questão,
  com painel de sugestão (comentário da IA + comparação lado a lado) e
  botões "Aplicar sugestão"/"Descartar" — nunca escreve direto no banco.
  Desabilitado quando a questão está travada (validada e já usada) ou
  quando o app está offline.

### Deploy

Função publicada pelo usuário via Supabase Dashboard (editor no navegador,
sem precisar de CLI); secret `GEMINI_API_KEY` configurado. Testado por
smoke test sem sessão (confirmando que a função está no ar) — o teste
completo com IA de verdade fica para quando o usuário testar logado.

## Parte 2 — Separar "Questões" de "Banco de Itens"

### Desenho confirmado com o usuário

Sem perder nenhuma funcionalidade: "Banco de Itens" continua com
Competências, Descritores e o catálogo curricular v2 (parte curricular).
Nova aba de menu **"Questões"** (mesmo nível de "Avaliações") recebe tudo
que já existia dentro da antiga sub-aba "Questões": Cadastro, Curadoria,
Cobertura, Inventário, Análise de Itens, e o modal de edição completo
(cascata Competência→Descritor, trava de conteúdo, revisão com IA).

### Decisões de arquitetura assumidas pelo Claude (não perguntadas por serem
### detalhes técnicos, não de negócio)

- Cada tela (`ItemBank` e o novo `QuestionBank`) tem seu **próprio** estado
  de "Curso em trabalho", independente um do outro — evita uma refatoração
  maior de estado compartilhado no componente pai, sem perder nenhuma
  função (o professor troca o curso normalmente em cada tela).
- A ponte "Usar na questão" (clicar num descritor em "Banco de Itens" e
  cair já preenchido em "Questões") foi preservada via um pequeno estado
  compartilhado no componente principal (`descritorParaNovaQuestao`):
  clicar navega para a tela Questões e pré-preenche o descritor
  automaticamente, testado e confirmado funcionando.
- Os KPIs de contagem de questões (Total/Validadas/Em revisão/Rascunhos)
  continuam aparecendo em "Banco de Itens" como resumo, mesmo com o
  cadastro de questões tendo saído de lá.

### Teste

Testado em modo local, sem tocar nos dados reais de produção:

- Navegação entre as duas telas, cada uma com seu próprio seletor de curso.
- KPIs de "Banco de Itens" batendo com os números de antes (441 questões,
  78 validadas, 363 em revisão).
- As 5 sub-abas de "Questões" carregando corretamente (Cadastro, Curadoria,
  Cobertura — 2 tabelas, Inventário — 150 linhas com filtro, Análise de
  Itens — 441 linhas).
- Editar questão: cascata Competência→Descritor→Componente funcionando
  igual antes da reestruturação (troquei competência, descritor e
  componente atualizaram sozinhos).
- Ponte "Usar na questão": cliquei no descritor D01 em Descritores,
  caiu automaticamente em Questões → Cadastro com D01 já selecionado.
- Criei uma questão nova de verdade pelo Cadastro: salvou corretamente
  (441 → 442 questões), confirmando que o fluxo de criação não quebrou.
- Botão de IA continua oculto corretamente em modo offline.
- `npm run build` (`tsc -b && vite build`): sem erros.
- Nenhum erro de console em nenhuma etapa do teste.

## Pendências

- Testar a revisão com IA de verdade (logado, com a Edge Function e o
  Gemini configurados) — depende do usuário confirmar em produção.
- Restam 5 histórias do backlog original de IA (trilhas de recomposição,
  atividades contextualizadas, rascunho de feedback, anonimização de
  dados quando envolver informação de aluno, registro formal de revisão
  humana) — ficam para uma próxima iteração, priorizadas pelo usuário
  quando fizer sentido.
