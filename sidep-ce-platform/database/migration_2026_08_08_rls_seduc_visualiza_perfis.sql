-- SIDEP-CE - Sprint 1: SEDUC passa a enxergar sidep_usuario_perfil
-- Data: 08/08/2026
--
-- Contexto:
-- A tela nova de "Usuarios Regionais e SEDUC" precisa listar quem ja tem
-- conta com perfil regional/seduc. A policy de leitura de
-- sidep_usuario_perfil hoje so libera ver outras linhas para
-- administrador (sidep_is_admin()). SEDUC ja e tratado no mesmo nivel de
-- administrador em todas as outras policies do sistema (sidep_can_access_school,
-- sidep_can_access_professor, escrita de regional/escola/professor) - este
-- ajuste so torna a leitura de perfis consistente com o resto do sistema.
--
-- So altera SELECT. Nao muda quem pode INSERT/UPDATE (isso continua so via
-- Edge Function admin-create-user, que usa service role e ignora RLS).

drop policy if exists sidep_perfil_select_own_or_admin on sidep_usuario_perfil;
create policy sidep_perfil_select_own_or_admin
on sidep_usuario_perfil
for select
to authenticated
using (auth_user_id = auth.uid() or sidep_current_role() in ('administrador', 'seduc'));

select policyname, cmd, roles
from pg_policies
where tablename = 'sidep_usuario_perfil';
