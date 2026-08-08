# SIDEP-CE - Sprint 2: Piloto Real em Andamento

Data: 08/08/2026
Contexto: o checklist original de piloto controlado
(`sprint_1_teste_piloto_controlado_2026_07_17.md`) nunca foi executado
formalmente, mas a realidade avançou: **4 avaliações reais já foram
aplicadas** por escolas/professores de verdade, com **70 respostas de
alunos reais** registradas, antes desta sprint começar.

**Atenção durante toda a sprint**: nenhuma ação aqui apagou, alterou ou
interferiu nas avaliações/respostas reais. Toda investigação foi feita com
consultas SQL somente leitura, validadas item por item com o usuário antes
de rodar.

## Estado real confirmado (08/08/2026)

| Avaliação | Escola (INEP) | Professor | Status | Respostas |
|---|---|---|---|---|
| `INF26-D-3M9FQJ` | 23008300 | 07286 | aberta | 7 |
| `INF26-D-4SPHKM` | 23008300 | 07286 | aberta | 21 |
| `INF26-D-GR76RC` | 23545445 | 06797 | encerrada | 19 |
| `INF26-D-W5NJKK` | 23545445 | 06797 | encerrada | 23 |

Total: 70 respostas reais, todas com nomes distintos e plausíveis (sem
sinal de dado de teste ou duplicidade).

## Achado 1: incidente de acesso do aluno já estava corrigido

O histórico do repositório mostra que em 02/08/2026 houve um bug real: a
RPC `sidep_obter_avaliacao_publica` referenciava uma coluna
(`v_avaliacao.regional_codigo`) que **não existe** em `avaliacao_mvp`,
provavelmente bloqueando o acesso de aluno a qualquer avaliação até ser
corrigido (`git log` — commit `6488117`, com diagnóstico específico do
código `INF26-D-A498LH`). Confirmado nesta sprint que a versão em produção
já reflete a correção (`regional_codigo` retorna `null` em vez de
referenciar a coluna inexistente).

## Achado 2: relatórios "confusos" — causa raiz identificada

O usuário relatou números de respostas/acertos confusos em todas as abas
de relatório. Investigação:

1. **Não é duplicidade nem dado de teste** — os 70 registros de resposta
   são de alunos reais e distintos.
2. **Causa real**: duas avaliações diferentes (`3M9FQJ` na escola
   23008300 e `W5NJKK` na escola 23545445) usam o mesmo texto de turma
   ("1ª TEC. INF.") — `turma_codigo` é campo de texto livre, não vinculado
   a uma entidade de turma real. As tabelas de relatório mostravam turma
   sem mostrar a escola, então duas turmas de escolas diferentes com o
   mesmo nome pareciam ser a mesma, inflando a leitura do total.
3. **Achado pedagógico adicional, não é bug**: o relatório pedagógico
   (Descritores/Componentes/Competências) mostrava só os descritores
   `IB-D01` (90% das questões respondidas) e `IB-D02` (10%) — confirmado
   com o usuário que isso é proposital: as avaliações estão sendo
   aplicadas em rodadas de 2 descritores por vez, para não gerar provas
   longas. O relatório está certo — ele reflete só a cobertura aplicada
   até agora, e vai acumular conforme mais rodadas forem aplicadas.

## Correção implementada

Adicionada coluna **Escola** em todas as tabelas de relatório que mostram
avaliação/turma (`app/src/App.tsx`, componente `Reports`): visão geral
("Avaliações recentes"), lista de alunos por avaliação, histórico
individual no escopo, e as exportações Markdown/HTML correspondentes.
Nenhuma mudança de cálculo — só deixa explícito de qual escola é cada
linha, resolvendo a ambiguidade de turmas com nomes iguais.

`tsc -b` e `npm run build` sem erros. Mudança é só de exibição (nova
coluna derivada de dado já carregado), sem alterar nenhum cálculo
existente nem tocar nas tabelas `avaliacao_mvp`/`resposta_avaliacao`.

## Lacunas identificadas para estudo futuro (não implementadas agora)

Discutido com o usuário, registrado para uma sprint futura de relatórios
(Sprint 3):

1. **Sem identificador persistente do aluno entre rodadas de avaliação.**
   Como o acesso é só por código+nome, se o mesmo aluno responder a
   rodada de descritores 1-2 e depois a de 3-4, não há hoje como o sistema
   ligar automaticamente as duas respostas à mesma pessoa (dependeria do
   nome ser digitado de forma idêntica nas duas vezes). O usuário
   considerou a ideia de um vínculo mais forte, mas apontou que isso
   tende a complicar o acesso do aluno (hoje deliberadamente simples: só
   código da prova + nome). Decisão: estudar uma forma de vincular sem
   pesar o acesso, antes de implementar.
2. **Sem controle de cobertura de descritores por turma.** Nada na
   interface indica quais descritores já foram aplicados para uma turma e
   quais ainda faltam nas próximas rodadas — hoje isso é acompanhado só
   de cabeça pelo usuário.

## Próximo passo

Retomar com o usuário se quer seguir aprofundando a Sprint 2 (mais
frentes do piloto real) ou migrar para a Sprint 3 (dashboard/relatórios),
já que as duas lacunas acima se encaixam melhor lá.

---

# Sprint 2 — continuação: 5 melhorias sugeridas pela coorientação

Com base em todo o contexto acumulado do projeto, foram propostas e
implementadas 5 melhorias, priorizadas e validadas uma a uma com o
usuário em 08/08/2026.

## 1. Backup manual dos dados reais

Feito pelo usuário via SQL Editor do Supabase (`select * from
avaliacao_mvp` / `select * from resposta_avaliacao`, exportado em CSV
usando o botão "Download CSV"). Script de referência:
`database/backup_2026_08_08_piloto_real_avaliacoes_respostas.sql`.

## 2. Padronizar turma por escola

**Achado durante a implementação**: o valor padrão do campo Turma na
criação de avaliação estava hardcoded como `"2ª TEC. INF."`
(`app/src/App.tsx`) — provável causa raiz de por que as turmas reais
usavam nomes tão parecidos entre si mesmo sendo de escolas diferentes.

**Correção**: campo Turma deixou de ser texto livre com valor padrão fixo.
Agora é uma seleção das turmas já usadas **naquela escola específica**
(lista construída a partir das avaliações já criadas para o
`escola_inep` selecionado), com opção "+ Nova turma..." que revela um
campo de texto. Isso incentiva reaproveitar a mesma grafia em vez de
criar variações (`"1ª TEC. INF."` vs `"1a TEC INF"` etc.) que fragmentam
os relatórios.

## 3. Validação de permissões dos usuários reais

Confirmado por consulta somente leitura (sem login real, mas validando a
estrutura de dados que a RLS usa):
- Os dois professores reais (`07286` e `06797`) têm perfil Auth ativo e
  corretamente vinculado à própria escola.
- `professor_vinculo` confirma vínculo único, sem cruzamento entre as
  duas escolas.
- Nenhuma avaliação real aponta para uma escola diferente da que o
  professor realmente atende (checagem de cruzamento retornou vazia).

Isso fecha, retroativamente, o item 9 ("Permissões e Segurança") do
checklist original de piloto que nunca tinha sido executado formalmente.

## 4. Alerta de avaliação aberta há muito tempo

Adicionado aviso visual (`app/src/App.tsx`, componente `AssessmentsV2`,
seção "Aplicações criadas"): quando uma avaliação está com status
`aberta` há 3 dias ou mais (calculado a partir de `inicio_em`), aparece
um aviso sugerindo encerrar a aplicação se já tiver terminado. Puramente
visual — não força encerramento automático nem manda notificação (o
projeto não tem infraestrutura de e-mail/push hoje).

## 5. Padrão de nomenclatura de avaliação/turma

Regra de negócio documentada e reforçada com um texto de ajuda no
formulário (não é validação bloqueante, é orientação):

- **Turma**: reaproveitar sempre uma turma já cadastrada para aquela
  escola (dropdown do item 2). Não é mais necessário incluir o nome da
  escola dentro do texto da turma, porque os relatórios agora sempre
  mostram a escola ao lado da turma.
- **Título da avaliação**: sugerido o formato
  `Diagnóstico {curso} - {descritores cobertos} - Rodada {N}` (ex.:
  `"Diagnóstico Informática - IB-D01/D02 - Rodada 1"`), para que cada
  rodada de aplicação (lembrando que o usuário aplica 2 descritores por
  vez) fique identificável só de bater o olho na lista de avaliações,
  sem precisar abrir cada uma para saber o que foi coberto.

## Teste

`tsc -b` e `npm run build` sem erros após cada item. Mudanças 2, 4 e 5
são só de formulário/exibição — não alteram `avaliacao_mvp` nem
`resposta_avaliacao` diretamente, e não afetam avaliações já existentes
(só o formulário de criação/edição). Recomendo testar a criação de uma
nova avaliação de teste após o deploy para confirmar o dropdown de turma
funcionando como esperado.
