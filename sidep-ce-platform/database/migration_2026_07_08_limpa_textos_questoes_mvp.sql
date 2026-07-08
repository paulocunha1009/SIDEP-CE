-- SIDEP-CE - limpeza de textos quebrados no banco de itens MVP
-- Use no SQL Editor do Supabase quando aparecerem caracteres como:
--   "a parte fisica ... a teclado" ou "a" em enunciados/alternativas.
-- O app tambem saneia em tempo de carregamento, mas esta migracao corrige
-- os registros ja gravados no banco.

create or replace function public.sidep_sanitize_mvp_text(value text)
returns text
language plpgsql
immutable
as $$
declare
  output text := value;
begin
  if output is null then
    return null;
  end if;

  output := replace(output, U&'\00E2\0080\0094', ' - ');
  output := replace(output, U&'\00E2\0080\0093', ' - ');
  output := replace(output, U&'\00E2\0086\0092', '->');
  output := replace(output, U&'\00E2\0089\00A5', '>=');
  output := replace(output, U&'\00E2\0089\00A4', '<=');
  output := replace(output, U&'\00E2\0080\009C', '"');
  output := replace(output, U&'\00E2\0080\009D', '"');
  output := replace(output, U&'\00E2\0080\0098', '''');
  output := replace(output, U&'\00E2\0080\0099', '''');
  output := replace(output, U&'\00C2\00A0', ' ');
  output := replace(output, U&'\00C2\0096', ' - ');
  output := regexp_replace(output, '[[:space:]]+', ' ', 'g');

  return btrim(output);
end;
$$;

update competencia_mvp
set
  curso_tecnico = public.sidep_sanitize_mvp_text(curso_tecnico),
  descricao = public.sidep_sanitize_mvp_text(descricao),
  fonte = public.sidep_sanitize_mvp_text(fonte),
  atualizada_em = now();

update descritor_mvp
set
  componente_curricular = public.sidep_sanitize_mvp_text(componente_curricular),
  descricao = public.sidep_sanitize_mvp_text(descricao),
  atualizada_em = now();

update questao_mvp
set
  componente_curricular = public.sidep_sanitize_mvp_text(componente_curricular),
  enunciado = public.sidep_sanitize_mvp_text(enunciado),
  alternativa_a = public.sidep_sanitize_mvp_text(alternativa_a),
  alternativa_b = public.sidep_sanitize_mvp_text(alternativa_b),
  alternativa_c = public.sidep_sanitize_mvp_text(alternativa_c),
  alternativa_d = public.sidep_sanitize_mvp_text(alternativa_d),
  alternativa_e = public.sidep_sanitize_mvp_text(alternativa_e),
  justificativa = public.sidep_sanitize_mvp_text(justificativa),
  atualizada_em = now();
