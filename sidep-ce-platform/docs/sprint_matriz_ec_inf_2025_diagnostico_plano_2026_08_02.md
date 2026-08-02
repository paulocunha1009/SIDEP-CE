# Sprint - Matriz EC-INF-2025 v2

Data: 2026-08-02  
Branch: `codex/matriz-ec-inf-2025`  
Escopo: reorganizacao curricular do curso `Tecnico em Informatica - Escolas do Campo - Matriz 2025`.

## Objetivo

Preparar o SIDEP-CE para receber a matriz curricular versionada `EC-INF-2025`, com componentes, competencias e descritores tecnicos novos, sem quebrar o banco de itens, avaliacoes, respostas, relatorios, permissoes, Supabase ou Vercel.

## Fontes analisadas

- Prompt orientador anexado em `C:\Users\yolep\.codex\attachments\8a7ca95c-e08a-41e8-ae01-4410a574b17a\pasted-text.txt`.
- Catalogo de descritores em `C:\Users\yolep\Documents\Codex\2026-08-02\e\outputs\Matrizes_Descritores_Todas_Disciplinas_Tecnicas_SIDEP_CE_2025.md`.
- Schema atual em `sidep-ce-platform/database/schema.sql`.
- Servicos atuais em `sidep-ce-platform/app/src/services/itemBankRepository.ts` e `sidep-ce-platform/app/src/services/registryRepository.ts`.
- Tipos atuais em `sidep-ce-platform/app/src/types.ts`.

## Diagnostico tecnico

O sistema atual ja possui tabelas MVP para o banco de itens:

- `competencia_mvp`
- `descritor_mvp`
- `questao_mvp`
- `avaliacao_mvp`
- `resposta_avaliacao`

Essas tabelas estao em producao e sustentam as rotinas atuais de cadastro, avaliacao, relatorios, acesso do aluno, resposta online, versao impressa e lancamento de gabarito. Portanto, elas nao devem ser substituidas nesta sprint.

O ponto de risco encontrado e que `competencia_mvp.codigo` e `descritor_mvp.codigo` sao chaves globais. Isso impede cadastrar varios cursos usando simplesmente `C01`, `C02`, `D01`, `D02`, porque um curso poderia colidir com outro no banco.

## Decisao de arquitetura

A matriz nova entra em uma camada versionada `v2`, preservando o MVP atual:

- `matriz_curricular_v2`
- `matriz_componente_v2`
- `competencia_curricular_v2`
- `descritor_curricular_v2`
- `historico_migracao_curricular_v2`
- `v_matriz_ec_inf_2025_descritores`

Assim o sistema passa a ter:

- codigo tecnico unico no banco, por exemplo `EC-INF-2025-IB-D01`;
- codigo pedagogico visivel, por exemplo `IB-D01`;
- codigo curto por componente, por exemplo `D01`;
- vinculo claro entre matriz, curso, componente, competencia e descritor;
- historico de migracao curricular.

## Conteudo preparado

Foi criado o arquivo:

`sidep-ce-platform/database/migration_2026_08_02_matriz_ec_inf_2025_v2.sql`

Ele e aditivo e idempotente. A migracao cadastra:

- 1 matriz curricular: `EC-INF-2025`;
- 17 componentes tecnicos;
- 17 competencias;
- 236 descritores;
- politicas RLS para leitura/escrita por perfis institucionais;
- uma view de consulta consolidada.

## O que esta migracao nao faz

- Nao altera as tabelas MVP atuais.
- Nao remove descritores ou questoes antigas.
- Nao altera avaliacoes ja criadas.
- Nao altera respostas de alunos.
- Nao altera login, Auth, perfis ou permissoes existentes.
- Nao envia automaticamente os dados para o Supabase de producao.

## Regras de negocio preservadas

- O aluno continua acessando apenas por codigo da prova e nome completo.
- Professor, escola, CREDE/SEFOR, SEDUC e administrador continuam respeitando escopo de acesso.
- Avaliacoes ja criadas continuam rastreadas pelo codigo de acesso.
- Questoes atuais continuam ligadas ao banco MVP ate a sprint de integracao visual.
- Os codigos pedagogicos podem se repetir entre cursos somente quando acompanhados do contexto de matriz/componente.

## Proxima sprint recomendada

1. Criar consulta de homologacao local para validar a matriz `EC-INF-2025`.
2. Integrar a interface do Banco de Itens com selecao de matriz/curso/componente. **Iniciado:** a tela ja carrega o catalogo curricular v2 quando a migracao existir no Supabase.
3. Criar rotina de cadastro de questoes v2 sem quebrar `questao_mvp`.
4. Definir ponte entre `descritor_curricular_v2` e `descritor_mvp`, para manter avaliacoes atuais funcionando.
5. Validar RLS em ambiente local/homologacao antes de aplicar no Supabase.
6. Somente depois, aplicar a migracao no SQL Editor do Supabase e testar leitura com usuario autenticado.

## Integracao de interface iniciada

Arquivos adicionados/alterados na segunda etapa da sprint:

- `app/src/services/curricularMatrixRepository.ts`: leitura segura das tabelas v2, com retorno vazio quando a migracao ainda nao foi aplicada.
- `app/src/types.ts`: tipos `MatrizCurricularV2`, `MatrizComponenteV2`, `CompetenciaCurricularV2`, `DescritorCurricularV2` e `CatalogoCurricularV2`.
- `app/src/App.tsx`: carregamento do catalogo v2 no fluxo principal e painel de referencia curricular dentro do Banco de Itens.
- `app/src/styles.css`: layout responsivo para resumo da matriz e tabela de componentes.

Regra preservada: a interface ainda nao usa a matriz v2 para gerar provas. Ela apenas exibe a referencia curricular versionada. A geracao de avaliacoes continua baseada no banco MVP validado, evitando quebra operacional.

Validacao executada:

- `npm.cmd run build` em `sidep-ce-platform/app`.

## Implantacao controlada no Supabase

Em 2026-08-02, a migracao `migration_2026_08_02_matriz_ec_inf_2025_v2.sql` foi aplicada no Supabase do projeto `qmfrxrvsoiwsfbjlwkfa`.

Resultado informado pelo SQL Editor:

- `Success. No rows returned`

Consulta de validacao executada:

```sql
select 'matrizes' as entidade, count(*)::int as total
from matriz_curricular_v2
where codigo = 'EC-INF-2025'
union all
select 'componentes', count(*)::int
from matriz_componente_v2
where matriz_codigo = 'EC-INF-2025'
union all
select 'competencias', count(*)::int
from competencia_curricular_v2
where matriz_codigo = 'EC-INF-2025'
union all
select 'descritores', count(*)::int
from descritor_curricular_v2
where matriz_codigo = 'EC-INF-2025'
union all
select 'view_descritores', count(*)::int
from v_matriz_ec_inf_2025_descritores;
```

Resultado validado:

| Entidade | Total |
|---|---:|
| matrizes | 1 |
| componentes | 17 |
| competencias | 17 |
| descritores | 236 |
| view_descritores | 236 |

Observacao: a migracao foi aplicada somente na camada curricular v2. Nao foram alteradas as tabelas MVP de questoes, avaliacoes, respostas, usuarios ou relatorios.

## Rollback

Como a migracao e aditiva, o rollback logico consiste em nao utilizar as tabelas v2 pela interface. Caso seja necessario remover a estrutura em homologacao, executar drop controlado apenas das tabelas `*_v2` e da view criada, depois de backup. Essa remocao nao deve ser feita em producao sem autorizacao expressa.
