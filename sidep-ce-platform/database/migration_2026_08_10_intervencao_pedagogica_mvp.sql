-- SIDEP-CE - Sprint 5, parte 3: registro de intervencoes pedagogicas
--
-- Tabela nova (nao reaproveita a antiga `intervencao_pedagogica`, que
-- fazia parte do modelo "amplo" original e foi removida do schema.sql na
-- Sprint 4 por nunca ter tido uso real). Segue o padrao MVP (chaves
-- varchar, sem uuid encadeado em tabelas institucionais antigas).
--
-- Regra de negocio confirmada com o usuario em 10/08/2026:
-- - Quem registra: professor (suas proprias turmas) e gestao escolar
--   (sua escola). Regional/SEDUC so visualizam (acompanhamento).
-- - Administrador mantem acesso total de escrita, como em todas as
--   outras tabelas do projeto (papel de suporte/operacao).
-- - Sem campo de "resultado observado" por enquanto (fica pra uma
--   proxima iteracao, se fizer falta com uso real).

create table if not exists intervencao_pedagogica_mvp (
  id uuid primary key default gen_random_uuid(),
  escola_inep varchar(20) not null,
  -- nullable: gestao escolar tambem pode registrar, nem sempre em nome de
  -- um professor especifico.
  professor_matricula varchar(40),
  turma_codigo varchar(80) not null,
  curso_tecnico varchar(180) not null,
  descritor_codigo varchar(40) references descritor_mvp(codigo) on delete set null,
  tipo varchar(30) not null default 'reforco'
    check (tipo in ('reforco', 'recuperacao', 'atendimento_individual', 'outro')),
  status varchar(20) not null default 'planejada'
    check (status in ('planejada', 'realizada', 'cancelada')),
  data_planejada date,
  observacoes text,
  criada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);

create index if not exists intervencao_pedagogica_mvp_escola_idx on intervencao_pedagogica_mvp (escola_inep);
create index if not exists intervencao_pedagogica_mvp_professor_idx on intervencao_pedagogica_mvp (professor_matricula);
create index if not exists intervencao_pedagogica_mvp_descritor_idx on intervencao_pedagogica_mvp (descritor_codigo);

grant select, insert, update, delete on intervencao_pedagogica_mvp to authenticated;

alter table intervencao_pedagogica_mvp enable row level security;
alter table intervencao_pedagogica_mvp force row level security;

drop policy if exists sidep_intervencao_select_scope on intervencao_pedagogica_mvp;
create policy sidep_intervencao_select_scope
on intervencao_pedagogica_mvp
for select
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
);

-- Escrita: professor (suas proprias, escola vinculada), gestao_escolar
-- (sua escola) e administrador (suporte). Regional e seduc ficam de fora
-- de proposito - so acompanham, nao registram.
drop policy if exists sidep_intervencao_write_scope on intervencao_pedagogica_mvp;
create policy sidep_intervencao_write_scope
on intervencao_pedagogica_mvp
for all
to authenticated
using (
  sidep_current_role() = 'administrador'
  or (
    professor_matricula = (select professor_matricula from sidep_current_profile())
    and sidep_can_access_school(escola_inep)
  )
  or (
    sidep_current_role() = 'gestao_escolar'
    and sidep_can_access_school(escola_inep)
  )
)
with check (
  sidep_current_role() = 'administrador'
  or (
    professor_matricula = (select professor_matricula from sidep_current_profile())
    and sidep_can_access_school(escola_inep)
  )
  or (
    sidep_current_role() = 'gestao_escolar'
    and sidep_can_access_school(escola_inep)
  )
);

-- Verificacao pos-migracao
select schemaname, tablename, policyname, cmd
from pg_policies
where tablename = 'intervencao_pedagogica_mvp'
order by cmd;
