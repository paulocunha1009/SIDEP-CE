-- SIDEP-CE - Sprint 2: lista detalhada de respostas (somente leitura, uma unica consulta)
select
  r.avaliacao_codigo,
  a.status as status_avaliacao,
  r.estudante_nome,
  r.turma_codigo,
  r.acertos,
  r.total_questoes,
  r.percentual_bruto,
  r.enviado_em
from resposta_avaliacao r
left join avaliacao_mvp a on a.codigo_acesso = r.avaliacao_codigo
order by r.avaliacao_codigo, r.enviado_em;
