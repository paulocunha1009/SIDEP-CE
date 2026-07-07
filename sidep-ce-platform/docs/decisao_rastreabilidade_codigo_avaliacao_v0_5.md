# SIDEP-CE - Decisao tecnica v0.5

## Codigo de avaliacao, rastreabilidade e exclusao segura

Data: 07/07/2026

## Contexto

O codigo de avaliacao e utilizado pelo estudante para acessar a prova e pelo sistema para vincular respostas, turma, professor, escola, etapa, status e relatorios. Por isso, ele nao pode ser tratado como um campo editavel comum.

## Decisao

A partir da versao v0.5 do MVP, o codigo de avaliacao passa a ser gerado automaticamente pelo sistema, com token randomico e verificacao de unicidade contra:

- codigos de avaliacoes ativas;
- codigos de avaliacoes ja criadas;
- codigos de avaliacoes excluidas.

Depois que a avaliacao e aberta, o codigo fica bloqueado e imutavel.

## Regras de negocio

1. O professor nao digita o codigo manualmente.
2. Antes de abrir a avaliacao, o professor pode acionar `Gerar novo`.
3. Ao abrir a avaliacao, o codigo passa a ser chave de rastreabilidade da aplicacao.
4. O codigo vincula respostas, turma, professor, escola, etapa, status, relatorios e auditoria.
5. Avaliacao criada por engano pode ser excluida somente se ainda nao possuir respostas.
6. Avaliacao com resposta registrada nao pode ser excluida; deve ser encerrada ou corrigida.
7. Ao excluir uma avaliacao sem respostas, seu codigo fica bloqueado definitivamente.
8. Codigo bloqueado nao pode ser reaproveitado em nenhuma nova aplicacao.

## Justificativa pedagogica e academica

A imutabilidade do codigo preserva a integridade dos relatorios e evita mistura de dados entre aplicacoes. Para a metodologia do SIDEP-CE, essa regra fortalece a confiabilidade da base empirica usada em diagnosticos, analises por descritor, comparacoes entre turmas e futura calibracao psicometrica.

## Impacto tecnico

No MVP local, foi criado um registro local de codigos bloqueados. Na versao com banco real, recomenda-se implementar uma tabela propria, por exemplo `avaliacao_codigo_bloqueado`, com:

- codigo;
- motivo do bloqueio;
- avaliacao original;
- usuario responsavel;
- data/hora;
- origem da acao;
- metadados de auditoria.

## Criterio de aceite

- O sistema nao deve gerar codigo repetido.
- O sistema nao deve reutilizar codigo de avaliacao excluida.
- O sistema deve bloquear exclusao de avaliacao com respostas.
- O sistema deve preservar o codigo de avaliacoes abertas.
- Os relatorios devem usar o codigo como uma das chaves de rastreabilidade da aplicacao.
