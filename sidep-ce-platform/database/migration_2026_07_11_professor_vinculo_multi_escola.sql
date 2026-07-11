-- SIDEP-CE - Vinculo N:N professor-escola para MVP online
-- Data: 11/07/2026
--
-- Objetivo:
-- Permitir que um professor atue em mais de uma escola sem duplicar cadastro.
-- A tabela professor_vinculo ja existe no schema amplo do projeto; esta migracao
-- apenas garante uso seguro dela no MVP React/Supabase.
--
-- Regras:
-- 1. professor.escola_lotacao_id continua sendo a escola principal.
-- 2. professor_vinculo guarda todas as escolas de atuacao.
-- 3. Um mesmo professor nao deve ter dois vinculos ativos iguais com a mesma escola,
--    mesmo ano letivo e mesmo papel.
-- 4. Professores ja cadastrados com escola_lotacao_id ganham automaticamente um
--    vinculo ativo com essa escola.

create extension if not exists pgcrypto;

create table if not exists professor_vinculo (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null references professor(id) on delete cascade,
  escola_id uuid not null references escola(id) on delete cascade,
  curso_tecnico_id uuid references curso_tecnico(id),
  componente_curricular_id uuid references componente_curricular(id),
  turma_id uuid references turma(id),
  ano_letivo integer not null default extract(year from now())::integer,
  papel varchar(40) not null default 'professor'
    check (papel in ('professor', 'coordenador_curso', 'revisor_itens', 'gestor_pedagogico')),
  ativo boolean not null default true
);

alter table professor_vinculo
  add column if not exists ano_letivo integer not null default extract(year from now())::integer;

alter table professor_vinculo
  add column if not exists papel varchar(40) not null default 'professor';

alter table professor_vinculo
  add column if not exists ativo boolean not null default true;

create unique index if not exists professor_vinculo_escola_papel_ano_unique_idx
  on professor_vinculo (professor_id, escola_id, ano_letivo, papel)
;

create index if not exists professor_vinculo_professor_idx
  on professor_vinculo (professor_id);

create index if not exists professor_vinculo_escola_idx
  on professor_vinculo (escola_id);

insert into professor_vinculo (professor_id, escola_id, ano_letivo, papel, ativo)
select
  professor.id,
  professor.escola_lotacao_id,
  extract(year from now())::integer,
  case
    when professor.perfil_acesso = 'coordenador_professor_tecnico' then 'coordenador_curso'
    when professor.perfil_acesso = 'coordenador_escolar' then 'gestor_pedagogico'
    else 'professor'
  end,
  true
from professor
where professor.escola_lotacao_id is not null
on conflict do nothing;

alter table if exists professor_vinculo enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'professor_vinculo'
      and policyname = 'professor_vinculo_mvp_select_anon'
  ) then
    create policy professor_vinculo_mvp_select_anon
      on public.professor_vinculo
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'professor_vinculo'
      and policyname = 'professor_vinculo_mvp_insert_anon'
  ) then
    create policy professor_vinculo_mvp_insert_anon
      on public.professor_vinculo
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'professor_vinculo'
      and policyname = 'professor_vinculo_mvp_update_anon'
  ) then
    create policy professor_vinculo_mvp_update_anon
      on public.professor_vinculo
      for update
      to anon
      using (true)
      with check (true);
  end if;
end $$;
