# SIDEP-CE - Sprint de Segurança Online com Supabase Auth

Data: 14/07/2026

## Objetivo

Restaurar o uso online do SIDEP-CE sem deixar tabelas públicas. A partir desta sprint, o acesso institucional deve usar Supabase Auth e Row-Level Security por perfil.

## O que muda

- O visitante anônimo não lê mais tabelas do banco.
- Professor, gestão escolar, CREDE/SEFOR, SEDUC e Administrador entram com e-mail e senha do Supabase Auth.
- O app consulta a tabela `sidep_usuario_perfil` para descobrir o perfil e o escopo do usuário.
- As policies RLS filtram dados por professor, escola, regional ou rede estadual.
- O modo local continua funcionando para desenvolvimento e contingência.

## Ordem correta no Supabase

1. Rodar `database/migration_2026_07_14_security_lockdown_rls.sql`.
2. Rodar `database/migration_2026_07_14_supabase_auth_profiles_rls.sql`.
3. Criar usuários em `Authentication > Users`.
4. Para cada usuário criado, cadastrar um vínculo em `sidep_usuario_perfil`.

## Exemplo de vínculo de Administrador Master

Depois de criar o usuário no Supabase Auth, copie o `User UID` e rode:

```sql
insert into sidep_usuario_perfil (
  auth_user_id,
  email,
  nome,
  perfil,
  ativo,
  alterar_senha_primeiro_login
) values (
  'COLE_AQUI_O_USER_UID',
  'seu-email@dominio.com',
  'Administrador Master SIDEP-CE',
  'administrador',
  true,
  false
)
on conflict (auth_user_id) do update set
  email = excluded.email,
  nome = excluded.nome,
  perfil = excluded.perfil,
  ativo = excluded.ativo,
  atualizado_em = now();
```

## Exemplos por perfil

Gestão escolar:

```sql
insert into sidep_usuario_perfil (
  auth_user_id, email, nome, perfil, escola_inep, ativo
) values (
  'USER_UID',
  'escola@escola.ce.gov.br',
  'Gestão Escolar',
  'gestao_escolar',
  'CODIGO_INEP_DA_ESCOLA',
  true
);
```

Professor:

```sql
insert into sidep_usuario_perfil (
  auth_user_id, email, nome, perfil, professor_matricula, ativo
) values (
  'USER_UID',
  'professor@prof.ce.gov.br',
  'Nome do Professor',
  'professor',
  'MATRICULA_DO_PROFESSOR',
  true
);
```

CREDE/SEFOR:

```sql
insert into sidep_usuario_perfil (
  auth_user_id, email, nome, perfil, regional_codigo, ativo
) values (
  'USER_UID',
  'crede03@seduc.ce.gov.br',
  'CREDE 3',
  'regional',
  'CREDE-3',
  true
);
```

SEDUC:

```sql
insert into sidep_usuario_perfil (
  auth_user_id, email, nome, perfil, ativo
) values (
  'USER_UID',
  'seduc@seduc.ce.gov.br',
  'SEDUC Ceará',
  'seduc',
  true
);
```

## Regra de escopo

- Administrador: acessa tudo e pode administrar o sistema.
- SEDUC: acessa visão estadual.
- CREDE/SEFOR: acessa escolas da própria regional.
- Gestão escolar: acessa dados da própria escola.
- Professor: acessa suas avaliações e escolas vinculadas por `professor_vinculo`.

## Observação sobre aluno por código

O acesso do aluno por código não deve abrir tabelas públicas. A próxima etapa segura é criar uma RPC ou Edge Function que:

- recebe código da avaliação e nome do aluno;
- retorna somente a prova aberta, sem gabarito e sem banco completo de itens;
- grava a resposta consolidada em JSON;
- bloqueia nova tentativa do mesmo estudante na mesma avaliação.

Enquanto essa RPC não for implantada, o fluxo impresso/manual permanece como alternativa segura de contingência.
