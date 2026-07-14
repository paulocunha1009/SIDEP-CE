-- SIDEP-CE - Script assistido para vincular usuarios do Supabase Auth aos perfis do sistema
-- Data: 14/07/2026
--
-- COMO USAR:
-- 1. Primeiro crie os usuarios em Authentication > Users no Supabase.
-- 2. Depois rode este script no SQL Editor.
-- 3. O script procura o usuario pelo e-mail em auth.users e grava o perfil
--    em public.sidep_usuario_perfil, sem precisar copiar o User UID manualmente.
--
-- ATENCAO:
-- Este script nao cria senhas e nao mostra senhas. Senhas ficam no Supabase Auth.
-- Se precisar trocar senha, use Authentication > Users > usuário > reset/update password.

-- ============================================================
-- 1) ADMINISTRADORES / SEDUC / CREDE-SEFOR MANUAIS
-- Edite apenas a lista abaixo.
-- Perfis aceitos: administrador, seduc, regional
-- Para regional, informe regional_codigo. Para admin/seduc, pode deixar null.
-- ============================================================

with usuarios_manuais(email, nome, perfil, regional_codigo) as (
  values
    -- EXEMPLOS: troque pelos e-mails reais criados em Authentication > Users.
    -- ('seu-email@dominio.com', 'Administrador Master SIDEP-CE', 'administrador', null),
    -- ('seduc@seduc.ce.gov.br', 'SEDUC Ceará', 'seduc', null),
    -- ('crede03@seduc.ce.gov.br', 'CREDE 3 Acaraú', 'regional', 'CREDE-3')
    ('troque-seu-email@dominio.com', 'Administrador Master SIDEP-CE', 'administrador', null)
)
insert into sidep_usuario_perfil (
  auth_user_id,
  email,
  nome,
  perfil,
  regional_codigo,
  ativo,
  alterar_senha_primeiro_login
)
select
  u.id,
  lower(m.email),
  m.nome,
  m.perfil,
  m.regional_codigo,
  true,
  false
from usuarios_manuais m
join auth.users u on lower(u.email) = lower(m.email)
where m.email is not null
  and m.email not like '%@dominio.com'
on conflict (auth_user_id) do update set
  email = excluded.email,
  nome = excluded.nome,
  perfil = excluded.perfil,
  regional_codigo = excluded.regional_codigo,
  ativo = true,
  atualizado_em = now();

-- ============================================================
-- 2) GESTAO ESCOLAR AUTOMATICA
-- Para cada escola, se existir um usuario no Supabase Auth com o mesmo
-- e-mail de escola.email_principal, o perfil gestao_escolar sera criado.
-- ============================================================

insert into sidep_usuario_perfil (
  auth_user_id,
  email,
  nome,
  perfil,
  escola_inep,
  ativo,
  alterar_senha_primeiro_login
)
select
  u.id,
  lower(e.email_principal),
  e.nome_oficial,
  'gestao_escolar',
  e.codigo_inep,
  true,
  true
from escola e
join auth.users u on lower(u.email) = lower(e.email_principal)
where e.status = 'ativa'
  and e.email_principal is not null
on conflict (auth_user_id) do update set
  email = excluded.email,
  nome = excluded.nome,
  perfil = excluded.perfil,
  escola_inep = excluded.escola_inep,
  ativo = true,
  atualizado_em = now();

-- ============================================================
-- 3) PROFESSORES AUTOMATICOS
-- Para cada professor, se existir um usuario no Supabase Auth com o mesmo
-- e-mail de professor.email_institucional, o perfil professor sera criado.
-- ============================================================

insert into sidep_usuario_perfil (
  auth_user_id,
  email,
  nome,
  perfil,
  professor_matricula,
  ativo,
  alterar_senha_primeiro_login
)
select
  u.id,
  lower(p.email_institucional),
  p.nome_completo,
  'professor',
  p.matricula,
  true,
  true
from professor p
join auth.users u on lower(u.email) = lower(p.email_institucional)
where p.status = 'ativo'
  and p.email_institucional is not null
on conflict (auth_user_id) do update set
  email = excluded.email,
  nome = excluded.nome,
  perfil = excluded.perfil,
  professor_matricula = excluded.professor_matricula,
  ativo = true,
  atualizado_em = now();

-- ============================================================
-- 4) CONFERENCIA: usuarios ja vinculados
-- ============================================================

select
  p.nome,
  p.email,
  p.perfil,
  p.escola_inep,
  p.regional_codigo,
  p.professor_matricula,
  p.ativo,
  p.alterar_senha_primeiro_login,
  u.created_at,
  u.last_sign_in_at
from sidep_usuario_perfil p
join auth.users u on u.id = p.auth_user_id
order by p.perfil, p.nome;

-- ============================================================
-- 5) CONFERENCIA: escolas/professores sem usuario no Auth
-- Rode para saber quem ainda precisa ser criado em Authentication > Users.
-- ============================================================

select
  'gestao_escolar_sem_auth' as pendencia,
  e.nome_oficial as nome,
  e.email_principal as email,
  e.codigo_inep as referencia
from escola e
left join auth.users u on lower(u.email) = lower(e.email_principal)
where e.status = 'ativa'
  and u.id is null

union all

select
  'professor_sem_auth' as pendencia,
  p.nome_completo as nome,
  p.email_institucional as email,
  p.matricula as referencia
from professor p
left join auth.users u on lower(u.email) = lower(p.email_institucional)
where p.status = 'ativo'
  and u.id is null
order by pendencia, nome;
