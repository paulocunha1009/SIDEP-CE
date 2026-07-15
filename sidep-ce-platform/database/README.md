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

## Arquivos históricos do piloto

Os arquivos abaixo fizeram parte do MVP/piloto e não devem ser executados em produção sem revisão:

- `migration_2026_07_08_policies_mvp_piloto.sql`
- `migration_2026_07_09_storage_imagens_questoes.sql`
- `migration_2026_07_11_professor_vinculo_multi_escola.sql`

Eles contêm ou podem conter policies antigas para o papel `anon`, usadas apenas para validação inicial. O setup seguro remove essas policies do banco, mas rodar os arquivos históricos depois do setup pode reabrir permissões indevidas.

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
