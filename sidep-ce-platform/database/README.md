# SIDEP-CE - Banco de Dados e Segurança

## Arquivo recomendado para produção

Use este arquivo no SQL Editor do Supabase:

`setup_2026_07_14_supabase_seguro_unico.sql`

Ele consolida:

- bloqueio emergencial de policies públicas;
- RLS forçado;
- criação de `sidep_usuario_perfil`;
- policies por perfil institucional;
- escopo por professor, escola, CREDE/SEFOR, SEDUC e administrador.
- RPC segura para o aluno acessar/enviar prova por código sem ler tabelas diretamente;
- policies de Storage para imagem com upload autenticado.

## Arquivos de reparo

`fix_2026_07_14_reparar_master_admin.sql`

Use apenas se o usuário master/admin aparecer como professor, gestão ou outro perfil incorreto.

`cleanup_2026_07_14_senhas_legadas_pos_auth.sql`

Use apenas depois de confirmar que professores e gestões escolares já acessam pelo Supabase Auth.

## Arquivos históricos do piloto — NÃO EXECUTAR

Os arquivos abaixo fizeram parte do MVP/piloto inicial e foram movidos para
`historico-nao-executar/` justamente para reduzir o risco de reexecução por
engano no SQL Editor:

- `historico-nao-executar/migration_2026_07_08_policies_mvp_piloto.sql`
- `historico-nao-executar/migration_2026_07_09_storage_imagens_questoes.sql`
- `historico-nao-executar/migration_2026_07_11_professor_vinculo_multi_escola.sql`

Eles contêm policies `to anon using(true)` (acesso público total), usadas apenas
para validação inicial do piloto. O setup seguro remove essas policies do banco,
mas rodar qualquer um desses arquivos depois do setup reabre permissões
indevidas. Cada arquivo tem um aviso `NAO EXECUTAR EM PRODUCAO` no topo. Mantidos
apenas como referência histórica de como o RLS evoluiu — nunca colar no SQL
Editor do Supabase em produção.

## Usuários Auth

O SQL não deve criar senhas. Para criar usuários em lote, use:

`app/scripts/bootstrap-auth-users.mjs`

Sempre rode primeiro em simulação:

```powershell
npm run auth:bootstrap
```

Depois execute:

```powershell
npm run auth:bootstrap -- --execute
```

## Service Role

`SUPABASE_SERVICE_ROLE_KEY` nunca deve ir para:

- Vercel;
- `.env.local` do frontend;
- GitHub;
- print de tela;
- código React.

Ela só deve ser usada em terminal local controlado ou em backend/Edge Function segura.

## Edge Functions

`supabase/functions/admin-create-user`

Base segura para criação administrativa de usuários Auth + `sidep_usuario_perfil`.
Ela exige usuário autenticado e valida escopo antes de criar perfil.
O frontend chama esta função ao salvar escola/professor, redefinir senha e ativar/inativar perfil institucional.

Para produção, publique a função no projeto Supabase antes de depender do cadastro automático:

```bash
supabase functions deploy admin-create-user --project-ref qmfrxrvsoiwsfbjlwkfa
```

Configure também `SUPABASE_SERVICE_ROLE_KEY` como secret da função. Essa chave nunca deve ir para o Vercel nem para o código React.
