-- SIDEP-CE - Policies temporarias para MVP piloto online
-- Contexto:
-- O app ainda nao usa Supabase Auth. Enquanto isso, o frontend acessa o banco
-- com a chave publica anon. Se o RLS estiver ativo sem policies, o banco fica
-- povoado, mas o sistema online nao consegue carregar escolas, professores,
-- avaliacoes, itens e respostas.
--
-- ATENCAO:
-- Estas policies sao permissivas para viabilizar piloto controlado.
-- Antes de uso estadual/producao, substituir por Supabase Auth, RLS por perfil,
-- JWT claims, auditoria e policies por escola/CREDE/SEFOR/professor.

create extension if not exists pgcrypto;

alter table if exists regional enable row level security;
alter table if exists escola enable row level security;
alter table if exists escola_email enable row level security;
alter table if exists professor enable row level security;
alter table if exists competencia_mvp enable row level security;
alter table if exists descritor_mvp enable row level security;
alter table if exists questao_mvp enable row level security;
alter table if exists avaliacao_mvp enable row level security;
alter table if exists avaliacao_codigo_bloqueado enable row level security;
alter table if exists resposta_avaliacao enable row level security;
alter table if exists log_auditoria enable row level security;

do $$
declare
  tabela text;
begin
  foreach tabela in array array[
    'regional',
    'escola',
    'escola_email',
    'professor',
    'competencia_mvp',
    'descritor_mvp',
    'questao_mvp',
    'avaliacao_mvp',
    'avaliacao_codigo_bloqueado',
    'resposta_avaliacao',
    'log_auditoria'
  ]
  loop
    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = tabela
        and policyname = tabela || '_mvp_select_anon'
    ) then
      execute format(
        'create policy %I on public.%I for select to anon using (true)',
        tabela || '_mvp_select_anon',
        tabela
      );
    end if;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = tabela
        and policyname = tabela || '_mvp_insert_anon'
    ) then
      execute format(
        'create policy %I on public.%I for insert to anon with check (true)',
        tabela || '_mvp_insert_anon',
        tabela
      );
    end if;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = tabela
        and policyname = tabela || '_mvp_update_anon'
    ) then
      execute format(
        'create policy %I on public.%I for update to anon using (true) with check (true)',
        tabela || '_mvp_update_anon',
        tabela
      );
    end if;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = tabela
        and policyname = tabela || '_mvp_delete_anon'
    ) then
      execute format(
        'create policy %I on public.%I for delete to anon using (true)',
        tabela || '_mvp_delete_anon',
        tabela
      );
    end if;
  end loop;
end $$;
