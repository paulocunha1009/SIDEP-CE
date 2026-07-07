# SIDEP-CE - Sprint MCP/Scrum de Aplicação, Respostas e Relatórios

## Objetivo

Consolidar o fluxo profissional de aplicação da avaliação diagnóstica, mantendo a separação entre estudante, professor e gestão escolar.

## Regras de negócio aplicadas

- A avaliação possui ciclo de status: `rascunho`, `agendada`, `aberta`, `encerrada` e `corrigida`.
- O estudante só acessa a avaliação quando o status está `aberta`.
- Cada estudante pode enviar apenas uma resposta por código de avaliação e nome normalizado.
- A ordem das questões é embaralhada por tentativa e registrada para auditoria.
- A pré-visualização do professor simula a prova, mas não grava resposta nem altera relatório.
- O estudante não visualiza gabarito, TRI, diagnóstico ou intervenção.

## Entregas técnicas

- Tipo `RespostaAvaliacaoDraft`.
- Repositório de respostas com persistência local e rota Supabase.
- Tabela PostgreSQL `resposta_avaliacao`.
- Registro de acertos, percentual bruto, desempenho por descritor e desempenho por componente.
- Relatórios por aluno, turma/avaliação, descritor, componente e competência.
- Preparação de log de auditoria para envio de respostas em Supabase.

## MCP

Nesta sprint, MCP é usado como camada de coordenação entre:

- modelo pedagógico: competências, descritores e itens;
- modelo operacional: aplicação, respostas, status e auditoria;
- modelo analítico: relatórios, desempenho bruto, pré-TRI e futura calibração TRI.

## Critérios de aceite

- Uma avaliação encerrada ou agendada não pode ser iniciada pelo estudante.
- Uma avaliação aberta pode ser iniciada com código e nome completo.
- Uma segunda tentativa do mesmo estudante no mesmo código é bloqueada.
- A pré-visualização do professor não gera registro de resposta.
- O relatório exibe resultados individuais e agregados.
- O schema SQL contém a tabela de respostas consolidada e índices de consulta.

## Governança administrativa

- O sistema possui usuário `MASTER` com perfil `administrador`.
- O Administrador Master tem acesso total a escolas, profissionais, banco de itens, avaliações e relatórios.
- O Administrador Master pode editar, inativar/reativar e redefinir senha de escolas e profissionais.
- A senha inicial do `MASTER` deve ser alterada no primeiro acesso.

## Adendo - Codigo de avaliacao, rastreabilidade e exclusao segura

Regra incorporada ao MVP em 07/07/2026:

- O codigo da avaliacao deve ser gerado automaticamente pelo sistema, com token randomico e verificacao contra codigos ativos e codigos bloqueados.
- O professor pode gerar outro codigo antes de abrir a avaliacao, mas nao pode alterar o codigo manualmente.
- Depois que a avaliacao e aberta, o codigo torna-se imutavel e passa a ser a chave de rastreabilidade da aplicacao.
- O codigo vincula respostas, turma, professor, escola, etapa, status, relatorios e auditoria.
- Avaliacao criada por engano pode ser excluida apenas quando ainda nao possui respostas registradas.
- Se houver resposta de estudante, a exclusao deve ser bloqueada; nesse caso, a avaliacao deve ser encerrada ou corrigida para preservar historico.
- O codigo de uma avaliacao excluida fica bloqueado definitivamente e nao pode ser reaproveitado em outra aplicacao.

Essa decisao evita colisao de dados, protege a integridade dos relatorios e prepara a futura migracao para PostgreSQL/Supabase com tabela propria de codigos bloqueados e log de auditoria.
