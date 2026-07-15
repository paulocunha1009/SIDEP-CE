# SIDEP-CE - Runbook Unico para Ajustar Supabase Seguro

Este roteiro organiza tudo que precisa ser feito no Supabase depois da mudança para autenticação segura.

## Visao geral

Existem duas partes diferentes:

1. **Banco/RLS/perfis**: roda no `SQL Editor` do Supabase.
2. **Usuarios do Authentication**: roda no terminal local com `SUPABASE_SERVICE_ROLE_KEY`.

Por seguranca, nao existe um SQL unico que crie usuarios Auth com senha de forma correta. O Supabase Auth deve ser operado pela API administrativa, usando service role fora do navegador.

## Parte 1 - SQL unico no Supabase

No Supabase:

1. Abra o projeto `SIDEP-CE`.
2. Va em `SQL Editor`.
3. Clique em `New query`.
4. Cole e rode o conteudo deste arquivo unico:

- `database/setup_2026_07_14_supabase_seguro_unico.sql`

Esse arquivo consolidado faz:

- habilitam RLS nas tabelas do projeto;
- removem policies anonimas abertas;
- revogam acesso publico amplo;
- criam `sidep_usuario_perfil`;
- criam funcoes de escopo por perfil;
- liberam policies por usuario autenticado;
- preservam acesso por professor, escola, CREDE/SEFOR, SEDUC e administrador.

Os arquivos separados continuam no projeto apenas como referencia tecnica:

- `database/migration_2026_07_14_security_lockdown_rls.sql`
- `database/migration_2026_07_14_supabase_auth_profiles_rls.sql`

## Parte 2 - Criar/vincular usuarios Auth em lote

No PowerShell, abra:

```powershell
cd "C:\Users\yolep\OneDrive\Documentos\Método TRI e IA\sidep-ce-platform\app"
```

Configure as variaveis:

```powershell
$env:SUPABASE_URL="https://qmfrxrvsoiwsfbjlwkfa.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="COLE_A_SERVICE_ROLE_KEY"
$env:SIDEP_INITIAL_PASSWORD="AGzzcso1$"
```

Primeiro rode em simulacao:

```powershell
npm run auth:bootstrap
```

Se a simulacao estiver correta, execute de verdade:

```powershell
npm run auth:bootstrap -- --execute
```

## O que o bootstrap faz

- cria usuarios no Supabase Auth para escolas ativas usando `escola.email_principal`;
- cria usuarios no Supabase Auth para professores ativos usando `professor.email_institucional`;
- vincula cada Auth user em `sidep_usuario_perfil`;
- nao cria duplicidade se o usuario ja existir;
- preserva perfis sensiveis como `administrador`, `seduc` e `regional`;
- avisa quando houver e-mail duplicado ou perfil divergente;
- marca `alterar_senha_primeiro_login = true`.

## Comandos uteis

Criar apenas professores:

```powershell
npm run auth:bootstrap -- --include=professores --execute
```

Criar apenas gestoes escolares:

```powershell
npm run auth:bootstrap -- --include=escolas --execute
```

Sobrescrever perfil existente, somente depois de auditoria:

```powershell
npm run auth:bootstrap -- --execute --overwrite-profiles
```

## Conferencia no SQL Editor

Depois da execucao, rode:

```sql
select
  p.nome,
  p.email,
  p.perfil,
  p.escola_inep,
  p.regional_codigo,
  p.professor_matricula,
  p.ativo,
  p.alterar_senha_primeiro_login,
  u.created_at,
  u.last_sign_in_at
from sidep_usuario_perfil p
join auth.users u on u.id = p.auth_user_id
order by p.perfil, p.nome;
```

Para localizar cadastros sem Auth:

```sql
select
  'gestao_escolar_sem_auth' as pendencia,
  e.nome_oficial as nome,
  e.email_principal as email,
  e.codigo_inep as referencia
from escola e
left join auth.users u on lower(u.email) = lower(e.email_principal)
where e.status = 'ativa'
  and u.id is null

union all

select
  'professor_sem_auth' as pendencia,
  p.nome_completo as nome,
  p.email_institucional as email,
  p.matricula as referencia
from professor p
left join auth.users u on lower(u.email) = lower(p.email_institucional)
where p.status = 'ativo'
  and u.id is null
order by pendencia, nome;
```

## Fluxo correto daqui para frente

Para nao gerar retrabalho, o SIDEP-CE deve evoluir para uma tela administrativa que, ao cadastrar professor ou gestao escolar, faca em um unico fluxo seguro:

- valida e-mail unico;
- cria usuario no Supabase Auth por backend/Edge Function;
- cria ou atualiza `sidep_usuario_perfil`;
- vincula escola/professor/regional;
- registra auditoria;
- nunca expoe `SUPABASE_SERVICE_ROLE_KEY` no navegador.

Enquanto essa rotina interna nao for criada, use o `auth:bootstrap` sempre apos novos cadastros institucionais.
