-- SIDEP-CE - Modelo inicial de banco de dados
-- Banco alvo: PostgreSQL
-- Fase: fundacao institucional + avaliacao diagnostica pre-TRI

create extension if not exists pgcrypto;

create table if not exists regional (
  id uuid primary key default gen_random_uuid(),
  codigo varchar(20) not null unique,
  nome varchar(120) not null,
  tipo varchar(10) not null check (tipo in ('CREDE', 'SEFOR')),
  municipio_sede varchar(120),
  email_institucional varchar(180),
  telefone varchar(30),
  responsavel varchar(160),
  ativa boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists escola (
  id uuid primary key default gen_random_uuid(),
  codigo_inep varchar(20) not null unique,
  nome_oficial varchar(220) not null,
  tipo varchar(40) not null,
  regional_id uuid not null references regional(id),
  municipio varchar(120) not null,
  endereco text,
  email_principal varchar(180) not null,
  telefone varchar(30),
  diretor_nome varchar(160),
  coordenador_ep_nome varchar(160),
  senha_inicial_hash text,
  alterar_senha_primeiro_login boolean not null default true,
  status varchar(20) not null default 'ativa' check (status in ('ativa', 'inativa', 'em_implantacao')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists escola_email (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid not null references escola(id) on delete cascade,
  email varchar(180) not null,
  descricao varchar(120),
  principal boolean not null default false,
  unique (escola_id, email)
);

create table if not exists eixo_tecnologico (
  id uuid primary key default gen_random_uuid(),
  nome varchar(160) not null unique,
  ativo boolean not null default true
);

create table if not exists curso_tecnico (
  id uuid primary key default gen_random_uuid(),
  nome varchar(180) not null,
  eixo_tecnologico_id uuid not null references eixo_tecnologico(id),
  carga_horaria_minima integer,
  cnct_referencia varchar(120),
  ativo boolean not null default true,
  unique (nome, eixo_tecnologico_id)
);

create table if not exists escola_curso (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid not null references escola(id),
  curso_tecnico_id uuid not null references curso_tecnico(id),
  matriz_vigente varchar(80),
  ano_inicio integer,
  ativo boolean not null default true,
  unique (escola_id, curso_tecnico_id, matriz_vigente)
);

create table if not exists professor (
  id uuid primary key default gen_random_uuid(),
  matricula varchar(40) not null unique,
  nome_completo varchar(180) not null,
  cpf varchar(14),
  telefone varchar(30),
  email_institucional varchar(180) not null unique,
  escola_lotacao_id uuid references escola(id),
  perfil_acesso varchar(40) not null default 'professor'
    check (perfil_acesso in ('professor', 'professor_tecnico', 'coordenador_professor_tecnico', 'coordenador_escolar', 'crede', 'seduc', 'administrador')),
  area_formacao varchar(160),
  senha_inicial_hash text,
  alterar_senha_primeiro_login boolean not null default true,
  status varchar(20) not null default 'ativo' check (status in ('ativo', 'afastado', 'removido', 'inativo')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists componente_curricular (
  id uuid primary key default gen_random_uuid(),
  curso_tecnico_id uuid not null references curso_tecnico(id),
  nome varchar(180) not null,
  serie varchar(20),
  semestre varchar(20),
  carga_horaria integer,
  ativo boolean not null default true,
  unique (curso_tecnico_id, nome, serie, semestre)
);

create table if not exists turma (
  id uuid primary key default gen_random_uuid(),
  escola_id uuid not null references escola(id),
  curso_tecnico_id uuid not null references curso_tecnico(id),
  codigo varchar(60) not null,
  serie varchar(20) not null,
  turno varchar(30),
  ano_letivo integer not null,
  quantidade_estudantes integer,
  status varchar(20) not null default 'ativa' check (status in ('ativa', 'concluida', 'inativa')),
  unique (escola_id, codigo, ano_letivo)
);

create table if not exists professor_vinculo (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references professor(id),
  escola_id uuid not null references escola(id),
  curso_tecnico_id uuid references curso_tecnico(id),
  componente_curricular_id uuid references componente_curricular(id),
  turma_id uuid references turma(id),
  ano_letivo integer not null,
  papel varchar(40) not null default 'professor'
    check (papel in ('professor', 'coordenador_curso', 'revisor_itens', 'gestor_pedagogico')),
  ativo boolean not null default true
);

create table if not exists competencia (
  id uuid primary key default gen_random_uuid(),
  curso_tecnico_id uuid not null references curso_tecnico(id),
  codigo varchar(40),
  descricao text not null,
  fonte varchar(120),
  ativo boolean not null default true
);

create table if not exists descritor (
  id uuid primary key default gen_random_uuid(),
  competencia_id uuid not null references competencia(id),
  componente_curricular_id uuid references componente_curricular(id),
  codigo varchar(40) not null,
  descricao text not null,
  nivel_esperado varchar(40),
  ativo boolean not null default true,
  unique (competencia_id, codigo)
);

create table if not exists questao (
  id uuid primary key default gen_random_uuid(),
  descritor_id uuid not null references descritor(id),
  autor_professor_id uuid references professor(id),
  enunciado text not null,
  tipo varchar(30) not null default 'multipla_escolha'
    check (tipo in ('multipla_escolha', 'multipla_resposta', 'situacao_problema', 'rubrica')),
  alternativas jsonb,
  gabarito jsonb,
  justificativa text,
  dificuldade_inicial numeric(5,2) not null default 1.00,
  status varchar(30) not null default 'rascunho'
    check (status in ('rascunho', 'em_revisao', 'validada', 'aplicada', 'revisada', 'suspensa', 'descartada')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists avaliacao (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references professor(id),
  turma_id uuid not null references turma(id),
  titulo varchar(220) not null,
  codigo_acesso varchar(40) not null unique,
  quantidade_questoes integer not null check (quantidade_questoes between 20 and 80),
  status varchar(30) not null default 'rascunho'
    check (status in ('rascunho', 'agendada', 'aberta', 'encerrada', 'corrigida')),
  inicio_em timestamptz,
  fim_em timestamptz,
  criada_em timestamptz not null default now()
);

create table if not exists avaliacao_questao (
  avaliacao_id uuid not null references avaliacao(id) on delete cascade,
  questao_id uuid not null references questao(id),
  ordem integer not null,
  peso_pre_tri numeric(5,2) not null default 1.00,
  primary key (avaliacao_id, questao_id)
);

create table if not exists estudante_aplicacao (
  id uuid primary key default gen_random_uuid(),
  avaliacao_id uuid not null references avaliacao(id),
  nome_completo varchar(180) not null,
  identificador_institucional varchar(80),
  iniciado_em timestamptz not null default now(),
  finalizado_em timestamptz,
  dispositivo varchar(80),
  status varchar(20) not null default 'em_andamento'
    check (status in ('em_andamento', 'finalizada', 'cancelada'))
);

create table if not exists resposta (
  id uuid primary key default gen_random_uuid(),
  estudante_aplicacao_id uuid not null references estudante_aplicacao(id) on delete cascade,
  questao_id uuid not null references questao(id),
  resposta jsonb not null,
  correta boolean,
  tempo_resposta_segundos integer,
  respondida_em timestamptz not null default now(),
  unique (estudante_aplicacao_id, questao_id)
);

-- Registro consolidado usado pelo MVP React/Supabase.
-- Mantem uma tentativa por estudante normalizado e codigo de avaliacao,
-- preserva a ordem sorteada das questoes e os agregados pedagogicos.
create table if not exists resposta_avaliacao (
  id uuid primary key default gen_random_uuid(),
  avaliacao_codigo varchar(40) not null,
  avaliacao_titulo varchar(220) not null,
  estudante_nome varchar(180) not null,
  estudante_chave varchar(260) not null,
  turma_codigo varchar(80) not null,
  curso_tecnico varchar(180) not null,
  escola_inep varchar(20),
  professor_matricula varchar(40),
  etapa varchar(30) not null check (etapa in ('diagnostica', 'formativa', 'final')),
  ordem_questoes jsonb not null,
  respostas jsonb not null,
  acertos integer not null,
  total_questoes integer not null,
  percentual_bruto numeric(5,2) not null,
  desempenho_por_descritor jsonb not null,
  desempenho_por_componente jsonb not null,
  enviado_em timestamptz not null default now(),
  criado_em timestamptz not null default now(),
  unique (avaliacao_codigo, estudante_chave)
);

create index if not exists resposta_avaliacao_codigo_idx on resposta_avaliacao (avaliacao_codigo);
create index if not exists resposta_avaliacao_escola_idx on resposta_avaliacao (escola_inep);
create index if not exists resposta_avaliacao_professor_idx on resposta_avaliacao (professor_matricula);

-- Tabelas leves para o MVP online.
-- Elas preservam o formato atual do React sem quebrar o modo local.
-- A resposta continua consolidada em JSON por aluno/prova, evitando uma linha por alternativa.
create table if not exists avaliacao_mvp (
  codigo_acesso varchar(40) primary key,
  titulo varchar(220) not null,
  curso_tecnico varchar(180) not null,
  componentes text,
  turma_codigo varchar(80) not null,
  quantidade_questoes integer not null check (quantidade_questoes between 20 and 80),
  etapa varchar(30) not null check (etapa in ('diagnostica', 'formativa', 'final')),
  questoes_por_componente jsonb not null default '{}'::jsonb,
  descritores_selecionados jsonb not null default '[]'::jsonb,
  questoes_codigos jsonb not null default '[]'::jsonb,
  status varchar(30) not null default 'rascunho'
    check (status in ('rascunho', 'agendada', 'aberta', 'encerrada', 'corrigida')),
  professor_matricula varchar(40),
  escola_inep varchar(20),
  inicio_em timestamptz,
  fim_em timestamptz,
  codigo_bloqueado_em timestamptz,
  criada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);

create table if not exists avaliacao_codigo_bloqueado (
  codigo varchar(40) primary key,
  motivo varchar(80) not null default 'codigo_usado',
  avaliacao_codigo varchar(40),
  escola_inep varchar(20),
  professor_matricula varchar(40),
  bloqueado_em timestamptz not null default now(),
  metadados jsonb not null default '{}'::jsonb
);

create table if not exists competencia_mvp (
  codigo varchar(40) primary key,
  curso_tecnico varchar(180) not null,
  descricao text not null,
  fonte varchar(180),
  atualizada_em timestamptz not null default now()
);

create table if not exists descritor_mvp (
  codigo varchar(40) primary key,
  competencia_codigo varchar(40) not null references competencia_mvp(codigo) on delete cascade,
  componente_curricular varchar(180) not null,
  descricao text not null,
  nivel_esperado varchar(40) not null check (nivel_esperado in ('basico', 'intermediario', 'avancado')),
  atualizada_em timestamptz not null default now()
);

create table if not exists questao_mvp (
  codigo varchar(60) primary key,
  descritor_codigo varchar(40) not null references descritor_mvp(codigo) on delete cascade,
  componente_curricular varchar(180) not null,
  enunciado text not null,
  alternativa_a text not null,
  alternativa_b text not null,
  alternativa_c text not null,
  alternativa_d text not null,
  alternativa_e text not null,
  gabarito varchar(1) not null check (gabarito in ('A', 'B', 'C', 'D', 'E')),
  justificativa text,
  dificuldade_inicial numeric(5,2) not null default 1.00,
  status varchar(30) not null default 'rascunho' check (status in ('rascunho', 'em_revisao', 'validada')),
  atualizada_em timestamptz not null default now()
);

create index if not exists avaliacao_mvp_escola_idx on avaliacao_mvp (escola_inep);
create index if not exists avaliacao_mvp_professor_idx on avaliacao_mvp (professor_matricula);
create index if not exists avaliacao_mvp_status_idx on avaliacao_mvp (status);
create index if not exists descritor_mvp_competencia_idx on descritor_mvp (competencia_codigo);
create index if not exists questao_mvp_descritor_idx on questao_mvp (descritor_codigo);
create index if not exists questao_mvp_status_idx on questao_mvp (status);

create table if not exists resultado_individual (
  id uuid primary key default gen_random_uuid(),
  estudante_aplicacao_id uuid not null references estudante_aplicacao(id),
  percentual_bruto numeric(5,2) not null,
  escore_pre_tri numeric(8,2),
  nivel_diagnostico varchar(80),
  desempenho_por_descritor jsonb,
  descritores_criticos jsonb,
  gerado_em timestamptz not null default now()
);

create table if not exists intervencao_pedagogica (
  id uuid primary key default gen_random_uuid(),
  avaliacao_id uuid not null references avaliacao(id),
  turma_id uuid not null references turma(id),
  descritor_id uuid references descritor(id),
  professor_id uuid not null references professor(id),
  descricao text not null,
  prazo date,
  status varchar(30) not null default 'planejada'
    check (status in ('planejada', 'em_execucao', 'concluida', 'cancelada')),
  criada_em timestamptz not null default now()
);

create table if not exists log_auditoria (
  id uuid primary key default gen_random_uuid(),
  usuario_tipo varchar(40),
  usuario_id uuid,
  acao varchar(120) not null,
  entidade varchar(80),
  entidade_id uuid,
  metadados jsonb,
  criado_em timestamptz not null default now()
);

