-- SIDEP-CE - Reparo emergencial do perfil Administrador Master
-- Data: 14/07/2026
--
-- Sintoma:
-- O usuario master entra, mas aparece como Professor Tecnico e perde acesso
-- aos menus administrativos.
--
-- Causa:
-- O registro em sidep_usuario_perfil ficou com perfil = 'professor' para
-- o e-mail do administrador.
--
-- Como usar:
-- 1. Troque o e-mail abaixo pelo e-mail usado no login master.
-- 2. Rode no SQL Editor do Supabase.

drop table if exists tmp_sidep_master_reparo;

create temporary table tmp_sidep_master_reparo as
select lower('TROQUE_PELO_EMAIL_DO_MASTER') as email_master;

insert into sidep_usuario_perfil (
  auth_user_id,
  email,
  nome,
  perfil,
  escola_inep,
  regional_codigo,
  professor_matricula,
  ativo,
  alterar_senha_primeiro_login,
  atualizado_em
)
select
  u.id,
  u.email,
  'Administrador Master SIDEP-CE',
  'administrador',
  null,
  null,
  null,
  true,
  false,
  now()
from (
  select u.id, lower(u.email) as email
  from auth.users u
  join tmp_sidep_master_reparo a on lower(u.email) = a.email_master
) u
on conflict (auth_user_id) do update set
  email = excluded.email,
  nome = excluded.nome,
  perfil = 'administrador',
  escola_inep = null,
  regional_codigo = null,
  professor_matricula = null,
  ativo = true,
  alterar_senha_primeiro_login = false,
  atualizado_em = now();

-- Se existir outro registro duplicado com o mesmo e-mail, tambem corrige.
update sidep_usuario_perfil p
set
  nome = 'Administrador Master SIDEP-CE',
  perfil = 'administrador',
  escola_inep = null,
  regional_codigo = null,
  professor_matricula = null,
  ativo = true,
  alterar_senha_primeiro_login = false,
  atualizado_em = now()
from tmp_sidep_master_reparo a
where lower(p.email) = a.email_master;

select
  p.nome,
  p.email,
  p.perfil,
  p.escola_inep,
  p.regional_codigo,
  p.professor_matricula,
  p.ativo,
  p.alterar_senha_primeiro_login
from sidep_usuario_perfil p
join tmp_sidep_master_reparo a on lower(p.email) = a.email_master;

drop table if exists tmp_sidep_master_reparo;
