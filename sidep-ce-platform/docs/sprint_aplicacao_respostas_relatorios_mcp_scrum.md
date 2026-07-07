# SIDEP-CE - Sprint MCP/Scrum de Aplicacao, Respostas, Relatorios e Persistencia Online

Atualizado em: 07/07/2026  
Status: implementada no MVP React e conectada ao Supabase em piloto controlado.

## Objetivo

Consolidar o fluxo profissional de aplicacao da avaliacao diagnostica, mantendo separacao entre estudante, professor e gestao escolar, e garantindo persistencia online inicial para uso em piloto controlado.

## Regras de negocio aplicadas

- A avaliacao possui ciclo de status: `rascunho`, `agendada`, `aberta`, `encerrada` e `corrigida`.
- O estudante so acessa a avaliacao quando o status esta `aberta`.
- Cada estudante pode enviar apenas uma resposta por codigo de avaliacao e nome normalizado.
- A ordem das questoes e embaralhada por tentativa e registrada para auditoria.
- A pre-visualizacao do professor simula a prova, mas nao grava resposta nem altera relatorio.
- O estudante nao visualiza gabarito, TRI, diagnostico ou intervencao.
- O codigo da avaliacao e gerado automaticamente e nao pode ser reaproveitado.
- Avaliacao com respostas nao pode ser excluida; deve ser encerrada ou corrigida.

## Entregas tecnicas

- Tipo `RespostaAvaliacaoDraft`.
- Repositorio de respostas com persistencia local e Supabase.
- Tabela PostgreSQL `resposta_avaliacao`.
- Tabelas MVP online `competencia_mvp`, `descritor_mvp`, `questao_mvp`, `avaliacao_mvp` e `avaliacao_codigo_bloqueado`.
- Registro de acertos, percentual bruto, desempenho por descritor e desempenho por componente.
- Relatorios por aluno, turma/avaliacao, descritor, componente e competencia.
- Preparacao de log de auditoria para envio de respostas em Supabase.
- Rotina administrativa para subir a base local do navegador para o Supabase.
- Deploy preparado para Vercel com variaveis de ambiente.

## MCP

Nesta sprint, MCP e tratado como camada de coordenacao futura entre:

- modelo pedagogico: competencias, descritores e itens;
- modelo operacional: aplicacao, respostas, status e auditoria;
- modelo analitico: relatorios, desempenho bruto, pre-TRI e futura calibracao TRI;
- conectores futuros: banco de itens, matrizes curriculares, relatorios e IA generativa supervisionada.

## Criterios de aceite

- Uma avaliacao encerrada ou agendada nao pode ser iniciada pelo estudante.
- Uma avaliacao aberta pode ser iniciada com codigo e nome completo.
- Uma segunda tentativa do mesmo estudante no mesmo codigo e bloqueada.
- A pre-visualizacao do professor nao gera registro de resposta.
- O relatorio exibe resultados individuais e agregados.
- O schema SQL contem a tabela de respostas consolidada e indices de consulta.
- O administrador consegue migrar a base local para Supabase sem apagar dados.
- O banco online recebe competencias, descritores, questoes, avaliacoes e respostas.
- O sistema continua funcionando localmente caso o Supabase nao esteja configurado.

## Governanca administrativa

- O sistema possui usuario `MASTER` com perfil `administrador`.
- O Administrador Master tem acesso total a escolas, profissionais, banco de itens, avaliacoes e relatorios.
- O Administrador Master pode editar, inativar/reativar e redefinir senha de escolas e profissionais.
- A senha inicial do `MASTER` deve ser alterada no primeiro acesso.

## Codigo de avaliacao, rastreabilidade e exclusao segura

Regra incorporada ao MVP em 07/07/2026:

- O codigo da avaliacao deve ser gerado automaticamente pelo sistema, com token randomico e verificacao contra codigos ativos e bloqueados.
- O professor pode gerar outro codigo antes de abrir a avaliacao, mas nao pode alterar o codigo manualmente.
- Depois que a avaliacao e aberta, o codigo torna-se imutavel e passa a ser a chave de rastreabilidade da aplicacao.
- O codigo vincula respostas, turma, professor, escola, etapa, status, relatorios e auditoria.
- Avaliacao criada por engano pode ser excluida apenas quando ainda nao possui respostas registradas.
- Se houver resposta de estudante, a exclusao deve ser bloqueada; nesse caso, a avaliacao deve ser encerrada ou corrigida.
- O codigo de uma avaliacao excluida fica bloqueado definitivamente e nao pode ser reaproveitado em outra aplicacao.

Essa decisao evita colisao de dados, protege a integridade dos relatorios e prepara a futura calibracao psicometrica, pois cada conjunto de respostas permanece associado a uma aplicacao unica e auditavel.

## Persistencia online e piloto controlado

Regra incorporada ao MVP em 07/07/2026:

- O Supabase/PostgreSQL passa a ser a base online do piloto.
- O Vercel passa a ser o ambiente inicial de publicacao.
- O sistema preserva fallback local para desenvolvimento e contingencia.
- A rotina **Subir base local para Supabase** envia a base historica criada no navegador para o banco online.
- O uso online fica liberado apenas como piloto controlado enquanto RLS, Supabase Auth e politicas por perfil nao estiverem implementadas.

Do ponto de vista Scrum, esta sprint entrega um incremento utilizavel: uma escola ou turma piloto ja pode aplicar avaliacao, coletar respostas e consultar relatorios. Do ponto de vista MCP, a persistencia online passa a organizar o contexto que futuramente podera alimentar conectores para banco de itens, relatorios, matrizes curriculares e IA generativa supervisionada.

## Proxima sprint recomendada

Prioridade tecnica e institucional:

1. implementar Supabase Auth;
2. ativar RLS por perfil e escopo;
3. criar politicas por escola, professor, CREDE/SEFOR e Administrador;
4. fortalecer logs de auditoria;
5. revisar LGPD e termos de uso;
6. automatizar backup;
7. ampliar painel da gestao escolar;
8. preparar exportacoes pedagogicas para apresentacao institucional.
