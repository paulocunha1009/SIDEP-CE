-- SIDEP-CE - Diagnostico pre-Sprint 1 (RLS hardening)
-- Data: 08/08/2026
--
-- Objetivo: confirmar, ANTES de apertar a policy de escrita de avaliacao_mvp,
-- que o professor autor de cada avaliacao real ja tem vinculo formal
-- (professor_vinculo) com a escola gravada na avaliacao. Se alguma linha
-- retornar "professor_tem_vinculo_com_essa_escola = false", a policy nova
-- vai bloquear esse professor de atualizar/encerrar essa avaliacao ate o
-- vinculo ser corrigido. Somente leitura - nao altera nada.

select
  am.codigo_acesso,
  am.professor_matricula,
  am.escola_inep,
  am.status,
  exists (
    select 1
    from professor p
    join professor_vinculo pv on pv.professor_id = p.id and pv.ativo = true
    join escola e on e.id = pv.escola_id
    where p.matricula = am.professor_matricula
      and e.codigo_inep = am.escola_inep
  ) as professor_tem_vinculo_com_essa_escola
from avaliacao_mvp am
order by am.status, am.codigo_acesso;
