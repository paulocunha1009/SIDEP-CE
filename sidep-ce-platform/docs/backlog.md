# SIDEP-CE - Backlog Tecnico e Pedagogico

Atualizado em: 09/07/2026

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
- codigo imutavel apos abertura da avaliacao;
- checagem contra questoes duplicadas na mesma prova;
- checagem contra questoes de contexto muito semelhante na mesma prova;
- pre-visualizacao como aluno;
- selecao de curso por perfil institucional;
- professor visualiza apenas cursos vinculados ao seu cadastro;
- gestao escolar visualiza cursos da escola;
- CREDE/SEFOR visualiza provas das escolas da regional;
- SEDUC e Administrador visualizam todas as provas;
- listagem de aplicacoes criadas organizada por escopo de acesso.

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

## Sprint 6.1 - Qualidade do banco e exportacao curricular

Status: implementada.

Entregas:

- revisao do banco base para reduzir repeticoes de enunciado e contexto;
- normalizacao textual para corrigir problemas de acentuacao e caracteres quebrados;
- rotina de bloqueio de duplicidade ao salvar novas questoes;
- exportacao organizada de cursos, componentes, competencias e descritores em Markdown;
- exportacao em PDF via janela de impressao do navegador;
- selecao de "Todos os cursos" ou curso especifico antes da exportacao;
- documentacao do fluxo de curadoria e exportacao para uso pedagogico e academico.

## Sprint 6.2 - Multcurso, questoes por curso e imagem opcional

Status: implementada no MVP local e preparada para deploy online controlado.

Entregas:

- selecao de curso nas subtelas de competencias, descritores e questoes;
- regra multcurso para evitar choque entre codigos `C01`, `D01` e sequencias de questoes;
- codigo de questao gerado automaticamente por curso;
- sincronizacao curso -> componente -> descritor -> questao;
- ao escolher componente no cadastro de questao, aparecem apenas descritores daquele componente;
- campo opcional de imagem da questao;
- previa da imagem no cadastro;
- exibicao da imagem na prova do estudante;
- exibicao da imagem no modal de validacao docente;
- preservacao da responsividade para questoes com ou sem imagem;
- upload de imagem para Supabase Storage quando o ambiente online esta configurado;
- migracao SQL para bucket `sidep-questoes-imagens` e coluna `imagem_url`;
- documentacao da estrategia recomendada: Supabase Storage para arquivos e URL/metadados no banco.

## Sprint 6.3 - QA responsivo e acessibilidade basica

Status: implementada e validada em build local.

Entregas:

- auditoria da tela inicial nos breakpoints 320, 390, 768, 900, 1366 e 1600 px;
- correcoes globais contra overflow horizontal;
- foco visivel reforcado para teclado;
- botoes pequenos com area minima de toque melhorada;
- tabelas com rolagem horizontal controlada e navegacao por teclado;
- modais, cards, filtros e grids adaptados para celular e janela compartilhada;
- imagens de questoes responsivas;
- documento de QA em `docs/qa_responsividade_acessibilidade_2026_07_09.md`.

## Sprint 7 - Seguranca institucional

Status: proxima prioridade apos deploy das melhorias da Sprint 6.2.

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
- substituir policies permissivas de Storage por regras baseadas em Supabase Auth;
- definir politicas de upload/leitura de imagens por perfil institucional.

Observacao: as rotinas de login e permissao ja existem no MVP, mas a proxima etapa deve levar essa regra para Supabase Auth e RLS real, evitando dependencia de validacao apenas no frontend.

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
- nao permite questoes repetidas ou de mesmo contexto dentro da mesma prova;
- preserva rastreabilidade por codigo de avaliacao;
- salva ou mantem fallback local sem perda de dados;
- esta documentada;
- foi testada em fluxo professor/gestao/aluno.
