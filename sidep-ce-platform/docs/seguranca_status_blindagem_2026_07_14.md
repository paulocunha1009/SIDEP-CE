# SIDEP-CE - Status de Segurança e Blindagem

Data: 14/07/2026

## O que foi corrigido

### 1. Acesso público ao banco

O Supabase alertou que havia tabela publicamente acessível. A causa era a fase de MVP, na qual algumas policies `anon` foram usadas para validar rapidamente Vercel + Supabase.

Correção aplicada:

- criação do setup seguro `database/setup_2026_07_14_supabase_seguro_unico.sql`;
- RLS habilitado e forçado;
- policies públicas removidas;
- permissões amplas de `anon` revogadas;
- acesso institucional movido para Supabase Auth.

### 2. Perfis institucionais

Foi criada a tabela:

`sidep_usuario_perfil`

Ela liga o usuário do Supabase Auth ao papel dentro do SIDEP-CE:

- `administrador`;
- `seduc`;
- `regional`;
- `gestao_escolar`;
- `professor`.

As funções de escopo controlam o que cada usuário pode ler/alterar.

### 3. Master/Admin corrigido

Houve um erro operacional: o e-mail master ficou vinculado como `professor`, por isso o sistema cortou os menus administrativos.

Correção criada:

`database/fix_2026_07_14_reparar_master_admin.sql`

O script força o e-mail master para:

- `perfil = administrador`;
- sem escola;
- sem regional;
- sem matrícula de professor;
- ativo.

### 4. Bootstrap de usuários em lote

Foi criado:

`app/scripts/bootstrap-auth-users.mjs`

Ele cria/vincula usuários Auth em lote a partir dos cadastros de escola e professor, com proteção contra redundância:

- não cria Auth duplicado;
- preserva admin, SEDUC e regional;
- ignora e-mail protegido em `SIDEP_MASTER_EMAILS`;
- avisa sobre e-mail duplicado;
- preserva perfil divergente até revisão manual.

### 5. Senhas legadas

O app deixou de selecionar e gravar `senha_inicial_hash` em escola/professor nas rotinas online. A senha oficial agora é a do Supabase Auth.

Regra definida:

- administrador redefine senha pelo Supabase/Auth ou rotina backend futura;
- o sistema não deve exibir senha;
- senha antiga em banco é legado e deve ser removida após migração completa.

## O que ainda precisa ser corrigido para blindagem total

### Prioridade 1 - Acesso do aluno por código

O aluno ainda é o ponto que precisa de maior cuidado arquitetural.

Regra correta:

- aluno não deve ler tabela `questao_mvp` diretamente;
- aluno não deve receber gabarito;
- aluno deve acessar a prova por RPC ou Edge Function;
- a função deve retornar apenas questões daquela avaliação aberta;
- a função deve gravar resposta consolidada com bloqueio de tentativa duplicada.

Status: pendente.

### Prioridade 2 - Cadastro de usuário dentro do sistema

Hoje o bootstrap em lote resolve migração/carga inicial. Para operação estadual, o ideal é uma tela administrativa que crie:

- professor/escola no banco;
- usuário no Supabase Auth;
- vínculo em `sidep_usuario_perfil`;
- auditoria.

Essa rotina deve rodar por backend/Edge Function com service role, nunca pelo navegador.

Status: pendente.

### Prioridade 3 - Limpeza definitiva de senhas legadas

Depois que todos os usuários estiverem no Supabase Auth, executar limpeza controlada:

```sql
update escola set senha_inicial_hash = null;
update professor set senha_inicial_hash = null;
```

Antes disso, fazer backup.

Status: pendente, depende de confirmação de migração Auth completa.

### Prioridade 4 - Storage de imagens

As migrações antigas do storage foram criadas em fase piloto. O ideal é revisar policies do bucket de imagens:

- leitura pública apenas se a imagem não tiver dado sensível;
- escrita apenas autenticada;
- exclusão/alteração apenas autor/admin.

Status: pendente de auditoria no Supabase Storage.

### Prioridade 5 - Auditoria

Fortalecer logs para ações críticas:

- criação/edição/desativação de usuário;
- alteração de perfil;
- abertura/encerramento/exclusão de avaliação;
- exportação de relatório;
- lançamento de prova impressa.

Status: parcialmente implementado.

## Checklist operacional atual

1. Rodar `setup_2026_07_14_supabase_seguro_unico.sql`.
2. Corrigir master, se necessário, com `fix_2026_07_14_reparar_master_admin.sql`.
3. Rodar `auth:bootstrap` em simulação.
4. Rodar `auth:bootstrap -- --execute`.
5. Conferir `sidep_usuario_perfil`.
6. Testar login como administrador.
7. Testar login como professor.
8. Testar login como gestão escolar.
9. Verificar se cada perfil enxerga apenas seu escopo.
10. Não rodar migrações antigas de policies `anon` depois do setup seguro.

## Conclusão

O SIDEP-CE saiu do modelo de piloto aberto e passou para um modelo institucional com Supabase Auth + RLS. Ainda não é correto chamar o sistema de totalmente blindado enquanto o acesso do aluno por código não for migrado para RPC/Edge Function e enquanto não houver rotina administrativa interna para criação segura de usuários.

O estado atual é: **segurança institucional em implantação avançada, com próximos pontos críticos já mapeados**.
