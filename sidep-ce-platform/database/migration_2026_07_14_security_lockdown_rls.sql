-- SIDEP-CE - Bloqueio emergencial de seguranca RLS
-- Data: 14/07/2026
--
-- Contexto:
-- O piloto online foi habilitado inicialmente com policies permissivas para anon.
-- Isso permitiu validar o MVP, mas nao e aceitavel para uso com dados reais.
--
-- Objetivo:
-- 1. Habilitar RLS em todas as tabelas publicas do projeto.
-- 2. Remover policies anon permissivas criadas para o MVP piloto.
-- 3. Revogar privilegios amplos do papel anon.
--
-- Efeito esperado:
-- - Corrige o risco de tabelas publicamente acessiveis.
-- - O frontend que usa chave publica anon pode perder acesso ate a implantacao
--   de Supabase Auth, Edge Functions ou policies por usuario autenticado.
--
-- ATENCAO:
-- Rode esta migracao quando a prioridade for bloquear exposicao de dados.
-- Depois implemente a sprint de autenticacao segura para restaurar o uso online.

do $$
declare
  tabela record;
begin
  for tabela in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename in (
        'regional',
        'escola',
        'escola_email',
        'eixo_tecnologico',
        'curso_tecnico',
        'escola_curso',
        'professor',
        'professor_vinculo',
        'componente_curricular',
        'turma',
        'competencia',
        'descritor',
        'questao',
        'avaliacao',
        'avaliacao_questao',
        'estudante_aplicacao',
        'resposta',
        'resposta_avaliacao',
        'avaliacao_mvp',
        'avaliacao_codigo_bloqueado',
        'competencia_mvp',
        'descritor_mvp',
        'questao_mvp',
        'log_auditoria'
      )
  loop
    execute format('alter table public.%I enable row level security', tabela.tablename);
    execute format('alter table public.%I force row level security', tabela.tablename);
  end loop;
end $$;

do $$
declare
  politica record;
begin
  for politica in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and (
        policyname like '%_mvp_%_anon'
        or policyname like 'professor_vinculo_mvp_%'
        or policyname like 'sidep_%_anon'
      )
  loop
    execute format('drop policy if exists %I on public.%I', politica.policyname, politica.tablename);
  end loop;
end $$;

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;

-- Mantem authenticated sem policies abertas. As permissoes finais devem ser
-- criadas na sprint de autenticacao por perfil institucional.
revoke all on all tables in schema public from authenticated;
revoke all on all sequences in schema public from authenticated;
revoke all on all functions in schema public from authenticated;
