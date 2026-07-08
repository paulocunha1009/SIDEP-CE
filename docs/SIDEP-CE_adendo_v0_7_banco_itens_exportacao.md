# SIDEP-CE - Adendo v0.7: Qualidade do Banco, Exportacao Curricular e Manual de Uso

Data: 08/07/2026

## 1. Marco da versao

A versao v0.7 consolida o SIDEP-CE como produto tecnico-tecnologico mais maduro para piloto controlado. A entrega avanca em tres dimensoes:

- qualidade do banco de itens;
- rastreabilidade e seguranca da geracao de avaliacoes;
- documentacao operacional para uso por professores e gestores.

## 2. Qualidade do banco de itens

O banco de itens passou a incorporar regras de protecao contra duplicidade. O sistema deve impedir que uma questao identica seja cadastrada novamente e deve evitar que uma avaliacao contenha questoes repetidas ou com contexto muito semelhante.

Essa regra e relevante porque a avaliacao por competencias e descritores depende da diversidade de evidencias. Se uma prova repete o mesmo contexto diversas vezes, ela pode superestimar ou subestimar a aprendizagem do estudante e reduzir a qualidade diagnostica do relatorio.

## 3. Regra para provas

Uma questao pode ser reutilizada em avaliacoes diferentes, especialmente para estudos longitudinais e futura composicao de itens ancora. Entretanto, dentro da mesma avaliacao, o sistema deve preservar:

- unicidade de questoes;
- diversidade de contextos;
- distribuicao por componentes e descritores;
- uso exclusivo de itens validados.

Quando o banco nao possuir itens suficientes para atender essas regras, o sistema deve sinalizar necessidade de ampliacao ou revisao do banco.

## 4. Exportacao curricular

Foi adicionada ao Banco de Itens a possibilidade de exportar a organizacao curricular em:

- Markdown;
- PDF.

A exportacao organiza dados por curso, componente curricular, competencia e descritor. Essa funcionalidade transforma o banco interno do sistema em material de planejamento pedagogico e documento de transparencia metodologica.

## 5. Importancia para a pesquisa de mestrado

A exportacao da matriz avaliativa fortalece a pesquisa porque permite demonstrar:

- quais competencias estao sendo avaliadas;
- quais descritores operacionalizam cada competencia;
- quais componentes curriculares estao contemplados;
- onde existem lacunas de cobertura;
- como o banco de itens se conecta a matriz curricular.

Isso contribui para a validade de conteudo do metodo e facilita a validacao por professores especialistas.

## 6. Manual de uso

Foi criado o manual operacional `sidep-ce-platform/docs/manual_uso_sidep_ce.md`, contemplando:

- perfis de acesso;
- login e primeiro acesso;
- banco de itens;
- validacao de questoes;
- exportacao curricular;
- criacao de avaliacoes;
- aplicacao para estudantes;
- relatorios;
- uso online com Supabase;
- backup;
- cuidados do piloto controlado.

O manual e parte do produto tecnico-tecnologico, pois permite replicabilidade do uso e reduz dependencia direta do pesquisador.

## 7. Proxima etapa

A proxima etapa prioritaria e institucionalizar a seguranca:

- Supabase Auth;
- RLS por perfil;
- politicas por escola, professor, CREDE/SEFOR, SEDUC e Administrador;
- auditoria;
- LGPD;
- rotina formal de backup e recuperacao.

Com isso, o SIDEP-CE sai de um MVP funcional em piloto controlado para uma base mais adequada a expansao institucional.
