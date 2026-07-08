# Manual de Uso - SIDEP-CE v0.7

Atualizado em: 08/07/2026

## 1. Finalidade do sistema

O SIDEP-CE e uma plataforma de avaliacao diagnostica da Educacao Profissional do Ceara. O sistema organiza cursos tecnicos, competencias, descritores, banco de itens, avaliacoes, respostas e relatorios pedagogicos.

O objetivo nao e apenas aplicar prova online. O objetivo e diagnosticar lacunas de aprendizagem tecnica, apoiar intervencoes docentes, acompanhar turmas e preparar uma base de dados para futura calibracao TRI.

## 2. Perfis de acesso

### Aluno

O estudante acessa somente a avaliacao. Ele informa:

- codigo da prova;
- nome completo.

O aluno nao ve relatorios, pesos, diagnostico, parametros pre-TRI/TRI, gabarito ou intervencoes pedagogicas.

### Professor tecnico

O professor acessa a area pedagogica vinculada as suas avaliacoes. Ele pode:

- consultar banco de itens;
- validar, revisar ou devolver questoes para rascunho;
- criar avaliacoes;
- pre-visualizar a prova como aluno;
- acompanhar relatorios das suas aplicacoes.

### Coordenador/professor tecnico

Possui uso semelhante ao professor tecnico, com responsabilidade ampliada sobre curso, curadoria e acompanhamento pedagogico.

### Gestao escolar

A gestao escolar acessa dados da propria escola. Pode:

- cadastrar e acompanhar professores da escola;
- acompanhar avaliacoes da escola;
- visualizar relatorios institucionais;
- apoiar recomposicoes por turma, curso, componente, competencia e descritor.

### CREDE/SEFOR

O perfil regional acessa somente as escolas vinculadas a sua regional. Pode:

- acompanhar escolas da regional;
- visualizar indicadores agregados;
- identificar descritores criticos recorrentes;
- apoiar planejamento regional.

### SEDUC

O perfil SEDUC acessa dados de rede para acompanhamento estrategico e decisao institucional.

### Administrador master

O Administrador possui acesso total ao sistema. Somente esse perfil pode:

- redefinir senhas;
- editar, inativar e controlar cadastros de forma ampla;
- subir a base local para o Supabase;
- executar rotinas administrativas de migracao e verificacao.

## 3. Login e primeiro acesso

### Aluno

O aluno nao cria conta. Ele entra pela tela inicial, em "Aluno", informando:

- codigo da prova;
- nome completo.

### Escola

O usuario da escola e o codigo INEP. No primeiro acesso, a senha inicial recomendada e o proprio INEP.

### Professor

O usuario do professor e o e-mail institucional cadastrado. No primeiro acesso, a senha inicial recomendada e o CPF cadastrado.

### Recuperacao de senha

Se o professor ou a escola esquecer a senha, a redefinicao deve ser feita pelo Administrador master.

## 4. Banco de itens

O banco de itens e a base pedagogica do SIDEP-CE. Ele e organizado em:

1. curso tecnico;
2. componente curricular;
3. competencia;
4. descritor;
5. questao.

### Competencia

Competencia e uma capacidade ampla de mobilizar conhecimentos, habilidades, atitudes e procedimentos em situacoes tecnicas.

Exemplo: `C02 - Resolver problemas computacionais por meio de logica de programacao`.

### Descritor

Descritor e a evidencia observavel e avaliavel da competencia. E mais especifico e orienta a criacao de itens, rubricas e relatorios.

Exemplo: `D05 - Decompor problemas em entradas, processamento e saidas`.

### Questao

Questao e o item que mede um descritor. Cada questao deve ter:

- enunciado claro;
- alternativas;
- gabarito;
- justificativa;
- componente curricular;
- competencia;
- descritor;
- dificuldade inicial;
- status de curadoria.

## 5. Status das questoes

### Rascunho

Questao em elaboracao ou devolvida para ajuste. Nao entra em avaliacao.

### Em revisao

Questao aguardando leitura e validacao docente. Nao entra em avaliacao.

### Validada

Questao revisada e liberada para compor avaliacoes.

Regra central: somente questoes validadas podem entrar em prova.

## 6. Validacao de questoes

Na area do Banco de Itens, o professor/revisor pode:

- abrir a questao no botao "Ver questao";
- ler enunciado, alternativas, gabarito, justificativa, descritor e competencia;
- validar a questao;
- devolver para revisao;
- marcar como rascunho.

O sistema bloqueia a criacao de questoes iguais para evitar duplicidade no banco.

## 7. Exportacao de componentes e descritores

Na area do Banco de Itens, existe a funcao "Exportar curso".

O usuario pode escolher:

- todos os cursos;
- um curso especifico.

Depois pode exportar:

- Markdown (`.md`);
- PDF, usando a janela de impressao do navegador.

A exportacao organiza:

- curso;
- componente curricular;
- competencia;
- descritores vinculados.

Essa funcao serve para planejamento pedagogico, reuniao de professores, documentacao do projeto, coorientacao e apresentacao academica.

## 8. Criacao de avaliacao

Na area do professor, o usuario cria avaliacao informando:

- titulo;
- curso tecnico;
- turma;
- etapa: diagnostica, formativa ou final;
- componentes avaliados;
- quantidade de questoes por componente.

Regras:

- a avaliacao deve ter no minimo 20 questoes;
- a avaliacao deve ter no maximo 80 questoes;
- somente questoes validadas entram na prova;
- o codigo da avaliacao e gerado automaticamente pelo sistema;
- o codigo nao deve ser digitado manualmente;
- apos aberta a avaliacao, o codigo fica imutavel;
- codigo usado ou excluido nunca pode ser reaproveitado.

## 9. Checagem anti-duplicidade na prova

Antes de gerar a avaliacao, o sistema verifica se existem:

- questoes exatamente iguais;
- questoes com mesmo enunciado;
- questoes com contexto muito semelhante.

Uma questao pode aparecer em avaliacoes diferentes, mas nunca deve aparecer repetida ou quase repetida dentro da mesma avaliacao.

Se nao houver itens suficientes sem repeticao de contexto, o sistema deve sinalizar necessidade de revisar ou ampliar o banco de itens.

## 10. Aplicacao para estudantes

O professor abre a avaliacao e repassa o codigo aos estudantes.

O estudante:

1. acessa o sistema;
2. seleciona a aba de aluno;
3. informa codigo da prova;
4. informa nome completo;
5. responde a avaliacao.

A ordem das questoes e embaralhada por estudante. Assim, dois alunos lado a lado nao recebem necessariamente a mesma primeira questao.

O sistema bloqueia segunda tentativa do mesmo aluno no mesmo codigo de avaliacao.

## 11. Respostas e relatorios

As respostas sao salvas de forma consolidada em JSON por aluno e avaliacao.

O sistema calcula:

- acertos;
- percentual bruto;
- desempenho por descritor;
- desempenho por componente;
- desempenho por competencia;
- relatorios por aluno;
- relatorios por turma/avaliacao.

Na fase atual, esses resultados sao pre-TRI. A TRI plena depende de volume maior de respostas e calibracao psicometrica posterior.

## 12. Uso online com Supabase

Quando o Supabase esta configurado, o sistema salva dados online. Quando nao esta configurado, o sistema usa o modo local como fallback.

Para usar online:

1. configurar `VITE_SUPABASE_URL`;
2. configurar `VITE_SUPABASE_PUBLISHABLE_KEY`;
3. executar as migracoes SQL no Supabase;
4. subir a base local pelo perfil Administrador;
5. testar login, criacao de avaliacao, resposta de aluno e relatorio.

## 13. Backup

Durante o piloto gratuito, recomenda-se:

- fazer backup semanal em JSON;
- guardar copia local e copia em nuvem;
- registrar data, escola, turma e responsavel pelo backup.

## 14. Cuidados no piloto controlado

O sistema ja pode ser usado em piloto controlado, mas ainda nao deve ser tratado como ambiente institucional definitivo.

Antes de ampliacao estadual, a proxima sprint deve implementar:

- Supabase Auth;
- RLS por perfil;
- politicas por escola, professor, CREDE/SEFOR, SEDUC e Administrador;
- logs de auditoria mais completos;
- termos de uso;
- rotina formal de backup e recuperacao;
- revisao LGPD.

## 15. Fluxo recomendado de uso

1. Administrador cadastra regionais, escolas e professores.
2. Professor revisa banco de itens.
3. Professor valida questoes adequadas.
4. Professor exporta componentes e descritores para planejamento.
5. Professor cria avaliacao.
6. Sistema gera codigo randomico.
7. Professor abre avaliacao.
8. Estudantes acessam por codigo e nome completo.
9. Sistema salva respostas.
10. Professor e gestao analisam relatorios.
11. Escola planeja recomposicao por descritor.
12. Novas questoes sao criadas, revisadas e validadas.

## 16. Regra pedagogica principal

O SIDEP-CE nao termina na nota. O resultado deve orientar decisao pedagogica.

O foco da intervencao deve ser o descritor, porque e nele que a dificuldade do estudante aparece de forma mais objetiva e acionavel pelo professor.
