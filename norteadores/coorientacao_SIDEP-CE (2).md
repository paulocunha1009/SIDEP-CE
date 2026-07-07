# Coorientação Crítica — SIDEP-CE
### Sistema de Diagnóstico da Educação Profissional do Ceará

*Análise do TCC de mestrado profissional e da apresentação do projeto, com proposta de refinamento.*

---

## Identidade atual do projeto (atualizado)

- **Título principal (acadêmico):** Avaliação técnica baseada em TRI e IA Generativa: personalização da aprendizagem na Educação Profissional do Ceará
- **Nome do sistema/produto:** SIDEP-CE — Sistema de Diagnóstico da Educação Profissional do Ceará *(substitui o antigo "SATEC-CE/TRI" em todo o TCC e nesta coorientação)*
- **Resumo para inscrição:**
  > O projeto propõe o desenvolvimento de um método de avaliação diagnóstica, formativa e final para cursos técnicos da rede estadual do Ceará, baseado em competências, descritores, Teoria de Resposta ao Item e apoio de Inteligência Artificial Generativa. A proposta busca transformar dados de desempenho em intervenções pedagógicas personalizadas, permitindo ao professor diagnosticar, acompanhar e aprimorar a aprendizagem técnica dos estudantes ao longo do percurso formativo. Mais do que inserir IA na escola, o projeto pretende criar uma estratégia pedagógica orientada por evidências, capaz de fortalecer a cidadania digital, a recomposição das aprendizagens e a qualidade da Educação Profissional.
- **Frase de impacto (abertura/fechamento oral):**
  > "Não se trata apenas de usar IA na escola. Trata-se de criar um método para diagnosticar, acompanhar e melhorar a aprendizagem técnica dos estudantes, transformando dados em intervenção pedagógica."

O título novo é uma vantagem estratégica em relação ao antigo: ele soma os quatro elementos que dão identidade ao projeto (TRI, IA Generativa, personalização, EPT-CE) sem prender o trabalho a um nome de sistema fixo desde a capa — o nome do sistema (SIDEP-CE) fica como *produto* da pesquisa, não como *título* dela. Isso dá mais liberdade se o nome do sistema precisar mudar mais adiante (por exemplo, se a SEDUC pedir outro nome para adoção institucional) sem exigir renomear o título acadêmico do TCC.

---

## 0. O que foi analisado

Li integralmente o TCC (12 seções + 4 apêndices) e a apresentação de 10 slides. O TCC já está em estágio avançado — tem problema, objetivos, referencial teórico, base normativa, proposta de método, metodologia de pesquisa, produto técnico, cronograma e apêndices exemplificativos. Isso muda o meu papel: não preciso reconstruir o projeto do zero, preciso **testar a costura entre as partes** e apontar onde a ambição conceitual ultrapassa o que é operacionalmente sustentável em doze meses de mestrado profissional numa rede pública.

Verifiquei também, via busca, os principais marcos normativos citados no capítulo 6, porque parte da força de um mestrado profissional em educação pública está na precisão jurídica — e encontrei problemas nisso (ver seção 1.3).

---

## 1. Crítica geral do projeto

### 1.1 O maior risco do projeto é o próprio nome

"SIDEP-CE" promete, no nome, algo que o próprio texto reconhece (seção 8.5) que ainda não existe: um sistema calibrado por Teoria de Resposta ao Item. O TCC é honesto sobre isso — chama a primeira fase de "pré-TRI" e diz que a calibração só é viável "quando houver volume suficiente de respostas". Isso é tecnicamente correto. O problema é que **a apresentação em PowerPoint não carrega essa mesma cautela**: fala em "TRI" nos slides 1, 3 e 5 como se fosse a engrenagem já operante do sistema, sem qualificar que a primeira aplicação é análise clássica de itens (TCT), não TRI.

Essa é uma incoerência real, não cosmética. Numa banca, alguém vai perguntar "onde está a TRI nesse produto de doze meses?" — e a resposta honesta é "ainda não está, está a base de dados para ela". Isso não invalida o projeto, mas precisa estar explícito em toda peça de comunicação, ou o projeto corre risco de ser lido como "TRI de fachada" sobre uma avaliação por rubricas e testes clássicos. Sugestão de reposicionamento: o produto de mestrado é a **arquitetura e o banco de itens pré-calibração**; a TRI é o horizonte metodológico do sistema, não uma entrega do primeiro ciclo.

### 1.2 Volume amostral: a questão que ninguém vai deixar passar

Nenhuma versão do calendário do projeto (TCC ou slides) dá indicação de *N* de estudantes por curso-piloto. Isso importa porque modelos TRI de 2 ou 3 parâmetros exigem tipicamente amostras da ordem de 200 a 500 respondentes por item para estimativas estáveis; um modelo Rasch (1PL) é mais tolerante, mas ainda pede volume que cinco cursos-piloto, aplicados uma vez em doze meses, dificilmente vão gerar. Isso não é um defeito fatal — é a razão de existir da "fase pré-TRI" que o texto já prevê — mas o projeto precisa **assumir isso explicitamente como resultado esperado**: "ao final do mestrado, entrega-se um banco de itens pronto para calibração futura, não uma escala calibrada". Do jeito que está, essa limitação está escondida no meio da seção 8.5 em vez de aparecer no resumo e nos objetivos.

### 1.3 Base normativa — quadro verificado em fonte oficial (Planalto/DOU)

*Nota de correção: numa análise anterior eu havia marcado LC 212/2025 e Decreto 12.603/2025 como não confirmados. Voltei às fontes oficiais (planalto.gov.br) e confirmei que ambos existem — e o Decreto 12.603/2025, em particular, é uma peça-chave que faltava no TCC. Correção feita abaixo, sem repetir o erro.*

| Norma | O que é, exatamente | Status | Relevância direta para o SIDEP-CE |
|---|---|---|---|
| **Lei nº 14.945/2024** | Altera a LDB para redefinir o Ensino Médio: FGB de 2.400h no ensino regular; 2.100h + até 300h de aprofundamento técnico na EPT; regulamenta os Itinerários Formativos. | Confirmada. | Base da carga horária das matrizes 2025/2026 citadas no TCC. A conversão para 2.880 h/a usada no texto só faz sentido como hora-relógio → hora-aula (fator ~1,2); **isso precisa aparecer explicitado em nota**, senão parece inconsistente com a lei. |
| **Lei nº 15.388/2026** | Institui o novo PNE, decênio **2026-2036** (não 2024-2034). Sancionada em 14/04/2026. 19 objetivos, 73 metas, 372 estratégias; uma das metas trata expressamente de expandir e melhorar a qualidade da educação profissional técnica de nível médio. | Confirmada. | Corrigir a citação do TCC para indicar o decênio certo (2026-2036). A meta de "elevar a qualidade dos cursos técnicos" do PNE é um gancho direto de justificativa para o projeto. |
| **Resolução CNE/CEB nº 4, de 12/05/2025** | Institui os Parâmetros Nacionais para a Oferta dos Itinerários Formativos de Aprofundamento (IFAs) do Ensino Médio — resposta normativa à Lei 14.945/2024. | Confirmada. | Aplica-se porque um dos eixos dos IFAs é "Ensino Técnico e Profissional" — mas a resolução trata do Ensino Médio regular como um todo, não é uma norma específica de avaliação da EPT técnica. Usar com essa ressalva. |
| **Decreto nº 12.603, de 28/08/2025** | Institui a **Política Nacional de Educação Profissional e Tecnológica (PNEPT)** e, no seu Capítulo V, cria o **Sistema Nacional de Avaliação da Educação Profissional e Tecnológica (SINAEPT)** — coordenado pelo Inep (art. 18). | Confirmada. | **É a peça normativa mais importante que faltava no TCC.** Ver seção 1.3.1 abaixo — o SIDEP-CE pode e deve se apresentar como uma operacionalização estadual do SINAEPT. |
| **Lei Complementar nº 212, de 13/01/2025** | Institui o Propag (Programa de Pleno Pagamento de Dívidas dos Estados). Trata de renegociação de dívida estadual com a União — **não é uma norma educacional**. | Confirmada, mas de outro assunto. | É citada dentro do próprio Decreto 12.603/2025 (art. 21, inciso II) como uma possível *fonte de custeio* da PNEPT pelos estados. Ou seja: a LC 212/2025 só entra no projeto como **mecanismo de financiamento**, nunca como base pedagógica ou avaliativa. Usar apenas nessa função, no capítulo de sustentabilidade/financiamento do projeto — não no referencial teórico-avaliativo. |
| **"Lei 12.603/2025"** | Não existe como lei distinta — é o **mesmo número do Decreto 12.603/2025** (Poder Executivo, não Congresso). | Provável confusão de nomenclatura. | Corrigir para "Decreto nº 12.603/2025" em qualquer peça do projeto; não citar como "lei". |
| **CNCT — Catálogo Nacional de Cursos Técnicos** | Já usado corretamente no TCC. Agora tem base explícita também no art. 12 do Decreto 12.603/2025: o CNCT "orientará a organização dos cursos e dos itinerários de acordo com os eixos tecnológicos". | Confirmado (uso já correto). | Reforçar a citação do TCC com essa base no Decreto 12.603/2025, além da resolução CNE que já institui o Catálogo. |
| **Educação Híbrida × EaD** | Ver quadro dedicado na seção 1.3.2. | Confirmado. | — |

#### 1.3.1 Por que o Decreto 12.603/2025 muda a força do projeto

O art. 19 do Decreto 12.603/2025 define as dimensões do SINAEPT:

> I – condições institucionais de oferta (organização didático-pedagógica, corpo docente, infraestrutura);
> II – estatísticas de oferta, fluxo e rendimento, com foco em permanência e conclusão;
> III – **avaliação, com fins diagnósticos, dos conhecimentos, das competências e das habilidades práticas desenvolvidas nos cursos**;
> IV – articulação da oferta com as demandas do mundo do trabalho;
> V – acompanhamento da inserção dos egressos no mundo do trabalho e continuidade dos estudos.

Compare isso com a tabela de "Dimensões avaliativas" que o TCC já tem na seção 7.1 (formação geral aplicada, competências técnicas, prática profissional, mundo do trabalho, condições de oferta, permanência e progressão). **É quase uma correspondência 1:1.** Isso é uma virada de qualidade para o projeto: o SIDEP-CE deixa de ser "uma boa ideia pedagógica inspirada em avaliações de larga escala" e passa a poder se apresentar, com base legal, como **a operacionalização estadual, no Ceará, da dimensão III do SINAEPT** — que é exatamente a dimensão que o decreto federal deixa em aberto quanto ao "como fazer" (o decreto cria a obrigação de avaliar diagnosticamente competências e habilidades práticas, mas não desenha o método). Essa é a lacuna legal que o SIDEP-CE preenche. Isso deveria ir para o resumo e para a justificativa do TCC como argumento central — é mais forte do que qualquer justificativa pedagógica genérica.

O art. 18 também importa: quem coordena a implementação do SINAEPT nacionalmente é o **Inep**, não a SEDUC. Isso significa que, ao apresentar o projeto à SEDUC ou a uma banca, vale deixar claro que o SIDEP-CE é uma iniciativa **estadual, alinhada ao SINAEPT, mas não subordinada operacionalmente a ele** — evita a leitura de que o projeto estaria duplicando ou concorrendo com uma atribuição federal.

#### 1.3.2 Educação híbrida × EaD — base normativa que faltava

O TCC já faz a distinção conceitual corretamente (seção 8.6), mas sem citar norma. Agora há base explícita:

- **Parecer CNE/CP nº 20/2024** (aprovado em 02/07/2024) — "Orientações para o desenvolvimento da Educação Híbrida e das práticas flexíveis do processo híbrido de ensino e aprendizagem no nível da Educação Básica". É a referência certa para a Educação Básica (que inclui a EPT técnica de nível médio) — os pareceres anteriores (CNE/CP 14/2022 e 34/2023) tratam de educação superior e pós-graduação, não se aplicam à rede estadual de EEEPs.
- A minuta de diretrizes do CNE sobre aprendizagem híbrida é explícita: **"a aprendizagem híbrida não se confunde com a estrutura de cursos ofertados na modalidade Educação a Distância (EaD)"** — a EaD é uma modalidade regulada (desde a Resolução CNE/CEB nº 1/2016, para Ensino Médio e EPT técnica), a educação híbrida é uma metodologia, não uma modalidade. Essa é exatamente a distinção que o TCC defende na seção 8.6 — agora com citação.
- **Fato relevante e específico do Ceará**: o Ceará é um dos estados que formalizaram adesão à **RIEH — Rede de Inovação para a Educação Híbrida** do MEC (Portaria MEC nº 865/2022), voltada a redes estaduais de Ensino Médio. Isso é um gancho concreto: o SIDEP-CE pode se apresentar como parte da estratégia de educação híbrida que a SEDUC-CE já aderiu formalmente, e não como uma iniciativa isolada.

### 1.4 Objetivos: bons, mas com uma lacuna estrutural

Os sete objetivos específicos (seção 4.2) são claros e, em geral, mensuráveis. Faltam dois:
- Um objetivo específico sobre **validação de conteúdo dos instrumentos** (que aparece na metodologia, seção 8.2, mas não vira objetivo — deveria, porque é ele que dá o critério de qualidade do produto).
- Um objetivo sobre **avaliação da usabilidade e adesão docente ao método** (a pesquisa fala em "questionário docente" como instrumento, mas isso não é objetivo, é dado solto).

### 1.5 O ponto forte do projeto

A arquitetura conceitual (currículo → competências → descritores → itens → TRI, slide 3) é elegante e didaticamente forte — é a melhor peça de comunicação do projeto e deveria estar em toda introdução, oral ou escrita. A tabela de níveis de proficiência (seção 7.3) e as dimensões avaliativas (seção 7.1) já são um esqueleto avaliativo maduro. E o cuidado com Escola do Campo/EFA e com a distinção híbrido vs. EaD (seção 8.6) é um diferencial real — poucos projetos de avaliação em EPT tratam a alternância com esse nível de detalhe.

### 1.6 Avaliação dos estudantes: risco de virar exame classificatório

O texto já se posiciona contra isso ("a nota deixa de ser o fim do processo", slide 9), mas a operacionalização de *como* impedir isso na prática escolar ainda é frágil. O risco concreto: se a devolutiva pedagógica (Apêndice B) não tiver prazo obrigatório de resposta da escola (ex.: "toda avaliação de percurso gera plano de recomposição em até 15 dias"), o sistema tende a produzir relatórios que ninguém lê — não porque o desenho é ruim, mas porque não há obrigação institucional amarrada ao dado.

### 1.7 IA generativa: bem posicionada, mas sem proteção de dados operacional

O Apêndice C é correto em princípio (revisão humana, minimização de dados, não rotulação), mas é declaração de intenção, não protocolo. Falta dizer, por exemplo: qual dado concreto sai da escola para a ferramenta de IA (nome? matrícula? só descritor e nível?), quem audita, com que periodicidade. Vale também citar a **LGPD (Lei nº 13.709/2018)** explicitamente — ela não aparece no texto e é a base legal mínima para qualquer tratamento de dado de estudante, inclusive menor de idade.

---

## 1.8 Quadro normativo revisado — pronto para substituir a tabela do Capítulo 6 do TCC

Este quadro substitui a tabela atual da seção 6 do TCC ("Referencial × Contribuição"). Todas as linhas abaixo foram checadas em fonte oficial.

| Referencial | Contribuição para o SIDEP-CE |
| --- | --- |
| DCRC | Orienta a formação integral, o currículo do Ensino Médio no Ceará e a articulação entre competências, território e projeto de vida. |
| Matrizes 2025/2026 da SEDUC-CE | Definem cursos ofertados, carga horária, componentes curriculares, séries e organização da formação profissional. |
| Lei nº 14.945/2024 | Base legal da carga horária das matrizes: FGB de 2.100h + até 300h de aprofundamento técnico na EPT (2.400h no ensino regular). |
| CNCT — Catálogo Nacional de Cursos Técnicos | Define eixos tecnológicos, perfis profissionais de conclusão e carga horária mínima; base explícita também no art. 12 do Decreto nº 12.603/2025. |
| **Decreto nº 12.603/2025** | Institui a PNEPT e o **SINAEPT**. O art. 19 define as dimensões avaliativas nacionais da EPT (condições de oferta; fluxo e rendimento; avaliação diagnóstica de competências e habilidades práticas; articulação com o mundo do trabalho; acompanhamento de egressos) — o SIDEP-CE operacionaliza, em nível estadual, a dimensão III (avaliação diagnóstica de competências). |
| Lei nº 15.388/2026 (novo PNE, decênio 2026-2036) | Estabelece meta de expansão e melhoria da qualidade da educação profissional técnica de nível médio, dando amparo de médio prazo à proposta. |
| Resolução CNE/CEB nº 4/2025 | Institui os Parâmetros Nacionais para os Itinerários Formativos de Aprofundamento (IFAs) do Ensino Médio, um dos quais é o eixo "Ensino Técnico e Profissional" — aplica-se de forma indireta, via organização curricular do Ensino Médio regular. |
| Parecer CNE/CP nº 20/2024 | Orienta o desenvolvimento da Educação Híbrida na Educação Básica (que inclui a EPT técnica) — base da distinção entre educação híbrida (metodologia) e EaD (modalidade regulada desde a Resolução CNE/CEB nº 1/2016). |
| RIEH — Rede de Inovação para a Educação Híbrida (Portaria MEC nº 865/2022) | O Ceará já é estado aderente à RIEH; o SIDEP-CE pode se posicionar como parte dessa estratégia já formalizada pela SEDUC-CE, não como iniciativa isolada. |
| LC nº 212/2025 (Propag) | **Não é norma educacional.** Citada apenas como possível fonte de custeio estadual da PNEPT (art. 21, II, do Decreto 12.603/2025) — usar só na seção de sustentabilidade financeira do projeto, se houver. |

*Removido do quadro: "PNE 15388/2026" sem indicar o decênio correto (agora corrigido para 2026-2036); "Decreto 12.603/2025" e "Lei 12.603/2025" como se fossem duas normas distintas (é uma só, o Decreto); e qualquer menção solta a normas não verificáveis.*

---

## 2. Problema de pesquisa — versão refinada

**Versão atual (já boa, mas ampla demais para se resolver em 12 meses):**
> "Como desenvolver e validar um método de avaliação diagnóstica, formativa e final, baseado em competências e inspirado nos parâmetros da Teoria de Resposta ao Item, capaz de acompanhar a proficiência técnica dos estudantes dos cursos profissionalizantes da rede estadual do Ceará antes, durante e ao final do percurso formativo?"

**Versão refinada, delimitando o que é exequível num mestrado profissional e ancorada na norma federal que já existe:**

> O Decreto nº 12.603/2025 institui o Sistema Nacional de Avaliação da Educação Profissional e Tecnológica (SINAEPT) e determina, entre suas dimensões (art. 19, III), a avaliação diagnóstica de conhecimentos, competências e habilidades práticas nos cursos de EPT — sem, no entanto, definir o método dessa avaliação. Como transformar as matrizes curriculares dos cursos técnicos da rede estadual do Ceará em uma matriz avaliativa por competências — com descritores, banco inicial de itens e rubricas práticas — capaz de operacionalizar, em nível estadual, essa dimensão do SINAEPT, produzindo evidências comparáveis sobre a proficiência técnica dos estudantes nos momentos de entrada, percurso e saída, e constituindo a base de dados necessária a uma futura calibração pelos parâmetros da Teoria de Resposta ao Item?

A diferença é dupla: (1) o problema deixa de prometer "acompanhar a proficiência via TRI" e passa a prometer, honestamente, **construir o sistema e a base empírica que tornam a TRI possível depois**; e (2) o problema deixa de soar como uma boa ideia pedagógica isolada e passa a se apresentar como resposta a uma lacuna metodológica deixada em aberto por uma política pública federal já em vigor — o que é um argumento de relevância muito mais forte numa banca de mestrado profissional.

---

## 3. Objetivo geral — versão refinada

**Atual:**
> "Desenvolver e validar uma proposta metodológica de avaliação diagnóstica, formativa e final para cursos técnicos da rede estadual do Ceará, baseada em matriz de competências, descritores avaliáveis, banco de itens, rubricas práticas e parâmetros inspirados na Teoria de Resposta ao Item."

**Refinado:**
> Desenvolver, aplicar em cursos-piloto e validar por meio de análise clássica de itens uma metodologia de avaliação técnica diagnóstica, formativa e final para a Educação Profissional da rede estadual do Ceará, estruturada em matriz de competências, descritores, banco de itens e rubricas práticas, de modo a produzir tanto um produto pedagógico aplicável pelas escolas quanto a base de dados necessária à futura calibração por Teoria de Resposta ao Item.

"Validar por meio de análise clássica de itens" é a mudança central: define o padrão de evidência que a pesquisa realmente vai produzir, sem prometer psicometria que o volume amostral não sustenta.

---

## 4. Objetivos específicos — versão melhorada

1. Mapear os cursos técnicos da rede estadual do Ceará e seus eixos tecnológicos a partir das matrizes curriculares 2025/2026 e do CNCT.
2. Construir, para cada curso-piloto, uma matriz avaliativa que relacione componentes curriculares, competências, descritores e tipos de evidência.
3. Elaborar e **validar por juízes especialistas** (validação de conteúdo) um banco inicial de itens, situações-problema e rubricas práticas para os três momentos de aplicação.
4. Aplicar a avaliação diagnóstica de entrada e a avaliação de percurso nos cursos-piloto, gerando devolutivas pedagógicas para estudantes, professores e coordenação.
5. Analisar os resultados por estatística descritiva e análise clássica de itens (dificuldade, discriminação, consistência), constituindo o banco de dados-base para calibração TRI futura.
6. Desenvolver um protocolo de devolutiva e intervenção pedagógica (incluindo apoio de IA generativa supervisionada) com prazos e responsáveis definidos.
7. Avaliar a **usabilidade e a adesão docente** ao método, por questionário e entrevista, como critério de viabilidade de escala.

*(Removi "definir níveis de proficiência técnica" e "avaliar o perfil profissional de conclusão com evidências teóricas e práticas" como objetivos autônomos — o primeiro já está resolvido na proposta do método (seção 7.3 do TCC) e não precisa ser objetivo de pesquisa; o segundo é absorvido pelo objetivo 4, evitando redundância.)*

---

## 5. Metodologia prática em etapas

Para uso direto por professor e coordenação, não só pelo pesquisador:

**Fase 0 — Antes do curso (Mês 1-2)**
1. Escolher o curso-piloto e a turma.
2. Reunir professores da formação técnica e da formação geral para mapear componentes × competências × CNCT.
3. Transformar competências em descritores observáveis (verbo + objeto + condição — ex.: "diagnostica falha simples em circuito, com apoio de checklist").
4. Elaborar itens objetivos, situações-problema e rubricas por descritor.
5. Validar os instrumentos com 2-3 especialistas externos ao curso (validação de conteúdo).

**Fase 1 — Entrada (Mês 3)**
6. Aplicar avaliação diagnóstica de entrada.
7. Gerar relatório por estudante e por turma em até 15 dias.
8. Devolutiva coletiva em reunião pedagógica — não só documento.

**Fase 2 — Percurso (Mês 4-8)**
9. Formar grupos de recomposição por descritor frágil.
10. Aplicar atividades de intervenção (com apoio de IA supervisionada para gerar variações de atividade por descritor).
11. Reaplicar itens-âncora ao final de cada módulo relevante para acompanhar evolução.

**Fase 3 — Saída (Mês 9-11)**
12. Aplicar avaliação de saída (prova técnica + situação-problema + rubrica + evidência de projeto/estágio).
13. Comparar entrada × percurso × saída por descritor.
14. Relatório final por estudante, turma, curso e escola.

**Fase 4 — Consolidação (Mês 12)**
15. Revisar itens com desempenho anômalo (muito fáceis, muito difíceis, sem relação com o descritor).
16. Organizar o banco de itens revisado como insumo para calibração TRI futura.
17. Redigir o caderno metodológico.

---

## 6. Proposta de matriz avaliativa inicial (modelo genérico, para qualquer curso)

| Componente curricular | Competência | Descritor avaliável | Tipo de evidência | Momento | Nível esperado |
|---|---|---|---|---|---|
| [Nome do componente] | [Competência do CNCT/matriz] | [Verbo observável + objeto + condição] | Item objetivo / situação-problema / rubrica / produto | Entrada / Percurso / Saída | Nível 1 a 5 (escala da seção 7.3 do TCC) |

Regra prática para escrever um descritor: se dois professores diferentes, olhando a mesma resposta do estudante, não chegam à mesma nota, o descritor está mal escrito — falta condição ou critério de observação.

---

## 7. Modelo de produto final

Em vez de listar todos os produtos como itens soltos (o TCC já faz isso bem na seção 9), a sugestão é organizá-los em uma **hierarquia de entrega**, deixando claro o que é obrigatório para a defesa e o que é ambição para depois:

- **Núcleo obrigatório (entregável do mestrado):**
  - Caderno metodológico (fundamentos + protocolo de aplicação).
  - Matriz avaliativa validada de 1 curso-piloto completo (o Apêndice A do TCC já é esse protótipo).
  - Banco inicial de itens e rubricas, com relatório de validação de conteúdo.
  - Modelo de relatório pedagógico (Apêndice B já cumpre isso).
- **Extensão desejável (se o tempo permitir):**
  - Matrizes dos outros 4 cursos-piloto.
  - Protótipo de dashboard (pode ser planilha ou mockup simples — não precisa ser sistema de software funcional para um mestrado profissional em educação).
- **Fora do escopo deste ciclo (deixar explícito para a banca):**
  - Escala TRI calibrada.
  - Sistema de software em produção na rede.

Separar assim evita que a banca cobre, como se fosse entrega obrigatória, algo que exigiria mais tempo e mais dados do que um mestrado profissional comporta.

---

## 8. Proposta de cronograma (ajustado)

| Mês | Atividade principal | Produto parcial |
|---|---|---|
| 1 | Revisão bibliográfica, checagem normativa e análise documental | Quadro teórico e normativo **revisado e verificado** |
| 2 | Seleção do curso-piloto e desenho da matriz avaliativa | Matriz avaliativa preliminar |
| 3 | Elaboração de itens, situações-problema e rubricas | Banco inicial de instrumentos |
| 4 | Validação por especialistas e ajustes | Instrumentos revisados + relatório de validação |
| 5 | Aplicação diagnóstica de entrada | Relatório inicial + devolutiva à escola |
| 6-7 | Intervenção pedagógica e trilhas de recomposição | Planos por descritor |
| 8 | Avaliação de percurso | Relatório comparativo |
| 9 | Ajuste metodológico | Versão 2 dos instrumentos |
| 10 | Avaliação de saída | Relatório de proficiência (análise clássica) |
| 11 | Análise consolidada e questionário docente | Dados de usabilidade/adesão |
| 12 | Redação final, caderno metodológico e defesa | TCC + produto técnico |

Diferença em relação ao cronograma original: reservei o mês 11 explicitamente para coletar dado de adesão docente (objetivo 7), que no cronograma atual não tinha espaço próprio.

---

## 9. Riscos e mitigação (ampliando a tabela já existente na seção 8.8 do TCC)

| Risco | Efeito possível | Mitigação |
|---|---|---|
| Nome "TRI" gerar expectativa de escala calibrada já na primeira entrega | Banca ou SEDUC cobrar produto que os dados não sustentam | Comunicar desde o resumo que o produto do ciclo é o banco pré-TRI, não a escala calibrada |
| Usar a LC 212/2025 fora do contexto correto (ela é sobre dívida de estados, não educação) | Parecer que o capítulo normativo foi montado sem checagem | Citá-la exclusivamente na seção de financiamento/sustentabilidade, como fonte de custeio possível da PNEPT via estados (art. 21, II, do Decreto 12.603/2025) — nunca no referencial pedagógico |
| Não explorar o Decreto 12.603/2025 (SINAEPT) como âncora normativa do método | Projeto parecer "flutuante", sem amarração a uma política nacional já existente | Usar o art. 19 do Decreto 12.603/2025 como base legal da matriz de dimensões avaliativas (seção 7.1 do TCC) — ver seção 1.3.1 |
| Baixo volume de respondentes por curso-piloto | Impossibilidade de qualquer calibração, mesmo futura | Definir N mínimo desejável por curso e registrar como limitação metodológica explícita |
| Ausência de prazo institucional para resposta às devolutivas | Relatórios gerados e não usados | Amarrar prazo (ex. 15 dias) e responsável institucional a cada relatório |
| Uso de dados pessoais em ferramentas de IA externas | Exposição de dados de estudantes, inclusive menores | Citar LGPD explicitamente; enviar à IA apenas dados agregados por descritor, nunca identificação individual |
| Sobreposição de papéis do pesquisador (autor do método e avaliador do próprio método) | Viés de validação | Prever validação de conteúdo por especialistas externos ao pesquisador, já previsto — reforçar como critério de qualidade, não formalidade |
| Escola tratar a avaliação de saída como exame classificatório | Perda da função formativa | Regra explícita: nota de saída não decide sozinha aprovação; combina-se com evidência de estágio/projeto |

---

## 10. Sugestões para a apresentação em PowerPoint

1. **Slide 1** — ok, mas incluir uma frase que já avise: "produto do mestrado: banco de itens e matriz avaliativa; TRI como horizonte, não entrega imediata". Isso evita a expectativa que sinalizei em 1.1.
2. **Slide 3 (ideia central)** — é o melhor slide do deck; considerar movê-lo para logo após o slide 1, como abertura conceitual, antes da justificativa.
3. **Slides 3 e 5** — trocar "TRI" isolado por "rumo à TRI" ou "base para TRI" nos títulos, para manter a mesma cautela epistemológica que o TCC já tem no texto.
4. **Slide 5** — trocar a menção genérica a normas por uma citação precisa e curta: "Decreto nº 12.603/2025 (institui o SINAEPT) e Lei nº 15.388/2026 (novo PNE, 2026-2036)". Essas duas são as que carregam peso de justificativa — a LC 212/2025 não deve aparecer aqui, pois é uma norma de financiamento, não de avaliação (ver seção 1.3). Um slide de banca ou SEDUC ganha mais credibilidade com duas citações certas do que com seis citações genéricas.
5. **Slide 7** — indicar, mesmo que estimado, o número de estudantes por piloto — reforça que o projeto tem noção de escala amostral.
6. **Slide 9** — a frase final ("a nota deixa de ser o fim do processo") é forte; sugiro adicionar um sub-bullet com o prazo de devolutiva (ex. "relatório em até 15 dias"), transformando princípio em compromisso operacional.
7. **Slide 10** — adicionar um indicador de sucesso mensurável (ex. "adesão docente > X%"), amarrando a síntese aos indicadores que já existem na seção 11 do TCC.
8. Adicionar **um slide novo, entre 7 e 8**, mostrando a hierarquia de entregas da seção 7 acima (núcleo obrigatório vs. extensão vs. fora de escopo) — é a peça que mais protege o projeto numa banca, porque delimita expectativa antes de qualquer pergunta.

---

## Síntese

O projeto está bem mais maduro do que a média de propostas nesse estágio — tem estrutura, tem base teórica, tem sensibilidade a contextos difíceis (campo, alternância, IA responsável). A checagem normativa desta rodada mudou o patamar do projeto num ponto específico: o **Decreto nº 12.603/2025**, que cria o SINAEPT, dá ao SIDEP-CE uma ancoragem legal que ele não tinha antes — o projeto deixa de ser "uma boa ideia pedagógica inspirada em avaliações de larga escala" e passa a poder se apresentar como a resposta estadual a uma lacuna metodológica explícita numa política nacional já em vigor. Isso deveria estar no resumo, na justificativa e no primeiro slide da apresentação.

O trabalho de coorientação daqui para frente é menos "criar" e mais **podar e ancorar**: reduzir a promessa de TRI operante para o que o volume de dados permite, usar as normas certas nos lugares certos (SINAEPT no referencial avaliativo, LC 212/2025 só em financiamento, se necessário), e transformar princípios bons ("a nota deixa de ser o fim do processo") em mecanismos com prazo e responsável. Isso é o que separa um projeto pedagogicamente inspirador de um produto técnico defensável — e agora com a base legal para sustentar isso numa banca.
