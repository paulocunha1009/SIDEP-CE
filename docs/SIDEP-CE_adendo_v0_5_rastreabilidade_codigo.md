# SIDEP-CE - Adendo v0.5

## Rastreabilidade do codigo de avaliacao

**Data:** 07/07/2026  
**Natureza:** regra de negocio, auditoria e integridade metodologica  
**Modulo:** criador de avaliacoes, aplicacao do estudante e relatorios

## Decisao

O codigo de avaliacao passa a ser gerado automaticamente pelo sistema e nao deve ser digitado manualmente pelo professor. Antes da abertura da avaliacao, o professor pode solicitar novo codigo. Depois da abertura, o codigo fica bloqueado e imutavel.

## Justificativa

O codigo de avaliacao funciona como chave de rastreabilidade da aplicacao. Ele vincula:

- avaliacao;
- turma;
- professor;
- escola;
- etapa diagnostica, formativa ou final;
- questoes aplicadas;
- respostas dos estudantes;
- relatorios pedagogicos;
- auditoria da aplicacao.

Por isso, o codigo nao pode ser alterado apos a avaliacao ser aberta e nao pode ser reaproveitado caso uma avaliacao seja excluida.

## Regras incorporadas ao MVP

1. O codigo e gerado automaticamente pelo sistema.
2. O codigo e comparado contra codigos ativos e codigos bloqueados.
3. Apos abrir a avaliacao, o codigo torna-se imutavel.
4. Avaliacao criada por engano pode ser excluida apenas se ainda nao possuir respostas.
5. Avaliacao com respostas nao pode ser excluida; deve ser encerrada ou corrigida.
6. Codigo de avaliacao excluida fica bloqueado definitivamente.
7. Codigo bloqueado nao pode ser reaproveitado em nova aplicacao.

## Impacto para o mestrado

Essa regra aumenta a confiabilidade da base de dados do SIDEP-CE, pois garante que cada conjunto de respostas pertence a uma unica aplicacao avaliativa. Isso fortalece:

- analise por descritor;
- analise por competencia;
- relatorios por turma e escola;
- acompanhamento antes, durante e depois do curso;
- futura analise classica de itens;
- futura calibracao por TRI;
- auditoria dos resultados em escala institucional.

## Recomendacao para a versao com banco real

Na migracao para PostgreSQL/Supabase, recomenda-se criar uma tabela propria para codigos bloqueados, associada ao log de auditoria. Campos recomendados:

- codigo;
- status: ativo, bloqueado, excluido;
- avaliacao original;
- motivo do bloqueio;
- usuario responsavel;
- data/hora;
- escola;
- turma;
- professor;
- metadados de auditoria.
