# SIDEP-CE - Backlog Técnico Inicial

## Sprint 1 - Cadastros institucionais

Status: em desenvolvimento no MVP React.

### US01 - Cadastrar regional

Como administrador, quero cadastrar CREDEs e SEFORs para vincular escolas à estrutura administrativa correta.

Critérios de aceite:

- informar código, nome e tipo;
- tipo deve ser CREDE ou SEFOR;
- código deve ser único;
- regional pode ser ativada ou inativada.

### US02 - Cadastrar escola

Como administrador, quero cadastrar escolas pelo código INEP para garantir identificação única da unidade escolar.

Critérios de aceite:

- código INEP é obrigatório e único;
- nome oficial é obrigatório;
- tipo da escola é obrigatório;
- regional CREDE/SEFOR é obrigatória;
- município e e-mail institucional principal são obrigatórios;
- permitir múltiplos e-mails adicionais;
- registrar telefone, diretor e coordenador da Educação Profissional quando houver.

### US03 - Cadastrar professor

Como administrador ou coordenação, quero cadastrar professores por matrícula para controlar permissões e vínculos.

Critérios de aceite:

- matrícula é obrigatória e única;
- nome completo é obrigatório;
- telefone pode ser informado;
- e-mail institucional é obrigatório e único;
- professor deve ter perfil de acesso;
- professor pode ser vinculado a escola, curso, componente e turma.

### US04 - Vincular professor a curso e turma

Como coordenação, quero vincular professor a curso, componente e turma para limitar o acesso às avaliações corretas.

Critérios de aceite:

- vínculo exige ano letivo;
- vínculo define papel do professor;
- professor só acessa dados dos vínculos ativos;
- histórico não deve ser apagado.

## Sprint 2 - Banco de itens e curadoria docente

Status: implementada no MVP React em modo local, preparada para integração Supabase/PostgreSQL.

Objetivo: permitir que professores e revisores construam uma base de questões alinhada às matrizes, competências e descritores dos cursos técnicos.

- cadastrar competência;
- cadastrar descritor;
- cadastrar questão;
- informar alternativas, gabarito e justificativa;
- atribuir dificuldade inicial pré-TRI;
- revisar questão;
- aprovar questão;
- listar questões por curso, componente, competência e descritor.

Entregue no MVP:

- tela própria de Banco de Itens;
- cadastro de competência por código, curso, descrição e fonte;
- cadastro de descritor vinculado à competência;
- cadastro de questão vinculada ao descritor;
- alternativas A, B, C, D e E;
- gabarito;
- justificativa pedagógica;
- dificuldade inicial pré-TRI entre 0.1 e 5;
- status da questão: rascunho, em revisão ou validada;
- fila de validação docente com filtro por status;
- botão "Ver questão" com leitura completa do item em pop-up;
- destaque do gabarito, descritor, competência, componente e dificuldade pré-TRI;
- ações de curadoria: validar, voltar para revisão e marcar rascunho;
- cobertura do banco por competência e descritor;
- totais por status: validadas, em revisão e rascunhos;
- persistência local no navegador enquanto o Supabase não estiver configurado.

## Sprint 3 - Avaliações

Status: implementada no MVP React em modo local para o fluxo do professor.

Objetivo: criar avaliações diagnósticas, formativas e finais com 20 a 40 itens, acessíveis por código pelo estudante.

- criar avaliação;
- definir etapa da avaliação;
- definir código de acesso;
- selecionar curso, turma e componentes avaliados;
- selecionar descritores;
- gerar prova com 20 a 40 itens;
- publicar avaliação;
- estudante acessar por código e nome completo;
- ocultar diagnóstico e intervenção da área do estudante.

Entregue no MVP:

- criação de avaliação com título, código, curso, componentes, turma e etapa;
- regra de 20 a 40 questões;
- filtro por curso técnico e componentes avaliados;
- seleção opcional de descritores específicos;
- uso exclusivo de questões com status validada;
- montagem automática da avaliação a partir do Banco de Itens;
- bloqueio de publicação quando não houver itens validados suficientes;
- registro dos códigos das questões selecionadas na avaliação;
- avaliação publicada fica acessível por código na área do estudante.

## Sprint 4 - Área Escola / Gestão Escolar

Status: em implementação no MVP React, com controle de acesso inicial.

Objetivo: permitir que a gestão escolar acompanhe turmas, professores, avaliações, cobertura do banco e relatórios agregados por curso, turma, componente, competência e descritor.

Regras de negócio iniciais:

- a escola deve ser identificada pelo código INEP;
- a gestão só visualiza dados da própria escola, salvo perfis CREDE/SEFOR ou SEDUC;
- relatórios da escola devem ser agregados por curso, turma, série, componente, competência e descritor;
- a gestão deve acompanhar quais avaliações estão em rascunho, publicadas, em aplicação e encerradas;
- a gestão deve acompanhar cobertura do banco de itens por curso da escola;
- a gestão deve visualizar professores vinculados por curso, componente e turma;
- relatórios nominais de estudantes devem respeitar permissões e finalidade pedagógica;
- a escola deve ter indicadores de participação, conclusão, desempenho médio, descritores críticos e evolução após intervenção;
- a gestão não deve alterar gabarito ou validar item sem perfil de revisor autorizado;
- toda ação de gestão deve ser preparada para log de auditoria na versão com banco real.

Entregue no MVP:

- tela de login institucional;
- acesso do aluno separado, com código da prova e nome completo em destaque;
- usuário da escola baseado no código INEP;
- senha inicial da escola baseada no código INEP;
- usuário do professor baseado no e-mail institucional;
- senha inicial do professor baseada no CPF cadastrado;
- troca obrigatória de senha no primeiro acesso;
- Administrador como único perfil autorizado a redefinir senhas;
- CREDE/SEFOR, SEDUC e Administrador com acesso às abas principais;
- filtros de escopo por escola, regional e professor.

## Sprint 5 - Aplicação e resultados

Objetivo: coletar respostas e produzir diagnósticos individuais e por turma.

- iniciar aplicação do estudante;
- registrar respostas por questão;
- calcular percentual bruto;
- calcular escore pré-TRI;
- identificar descritores críticos;
- gerar relatório individual;
- gerar relatório por turma;
- preparar exportação por escola, CREDE/SEFOR e rede.

## Sprint 6 - TRI, IA e intervenção pedagógica

Objetivo: evoluir da análise pré-TRI para calibração TRI, Learning Analytics e apoio de IA generativa sob revisão humana.

- calibrar itens após volume mínimo de respostas;
- estimar parâmetros de dificuldade, discriminação e acerto casual;
- calcular proficiência por estudante;
- agrupar padrões de dificuldade por descritor;
- sugerir trilhas de recomposição;
- registrar intervenção pedagógica;
- acompanhar antes, durante e depois do curso.

## Adendo - Sprint de aplicação, respostas e relatórios

Status: implementada no MVP React em modo local, com rota preparada para Supabase/PostgreSQL.

Entregas:

- status de aplicação da avaliação: rascunho, agendada, aberta, encerrada e corrigida;
- aluno só acessa avaliação com status aberta;
- bloqueio de segunda tentativa pelo mesmo aluno no mesmo código de avaliação;
- ordem de questões embaralhada por tentativa do estudante;
- registro da ordem sorteada das questões para auditoria;
- registro consolidado de respostas por estudante, avaliação e turma;
- cálculo de acertos, total de questões e percentual bruto;
- consolidação de desempenho por descritor e componente;
- relatórios por aluno, avaliação/turma, descritor, componente e competência;
- botão de pré-visualização como aluno na área do professor, sem gravar resposta;
- schema PostgreSQL atualizado com tabela `resposta_avaliacao`, índices e unicidade por avaliação/aluno;
- preparação para log de auditoria no Supabase.
