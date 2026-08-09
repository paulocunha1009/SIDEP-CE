# SIDEP-CE - Sprint 3: vínculo persistente do aluno (matrícula)

Data: 08/08/2026

## Contexto e regra de negócio

Lacuna identificada na Sprint 2: como o aluno acessa só por código da
avaliação + nome completo, e as avaliações são aplicadas em rodadas
curtas (2 descritores por vez), não havia como o sistema saber que o
mesmo aluno respondeu a rodada 1 e a rodada 2, a não ser que o nome
fosse digitado de forma idêntica nas duas vezes.

O usuário forneceu (fora do repositório, por privacidade — ver seção
"Dados pessoais") duas listas reais de alunos (matrícula, nome, e-mail
institucional GSuite) de uma das escolas do piloto, e decidiu:

- **Acesso do aluno passa a aceitar matrícula OU nome completo** (modo
  híbrido, não obrigatório).
- Se a matrícula digitada existir na tabela de referência nova, o
  sistema resolve o nome automaticamente e usa a matrícula como vínculo
  estável entre rodadas.
- Se não existir (escola ainda não importada), o acesso por nome
  continua funcionando exatamente como antes — **nada quebra para quem
  ainda não foi cadastrado**.

## Risco identificado e mitigado

As 2 avaliações reais que ainda estão **abertas** agora
(`INF26-D-3M9FQJ`, `INF26-D-4SPHKM`) são de uma **escola diferente**
da que forneceu as listas de matrícula. Mudar o acesso para exigir
matrícula de todo mundo teria bloqueado esses alunos. O modelo híbrido
resolve isso: a mudança é 100% aditiva, não exige matrícula de ninguém,
só oferece um caminho melhor para quem já foi importado.

## O que foi implementado

- **`database/migration_2026_08_08_aluno_matricula_vinculo.sql`**:
  - Nova tabela `aluno_matricula` (matrícula, nome, e-mail, escola),
    com RLS escopada por escola (staff só vê/edita a própria escola;
    administrador/SEDUC sem restrição).
  - Nova coluna `resposta_avaliacao.matricula` (nula para respostas
    antigas e para alunos ainda não importados).
  - `sidep_obter_avaliacao_publica` e `sidep_enviar_resposta_publica`
    (RPCs públicas usadas pelo aluno) atualizadas: resolvem o texto
    digitado como matrícula primeiro; se não encontrar, tratam como
    nome completo (comportamento idêntico ao anterior).
- **Frontend**: campo de login do aluno aceita matrícula (4-20 dígitos)
  ou nome completo (2+ palavras); rótulo e texto de ajuda mudam
  conforme o modo (online/local); nome exibido durante a prova usa o
  nome resolvido pelo servidor, não o texto digitado (para não mostrar
  o número da matrícula na tela como se fosse o nome). O identificador
  originalmente digitado é preservado internamente e reenviado no envio
  final da prova, para não perder o vínculo com `aluno_matricula`.

## Dados pessoais — como foram tratados

As duas listas de alunos (nome, matrícula, e-mail institucional) **não
foram commitadas no repositório Git** em nenhum momento. Os scripts de
importação (`INSERT`) ficaram só na pasta de rascunho local da sessão,
fora do controle de versão, para o usuário rodar diretamente no SQL
Editor do Supabase. O script de teste pós-migração também ficou fora do
Git pelo mesmo motivo (continha uma matrícula real como exemplo).

## Teste

`tsc -b` e `npm run build`: sem erros. **Testado em modo local** só a
parte de UI (validação aceita matrícula/nome, rótulos corretos) — o
modo local não tem acesso à tabela `aluno_matricula` nem às RPCs, então
a lógica de resolução no banco só pode ser testada contra o Supabase
real.

**Testado em produção pelo usuário em 08/08/2026** (migration + importação
dos 46 alunos já executadas), com roteiro seguro contra avaliações
**já encerradas** (não toca nas 2 avaliações reais ainda abertas, que
são de outra escola):
- `sidep_obter_avaliacao_publica('INF26-D-GR76RC', '<matrícula real>')`
  → resolveu a matrícula corretamente e parou no motivo esperado
  ("Esta avaliação não está aberta para aplicação").
- Mesmo resultado confirmado para a avaliação `INF26-D-W5NJKK` e para o
  acesso por nome completo (compatibilidade). Nenhum efeito colateral —
  a função de leitura não grava nada.

Migration e importação já aplicadas em produção. Falta só publicar o
código do frontend (App.tsx, types.ts, registryRepository.ts) que já
estava pronto aguardando essa validação.

## Extensão: e-mail institucional como identificador também

O usuário levantou uma dúvida importante: trocar "nome" por "matrícula"
**não tira o sistema da LGPD** — matrícula e e-mail institucional
continuam sendo dado pessoal (e, com o e-mail geralmente contendo o
nome, até mais identificável que um nome solto). Isso não muda com essa
extensão; é uma decisão de robustez técnica (evitar erro de digitação),
não de conformidade. Registrado como pendência real: o projeto ainda
não tem política de privacidade/termo de uso formal, e agora liga dado
de aluno entre rodadas — vale revisão formal (idealmente com o
jurídico/DPO da SEDUC) numa próxima etapa, fora do escopo técnico desta
sessão.

Decidido: o login do aluno aceita **matrícula OU e-mail institucional**
(`@aluno.ce.gov.br`) cadastrados, além do nome completo (fallback).
Implementado em `database/migration_2026_08_08_aluno_email_login.sql` —
mesma lógica híbrida e aditiva, só adiciona `lower(email_institucional)
= lower(identificador)` como segunda forma de resolução. Testado pelo
usuário em produção com e-mail real contra avaliação já encerrada:
resolveu corretamente, sem efeito colateral.

## Próximo passo natural (não implementado agora)

Com `resposta_avaliacao.matricula` sendo populado a partir de agora,
fica pronta a base para um relatório "consolidado por aluno" que junte
o desempenho de um mesmo aluno em várias rodadas/avaliações diferentes
— hoje cada avaliação ainda aparece separada nos relatórios. Fica
registrado como próximo item da Sprint 3.
