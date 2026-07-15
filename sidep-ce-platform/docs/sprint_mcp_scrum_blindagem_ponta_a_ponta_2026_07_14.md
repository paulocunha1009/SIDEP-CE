# SIDEP-CE - Sprint MCP/Scrum de Blindagem Ponta a Ponta

Data: 14/07/2026

## Objetivo da Sprint

Fechar os principais riscos de segurança ainda existentes após a implantação de Supabase Auth + RLS:

1. aluno não pode ler `questao_mvp` diretamente;
2. criação de usuários não deve depender de processo manual um a um;
3. Storage de imagens não deve aceitar upload anônimo;
4. senhas legadas devem sair do fluxo do app;
5. exportações e ações críticas precisam de auditoria.

## MCP - Mapeamento, Controle e Proteção

### Mapeamento

- Fluxo do aluno usava dados já carregados no front.
- App ainda tinha resquício de `senha_inicial_hash`.
- Storage tinha histórico de policies anônimas do MVP.
- Exportações não registravam auditoria.
- Criação em massa de usuários dependia de script local.

### Controle

- Criada RPC pública controlada:
  - `sidep_obter_avaliacao_publica`;
  - `sidep_enviar_resposta_publica`.
- Criada Edge Function base:
  - `supabase/functions/admin-create-user`.
- Criada migração de Storage:
  - `migration_2026_07_14_storage_imagens_seguro.sql`.
- Criada auditoria leve:
  - `registrarAuditoria`;
  - ação `relatorio_exportado`.

### Proteção

- Aluno recebe apenas questões da avaliação aberta, sem gabarito.
- Correção da prova ocorre no banco.
- Tentativa duplicada é bloqueada por `avaliacao_codigo + estudante_chave`.
- Upload de imagem passa a exigir usuário autenticado.
- Service role permanece fora do React.

## Itens Entregues

### 1. RPC segura do aluno

Arquivo:

`database/migration_2026_07_14_rpc_aluno_seguro.sql`

Funções:

- `sidep_obter_avaliacao_publica(codigo, nome)`;
- `sidep_enviar_resposta_publica(codigo, nome, ordem_questoes, respostas)`.

Resultado:

- o aluno acessa por código;
- a prova só abre se estiver `aberta`;
- o aluno não recebe gabarito;
- a resposta é corrigida e gravada no servidor.

### 2. Frontend ajustado

Arquivos:

- `app/src/services/studentRepository.ts`;
- `app/src/types.ts`;
- `app/src/App.tsx`.

Resultado:

- modo local continua funcionando;
- modo Supabase usa RPC segura;
- gabarito não circula no navegador do aluno.

### 3. Edge Function administrativa

Arquivo:

`supabase/functions/admin-create-user/index.ts`

Resultado:

- base para criação segura de usuário Auth + perfil;
- valida usuário autenticado;
- valida escopo do criador;
- usa service role apenas no backend.

### 4. Storage seguro

Arquivo:

`database/migration_2026_07_14_storage_imagens_seguro.sql`

Resultado:

- leitura pública do bucket de imagens, se necessário para prova;
- upload/update/delete apenas autenticados;
- policies anônimas antigas removidas.

### 5. Auditoria de exportações

Arquivo:

`app/src/services/auditRepository.ts`

Resultado:

- exportações de relatório registram ação `relatorio_exportado`;
- falha no log não bloqueia a exportação;
- metadados registram formato, escopo, avaliações e respostas.

## Backlog Pós-Sprint

1. Ligar a Edge Function `admin-create-user` na tela de cadastro de professor/escola.
2. Refinar a policy de Storage para restringir alteração/exclusão ao autor/admin.
3. Criar auditoria para alteração de perfil, abertura/encerramento de avaliação e lançamento impresso.
4. Rodar `cleanup_2026_07_14_senhas_legadas_pos_auth.sql` somente após todos os usuários migrarem para Auth.
5. Testar RPC do aluno em produção com avaliação aberta real.

## Critérios de Aceite

- `npm run build` precisa passar.
- Aluno online deve abrir prova por RPC.
- Aluno online não deve receber campo `gabarito`.
- Resposta online deve ser corrigida no banco.
- Admin continua vendo escopo completo.
- Professor/gestão continuam respeitando RLS.
- Storage não aceita upload anônimo.

## Incremento complementar - Cadastro Auth automatico

Arquivos:

- `app/src/services/institutionalUserRepository.ts`
- `app/src/App.tsx`
- `supabase/functions/admin-create-user/index.ts`

Resultado:

- cadastro de escola continua salvando a escola normalmente e, no modo Supabase, tambem sincroniza o usuario Auth da gestao escolar;
- cadastro de professor/profissional continua salvando o professor normalmente e, no modo Supabase, tambem sincroniza o usuario Auth e o perfil institucional;
- redefinicao de senha de escola/professor passa a atualizar o Auth quando a Edge Function estiver publicada;
- inativacao/reativacao sincroniza `sidep_usuario_perfil.ativo`, bloqueando login quando o perfil ficar inativo;
- se a Edge Function nao estiver publicada, o cadastro principal nao quebra, mas o sistema informa que a sincronizacao Auth falhou.
- redefinicao de senha agora e operacao explicita: se a senha nao tiver no minimo 8 caracteres, a Edge Function retorna erro claro e nao finge sucesso.

Regra operacional:

- escola acessa pelo e-mail institucional principal no Supabase Auth, vinculada ao INEP no SIDEP-CE;
- professor acessa pelo e-mail institucional no Supabase Auth, vinculado a matricula funcional no SIDEP-CE;
- senha inicial recomendada da escola: codigo INEP;
- senha inicial recomendada do professor: CPF;
- primeiro login continua exigindo troca de senha quando `alterar_senha_primeiro_login` estiver ativo.

Backlog atualizado:

1. Publicar/atualizar a Edge Function `admin-create-user` no projeto Supabase online.
2. Refinar a policy de Storage para restringir alteracao/exclusao ao autor/admin.
3. Criar auditoria para abertura/encerramento de avaliacao e lancamento impresso.
4. Rodar `cleanup_2026_07_14_senhas_legadas_pos_auth.sql` somente apos todos os usuarios migrarem para Auth.
5. Testar RPC do aluno em producao com avaliacao aberta real.
