# Sprint local - vínculos, escola avaliada e prova impressa

Data: 11/07/2026

## Objetivo

Implementar, primeiro na base local, quatro rotinas novas sem quebrar as regras já validadas do SIDEP-CE:

1. Um professor pode atuar em mais de uma escola.
2. Uma escola pode possuir mais de um professor.
3. Toda avaliação deve registrar a escola avaliada e sua CREDE/SEFOR.
4. O professor pode gerar versão impressa da prova e lançar posteriormente as respostas em caso de falta de internet.

## Sprint 1 - Vínculo professor-escola

Regra mantida:
- O campo `escola_inep` continua existindo como escola principal.

Nova regra:
- O professor passa a ter também `escolas_inep`, lista de escolas de atuação.
- A gestão escolar continua cadastrando profissionais apenas para a própria escola.
- CREDE/SEFOR, SEDUC e administrador podem vincular um mesmo professor a mais de uma escola.
- O escopo de visualização do professor passa a considerar todas as escolas de atuação, sem duplicar cadastro.

## Sprint 2 - Avaliação com escola e regional

Nova regra:
- A avaliação possui escola avaliada (`escola_inep`) e regional vinculada (`regional_codigo`).
- Professor escolhe a escola de aplicação dentro das escolas em que atua.
- Gestão escolar usa a escola da própria sessão.
- CREDE/SEFOR visualiza avaliações das escolas da sua regional.
- SEDUC e administrador mantêm visão ampla.

## Sprint 3 - Versão impressa

Nova rotina:
- Em `Aplicações criadas`, o botão `Versão impressa` abre uma página pronta para impressão.
- A prova impressa inclui cabeçalho com código, curso, turma, escola, CREDE/SEFOR e quantidade de questões.
- O cabeçalho usa identificação SIDEP-CE e logo do Centec.
- O rodapé usa a marca Governo do Estado do Ceará/SEDUC.
- As questões são organizadas em duas colunas em A4 para reduzir consumo de papel.
- O gabarito não aparece na prova impressa.
- Ao final, a página gera uma folha de respostas para marcação manual.

## Sprint 4 - Lançamento de prova impressa

Nova rotina:
- O botão `Lançar prova impressa` abre um formulário de transcrição.
- O professor informa o nome completo do estudante e marca uma alternativa por questão.
- O lançamento ocorre em janela pop-up/modal, com cards por questão e alternativas A/B/C/D/E em formato de marcação única.
- O modal mostra total de questões e quantidade já preenchida, reduzindo erro antes de salvar.
- O sistema usa o mesmo cálculo da aplicação online: acertos, percentual bruto, desempenho por descritor e por componente.
- A resposta lançada entra no conjunto de respostas e passa a alimentar os relatórios.

## Critérios de aceite local

- Build do app deve passar com `npm run build`.
- Cadastro de professor deve aceitar escola principal e múltiplas escolas de atuação.
- Avaliação deve exigir escola avaliada antes de abrir aplicação.
- Aplicações criadas devem mostrar escola e regional.
- Versão impressa deve abrir em nova janela sem gabarito.
- Versão impressa deve economizar folha com questões em duas colunas.
- Lançamento manual deve bloquear envio sem nome do estudante ou sem todas as alternativas marcadas.
- Lançamento manual deve permitir apenas uma alternativa marcada por questão.

## Observação para Supabase

Esta sprint foi aplicada para validação local. Para persistência estadual online completa, será necessária uma migração criando vínculo N:N entre professor e escola, por exemplo:

- `professor_escola_vinculo`
- `professor_id`
- `escola_id`
- `tipo_vinculo`
- `principal`
- `status`

Também será necessário persistir `regional_codigo` em `avaliacao_mvp` ou recuperar a regional por relacionamento com a escola no momento do relatório.
