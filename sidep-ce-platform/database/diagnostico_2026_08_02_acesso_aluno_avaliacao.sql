-- SIDEP-CE - Diagnostico de acesso do aluno a avaliacao
-- Data: 02/08/2026
--
-- Como usar:
-- 1. No Supabase, abra SQL Editor > New query.
-- 2. Troque INF26-EXEMPLO pelo codigo real da avaliacao.
-- 3. Execute tudo.
-- 4. Leia a coluna "diagnostico".

with alvo as (
  select upper(trim('INF26-EXEMPLO')) as codigo
),
avaliacao as (
  select a.*
  from avaliacao_mvp a
  join alvo on a.codigo_acesso = alvo.codigo
),
questoes_planejadas as (
  select
    a.codigo_acesso,
    item.codigo as questao_codigo,
    item.ordem
  from avaliacao a
  cross join lateral jsonb_array_elements_text(coalesce(a.questoes_codigos, '[]'::jsonb))
    with ordinality as item(codigo, ordem)
),
questoes_conferidas as (
  select
    qp.codigo_acesso,
    qp.questao_codigo,
    qp.ordem,
    q.status,
    q.descritor_codigo,
    q.componente_curricular,
    q.enunciado
  from questoes_planejadas qp
  left join questao_mvp q on q.codigo = qp.questao_codigo
)
select
  case
    when not exists (select 1 from avaliacao) then 'ERRO: avaliacao nao encontrada com esse codigo.'
    when (select status from avaliacao limit 1) <> 'aberta' then 'ERRO: avaliacao existe, mas nao esta ABERTA.'
    when (select jsonb_array_length(coalesce(questoes_codigos, '[]'::jsonb)) from avaliacao limit 1) = 0 then 'ERRO: avaliacao esta aberta, mas nao tem questoes_codigos salvos.'
    when exists (select 1 from questoes_conferidas where status is null) then 'ERRO: existem codigos de questao na avaliacao que nao foram encontrados no banco.'
    when not exists (select 1 from questoes_conferidas where status = 'validada') then 'ERRO: nenhuma questao vinculada esta com status validada.'
    when exists (select 1 from questoes_conferidas where status <> 'validada') then 'ALERTA: ha questoes vinculadas sem status validada; o aluno so recebe as validadas.'
    else 'OK: avaliacao encontrada, aberta e com questoes validadas publicaveis.'
  end as diagnostico,
  (select codigo_acesso from avaliacao limit 1) as codigo,
  (select titulo from avaliacao limit 1) as titulo,
  (select status from avaliacao limit 1) as status,
  (select turma_codigo from avaliacao limit 1) as turma,
  (select curso_tecnico from avaliacao limit 1) as curso,
  (select jsonb_array_length(coalesce(questoes_codigos, '[]'::jsonb)) from avaliacao limit 1) as questoes_salvas_na_avaliacao,
  (select count(*) from questoes_conferidas) as questoes_localizadas_no_json,
  (select count(*) from questoes_conferidas where status = 'validada') as questoes_validadas,
  (select count(*) from questoes_conferidas where status is null) as codigos_de_questao_nao_encontrados,
  (select count(*) from questoes_conferidas where status is not null and status <> 'validada') as questoes_nao_validadas;

-- Teste direto da RPC usada pelo aluno.
-- Troque tambem o codigo abaixo e execute separadamente se precisar.
select sidep_obter_avaliacao_publica('INF26-EXEMPLO', 'Aluno Teste Piloto') as retorno_rpc_aluno;

-- Conferencia de existencia/permissao das funcoes publicas do aluno.
select
  p.proname as funcao,
  pg_get_function_arguments(p.oid) as argumentos,
  has_function_privilege('anon', p.oid, 'execute') as anon_pode_executar,
  has_function_privilege('authenticated', p.oid, 'execute') as authenticated_pode_executar
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('sidep_obter_avaliacao_publica', 'sidep_enviar_resposta_publica');
