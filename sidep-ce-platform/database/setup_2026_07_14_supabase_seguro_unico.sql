-- SIDEP-CE - Setup unico Supabase seguro
-- Rode este arquivo no SQL Editor do Supabase.
-- Ele consolida lockdown RLS + perfis Auth/RLS.

-- SIDEP-CE - Bloqueio emergencial de seguranca RLS
-- Data: 14/07/2026
--
-- Contexto:
-- O piloto online foi habilitado inicialmente com policies permissivas para anon.
-- Isso permitiu validar o MVP, mas nao e aceitavel para uso com dados reais.
--
-- Objetivo:
-- 1. Habilitar RLS em todas as tabelas publicas do projeto.
-- 2. Remover policies anon permissivas criadas para o MVP piloto.
-- 3. Revogar privilegios amplos do papel anon.
--
-- Efeito esperado:
-- - Corrige o risco de tabelas publicamente acessiveis.
-- - O frontend que usa chave publica anon pode perder acesso ate a implantacao
--   de Supabase Auth, Edge Functions ou policies por usuario autenticado.
--
-- ATENCAO:
-- Rode esta migracao quando a prioridade for bloquear exposicao de dados.
-- Depois implemente a sprint de autenticacao segura para restaurar o uso online.

do $$
declare
  tabela record;
begin
  for tabela in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename in (
        'regional',
        'escola',
        'escola_email',
        'eixo_tecnologico',
        'curso_tecnico',
        'escola_curso',
        'professor',
        'professor_vinculo',
        'componente_curricular',
        'turma',
        'competencia',
        'descritor',
        'questao',
        'avaliacao',
        'avaliacao_questao',
        'estudante_aplicacao',
        'resposta',
        'resposta_avaliacao',
        'avaliacao_mvp',
        'avaliacao_codigo_bloqueado',
        'competencia_mvp',
        'descritor_mvp',
        'questao_mvp',
        'log_auditoria'
      )
  loop
    execute format('alter table public.%I enable row level security', tabela.tablename);
    execute format('alter table public.%I force row level security', tabela.tablename);
  end loop;
end $$;

do $$
declare
  politica record;
begin
  for politica in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and (
        policyname like '%_mvp_%_anon'
        or policyname like 'professor_vinculo_mvp_%'
        or policyname like 'sidep_%_anon'
      )
  loop
    execute format('drop policy if exists %I on public.%I', politica.policyname, politica.tablename);
  end loop;
end $$;

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;

-- Mantem authenticated sem policies abertas. As permissoes finais devem ser
-- criadas na sprint de autenticacao por perfil institucional.
revoke all on all tables in schema public from authenticated;
revoke all on all sequences in schema public from authenticated;
revoke all on all functions in schema public from authenticated;

-- ============================================================
-- Segunda parte: Supabase Auth Profiles + RLS por escopo
-- ============================================================

-- SIDEP-CE - Autenticacao institucional segura com Supabase Auth + RLS
-- Data: 14/07/2026
--
-- Rode depois da migracao de bloqueio emergencial.
-- Esta migracao nao reabre acesso anonimo. Ela libera apenas usuarios
-- autenticados e filtrados por perfil institucional.

create extension if not exists pgcrypto;

create table if not exists sidep_usuario_perfil (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  nome text not null,
  perfil text not null check (perfil in ('professor', 'gestao_escolar', 'regional', 'seduc', 'administrador')),
  escola_inep varchar(20),
  regional_codigo varchar(20),
  professor_matricula varchar(40),
  ativo boolean not null default true,
  alterar_senha_primeiro_login boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists sidep_usuario_perfil_email_idx on sidep_usuario_perfil (lower(email));
create index if not exists sidep_usuario_perfil_escola_idx on sidep_usuario_perfil (escola_inep);
create index if not exists sidep_usuario_perfil_regional_idx on sidep_usuario_perfil (regional_codigo);
create index if not exists sidep_usuario_perfil_professor_idx on sidep_usuario_perfil (professor_matricula);

create or replace function sidep_current_profile()
returns sidep_usuario_perfil
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.sidep_usuario_perfil
  where auth_user_id = auth.uid()
    and ativo = true
  limit 1
$$;

create or replace function sidep_current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select perfil from public.sidep_current_profile()
$$;

create or replace function sidep_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select perfil = 'administrador' from public.sidep_current_profile()), false)
$$;

create or replace function sidep_can_access_school(target_inep text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with perfil as (
    select * from public.sidep_current_profile()
  )
  select coalesce((
    select
      p.perfil in ('administrador', 'seduc')
      or (p.perfil = 'gestao_escolar' and p.escola_inep = target_inep)
      or (
        p.perfil = 'regional'
        and exists (
          select 1
          from public.escola e
          join public.regional r on r.id = e.regional_id
          where e.codigo_inep = target_inep
            and r.codigo = p.regional_codigo
        )
      )
      or (
        p.perfil = 'professor'
        and exists (
          select 1
          from public.professor pr
          join public.professor_vinculo pv on pv.professor_id = pr.id and pv.ativo = true
          join public.escola e on e.id = pv.escola_id
          where pr.matricula = p.professor_matricula
            and e.codigo_inep = target_inep
        )
      )
    from perfil p
  ), false)
$$;

create or replace function sidep_can_access_professor(target_matricula text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with perfil as (
    select * from public.sidep_current_profile()
  )
  select coalesce((
    select
      p.perfil in ('administrador', 'seduc')
      or (p.perfil = 'professor' and p.professor_matricula = target_matricula)
      or (
        p.perfil in ('gestao_escolar', 'regional')
        and exists (
          select 1
          from public.professor pr
          left join public.professor_vinculo pv on pv.professor_id = pr.id and pv.ativo = true
          left join public.escola e on e.id = pv.escola_id
          left join public.regional r on r.id = e.regional_id
          where pr.matricula = target_matricula
            and (
              (p.perfil = 'gestao_escolar' and e.codigo_inep = p.escola_inep)
              or (p.perfil = 'regional' and r.codigo = p.regional_codigo)
            )
        )
      )
    from perfil p
  ), false)
$$;

grant usage on schema public to authenticated;
grant execute on function sidep_current_profile() to authenticated;
grant execute on function sidep_current_role() to authenticated;
grant execute on function sidep_is_admin() to authenticated;
grant execute on function sidep_can_access_school(text) to authenticated;
grant execute on function sidep_can_access_professor(text) to authenticated;

grant select, update on sidep_usuario_perfil to authenticated;
grant select, insert, update, delete on regional, escola, escola_email, professor, professor_vinculo to authenticated;
grant select, insert, update, delete on competencia_mvp, descritor_mvp, questao_mvp to authenticated;
grant select, insert, update, delete on avaliacao_mvp, avaliacao_codigo_bloqueado to authenticated;
grant select, insert, update on resposta_avaliacao to authenticated;
grant insert, select on log_auditoria to authenticated;
grant usage, select on all sequences in schema public to authenticated;

alter table sidep_usuario_perfil enable row level security;
alter table sidep_usuario_perfil force row level security;

drop policy if exists sidep_perfil_select_own_or_admin on sidep_usuario_perfil;
create policy sidep_perfil_select_own_or_admin
on sidep_usuario_perfil
for select
to authenticated
using (auth_user_id = auth.uid() or sidep_is_admin());

drop policy if exists sidep_perfil_update_own_password_flag_or_admin on sidep_usuario_perfil;
create policy sidep_perfil_update_own_password_flag_or_admin
on sidep_usuario_perfil
for update
to authenticated
using (auth_user_id = auth.uid() or sidep_is_admin())
with check (auth_user_id = auth.uid() or sidep_is_admin());

alter table regional enable row level security;
alter table regional force row level security;
drop policy if exists sidep_regional_select_scope on regional;
create policy sidep_regional_select_scope
on regional
for select
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or codigo = (select regional_codigo from sidep_current_profile())
);

drop policy if exists sidep_regional_write_admin_seduc on regional;
create policy sidep_regional_write_admin_seduc
on regional
for all
to authenticated
using (sidep_current_role() in ('administrador', 'seduc'))
with check (sidep_current_role() in ('administrador', 'seduc'));

alter table escola enable row level security;
alter table escola force row level security;
drop policy if exists sidep_escola_select_scope on escola;
create policy sidep_escola_select_scope
on escola
for select
to authenticated
using (sidep_can_access_school(codigo_inep));

drop policy if exists sidep_escola_write_admin_regional on escola;
create policy sidep_escola_write_admin_regional
on escola
for insert
to authenticated
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or exists (
    select 1 from regional r
    where r.id = escola.regional_id
      and r.codigo = (select regional_codigo from sidep_current_profile())
      and sidep_current_role() = 'regional'
  )
);

drop policy if exists sidep_escola_update_admin_regional on escola;
create policy sidep_escola_update_admin_regional
on escola
for update
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or exists (
    select 1 from regional r
    where r.id = escola.regional_id
      and r.codigo = (select regional_codigo from sidep_current_profile())
      and sidep_current_role() = 'regional'
  )
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or exists (
    select 1 from regional r
    where r.id = escola.regional_id
      and r.codigo = (select regional_codigo from sidep_current_profile())
      and sidep_current_role() = 'regional'
  )
);

alter table escola_email enable row level security;
alter table escola_email force row level security;
drop policy if exists sidep_escola_email_scope on escola_email;
create policy sidep_escola_email_scope
on escola_email
for all
to authenticated
using (
  exists (
    select 1 from escola e
    where e.id = escola_email.escola_id
      and sidep_can_access_school(e.codigo_inep)
  )
)
with check (
  exists (
    select 1 from escola e
    where e.id = escola_email.escola_id
      and sidep_can_access_school(e.codigo_inep)
  )
);

alter table professor enable row level security;
alter table professor force row level security;
drop policy if exists sidep_professor_select_scope on professor;
create policy sidep_professor_select_scope
on professor
for select
to authenticated
using (sidep_can_access_professor(matricula));

drop policy if exists sidep_professor_write_scope on professor;
drop policy if exists sidep_professor_insert_scope on professor;
create policy sidep_professor_insert_scope
on professor
for insert
to authenticated
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or (
    sidep_current_role() in ('regional', 'gestao_escolar')
    and exists (
      select 1 from escola e
      where e.id = professor.escola_lotacao_id
        and sidep_can_access_school(e.codigo_inep)
    )
  )
);

drop policy if exists sidep_professor_update_scope on professor;
create policy sidep_professor_update_scope
on professor
for update
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or sidep_can_access_professor(matricula)
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or (
    sidep_current_role() in ('regional', 'gestao_escolar')
    and exists (
      select 1 from escola e
      where e.id = professor.escola_lotacao_id
        and sidep_can_access_school(e.codigo_inep)
    )
  )
);

alter table professor_vinculo enable row level security;
alter table professor_vinculo force row level security;
drop policy if exists sidep_professor_vinculo_scope on professor_vinculo;
create policy sidep_professor_vinculo_scope
on professor_vinculo
for all
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or exists (
    select 1
    from professor p
    join escola e on e.id = professor_vinculo.escola_id
    join regional r on r.id = e.regional_id
    where p.id = professor_vinculo.professor_id
      and (
        p.matricula = (select professor_matricula from sidep_current_profile())
        or e.codigo_inep = (select escola_inep from sidep_current_profile())
        or r.codigo = (select regional_codigo from sidep_current_profile())
      )
  )
)
with check (
  sidep_current_role() in ('administrador', 'seduc', 'regional', 'gestao_escolar')
);

alter table competencia_mvp enable row level security;
alter table competencia_mvp force row level security;
drop policy if exists sidep_competencia_staff_select on competencia_mvp;
create policy sidep_competencia_staff_select on competencia_mvp
for select to authenticated
using (sidep_current_role() in ('professor', 'gestao_escolar', 'regional', 'seduc', 'administrador'));
drop policy if exists sidep_competencia_staff_write on competencia_mvp;
create policy sidep_competencia_staff_write on competencia_mvp
for all to authenticated
using (sidep_current_role() in ('professor', 'regional', 'seduc', 'administrador'))
with check (sidep_current_role() in ('professor', 'regional', 'seduc', 'administrador'));

alter table descritor_mvp enable row level security;
alter table descritor_mvp force row level security;
drop policy if exists sidep_descritor_staff_select on descritor_mvp;
create policy sidep_descritor_staff_select on descritor_mvp
for select to authenticated
using (sidep_current_role() in ('professor', 'gestao_escolar', 'regional', 'seduc', 'administrador'));
drop policy if exists sidep_descritor_staff_write on descritor_mvp;
create policy sidep_descritor_staff_write on descritor_mvp
for all to authenticated
using (sidep_current_role() in ('professor', 'regional', 'seduc', 'administrador'))
with check (sidep_current_role() in ('professor', 'regional', 'seduc', 'administrador'));

alter table questao_mvp enable row level security;
alter table questao_mvp force row level security;
drop policy if exists sidep_questao_staff_select on questao_mvp;
create policy sidep_questao_staff_select on questao_mvp
for select to authenticated
using (sidep_current_role() in ('professor', 'gestao_escolar', 'regional', 'seduc', 'administrador'));
drop policy if exists sidep_questao_staff_write on questao_mvp;
create policy sidep_questao_staff_write on questao_mvp
for all to authenticated
using (sidep_current_role() in ('professor', 'regional', 'seduc', 'administrador'))
with check (sidep_current_role() in ('professor', 'regional', 'seduc', 'administrador'));

alter table avaliacao_mvp enable row level security;
alter table avaliacao_mvp force row level security;
drop policy if exists sidep_avaliacao_select_scope on avaliacao_mvp;
create policy sidep_avaliacao_select_scope
on avaliacao_mvp
for select
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
);

drop policy if exists sidep_avaliacao_write_scope on avaliacao_mvp;
create policy sidep_avaliacao_write_scope
on avaliacao_mvp
for all
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or (
    sidep_current_role() in ('gestao_escolar', 'regional')
    and sidep_can_access_school(escola_inep)
  )
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or (
    sidep_current_role() in ('gestao_escolar', 'regional')
    and sidep_can_access_school(escola_inep)
  )
);

alter table avaliacao_codigo_bloqueado enable row level security;
alter table avaliacao_codigo_bloqueado force row level security;
drop policy if exists sidep_codigo_bloqueado_staff_scope on avaliacao_codigo_bloqueado;
create policy sidep_codigo_bloqueado_staff_scope
on avaliacao_codigo_bloqueado
for all
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
);

alter table resposta_avaliacao enable row level security;
alter table resposta_avaliacao force row level security;
drop policy if exists sidep_resposta_select_scope on resposta_avaliacao;
create policy sidep_resposta_select_scope
on resposta_avaliacao
for select
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
);

drop policy if exists sidep_resposta_staff_insert_update_scope on resposta_avaliacao;
create policy sidep_resposta_staff_insert_update_scope
on resposta_avaliacao
for insert
to authenticated
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
);

drop policy if exists sidep_resposta_staff_update_scope on resposta_avaliacao;
create policy sidep_resposta_staff_update_scope
on resposta_avaliacao
for update
to authenticated
using (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
)
with check (
  sidep_current_role() in ('administrador', 'seduc')
  or professor_matricula = (select professor_matricula from sidep_current_profile())
  or sidep_can_access_school(escola_inep)
);

alter table log_auditoria enable row level security;
alter table log_auditoria force row level security;
drop policy if exists sidep_log_insert_authenticated on log_auditoria;
create policy sidep_log_insert_authenticated
on log_auditoria
for insert
to authenticated
with check (sidep_current_role() is not null);

drop policy if exists sidep_log_select_admin on log_auditoria;
create policy sidep_log_select_admin
on log_auditoria
for select
to authenticated
using (sidep_current_role() in ('administrador', 'seduc'));
