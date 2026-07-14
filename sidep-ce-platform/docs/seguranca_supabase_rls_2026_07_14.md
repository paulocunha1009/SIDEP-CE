# Segurança Supabase - Correção do alerta de tabela pública

Data: 14/07/2026

## Problema identificado

O Supabase enviou alerta crítico informando que há tabela publicamente acessível porque Row-Level Security (RLS) não está habilitado ou porque o banco permite acesso amplo por URL/API pública.

No SIDEP-CE, isso decorre da fase inicial do MVP online. Para validar rapidamente o sistema com Vercel + Supabase, foram criadas policies temporárias para o papel `anon`, permitindo leitura, escrita, atualização e exclusão em tabelas do piloto.

Essa configuração não é segura para dados reais de escolas, professores, estudantes, avaliações e respostas.

## Correção emergencial preparada

Arquivo SQL:

`sidep-ce-platform/database/migration_2026_07_14_security_lockdown_rls.sql`

Essa migração:

- habilita RLS nas tabelas públicas do projeto;
- força RLS nas tabelas públicas do projeto;
- remove policies permissivas do tipo `anon`;
- revoga privilégios amplos do papel `anon`;
- revoga privilégios amplos do papel `authenticated` até que sejam criadas policies seguras por perfil.

## Impacto esperado

Depois de executar essa migração:

- os dados deixam de ficar publicamente acessíveis pela chave anônima;
- o alerta crítico de tabela pública tende a ser resolvido;
- telas do app online que dependem de leitura direta pelo frontend podem parar de carregar dados;
- o sistema precisará da próxima sprint de autenticação segura para voltar a operar online com controle por perfil.

## Próxima sprint necessária

Para o sistema voltar a operar online com segurança, será necessário implantar:

- Supabase Auth;
- tabela de vínculo entre usuário autenticado e perfil SIDEP-CE;
- claims ou tabela de permissões por papel;
- policies RLS por escopo:
  - professor vê apenas suas avaliações e escolas de atuação;
  - gestão escolar vê apenas sua escola;
  - CREDE/SEFOR vê apenas escolas da regional;
  - SEDUC vê dados agregados da rede;
  - administrador gerencia cadastros e senhas;
  - estudante acessa apenas a avaliação pelo código autorizado.

## Recomendação

Se já existem dados reais no Supabase, execute a migração de bloqueio emergencial imediatamente.

Se o sistema ainda está apenas em demonstração sem dados sensíveis, é possível planejar uma janela curta de manutenção para:

1. rodar a migração de bloqueio;
2. implantar Supabase Auth;
3. criar policies por perfil;
4. testar login e escopo;
5. reabrir o piloto online.

Não é recomendado continuar usando policies `anon` com `using (true)` ou `with check (true)` em ambiente com dados institucionais.
