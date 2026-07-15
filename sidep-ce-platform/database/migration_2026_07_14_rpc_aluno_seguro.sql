-- SIDEP-CE - RPC segura para acesso do aluno por codigo
-- Data: 14/07/2026
--
-- Objetivo:
-- Permitir que o aluno acesse e envie uma avaliacao aberta sem liberar
-- leitura direta das tabelas avaliacao_mvp, questao_mvp ou resposta_avaliacao.
-- As funcoes rodam como SECURITY DEFINER, validam o codigo e retornam apenas
-- dados necessarios para a prova, sem gabarito.

create or replace function sidep_student_attempt_key(p_codigo text, p_nome text)
returns text
language sql
immutable
as $$
  select lower(regexp_replace(trim(coalesce(p_codigo, '')), '\s+', '', 'g'))
    || ':'
    || lower(regexp_replace(trim(coalesce(p_nome, '')), '\s+', ' ', 'g'))
$$;

create or replace function sidep_obter_avaliacao_publica(p_codigo text, p_nome text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_codigo text := upper(trim(coalesce(p_codigo, '')));
  v_nome text := trim(coalesce(p_nome, ''));
  v_attempt_key text;
  v_avaliacao avaliacao_mvp%rowtype;
  v_questoes jsonb;
begin
  if v_codigo = '' then
    raise exception 'Informe o codigo da avaliacao.';
  end if;

  if array_length(regexp_split_to_array(v_nome, '\s+'), 1) < 2 then
    raise exception 'Informe o nome completo do estudante.';
  end if;

  select *
  into v_avaliacao
  from avaliacao_mvp
  where codigo_acesso = v_codigo
  limit 1;

  if not found then
    raise exception 'Avaliacao nao encontrada.';
  end if;

  if coalesce(v_avaliacao.status, 'rascunho') <> 'aberta' then
    raise exception 'Esta avaliacao nao esta aberta para aplicacao.';
  end if;

  v_attempt_key := sidep_student_attempt_key(v_codigo, v_nome);

  if exists (
    select 1
    from resposta_avaliacao r
    where r.avaliacao_codigo = v_codigo
      and r.estudante_chave = v_attempt_key
  ) then
    raise exception 'Este estudante ja enviou esta avaliacao.';
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'codigo', q.codigo,
      'descritor_codigo', q.descritor_codigo,
      'componente_curricular', q.componente_curricular,
      'enunciado', q.enunciado,
      'alternativa_a', q.alternativa_a,
      'alternativa_b', q.alternativa_b,
      'alternativa_c', q.alternativa_c,
      'alternativa_d', q.alternativa_d,
      'alternativa_e', q.alternativa_e,
      'imagem_url', q.imagem_url
    )
    order by itens.ordem
  ), '[]'::jsonb)
  into v_questoes
  from jsonb_array_elements_text(v_avaliacao.questoes_codigos) with ordinality as itens(codigo, ordem)
  join questao_mvp q on q.codigo = itens.codigo
  where q.status = 'validada';

  if jsonb_array_length(v_questoes) = 0 then
    raise exception 'Avaliacao sem questoes publicadas.';
  end if;

  return jsonb_build_object(
    'attempt_key', v_attempt_key,
    'assessment', jsonb_build_object(
      'titulo', v_avaliacao.titulo,
      'codigo_acesso', v_avaliacao.codigo_acesso,
      'curso_tecnico', v_avaliacao.curso_tecnico,
      'componentes', coalesce(v_avaliacao.componentes, ''),
      'turma_codigo', v_avaliacao.turma_codigo,
      'quantidade_questoes', jsonb_array_length(v_questoes),
      'etapa', v_avaliacao.etapa,
      'questoes_codigos', (
        select jsonb_agg(q->>'codigo')
        from jsonb_array_elements(v_questoes) q
      ),
      'status', v_avaliacao.status,
      'professor_matricula', v_avaliacao.professor_matricula,
      'escola_inep', v_avaliacao.escola_inep,
      'regional_codigo', v_avaliacao.regional_codigo,
      'inicio_em', v_avaliacao.inicio_em,
      'fim_em', v_avaliacao.fim_em,
      'codigo_bloqueado_em', v_avaliacao.codigo_bloqueado_em
    ),
    'questoes', v_questoes
  );
end;
$$;

create or replace function sidep_enviar_resposta_publica(
  p_codigo text,
  p_nome text,
  p_ordem_questoes jsonb,
  p_respostas jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_codigo text := upper(trim(coalesce(p_codigo, '')));
  v_nome text := trim(coalesce(p_nome, ''));
  v_attempt_key text;
  v_avaliacao avaliacao_mvp%rowtype;
  v_total integer;
  v_acertos integer;
  v_percentual numeric(5,2);
  v_descritores jsonb;
  v_componentes jsonb;
  v_resposta_id uuid := gen_random_uuid();
begin
  if array_length(regexp_split_to_array(v_nome, '\s+'), 1) < 2 then
    raise exception 'Informe o nome completo do estudante.';
  end if;

  select *
  into v_avaliacao
  from avaliacao_mvp
  where codigo_acesso = v_codigo
  limit 1;

  if not found then
    raise exception 'Avaliacao nao encontrada.';
  end if;

  if coalesce(v_avaliacao.status, 'rascunho') <> 'aberta' then
    raise exception 'Esta avaliacao nao esta aberta para envio.';
  end if;

  v_attempt_key := sidep_student_attempt_key(v_codigo, v_nome);

  if exists (
    select 1
    from resposta_avaliacao r
    where r.avaliacao_codigo = v_codigo
      and r.estudante_chave = v_attempt_key
  ) then
    raise exception 'Este estudante ja enviou esta avaliacao.';
  end if;

  with ordem as (
    select value::text as codigo, ordinality as ordem
    from jsonb_array_elements_text(coalesce(p_ordem_questoes, '[]'::jsonb)) with ordinality
  ),
  questoes_validas as (
    select
      o.ordem,
      q.codigo,
      q.descritor_codigo,
      q.componente_curricular,
      q.gabarito,
      upper(coalesce(p_respostas ->> q.codigo, '')) as resposta
    from ordem o
    join questao_mvp q on q.codigo = o.codigo
    where q.codigo in (
      select value::text
      from jsonb_array_elements_text(v_avaliacao.questoes_codigos)
    )
      and q.status = 'validada'
  ),
  totais as (
    select
      count(*)::integer as total,
      count(*) filter (where resposta = gabarito)::integer as acertos
    from questoes_validas
  ),
  por_descritor as (
    select jsonb_object_agg(
      descritor_codigo,
      jsonb_build_object(
        'acertos', acertos,
        'total', total,
        'percentual', case when total > 0 then round((acertos::numeric / total::numeric) * 100, 2) else 0 end
      )
    ) as dados
    from (
      select
        descritor_codigo,
        count(*)::integer as total,
        count(*) filter (where resposta = gabarito)::integer as acertos
      from questoes_validas
      group by descritor_codigo
    ) x
  ),
  por_componente as (
    select jsonb_object_agg(
      componente_curricular,
      jsonb_build_object(
        'acertos', acertos,
        'total', total,
        'percentual', case when total > 0 then round((acertos::numeric / total::numeric) * 100, 2) else 0 end
      )
    ) as dados
    from (
      select
        componente_curricular,
        count(*)::integer as total,
        count(*) filter (where resposta = gabarito)::integer as acertos
      from questoes_validas
      group by componente_curricular
    ) x
  )
  select
    t.total,
    t.acertos,
    case when t.total > 0 then round((t.acertos::numeric / t.total::numeric) * 100, 2) else 0 end,
    coalesce(d.dados, '{}'::jsonb),
    coalesce(c.dados, '{}'::jsonb)
  into v_total, v_acertos, v_percentual, v_descritores, v_componentes
  from totais t
  cross join por_descritor d
  cross join por_componente c;

  if v_total is null or v_total = 0 then
    raise exception 'Nenhuma questao valida foi enviada.';
  end if;

  if v_total <> jsonb_array_length(v_avaliacao.questoes_codigos) then
    raise exception 'Envio incompleto ou divergente da avaliacao publicada.';
  end if;

  insert into resposta_avaliacao (
    id,
    avaliacao_codigo,
    avaliacao_titulo,
    estudante_nome,
    estudante_chave,
    turma_codigo,
    curso_tecnico,
    escola_inep,
    professor_matricula,
    etapa,
    ordem_questoes,
    respostas,
    acertos,
    total_questoes,
    percentual_bruto,
    desempenho_por_descritor,
    desempenho_por_componente,
    enviado_em
  ) values (
    v_resposta_id,
    v_avaliacao.codigo_acesso,
    v_avaliacao.titulo,
    v_nome,
    v_attempt_key,
    v_avaliacao.turma_codigo,
    v_avaliacao.curso_tecnico,
    v_avaliacao.escola_inep,
    v_avaliacao.professor_matricula,
    v_avaliacao.etapa,
    p_ordem_questoes,
    p_respostas,
    v_acertos,
    v_total,
    v_percentual,
    v_descritores,
    v_componentes,
    now()
  );

  insert into log_auditoria (
    usuario_tipo,
    acao,
    entidade,
    entidade_id,
    metadados
  ) values (
    'aluno',
    'resposta_avaliacao_enviada_rpc',
    'resposta_avaliacao',
    v_resposta_id,
    jsonb_build_object(
      'avaliacao_codigo', v_codigo,
      'estudante_chave', v_attempt_key,
      'total_questoes', v_total
    )
  );

  return jsonb_build_object(
    'id', v_resposta_id,
    'avaliacao_codigo', v_avaliacao.codigo_acesso,
    'avaliacao_titulo', v_avaliacao.titulo,
    'estudante_nome', v_nome,
    'estudante_chave', v_attempt_key,
    'turma_codigo', v_avaliacao.turma_codigo,
    'curso_tecnico', v_avaliacao.curso_tecnico,
    'escola_inep', v_avaliacao.escola_inep,
    'professor_matricula', v_avaliacao.professor_matricula,
    'etapa', v_avaliacao.etapa,
    'ordem_questoes', p_ordem_questoes,
    'respostas', p_respostas,
    'acertos', v_acertos,
    'total_questoes', v_total,
    'percentual_bruto', v_percentual,
    'desempenho_por_descritor', v_descritores,
    'desempenho_por_componente', v_componentes,
    'enviado_em', now(),
    'origem', 'supabase'
  );
end;
$$;

revoke all on function sidep_obter_avaliacao_publica(text, text) from public;
revoke all on function sidep_enviar_resposta_publica(text, text, jsonb, jsonb) from public;

grant execute on function sidep_obter_avaliacao_publica(text, text) to anon, authenticated;
grant execute on function sidep_enviar_resposta_publica(text, text, jsonb, jsonb) to anon, authenticated;
