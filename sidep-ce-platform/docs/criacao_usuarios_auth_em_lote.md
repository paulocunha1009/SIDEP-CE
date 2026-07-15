# SIDEP-CE - Criação de Usuários em Lote no Supabase Auth

## Por que este script existe

Depois que o SIDEP-CE passou a usar Supabase Auth + RLS, não basta o professor ou a escola existir nas tabelas antigas. Para entrar no sistema online, cada usuário institucional precisa existir também em `Authentication > Users`.

Criar isso manualmente um por um não escala. Este script cria os usuários em lote a partir dos cadastros já existentes:

- escolas ativas: usa `escola.email_principal`;
- professores ativos: usa `professor.email_institucional`;
- vínculo de perfil: grava automaticamente em `sidep_usuario_perfil`.

## Arquivo

`app/scripts/bootstrap-auth-users.mjs`

## Segurança

O script usa a `SUPABASE_SERVICE_ROLE_KEY`. Essa chave é administrativa e nunca deve ser:

- colocada no `.env` público do Vercel;
- enviada para frontend;
- commitada no GitHub;
- compartilhada em prints.

Use somente no terminal local ou em ambiente administrativo controlado.

## Primeiro: simulação

No PowerShell, dentro da pasta `sidep-ce-platform/app`, rode:

```powershell
$env:SUPABASE_URL="https://SEU-PROJETO.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="COLE_A_SERVICE_ROLE_KEY"
$env:SIDEP_INITIAL_PASSWORD="AGzzcso1$"
npm run auth:bootstrap
```

Sem `--execute`, nada será gravado. O script apenas mostra quem seria criado/vinculado.

## Executar de verdade

Depois de conferir a simulação:

```powershell
npm run auth:bootstrap -- --execute
```

## Criar apenas professores

```powershell
npm run auth:bootstrap -- --include=professores --execute
```

## Criar apenas gestões escolares

```powershell
npm run auth:bootstrap -- --include=escolas --execute
```

## Estratégia de senha

Por padrão, todos os usuários criados recebem a senha definida em:

```powershell
$env:SIDEP_INITIAL_PASSWORD="AGzzcso1$"
```

O perfil é gravado com `alterar_senha_primeiro_login = true`, então o sistema força a troca no primeiro acesso.

Também existe o modo legado:

```powershell
$env:SIDEP_PASSWORD_MODE="legacy"
```

Nesse modo:

- professor usa `senha_inicial_hash` ou `cpf`, se existir;
- escola usa `senha_inicial_hash` ou `codigo_inep`, se existir;
- se não houver dado suficiente, usa `SIDEP_INITIAL_PASSWORD`.

Para ambiente real, o modo mais controlado é usar senha inicial única forte e troca obrigatória no primeiro acesso.

## O que o script não faz

- Não exibe senha de ninguém.
- Não grava a service role key.
- Não cria aluno, porque aluno acessa por código de avaliação e nome.
- Não resolve ainda o fluxo público do aluno por RPC; isso fica para a próxima sprint de segurança.
