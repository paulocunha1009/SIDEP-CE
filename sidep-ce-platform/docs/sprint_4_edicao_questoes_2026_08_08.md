# SIDEP-CE - Sprint 4: edição de questão, descritor e componente

Data: 08/08/2026

## Contexto

O usuário relatou: "acabei de tentar editar questões e solicitar edição e não
consegui ... quero poder editar tudo na questão não só itens mas até
descritores e componentes". Investigação (só leitura) confirmou duas causas
concretas, não apenas UX confusa:

1. **Não existia função de editar o conteúdo de uma questão já salva.** O
   botão "Ver questão" abria um modal só leitura. A aba "1. Cadastro" era
   exclusivamente de criação: mesmo tentando reaproveitar o formulário,
   `saveQuestao` recalculava sempre um código novo e ignorava qualquer
   código pré-existente.
2. **A aba "Solicitações" (pedir revisão) era uma maquete estática**, sem
   persistência real: o botão "Solicitar revisão" só mostrava uma mensagem
   de simulação, a autoria exibida era sorteada aleatoriamente
   (`index % 3 === 0`) e a aba "Histórico" tinha dados fixos no código.

## Regras de negócio confirmadas com o usuário

- **Trava de segurança**: se uma questão estiver `validada` **e** já constar
  em pelo menos uma resposta real (`resposta_avaliacao.ordem_questoes`),
  os campos de conteúdo (enunciado, alternativas, gabarito, vínculo com
  descritor/componente) ficam bloqueados na edição — só justificativa,
  imagem, dificuldade e status continuam editáveis. Isso evita invalidar
  resultados de avaliações já aplicadas.
- **Código de descritor/competência travado**: ao editar um descritor ou
  competência a partir do modal da questão, o código (`D01`, `C01` etc.)
  nunca pode ser renomeado — só a descrição/metadados. Preserva o vínculo
  histórico com questões e respostas já registradas.
- **Aba "Solicitações" e "Histórico"**: removidas da navegação por ora
  (eram maquetes sem função real); o foco ficou em viabilizar a edição
  direta, que já resolve o caso de uso relatado.

## O que foi implementado

Em `app/src/App.tsx`, componente `ItemBank`:

- O antigo modal "Ver questão" (só leitura) virou um modal de edição real,
  com três seções no mesmo lugar — sem trocar de aba:
  1. **Questão**: todos os campos do cadastro (enunciado, 5 alternativas,
     gabarito, justificativa, imagem, dificuldade, status, componente e
     descritor vinculados).
  2. **Descritor vinculado**: descrição, componente curricular e nível
     esperado editáveis; código sempre travado (`readOnly`).
  3. **Competência vinculada**: descrição e fonte editáveis; código e curso
     técnico sempre travados.
- `saveQuestao` agora preserva o código existente quando está em modo de
  edição (`questaoEmEdicaoCodigo`), em vez de sempre gerar um código novo.
  Antes disso, mesmo tentando reaproveitar o formulário de cadastro para
  editar, o código era recalculado à força — por isso a edição nunca
  funcionava de fato.
- Nova função `iniciarEdicaoQuestao(questao)`: localiza o descritor e a
  competência vinculados, ajusta o curso em trabalho se necessário e
  pré-carrega os três formulários (questão, descritor, competência) com os
  dados atuais.
- Trava de conteúdo (`questaoTravada`): calculada a partir de uma nova prop
  `respostas` (todas as respostas reais, já carregadas no app) cruzada com
  `ordem_questoes` de cada resposta. Reforçada em duas camadas: os campos
  ficam desabilitados na interface E `saveQuestao` sobrescreve qualquer
  tentativa de alterar conteúdo travado com os valores originais antes de
  salvar (defesa em profundidade).
- Removidas as sub-abas "5. Solicitações" e "6. Histórico" e os componentes
  `QuestionReviewRequestsPreview`/`QuestionReviewHistoryPreview` (código
  morto após a remoção).

## Teste

Testado em modo local (sem tocar o banco real de produção — `.env.local`
foi temporariamente trocado por uma configuração só local durante o teste
e restaurado depois):

- Editei a justificativa de uma questão em revisão (`Q-INF-V02-0079`) e
  salvei: confirmado por inspeção direta do `localStorage` que o total de
  questões continuou 441 (sem duplicar), só 1 registro com aquele código, e
  o novo texto foi persistido corretamente.
- Simulei uma resposta real referenciando uma questão validada
  (`Q-INF-0001`) e abri a edição: o aviso de trava apareceu, e os campos
  enunciado, alternativa A, gabarito e componente ficaram
  `readOnly`/`disabled`; justificativa continuou editável.
- Cancelar a edição e voltar para "1. Cadastro" confirmou que o fluxo de
  criação (próximo código automático) continua funcionando normalmente.
- `npm run build` (`tsc -b && vite build`): sem erros.

## Pendências

- Item 1 da Sprint 4 (ponte Matriz Curricular v2 ↔ banco MVP) segue em
  aberto.
- Se algum dia o fluxo de "solicitar revisão entre professores" for
  necessário de verdade, precisa ser reconstruído com autoria real e
  persistência — o que existia antes era só uma maquete visual.
