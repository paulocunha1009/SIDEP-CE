-- SIDEP-CE - reset pedagogico do banco de testes para iniciar banco oficial v2
-- Contexto: as avaliacoes e questoes existentes foram usadas apenas no teste de implantacao.
-- Regra de seguranca: antes de limpar, cria backups idempotentes das tabelas afetadas.

create table if not exists backup_20260802_competencia_mvp_pre_reset as
select * from competencia_mvp;

create table if not exists backup_20260802_descritor_mvp_pre_reset as
select * from descritor_mvp;

create table if not exists backup_20260802_questao_mvp_pre_reset as
select * from questao_mvp;

create table if not exists backup_20260802_avaliacao_mvp_pre_reset as
select * from avaliacao_mvp;

create table if not exists backup_20260802_resposta_avaliacao_pre_reset as
select * from resposta_avaliacao;

insert into log_auditoria (usuario_tipo, acao, entidade, metadados)
values (
  'administrador',
  'reset_pedagogico_banco_itens_matriz_v2',
  'banco_itens',
  jsonb_build_object(
    'matriz_codigo', 'EC-INF-2025',
    'motivo', 'Reset de questoes/avaliacoes de teste para iniciar banco oficial pela matriz curricular v2.',
    'backup_competencias', 'backup_20260802_competencia_mvp_pre_reset',
    'backup_descritores', 'backup_20260802_descritor_mvp_pre_reset',
    'backup_questoes', 'backup_20260802_questao_mvp_pre_reset',
    'backup_avaliacoes', 'backup_20260802_avaliacao_mvp_pre_reset',
    'backup_respostas', 'backup_20260802_resposta_avaliacao_pre_reset'
  )
);

delete from resposta_avaliacao;
delete from avaliacao_mvp;
delete from questao_mvp;
delete from descritor_mvp;
delete from competencia_mvp;

insert into competencia_mvp (codigo, curso_tecnico, descricao, fonte, atualizada_em)
select
  c.codigo_pedagogico as codigo,
  U&'T\00E9cnico em Inform\00E1tica' as curso_tecnico,
  c.descricao,
  'Matriz curricular EC-INF-2025 v2 - catalogo oficial SIDEP-CE' as fonte,
  now() as atualizada_em
from competencia_curricular_v2 c
where c.matriz_codigo = 'EC-INF-2025'
  and c.status = 'ativa'
order by c.componente_codigo
on conflict (codigo) do update set
  curso_tecnico = excluded.curso_tecnico,
  descricao = excluded.descricao,
  fonte = excluded.fonte,
  atualizada_em = now();

insert into descritor_mvp (codigo, competencia_codigo, componente_curricular, descricao, nivel_esperado, atualizada_em)
select
  d.codigo_pedagogico as codigo,
  c.codigo_pedagogico as competencia_codigo,
  case d.componente_codigo
    when 'EC-INF-2025-IB' then U&'INFORM\00C1TICA B\00C1SICA'
    when 'EC-INF-2025-LP1' then U&'L\00D3GICA DE PROGRAMA\00C7\00C3O I'
    when 'EC-INF-2025-LP2' then U&'L\00D3GICA DE PROGRAMA\00C7\00C3O II'
    when 'EC-INF-2025-AMC' then U&'ARQUITETURA E MANUTEN\00C7\00C3O DE COMPUTADORES'
    when 'EC-INF-2025-POO' then U&'PROGRAMA\00C7\00C3O ORIENTADA A OBJETOS'
    when 'EC-INF-2025-SO' then 'SISTEMAS OPERACIONAIS'
    when 'EC-INF-2025-HTML' then 'HTML/CSS'
    when 'EC-INF-2025-DG' then U&'DESIGN GR\00C1FICO'
    when 'EC-INF-2025-PWEB' then U&'PROGRAMA\00C7\00C3O WEB'
    when 'EC-INF-2025-PI' then 'PROJETO INTEGRADOR'
    when 'EC-INF-2025-BD' then 'BANCO DE DADOS'
    when 'EC-INF-2025-LS' then U&'LABORAT\00D3RIO DE SOFTWARE'
    when 'EC-INF-2025-LH' then U&'LABORAT\00D3RIO DE HARDWARE'
    when 'EC-INF-2025-RED' then 'REDES DE COMPUTADORES'
    when 'EC-INF-2025-GC' then U&'GERENCIADOR DE CONTE\00DADO'
    when 'EC-INF-2025-PC' then 'PLANEJAMENTO DE CARREIRA'
    when 'EC-INF-2025-ROB' then U&'NO\00C7\00D5ES DE ROB\00D3TICA'
    else m.nome
  end as componente_curricular,
  d.descricao,
  case d.nivel_tri_inicial
    when 'avancado' then 'avancado'
    when 'intermediario' then 'intermediario'
    else 'basico'
  end as nivel_esperado,
  now() as atualizada_em
from descritor_curricular_v2 d
join competencia_curricular_v2 c on c.codigo = d.competencia_codigo
join matriz_componente_v2 m on m.codigo = d.componente_codigo
where d.matriz_codigo = 'EC-INF-2025'
  and d.status = 'ativo'
order by m.ordem, d.codigo_pedagogico
on conflict (codigo) do update set
  competencia_codigo = excluded.competencia_codigo,
  componente_curricular = excluded.componente_curricular,
  descricao = excluded.descricao,
  nivel_esperado = excluded.nivel_esperado,
  atualizada_em = now();

select 'competencias_mvp' as tabela, count(*)::int as total from competencia_mvp
union all
select 'descritores_mvp', count(*)::int from descritor_mvp
union all
select 'questoes_mvp', count(*)::int from questao_mvp
union all
select 'avaliacoes_mvp', count(*)::int from avaliacao_mvp
union all
select 'respostas_avaliacao', count(*)::int from resposta_avaliacao;
