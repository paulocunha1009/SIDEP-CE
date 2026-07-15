-- SIDEP-CE - Limpeza de senhas legadas apos migracao para Supabase Auth
-- Data: 14/07/2026
--
-- ATENCAO:
-- Rode somente depois de confirmar que professores e gestoes escolares
-- ja conseguem acessar pelo Supabase Auth.
--
-- Objetivo:
-- Remover residuos de senha antiga do modelo pre-Auth.

begin;

update escola
set
  senha_inicial_hash = null,
  atualizado_em = now()
where senha_inicial_hash is not null;

update professor
set
  senha_inicial_hash = null,
  atualizado_em = now()
where senha_inicial_hash is not null;

select
  'escolas_com_senha_legada' as indicador,
  count(*) as total
from escola
where senha_inicial_hash is not null

union all

select
  'professores_com_senha_legada' as indicador,
  count(*) as total
from professor
where senha_inicial_hash is not null;

commit;
