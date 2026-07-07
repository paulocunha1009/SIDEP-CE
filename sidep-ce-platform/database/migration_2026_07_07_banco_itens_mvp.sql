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

create index if not exists descritor_mvp_competencia_idx on descritor_mvp (competencia_codigo);
create index if not exists questao_mvp_descritor_idx on questao_mvp (descritor_codigo);
create index if not exists questao_mvp_status_idx on questao_mvp (status);
