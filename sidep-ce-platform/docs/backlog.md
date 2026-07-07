# SIDEP-CE - Backlog Tecnico e Pedagogico

Atualizado em: 07/07/2026

## Visao do Produto

O SIDEP-CE e uma plataforma de diagnostico da Educacao Profissional do Ceara. O produto combina banco de itens, avaliacoes por competencias e descritores, respostas consolidadas, relatorios pedagogicos, base pre-TRI e governanca para uso por professor, escola, CREDE/SEFOR, SEDUC e Administrador.

## Sprint 1 - Fundacao do MVP React

Status: concluida.

Entregas:

- aplicacao React + Vite;
- layout responsivo inicial;
- separacao de areas por perfil;
- preservacao do modo local;
- identidade visual inspirada no Governo do Estado, CREDE 3 e CENTEC.

## Sprint 2 - Cadastros institucionais

Status: implementada no MVP.

Entregas:

- cadastro de escola por codigo INEP;
- tipos de escola: EEEP, EEMCP, EEMTI, EEM, EJA, Escola do Campo, EFA e outras;
- vinculo com CREDE/SEFOR;
- cadastro de professor por matricula;
- e-mail institucional, CPF, telefone, perfil e escola de lotacao;
- perfis de professor tecnico e coordenador/professor tecnico;
- usuario de escola baseado em INEP;
- usuario de professor baseado em e-mail institucional.

## Sprint 3 - Banco de itens e curadoria docente

Status: implementada.

Entregas:

- cadastro de competencias;
- cadastro de descritores vinculados a competencias;
- cadastro de questoes vinculadas a descritores;
- nomenclatura `C01`, `C02`... para competencias;
- nomenclatura `D01`, `D02`... para descritores;
- status da questao: `rascunho`, `em_revisao`, `validada`;
- modal "Ver questao";
- validacao, devolucao para revisao e marcacao como rascunho;
- bloqueio de duplicidade por enunciado/alternativas;
- cobertura por competencia e descritor;
- banco piloto de Informatica com 10 competencias, 40 descritores e 441 questoes.

## Sprint 4 - Criador de avaliacoes

Status: implementada.

Entregas:

- criacao de avaliacoes diagnosticas, formativas e finais;
- selecao de componentes;
- regra de 20 a 80 questoes;
- opcoes controladas por componente: 2, 5, 10 ou 20 questoes;
- uso exclusivo de questoes validadas;
- codigo randomico gerado pelo sistema;
- bloqueio definitivo de codigos usados ou excluidos;
- pre-visualizacao como aluno.

## Sprint 5 - Aplicacao do estudante e relatorios

Status: implementada.

Entregas:

- acesso do estudante por codigo da avaliacao e nome completo;
- bloqueio de avaliacao nao aberta;
- embaralhamento da ordem das questoes por estudante;
- bloqueio de segunda tentativa pelo mesmo aluno/codigo;
- respostas consolidadas em JSON;
- relatorios por aluno, avaliacao/turma, descritor, componente e competencia;
- backup semanal JSON.

## Sprint 6 - Supabase, Vercel e migracao online

Status: implementada em piloto controlado.

Entregas:

- schema PostgreSQL criado;
- conexao Supabase via variaveis de ambiente;
- deploy preparado para Vercel;
- tabelas `avaliacao_mvp`, `avaliacao_codigo_bloqueado`, `resposta_avaliacao`;
- tabelas `competencia_mvp`, `descritor_mvp`, `questao_mvp`;
- migracao da base local para Supabase;
- fallback local preservado.

## Sprint 7 - Seguranca institucional

Status: proxima prioridade.

Objetivo:

Transformar o piloto online em ambiente mais seguro para ampliacao.

Historias:

- implementar Supabase Auth;
- ativar RLS nas tabelas;
- criar politicas por perfil;
- limitar escola ao proprio INEP;
- limitar professor as proprias avaliacoes;
- limitar CREDE/SEFOR as escolas da regional;
- permitir Administrador com acesso total;
- registrar logs de auditoria mais completos;
- criar rotina de recuperacao/redefinicao de senha com seguranca.

## Sprint 8 - Gestao escolar e regional

Status: planejada.

Objetivo:

Fortalecer paineis para escola, CREDE/SEFOR e SEDUC.

Historias:

- painel da escola por curso, turma, avaliacao e descritor;
- painel regional por escola e curso;
- indicadores de participacao;
- descritores criticos recorrentes;
- mapa de cobertura do banco de itens;
- registro de intervencoes pedagogicas;
- comparacao entre diagnostico, formativo e final.

## Sprint 9 - Analise classica e preparacao TRI

Status: planejada.

Objetivo:

Evoluir de relatorios diagnosticos iniciais para analise estatistica de itens.

Historias:

- indice de acerto por item;
- dificuldade empirica;
- discriminacao preliminar;
- identificacao de distratores fracos;
- marcacao de itens candidatos a ancora;
- relatorio de itens problematicos;
- definicao de volume minimo para calibracao TRI.

## Sprint 10 - IA Generativa supervisionada

Status: planejada.

Objetivo:

Usar IA como apoio docente, sem substituir decisao pedagogica.

Historias:

- sugerir trilhas de recomposicao por descritor;
- propor atividades contextualizadas;
- gerar rascunhos de feedback para professor;
- apoiar revisao linguistica de itens;
- anonimizar dados antes de uso com IA;
- registrar revisao humana obrigatoria.

## Definition of Done

Uma entrega so e considerada pronta quando:

- compila sem erro;
- funciona em desktop, tablet e celular;
- respeita o perfil de acesso;
- nao expõe diagnostico ao aluno;
- usa apenas itens validados em avaliacoes;
- preserva rastreabilidade por codigo de avaliacao;
- salva ou mantem fallback local sem perda de dados;
- esta documentada;
- foi testada em fluxo professor/gestao/aluno.
