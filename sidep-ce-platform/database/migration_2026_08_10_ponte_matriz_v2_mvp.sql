-- SIDEP-CE - Ponte entre a Matriz Curricular v2 (leitura) e o banco MVP
-- (competencia_mvp/descritor_mvp, o que realmente alimenta as avaliacoes).
--
-- Migracao aditiva e reversivel: adiciona uma coluna nullable de rastreio
-- em competencia_mvp e descritor_mvp, apontando para o registro de origem
-- no catalogo v2 (quando o cadastro tiver sido importado de la). Nao altera
-- nenhum dado existente, nao remove nada, nao mexe em questao_mvp.
--
-- Uso: quando o professor cadastra uma NOVA competencia/descritor a partir
-- do painel "Catalogo curricular versionado" (botao "Usar esta
-- competencia"/"Usar este descritor"), o codigo do registro v2 de origem
-- fica registrado aqui. Cadastros manuais (sem matriz v2 disponivel para o
-- curso) continuam com esse campo nulo, normalmente.
--
-- on delete set null: se o registro v2 correspondente for removido no
-- futuro, o cadastro MVP criado a partir dele NAO e apagado, so perde a
-- referencia de origem.

alter table competencia_mvp
  add column if not exists origem_v2_codigo varchar(80)
    references competencia_curricular_v2(codigo) on delete set null;

alter table descritor_mvp
  add column if not exists origem_v2_codigo varchar(80)
    references descritor_curricular_v2(codigo) on delete set null;

create index if not exists competencia_mvp_origem_v2_idx on competencia_mvp (origem_v2_codigo);
create index if not exists descritor_mvp_origem_v2_idx on descritor_mvp (origem_v2_codigo);
