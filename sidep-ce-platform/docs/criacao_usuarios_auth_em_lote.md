# SIDEP-CE - Criação de Usuários em Lote no Supabase Auth

## Por que este script existe

Depois que o SIDEP-CE passou a usar Supabase Auth + RLS, não basta o professor ou a escola existir nas tabelas antigas. Para entrar no sistema online, cada usuário institucional precisa existir também em `Authentication > Users`.

Criar isso manualmente um por um não escala. Este script cria os usuários em lote a partir dos cadastros já existentes:

- escolas ativas: usa `escola.email_principal`;
- professores ativos: usa `professor.email_institucional`;
- vínculo de perfil: grava automaticamente em `sidep_usuario_perfil`.

Este script é pensado para carga inicial, migração e correções administrativas. Para novos cadastros do dia a dia, o caminho definitivo deve ser uma rotina administrativa dentro do SIDEP-CE, usando backend seguro/Edge Function com service role, para criar o usuário no Auth e o perfil no mesmo fluxo.

## Arquivo

`app/scripts/bootstrap-auth-users.mjs`

## Segurança

O script usa a `SUPABASE_SERVICE_ROLE_KEY`. Essa chave é administrativa e nunca deve ser:

- colocada no `.env` público do Vercel;
- enviada para frontend;
- commitada no GitHub;
- compartilhada em prints.

Use somente no terminal local ou em ambiente administrativo controlado.

## Regras contra redundância

O script foi feito para ser idempotente:

- se o usuário já existe no Supabase Auth, ele não cria outro;
- se o perfil já existe com o mesmo e-mail e mesmo papel, ele apenas atualiza o vínculo;
- se o e-mail aparece duplicado nos cadastros institucionais, o segundo registro é ignorado e aparece no relatório;
- se o e-mail já está vinculado como `administrador`, `seduc` ou `regional`, o perfil é preservado;
- se o e-mail estiver em `SIDEP_MASTER_EMAILS`, ele nunca será tratado pelo bootstrap automático;
- se o e-mail já tem um perfil diferente, o script preserva o perfil existente e pede revisão manual.

Existe a opção `--overwrite-profiles`, mas ela só deve ser usada depois de auditoria, porque pode trocar o papel de um usuário existente.

## Primeiro: simulação

No PowerShell, dentro da pasta `sidep-ce-platform/app`, rode:

```powershell
$env:SUPABASE_URL="https://SEU-PROJETO.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="COLE_A_SERVICE_ROLE_KEY"
$env:SIDEP_INITIAL_PASSWORD="AGzzcso1$"
$env:SIDEP_MASTER_EMAILS="email.master@dominio.com"
npm run auth:bootstrap
```

Sem `--execute`, nada será gravado. O script apenas mostra quem seria criado/vinculado.

## Executar de verdade

Depois de conferir a simulação:

```powershell
npm run auth:bootstrap -- --execute
```

## Sobrescrever perfis existentes

Use somente se tiver certeza de que o cadastro atual está errado:

```powershell
npm run auth:bootstrap -- --execute --overwrite-profiles
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

## Fluxo recomendado para novos usuários

Enquanto a rotina administrativa definitiva não estiver pronta dentro da interface:

1. Cadastre escola/professor normalmente no SIDEP-CE.
2. Rode a simulação do script.
3. Se o relatório estiver correto, rode com `--execute`.
4. O usuário entra com e-mail institucional e senha inicial.
5. O sistema força troca de senha no primeiro acesso.

Quando a rotina definitiva for criada, o cadastro de professor/escola deve fazer tudo em uma única transação lógica:

- validar e-mail único;
- criar usuário no Supabase Auth;
- criar/atualizar `sidep_usuario_perfil`;
- vincular escola/regional/professor;
- registrar auditoria;
- nunca expor a service role no navegador.

## O que o script não faz

- Não exibe senha de ninguém.
- Não grava a service role key.
- Não cria aluno, porque aluno acessa por código de avaliação e nome.
- Não resolve ainda o fluxo público do aluno por RPC; isso fica para a próxima sprint de segurança.
