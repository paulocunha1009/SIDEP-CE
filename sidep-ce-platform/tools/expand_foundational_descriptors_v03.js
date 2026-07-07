const fs = require("fs");
const path = require("path");

const seedPath = path.join(__dirname, "..", "app", "src", "data", "norteadoresSeed.ts");
const source = fs.readFileSync(seedPath, "utf8");

function extractArray(name) {
  const marker = `export const ${name}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Array not found: ${name}`);
  const equals = source.indexOf("=", start);
  const arrayStart = source.indexOf("[", equals);
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) return JSON.parse(source.slice(arrayStart, index + 1));
    }
  }
  throw new Error(`Array boundaries not found: ${name}`);
}

function replaceArray(name, value) {
  const marker = `export const ${name}`;
  const start = source.indexOf(marker);
  const equals = source.indexOf("=", start);
  const arrayStart = source.indexOf("[", equals);
  let depth = 0;
  let inString = false;
  let escaped = false;
  let arrayEnd = -1;

  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        arrayEnd = index + 1;
        if (source[arrayEnd] === ";") arrayEnd += 1;
        break;
      }
    }
  }
  if (arrayEnd < 0) throw new Error(`Array boundaries not found: ${name}`);
  return `${source.slice(0, arrayStart)}${JSON.stringify(value, null, 2)};${source.slice(arrayEnd)}`;
}

function countByDescritor(questoes) {
  return questoes.reduce((acc, questao) => {
    acc[questao.descritor_codigo] = (acc[questao.descritor_codigo] || 0) + 1;
    return acc;
  }, {});
}

function options(correct, wrongs, seed) {
  const letters = ["A", "B", "C", "D", "E"];
  const list = wrongs.slice(0, 4);
  const index = seed % 5;
  list.splice(index, 0, correct);
  return {
    alternativa_a: list[0],
    alternativa_b: list[1],
    alternativa_c: list[2],
    alternativa_d: list[3],
    alternativa_e: list[4],
    gabarito: letters[index],
  };
}

const descritores = extractArray("descritoresNorteadores");
const questoesAtuais = extractArray("questoesNorteadoras");
const descritorPorCodigo = Object.fromEntries(descritores.map((item) => [item.codigo, item]));

const commonWrong = [
  "Excluir todos os registros sem análise.",
  "Escolher a alternativa apenas pela aparência.",
  "Ignorar o contexto técnico apresentado.",
  "Substituir o procedimento por tentativa sem registro.",
];

function makeItems(prefix, rows) {
  return rows.map(([situation, correct, wrongs = commonWrong]) => [
    `${prefix} ${situation}`,
    correct,
    wrongs,
  ]);
}

const banco = {
  D01: makeItems("Em Informática Básica,", [
    ["qual ferramenta é mais adequada para organizar notas em linhas e colunas?", "planilha eletrônica.", ["editor de imagens.", "compactador de arquivos.", "tocador de mídia.", "gerenciador de energia."]],
    ["qual recurso permite criar um documento com textos, títulos e parágrafos?", "editor de texto.", ["antivírus.", "roteador.", "sensor digital.", "fonte de alimentação."]],
    ["qual prática ajuda a encontrar arquivos com mais facilidade?", "usar pastas e nomes claros para organizar documentos.", ["salvar tudo com o mesmo nome.", "deixar arquivos apenas na lixeira.", "remover extensões dos arquivos.", "usar senhas como nome de pasta."]],
    ["qual ação representa uso produtivo da internet em contexto escolar?", "pesquisar em fontes confiáveis e registrar referências.", ["copiar texto sem verificar fonte.", "baixar qualquer arquivo recebido.", "compartilhar senhas da turma.", "ignorar autoria dos materiais."]],
    ["qual recurso é mais indicado para apresentar resultados de um trabalho?", "software de apresentação com slides organizados.", ["gerenciador de processos.", "BIOS/UEFI.", "cabo de rede.", "partição do disco."]],
    ["qual ação demonstra letramento digital básico?", "preencher formulário online conferindo dados antes de enviar.", ["enviar dados incompletos sem revisar.", "usar a mesma senha em todos os serviços.", "abrir anexos desconhecidos.", "desativar atualizações sempre."]],
    ["qual recurso facilita armazenamento e acesso a documentos em diferentes dispositivos?", "serviço de armazenamento em nuvem.", ["memória cache do processador.", "placa de vídeo dedicada.", "fonte ATX.", "cooler do gabinete."]],
    ["qual procedimento é adequado antes de entregar arquivo digital a um professor?", "conferir nome, formato, conteúdo e legibilidade do arquivo.", ["renomear com caracteres aleatórios.", "compactar sem necessidade.", "remover a extensão.", "enviar arquivo vazio."]],
  ]),
  D02: makeItems("Sobre hardware, software e armazenamento,", [
    ["o teclado, o mouse e o monitor são classificados como:", "periféricos de entrada ou saída.", ["sistemas operacionais.", "comandos SQL.", "atributos de classe.", "seletores CSS."]],
    ["o conjunto físico de peças do computador recebe o nome de:", "hardware.", ["software.", "algoritmo.", "backup.", "domínio."]],
    ["um navegador de internet é exemplo de:", "software aplicativo.", ["memória RAM.", "placa-mãe.", "periférico físico.", "fonte de alimentação."]],
    ["um arquivo salvo no computador deve ter:", "nome, localização e formato compatíveis com seu uso.", ["sempre a mesma senha.", "apenas números no nome.", "ausência de extensão.", "tamanho fixo de 1 MB."]],
    ["um HD ou SSD tem a função principal de:", "armazenar dados de forma persistente.", ["processar instruções gráficas apenas.", "fornecer energia elétrica.", "substituir o sistema operacional.", "gerar sinal Wi-Fi."]],
    ["a memória RAM é usada principalmente para:", "guardar temporariamente dados em uso pelo sistema.", ["armazenar arquivos permanentemente.", "conectar redes externas.", "imprimir documentos.", "proteger contra surtos elétricos."]],
    ["o sistema operacional é classificado como:", "software de base que gerencia recursos do computador.", ["hardware de vídeo.", "periférico de saída.", "documento textual.", "formato de imagem."]],
    ["uma pasta no sistema de arquivos serve para:", "organizar arquivos e subpastas.", ["aumentar a velocidade do processador.", "substituir a memória RAM.", "executar SQL automaticamente.", "medir temperatura."]],
    ["o armazenamento em nuvem permite:", "guardar e sincronizar arquivos pela internet.", ["ligar o computador sem energia.", "dispensar senhas em todos os casos.", "trocar a placa-mãe.", "criar cabos físicos."]],
    ["um scanner é um periférico usado para:", "digitalizar documentos ou imagens.", ["processar comandos SQL.", "executar estruturas de repetição.", "armazenar energia.", "controlar sensores."]],
    ["a placa-mãe tem como função:", "interligar e permitir comunicação entre componentes.", ["substituir o monitor.", "editar textos.", "servir como navegador.", "armazenar apenas imagens."]],
    ["um software livre se caracteriza por:", "permitir liberdades de uso, estudo, modificação e distribuição conforme licença.", ["ser sempre sem atualização.", "não ter licença.", "funcionar sem sistema operacional.", "ser obrigatoriamente pago."]],
    ["uma extensão como .pdf indica:", "formato do arquivo.", ["endereço IP.", "tipo de memória.", "topologia de rede.", "classe de objeto."]],
    ["um pendrive é exemplo de:", "dispositivo de armazenamento removível.", ["processador central.", "sistema operacional.", "linguagem de programação.", "tag HTML."]],
  ]),
  D03: makeItems("Em segurança da informação e cidadania digital,", [
    ["uma senha forte deve:", "combinar tamanho, variedade de caracteres e não ser óbvia.", ["usar apenas a data de nascimento.", "ser igual ao nome do usuário.", "ser compartilhada com colegas.", "ficar anotada publicamente."]],
    ["autenticação em dois fatores ajuda porque:", "adiciona uma segunda confirmação de identidade.", ["remove a necessidade de senha.", "libera acesso para todos.", "apaga histórico de uso.", "troca o sistema operacional."]],
    ["phishing é uma ameaça em que:", "mensagens falsas tentam roubar dados ou credenciais.", ["o computador melhora desempenho sozinho.", "o roteador cria backup.", "o editor corrige código.", "a impressora atualiza drivers."]],
    ["ao receber link suspeito, a conduta correta é:", "verificar origem e evitar clicar ou informar dados.", ["abrir rapidamente para testar.", "encaminhar para todos.", "digitar a senha para confirmar.", "baixar anexos desconhecidos."]],
    ["proteção de dados pessoais envolve:", "coletar e compartilhar apenas o necessário e com finalidade.", ["publicar documentos da turma.", "expor senhas em planilha.", "usar dados sem autorização.", "guardar cópias sem controle."]],
    ["atualizações de sistema são importantes porque:", "corrigem falhas e melhoram segurança.", ["sempre removem antivírus.", "desligam a internet.", "apagam arquivos pessoais obrigatoriamente.", "substituem backup."]],
    ["backup contribui para segurança porque:", "permite recuperar dados após falhas ou perdas.", ["impede qualquer ataque.", "substitui senha forte.", "torna revisão desnecessária.", "libera acesso público."]],
    ["cidadania digital exige:", "respeito, responsabilidade e cuidado com informações compartilhadas.", ["anonimato para ofender.", "cópia sem autoria.", "divulgação de dados alheios.", "uso de boatos como fonte."]],
    ["um antivírus ajuda a:", "detectar ou bloquear softwares maliciosos.", ["substituir todo comportamento seguro.", "garantir que qualquer link é confiável.", "fazer backup automático sempre.", "criar senhas por conta própria."]],
    ["privacidade em redes sociais depende de:", "configurações de acesso e cuidado com o que é publicado.", ["aceitar todos os contatos.", "divulgar localização em tempo real.", "postar documentos pessoais.", "usar perfil sem senha."]],
    ["licença de uso de software define:", "condições para instalar, copiar, modificar ou distribuir o programa.", ["velocidade da internet.", "quantidade de memória RAM.", "tipo de roteador.", "cor padrão do sistema."]],
    ["ao usar computador compartilhado, é adequado:", "sair das contas e não salvar senhas no navegador.", ["deixar sessão aberta.", "salvar senha de e-mail.", "baixar arquivos pessoais de todos.", "desativar bloqueio de tela."]],
    ["criptografia é usada para:", "proteger dados tornando-os ilegíveis sem chave adequada.", ["aumentar brilho da tela.", "remover necessidade de backup.", "trocar peças físicas.", "formatar textos."]],
    ["um comportamento responsável na internet é:", "checar informações antes de compartilhar.", ["espalhar mensagens alarmistas.", "usar imagens sem permissão.", "expor dados de colegas.", "ignorar fontes."]],
  ]),
  D04: makeItems("Em Sistemas Operacionais,", [
    ["o gerenciador de arquivos permite:", "criar, mover, renomear e organizar arquivos e pastas.", ["calibrar sensores.", "definir cardinalidade.", "editar chave estrangeira.", "montar rede física."]],
    ["permissões de usuário servem para:", "controlar quem pode acessar ou alterar recursos.", ["mudar a cor do monitor.", "aumentar memória física.", "criar uma classe automaticamente.", "formatar imagens."]],
    ["um processo em execução é:", "um programa ou tarefa ativa no sistema.", ["um cabo conectado.", "uma tabela SQL.", "uma tag HTML.", "um formato de imagem."]],
    ["o terminal ou prompt permite:", "executar comandos de sistema por texto.", ["substituir toda interface gráfica.", "criar peças físicas.", "garantir backup remoto.", "trocar hardware sozinho."]],
    ["conta de administrador deve ser usada com cuidado porque:", "tem permissões amplas para alterar o sistema.", ["não possui senha.", "não permite instalar programas.", "é igual a conta visitante.", "só abre navegador."]],
    ["uma atualização do sistema operacional pode:", "corrigir falhas, melhorar estabilidade e segurança.", ["remover todos os periféricos.", "trocar o processador.", "criar banco de dados automaticamente.", "apagar roteadores."]],
    ["extensão de arquivo ajuda o sistema a:", "identificar tipo de arquivo e aplicativo associado.", ["definir IP da rede.", "criar sensor físico.", "substituir memória RAM.", "configurar BIOS sem usuário."]],
    ["atalhos no sistema operacional servem para:", "acessar rapidamente arquivos, pastas ou programas.", ["duplicar fisicamente o disco.", "aumentar voltagem.", "criar CSS.", "medir temperatura."]],
    ["o monitor de recursos ajuda a observar:", "uso de CPU, memória, disco e rede.", ["hierarquia visual de cartaz.", "relacionamentos entre entidades.", "comentários de código.", "pinos de sensores."]],
    ["instalar programa de fonte desconhecida pode:", "trazer risco de malware ou alteração indevida.", ["melhorar segurança sempre.", "criar backup automático.", "corrigir todas as falhas.", "dispensar antivírus."]],
    ["o sistema de arquivos organiza:", "como dados são nomeados, armazenados e acessados.", ["topologia de rede física.", "cores de uma página.", "classes de POO.", "sensores e atuadores."]],
    ["compactar arquivos é útil para:", "reduzir tamanho ou agrupar documentos para envio.", ["aumentar memória RAM.", "trocar o sistema operacional.", "corrigir senha fraca.", "formatar o disco obrigatoriamente."]],
    ["modo de segurança é usado para:", "iniciar o sistema com recursos mínimos para diagnóstico.", ["criar slides.", "modelar banco.", "editar imagem.", "testar contraste."]],
    ["o log do sistema pode ajudar a:", "investigar eventos, erros e alterações ocorridas.", ["escolher fonte de um cartaz.", "definir classe Aluno.", "configurar sensor de umidade.", "criar topologia estrela."]],
    ["gerenciar usuários em um sistema significa:", "criar contas, definir permissões e controlar acesso.", ["trocar cabos.", "formatar imagens.", "executar SQL sem banco.", "criar tags HTML."]],
  ]),
  D07: makeItems("Em Lógica de Programação I,", [
    ["o comando if é usado para:", "executar ações conforme uma condição.", ["criar uma imagem.", "montar hardware.", "definir IP.", "salvar arquivo em nuvem."]],
    ["o else representa:", "caminho alternativo quando a condição não é verdadeira.", ["início obrigatório do programa.", "tipo de variável.", "nome de arquivo.", "classe CSS."]],
    ["um laço for é adequado quando:", "a repetição tem quantidade conhecida ou sequência definida.", ["não existe repetição.", "o programa não usa variáveis.", "o arquivo é PDF.", "a rede está sem cabo."]],
    ["um laço while é adequado quando:", "a repetição depende de uma condição permanecer verdadeira.", ["a condição nunca é testada.", "o código é apenas HTML.", "a variável não existe.", "o sistema está desligado."]],
    ["em um algoritmo, fluxo de execução significa:", "ordem em que comandos e decisões são processados.", ["velocidade da internet.", "quantidade de portas USB.", "estilo visual da tela.", "tipo de gabinete."]],
    ["condição composta com and exige que:", "todas as condições ligadas sejam verdadeiras.", ["apenas uma condição seja verdadeira.", "nenhuma condição seja avaliada.", "a variável seja texto.", "o laço seja infinito."]],
    ["condição composta com or exige que:", "pelo menos uma condição ligada seja verdadeira.", ["todas sejam falsas.", "a função não retorne valor.", "o arquivo seja imagem.", "a rede esteja offline."]],
    ["um loop infinito ocorre quando:", "a condição de repetição nunca se torna falsa.", ["o monitor pisca.", "o arquivo é salvo.", "a senha é forte.", "a lista fica vazia sempre."]],
    ["em Python, a indentação em if/else indica:", "quais comandos pertencem a cada bloco.", ["a cor da saída.", "a velocidade do processador.", "o tipo do arquivo.", "a senha do usuário."]],
    ["ao analisar saída de código com repetição, é necessário:", "acompanhar valores das variáveis a cada iteração.", ["olhar apenas o primeiro comando.", "ignorar a condição.", "trocar o editor.", "apagar comentários."]],
    ["em uma decisão 'se idade >= 18', a expressão idade >= 18 é:", "condição lógica.", ["variável de texto.", "tag HTML.", "endereço IP.", "chave primária."]],
    ["break em um laço pode ser usado para:", "interromper a repetição antes do fim previsto.", ["criar variável global.", "formatar texto.", "ligar sensor.", "abrir pasta."]],
    ["continue em um laço pode ser usado para:", "pular para a próxima iteração.", ["parar todo computador.", "criar backup.", "definir CSS.", "alterar hardware."]],
    ["um contador em repetição serve para:", "controlar quantidade de execuções ou acompanhar progresso.", ["guardar senha.", "trocar IP.", "salvar imagem.", "criar classe."]],
    ["ao combinar if dentro de while, o estudante deve verificar:", "condição do laço, condição interna e alteração das variáveis.", ["apenas o nome do arquivo.", "a cor do tema.", "o cabo de energia.", "a extensão PDF."]],
  ]),
  D08: makeItems("Em Lógica de Programação II,", [
    ["uma lista é usada para:", "armazenar vários valores relacionados em uma estrutura.", ["ligar computador.", "criar cabo de rede.", "definir cor de monitor.", "trocar fonte."]],
    ["uma função serve para:", "organizar código reutilizável com uma tarefa definida.", ["aumentar voltagem.", "criar arquivo sem nome.", "substituir sistema operacional.", "apagar o projeto."]],
    ["parâmetro de função é:", "valor recebido pela função para executar sua lógica.", ["periférico de entrada.", "tipo de cabo.", "campo de senha do sistema.", "tag de imagem."]],
    ["retorno de função representa:", "resultado enviado pela função após processamento.", ["nome do arquivo.", "modelo do computador.", "porta do roteador.", "formato de imagem."]],
    ["modularizar código ajuda a:", "reduzir repetição, organizar responsabilidades e facilitar manutenção.", ["aumentar confusão.", "misturar todas as regras.", "impedir testes.", "ocultar erros."]],
    ["validar dados de entrada significa:", "verificar se valores informados atendem regras esperadas.", ["aceitar qualquer valor.", "ignorar campo vazio.", "apagar mensagens de erro.", "trocar hardware."]],
    ["índice de lista permite:", "acessar posição específica de um elemento.", ["configurar roteador.", "formatar disco.", "criar tabela física.", "calibrar sensor."]],
    ["percorrer lista com laço permite:", "processar cada elemento da coleção.", ["mudar a cor do cabo.", "instalar sistema.", "criar usuário administrador.", "fazer backup externo."]],
    ["uma função sem clareza de objetivo tende a:", "dificultar leitura, teste e manutenção.", ["melhorar automaticamente desempenho.", "eliminar documentação.", "corrigir entradas inválidas.", "substituir comentários."]],
    ["combinar lista e condição é útil para:", "filtrar ou tratar elementos conforme critérios.", ["trocar a placa-mãe.", "criar DNS.", "editar imagem.", "montar cabo."]],
    ["tratamento de erro em entrada numérica busca:", "evitar falhas quando o usuário digita valor inválido.", ["impedir uso de números.", "desligar o sistema.", "remover variáveis.", "apagar listas."]],
    ["dividir um problema em funções menores facilita:", "testar partes específicas da solução.", ["impedir reuso.", "aumentar duplicação.", "desorganizar código.", "remover lógica."]],
    ["uma lista vazia pode ser usada para:", "acumular valores durante a execução.", ["representar fonte de alimentação.", "definir IP.", "armazenar apenas imagens no monitor.", "apagar memória física."]],
    ["nomear funções de forma clara contribui para:", "compreensão do papel de cada bloco de código.", ["ocultar a lógica.", "trocar senha.", "mudar topologia.", "reduzir legibilidade."]],
    ["em programa modular, a função principal pode:", "coordenar chamadas de outras funções.", ["substituir todas as variáveis.", "impedir retorno.", "apagar parâmetros.", "ignorar entrada."]],
  ]),
  D09: makeItems("Em Programação Orientada a Objetos,", [
    ["classe pode ser entendida como:", "modelo que define atributos e comportamentos de objetos.", ["registro único no banco.", "cabo de rede.", "tag HTML.", "arquivo de imagem."]],
    ["objeto é:", "instância criada a partir de uma classe.", ["formato de pasta.", "tipo de monitor.", "comando SQL.", "propriedade CSS."]],
    ["atributo representa:", "característica ou dado associado ao objeto.", ["ação executada por roteador.", "tamanho do gabinete.", "laço de repetição.", "sistema de arquivos."]],
    ["método representa:", "comportamento ou ação que o objeto pode realizar.", ["campo fixo da placa-mãe.", "nome da fonte.", "tipo de cabo.", "extensão de imagem."]],
    ["encapsulamento busca:", "proteger dados internos e controlar acesso por métodos.", ["expor tudo sem critério.", "eliminar classes.", "impedir reuso.", "remover objetos."]],
    ["construtor é usado para:", "inicializar objeto no momento da criação.", ["formatar disco.", "editar imagem.", "definir DNS.", "trocar senha."]],
    ["herança permite:", "reaproveitar características de uma classe em outra.", ["duplicar código sem relação.", "remover atributos.", "impedir especialização.", "apagar métodos."]],
    ["polimorfismo permite:", "objetos responderem de formas diferentes a uma mesma operação.", ["usar apenas uma classe.", "proibir métodos.", "remover abstração.", "trocar hardware."]],
    ["abstração em POO significa:", "representar aspectos essenciais de uma entidade.", ["copiar todos os detalhes irrelevantes.", "ignorar regras do problema.", "usar só imagens.", "não criar modelos."]],
    ["uma classe Aluno com nome e matrícula modela:", "entidade do domínio do problema.", ["topologia de rede.", "sensor físico.", "estilo CSS.", "formato de arquivo."]],
    ["instanciar uma classe significa:", "criar um objeto concreto a partir dela.", ["deletar classe.", "renomear arquivo.", "formatar disco.", "criar backup."]],
    ["relacionamento entre classes pode representar:", "associação entre objetos do domínio.", ["cor de fundo.", "velocidade do cooler.", "chave do teclado.", "senha do Wi-Fi."]],
    ["usar POO ajuda a:", "organizar sistemas em entidades com dados e comportamentos.", ["eliminar testes.", "dispensar planejamento.", "misturar responsabilidades.", "remover documentação."]],
    ["um método calcularMedia em Aluno deveria:", "executar regra relacionada às notas do aluno.", ["alterar IP da rede.", "trocar fonte do texto.", "montar memória RAM.", "criar sensor."]],
    ["atributos privados indicam:", "dados com acesso controlado pela classe.", ["dados públicos obrigatórios.", "ausência de métodos.", "erro de sintaxe sempre.", "arquivo sem extensão."]],
  ]),
  D10: makeItems("Ao depurar programas,", [
    ["um erro de sintaxe ocorre quando:", "o código viola regras da linguagem.", ["o resultado é logicamente errado apenas.", "a internet cai.", "o monitor desliga.", "a fonte esquenta."]],
    ["um erro de lógica ocorre quando:", "o programa executa, mas não resolve corretamente o problema.", ["o teclado está desconectado.", "o arquivo é PDF.", "a imagem é grande.", "o roteador reinicia."]],
    ["teste de mesa ajuda a:", "simular execução acompanhando variáveis e saídas.", ["trocar hardware.", "criar banco.", "editar CSS.", "compactar imagem."]],
    ["mensagem de erro deve ser lida para:", "identificar local provável e tipo de falha.", ["ignorar o problema.", "apagar todo código.", "culpar o usuário sempre.", "remover comentários úteis."]],
    ["print de depuração pode servir para:", "observar valores intermediários durante execução.", ["melhorar design gráfico.", "trocar IP.", "montar placa.", "criar sensor."]],
    ["ao corrigir bug, é adequado:", "alterar uma parte por vez e testar novamente.", ["mudar tudo sem registro.", "não executar teste.", "apagar requisitos.", "ignorar saída esperada."]],
    ["prever saída exige:", "seguir passo a passo o fluxo do programa.", ["avaliar só o nome do arquivo.", "ver a cor do editor.", "trocar mouse.", "medir cabo."]],
    ["um teste com entrada inválida verifica:", "se o programa trata erros do usuário.", ["se o monitor é grande.", "se há sinal Wi-Fi.", "se a fonte é modular.", "se a imagem tem transparência."]],
    ["comentários úteis no código podem:", "explicar decisões ou trechos não óbvios.", ["substituir lógica.", "corrigir bug automaticamente.", "remover necessidade de testes.", "executar funções."]],
    ["versionar código ajuda porque:", "permite acompanhar alterações e recuperar versões.", ["impede erros sempre.", "substitui validação.", "aumenta RAM.", "troca processador."]],
    ["ao justificar uma decisão de correção, deve-se:", "relacionar causa, mudança feita e resultado esperado.", ["dizer apenas que funcionou.", "ocultar erro.", "remover evidências.", "não testar."]],
    ["um caso de teste deve conter:", "entrada, procedimento e saída esperada.", ["apenas o nome do aluno.", "cor da tela.", "marca do computador.", "tipo do cabo."]],
    ["debugger permite:", "executar código passo a passo e inspecionar valores.", ["fazer backup físico.", "criar rede sem fio.", "editar imagens.", "trocar fonte."]],
    ["erro de tipo pode ocorrer quando:", "operação usa valores incompatíveis.", ["o monitor está sujo.", "a tabela tem chaves.", "o cabo está curto.", "a imagem é PNG."]],
    ["um programa confiável deve ser testado com:", "casos comuns, limites e entradas inválidas.", ["apenas um caso favorável.", "nenhuma entrada.", "só dados do professor.", "somente saída bonita."]],
  ]),
  D11: makeItems("Em Arquitetura de Computadores,", [
    ["CPU é responsável principalmente por:", "processar instruções e coordenar operações.", ["armazenar arquivos permanentemente.", "exibir imagens sozinho.", "fornecer energia.", "conectar rede sem fio."]],
    ["placa-mãe permite:", "conexão e comunicação entre componentes.", ["editar planilhas.", "substituir sistema operacional.", "funcionar como antivírus.", "gerar código Python."]],
    ["fonte de alimentação tem a função de:", "fornecer energia adequada aos componentes.", ["armazenar documentos.", "processar imagens.", "conectar páginas HTML.", "criar backup."]],
    ["cooler ajuda a:", "dissipar calor e manter temperatura adequada.", ["salvar arquivos.", "aumentar armazenamento.", "definir IP.", "criar classes."]],
    ["SSD geralmente oferece:", "armazenamento persistente com acesso rápido.", ["energia elétrica.", "processamento central.", "sinal de vídeo sempre.", "proteção contra phishing."]],
    ["placa de vídeo dedicada é mais relevante para:", "processamento gráfico mais intenso.", ["armazenar senhas.", "criar pastas.", "executar DNS.", "montar banco relacional."]],
    ["memória RAM insuficiente pode causar:", "lentidão ao executar muitos programas.", ["melhor contraste.", "mais espaço em disco.", "aumento de portas USB.", "melhor qualidade de papel."]],
    ["porta USB é usada para:", "conectar periféricos e dispositivos externos.", ["criar chave primária.", "executar while.", "editar CSS.", "definir herança."]],
    ["periférico de entrada é aquele que:", "envia dados ao computador.", ["mostra apenas resultados.", "armazena energia.", "define rota de rede.", "processa SQL."]],
    ["monitor é periférico de:", "saída.", ["entrada apenas.", "armazenamento.", "processamento.", "backup."]],
    ["barramento do sistema está relacionado a:", "comunicação de dados entre componentes.", ["hierarquia visual.", "senha forte.", "domínio DNS.", "tag semântica."]],
    ["processador e memória trabalham juntos porque:", "a CPU acessa dados e instruções carregadas na RAM.", ["ambos são cabos.", "ambos são periféricos externos.", "ambos substituem disco.", "ambos criam páginas web."]],
    ["compatibilidade de componentes depende de:", "soquete, padrões, conectores e especificações técnicas.", ["cor do gabinete apenas.", "nome do usuário.", "tema do sistema.", "tamanho do papel."]],
    ["BIOS/UEFI fica armazenada em:", "firmware da placa-mãe.", ["arquivo de texto comum.", "cartão de rede.", "aplicativo de apresentação.", "pasta de downloads."]],
    ["um nobreak pode proteger contra:", "quedas de energia e variações elétricas dentro de sua capacidade.", ["erros de lógica.", "falhas de HTML.", "senha fraca.", "chave estrangeira inválida."]],
  ]),
  D12: makeItems("Em montagem e configuração de computadores,", [
    ["antes de instalar memória RAM, deve-se verificar:", "compatibilidade com placa-mãe e encaixe correto.", ["cor do papel de parede.", "nome do usuário.", "tag HTML.", "consulta SQL."]],
    ["pasta térmica é aplicada entre:", "processador e dissipador/cooler.", ["monitor e teclado.", "roteador e cabo.", "SSD e pendrive.", "HTML e CSS."]],
    ["após montar computador, primeiro teste deve verificar:", "ligamento, reconhecimento de componentes e ausência de falhas.", ["número de curtidas.", "cor do gabinete apenas.", "nome do arquivo.", "tamanho da fonte."]],
    ["cabos de energia internos devem ser:", "encaixados corretamente e compatíveis com os componentes.", ["deixados soltos.", "cortados para caber.", "misturados sem identificação.", "conectados com força excessiva."]],
    ["instalar driver é necessário para:", "permitir funcionamento adequado de determinados dispositivos.", ["formatar texto.", "trocar senha.", "definir cardinalidade.", "criar slide."]],
    ["particionamento de disco na instalação serve para:", "organizar áreas de armazenamento do sistema.", ["criar cabo físico.", "definir contraste.", "alterar IP.", "criar método de classe."]],
    ["configuração de boot define:", "ordem ou dispositivo usado para iniciar o sistema.", ["modelo do monitor.", "nome do usuário.", "tema da interface.", "tipo de documento."]],
    ["após instalar sistema, deve-se:", "atualizar, instalar drivers e verificar funcionamento.", ["remover cooler.", "deixar sem senha.", "desativar todos os recursos.", "ignorar segurança."]],
    ["um checklist de montagem ajuda a:", "evitar esquecimentos e registrar etapas.", ["substituir conhecimento técnico.", "apagar evidências.", "ocultar erro.", "impedir testes."]],
    ["equipamento não reconhecido pode indicar:", "driver ausente, conexão incorreta ou incompatibilidade.", ["contraste baixo.", "erro de tipografia.", "classe sem método.", "tag sem alt."]],
    ["ao trocar SSD, deve-se cuidar de:", "backup, compatibilidade e instalação correta.", ["excluir dados sem avisar.", "dobrar conector.", "usar qualquer parafuso.", "ignorar sistema."]],
    ["organização de cabos internos contribui para:", "fluxo de ar, manutenção e segurança.", ["aumentar dados no banco.", "melhorar cor do site.", "substituir antivírus.", "criar loop."]],
    ["ao instalar placa de expansão, deve-se:", "encaixar no slot correto e fixar adequadamente.", ["colocar na porta USB.", "usar cola quente.", "deixar solta.", "conectar na memória RAM."]],
    ["configuração inicial inclui:", "usuário, atualizações, drivers, rede e segurança básica.", ["somente papel de parede.", "apenas nome do computador.", "nenhum teste.", "senha em branco obrigatória."]],
    ["verificação final de equipamento deve incluir:", "teste de hardware, sistema, rede e periféricos.", ["apenas aparência externa.", "apenas brilho da tela.", "somente abertura do navegador.", "nenhum registro."]],
  ]),
  D15: makeItems("Em HTML,", [
    ["a tag <header> indica:", "cabeçalho de página ou seção.", ["consulta SQL.", "sensor de umidade.", "endereço IP.", "classe Python."]],
    ["a tag <main> deve conter:", "conteúdo principal da página.", ["scripts de banco apenas.", "fonte de alimentação.", "placa de vídeo.", "senha do usuário."]],
    ["a tag <section> serve para:", "agrupar conteúdo temático.", ["formatar disco.", "criar roteador.", "instalar driver.", "definir chave primária."]],
    ["o atributo alt em imagem contribui para:", "acessibilidade e descrição alternativa.", ["aumentar RAM.", "definir IP.", "compilar Python.", "montar hardware."]],
    ["um link em HTML é criado com:", "tag <a> e atributo href.", ["tag <img> sem src.", "comando SELECT.", "propriedade display.", "laço while."]],
    ["lista não ordenada é representada por:", "<ul> com itens <li>.", ["<table> com <ip>.", "<for> com <if>.", "SELECT com WHERE.", "router com switch."]],
    ["título principal da página deve usar:", "<h1> de forma semântica.", ["<p> para tudo.", "<br> repetido.", "<img> sem texto.", "<div> sem função sempre."]],
    ["formulário em HTML é estruturado com:", "campos, rótulos e controles de envio.", ["apenas imagens.", "somente cabos.", "tabelas SQL físicas.", "classes de hardware."]],
    ["label em formulário ajuda a:", "associar texto explicativo ao campo.", ["aumentar clock.", "trocar DNS.", "criar backup.", "formatar gabinete."]],
    ["HTML semântico melhora:", "acessibilidade, organização e interpretação do conteúdo.", ["consumo de energia.", "temperatura da CPU.", "capacidade do SSD.", "velocidade da fonte."]],
    ["a tag <footer> costuma indicar:", "rodapé com informações complementares.", ["início de programa Python.", "comando de rede.", "tabela primária.", "sensor."]],
    ["o atributo src em imagem define:", "caminho do arquivo de imagem.", ["cor do texto.", "endereço IP.", "classe do objeto.", "senha do usuário."]],
    ["um documento HTML básico deve conter:", "estrutura com html, head e body.", ["somente CSS.", "apenas SQL.", "somente Python.", "apenas imagem."]],
    ["a tag <table> é adequada para:", "dados tabulares com linhas e colunas.", ["layout geral moderno obrigatório.", "qualquer parágrafo.", "senha do banco.", "roteamento de rede."]],
    ["atributos em HTML servem para:", "fornecer informações adicionais aos elementos.", ["trocar hardware.", "criar sensor.", "testar memória.", "formatar disco."]],
  ]),
  D16: makeItems("Em CSS,", [
    ["seletor de id é indicado por:", "# antes do identificador.", [". antes do identificador.", "SELECT antes do nome.", "@ip antes do nome.", "<id> sempre."]],
    ["margin controla:", "espaço externo ao elemento.", ["texto alternativo.", "endereço IP.", "tipo de memória.", "chave primária."]],
    ["padding controla:", "espaço interno entre conteúdo e borda.", ["processamento da CPU.", "rota DNS.", "backup.", "classe de objeto."]],
    ["font-size define:", "tamanho do texto.", ["tamanho do disco.", "velocidade da rede.", "temperatura do processador.", "senha do usuário."]],
    ["background-color altera:", "cor de fundo do elemento.", ["sistema operacional.", "chave estrangeira.", "sensor.", "topologia."]],
    ["media query é usada para:", "adaptar estilos a condições como largura da tela.", ["consultar banco SQL.", "montar placa-mãe.", "criar senha.", "executar laço."]],
    ["display grid permite:", "organizar layout em linhas e colunas.", ["formatar disco.", "calibrar cooler.", "criar tabela SQL.", "trocar sistema."]],
    ["contraste em CSS é importante para:", "legibilidade e acessibilidade visual.", ["aumentar IP.", "trocar hardware.", "compilar Python.", "criar backup."]],
    ["classe CSS pode ser reutilizada para:", "aplicar estilo comum a vários elementos.", ["armazenar senha.", "configurar BIOS.", "medir rede.", "criar sensor."]],
    ["unidades relativas como rem ajudam em:", "escala e consistência de tamanhos.", ["soldagem.", "endereçamento IP.", "chaves SQL.", "memória física."]],
    ["border-radius altera:", "arredondamento dos cantos.", ["senha do usuário.", "tipo de processador.", "comando SQL.", "nome da classe."]],
    ["hover permite definir estilo quando:", "o cursor passa sobre o elemento.", ["o computador reinicia.", "o banco apaga dados.", "a rede perde conexão.", "o sensor aquece."]],
    ["flex-wrap ajuda quando:", "itens flexíveis precisam quebrar linha.", ["o processador falha.", "o backup some.", "o SQL consulta.", "o roteador liga."]],
    ["position relative/absolute trata de:", "posicionamento visual dos elementos.", ["criptografia.", "hardware.", "banco relacional.", "sistemas de arquivos."]],
    ["CSS externo é recomendado porque:", "separa estilo do conteúdo e facilita manutenção.", ["impede acessibilidade.", "elimina HTML.", "substitui JavaScript sempre.", "desativa navegador."]],
  ]),
  D32: makeItems("Em Design Gráfico,", [
    ["alinhamento visual contribui para:", "organização e leitura mais clara.", ["desorganizar blocos.", "reduzir contraste.", "apagar hierarquia.", "ocultar informação."]],
    ["tipografia adequada deve considerar:", "legibilidade, contexto e tamanho.", ["apenas gosto pessoal.", "sempre fonte decorativa.", "texto mínimo ilegível.", "ausência de contraste."]],
    ["contraste serve para:", "diferenciar elementos e destacar informações.", ["aproximar tudo visualmente.", "esconder títulos.", "reduzir leitura.", "misturar texto com fundo."]],
    ["hierarquia visual ajuda a:", "mostrar ordem de importância das informações.", ["deixar tudo com mesmo peso.", "eliminar título.", "dificultar navegação.", "reduzir compreensão."]],
    ["paleta de cores deve ser escolhida considerando:", "mensagem, público, contraste e identidade visual.", ["qualquer cor aleatória.", "somente tons muito próximos.", "ausência de legibilidade.", "preferência sem contexto."]],
    ["espaço em branco no layout serve para:", "dar respiro e separar grupos de informação.", ["desperdiçar área sempre.", "esconder conteúdo.", "reduzir leitura.", "impedir foco."]],
    ["proximidade entre elementos indica:", "relação visual ou temática entre eles.", ["que são sempre iguais.", "que devem ser ignorados.", "que não têm conexão.", "que são erros."]],
    ["repetição visual ajuda a:", "criar consistência e identidade.", ["confundir padrões.", "remover unidade.", "quebrar leitura.", "impedir reconhecimento."]],
    ["composição equilibrada busca:", "distribuir elementos de forma harmônica e funcional.", ["amontoar tudo em um canto.", "usar excesso sem critério.", "ocultar informação.", "remover contraste."]],
    ["ícones devem ser usados para:", "apoiar compreensão sem substituir informação essencial.", ["decorar sem sentido.", "confundir ações.", "substituir todo texto técnico.", "ocultar comandos."]],
    ["legibilidade em cartaz depende de:", "tamanho, contraste, fonte e distância de leitura.", ["quantidade máxima de efeitos.", "fundo muito poluído.", "texto minúsculo.", "cores sem contraste."]],
    ["consistência visual em uma peça significa:", "manter padrões de cor, fonte, espaçamento e estilo.", ["trocar tudo a cada bloco.", "usar fontes aleatórias.", "mudar alinhamento sem razão.", "não repetir padrões."]],
    ["uma peça com excesso de informação tende a:", "dificultar foco e compreensão.", ["melhorar leitura sempre.", "aumentar clareza.", "garantir acessibilidade.", "substituir hierarquia."]],
    ["design acessível deve considerar:", "contraste, leitura, organização e público diverso.", ["apenas estética.", "texto sem contraste.", "imagens sem sentido.", "informação escondida."]],
    ["o ponto focal em uma composição é:", "elemento que atrai primeiro a atenção do leitor.", ["qualquer erro de layout.", "a menor palavra sempre.", "o rodapé obrigatório.", "o fundo sem conteúdo."]],
  ]),
  D33: makeItems("Em produção e exportação de artefatos digitais,", [
    ["formato JPG é comum para:", "fotografias e imagens com muitas cores.", ["textos editáveis longos.", "bancos relacionais.", "código Python.", "endereços IP."]],
    ["formato PNG é indicado quando:", "precisa preservar transparência ou nitidez em elementos gráficos.", ["quer perder qualidade sempre.", "precisa executar programa.", "quer compactar banco SQL.", "precisa criar cabo."]],
    ["formato SVG é adequado para:", "gráficos vetoriais escaláveis.", ["áudio gravado.", "planilha de notas.", "fonte de alimentação.", "rede física."]],
    ["resolução baixa em impressão pode causar:", "imagem pixelada ou sem nitidez.", ["aumento de contraste técnico.", "melhor qualidade sempre.", "menor necessidade de revisão.", "texto mais legível automaticamente."]],
    ["antes de exportar, é necessário conferir:", "dimensão, formato, qualidade e destino de uso.", ["apenas nome do arquivo.", "cor favorita.", "senha do usuário.", "tipo de roteador."]],
    ["compressão de imagem deve equilibrar:", "tamanho do arquivo e qualidade visual.", ["tensão elétrica.", "velocidade do processador.", "número de usuários.", "tipo de cabo."]],
    ["arquivo editável é importante porque:", "permite ajustes futuros no projeto.", ["impede alterações.", "não abre em programas.", "apaga camadas.", "remove fontes."]],
    ["camadas em ferramenta gráfica ajudam a:", "organizar elementos separadamente.", ["formatar disco.", "criar chave primária.", "configurar DNS.", "executar laço."]],
    ["exportar para redes sociais exige observar:", "dimensão, proporção, legibilidade e peso do arquivo.", ["voltagem da fonte.", "classe do objeto.", "IP do servidor.", "partição do disco."]],
    ["modo de cor para impressão costuma exigir atenção a:", "perfil de cor e fidelidade no material final.", ["senha de rede.", "tag HTML.", "driver de som.", "loop infinito."]],
    ["ferramenta de edição raster trabalha principalmente com:", "pixels.", ["chaves estrangeiras.", "sensores.", "classes.", "endereços IP."]],
    ["ferramenta vetorial trabalha principalmente com:", "formas matemáticas redimensionáveis.", ["arquivos temporários.", "cabos físicos.", "processos do sistema.", "memória volátil."]],
    ["nomear arquivos de design adequadamente ajuda a:", "identificar versão, finalidade e autoria.", ["substituir backup.", "dispensar organização.", "ocultar alterações.", "aumentar RAM."]],
    ["ao enviar material para impressão, deve-se:", "usar formato e qualidade adequados ao serviço.", ["mandar print de baixa resolução sempre.", "ignorar margens.", "usar texto ilegível.", "remover revisão."]],
    ["uma versão final e uma editável devem ser guardadas para:", "publicação e manutenção posterior.", ["duplicar erros.", "remover autoria.", "impedir ajustes.", "confundir formatos."]],
  ]),
  D34: makeItems("Na produção de materiais digitais,", [
    ["um post informativo acessível deve ter:", "texto claro, contraste e organização visual.", ["excesso de fontes.", "texto pequeno.", "fundo poluído.", "informação sem hierarquia."]],
    ["texto alternativo em imagem ajuda:", "pessoas que usam leitores de tela.", ["a aumentar RAM.", "a criar banco.", "a mudar IP.", "a instalar driver."]],
    ["material para comunidade deve usar linguagem:", "adequada ao público e ao objetivo da comunicação.", ["excessivamente técnica sem explicação.", "sem revisão.", "com abreviações confusas.", "sem contexto."]],
    ["um card de campanha deve priorizar:", "mensagem principal, ação esperada e fonte confiável.", ["muitos temas ao mesmo tempo.", "texto ilegível.", "dados sem origem.", "apenas decoração."]],
    ["acessibilidade visual inclui:", "contraste, tamanho de fonte e clareza de layout.", ["texto sobre fundo parecido.", "fonte minúscula.", "baixa legibilidade.", "excesso de ruído visual."]],
    ["ao produzir material para redes sociais, é importante:", "adaptar formato ao canal e ao público.", ["usar qualquer proporção.", "ignorar corte da plataforma.", "não revisar texto.", "desconsiderar leitura em celular."]],
    ["uma cartilha digital eficiente deve:", "organizar conteúdo em seções claras e linguagem compreensível.", ["misturar temas sem ordem.", "usar texto denso sem títulos.", "não indicar fontes.", "omitir objetivo."]],
    ["comunicação visual responsável evita:", "desinformação, exposição indevida e uso inadequado de imagens.", ["boatos.", "imagens sem permissão.", "dados pessoais expostos.", "mensagens alarmistas."]],
    ["identidade visual em projeto escolar ajuda a:", "criar reconhecimento e consistência entre materiais.", ["confundir peças.", "mudar padrão sempre.", "remover autoria.", "esconder logotipo."]],
    ["em material educativo, chamada para ação serve para:", "orientar o que o público deve fazer após ler.", ["ocultar objetivo.", "aumentar confusão.", "substituir conteúdo.", "tirar responsabilidade."]],
    ["legenda em imagem pode ajudar a:", "contextualizar conteúdo visual.", ["trocar hardware.", "criar senha.", "definir IP.", "executar código."]],
    ["infográfico é adequado quando:", "dados ou etapas precisam ser explicados visualmente.", ["não há informação.", "o objetivo é esconder dados.", "tudo deve ser texto corrido.", "não existe público-alvo."]],
    ["material digital inclusivo deve considerar:", "diversidade de leitores, dispositivos e necessidades.", ["apenas telas grandes.", "somente estética.", "pessoas sem deficiência apenas.", "uma única forma de leitura."]],
    ["revisão antes da publicação deve conferir:", "ortografia, dados, links, imagens e acessibilidade.", ["apenas cor favorita.", "somente número de curtidas.", "nada se estiver bonito.", "apenas tamanho do arquivo."]],
    ["um material comunicativo eficiente é aquele que:", "transmite mensagem correta para o público certo com clareza.", ["agrada apenas ao autor.", "usa muitos efeitos.", "não informa ação.", "não tem fonte."]],
  ]),
};

const MIN_TARGET = 20;
const targetDescritores = new Set(Object.keys(banco));
const contagem = countByDescritor(questoesAtuais);
let proximoNumero = Math.max(
  ...questoesAtuais.map((questao) => Number(String(questao.codigo).match(/\d+$/)?.[0] || 0)),
) + 1;

const novasQuestoes = [];

for (const codigoDescritor of targetDescritores) {
  const descritor = descritorPorCodigo[codigoDescritor];
  const faltam = Math.max(0, MIN_TARGET - (contagem[codigoDescritor] || 0));
  const itens = banco[codigoDescritor] || [];
  if (faltam > itens.length) {
    throw new Error(`Banco insuficiente para ${codigoDescritor}: faltam ${faltam}, disponiveis ${itens.length}`);
  }

  itens.slice(0, faltam).forEach(([enunciado, correta, distratores], index) => {
    const codigo = `Q-INF-V03-${String(proximoNumero).padStart(4, "0")}`;
    novasQuestoes.push({
      codigo,
      descritor_codigo: codigoDescritor,
      componente_curricular: descritor.componente_curricular,
      enunciado,
      ...options(correta, distratores, proximoNumero + index),
      justificativa: `Item complementar v0.3 criado para robustecer o descritor ${codigoDescritor} com meta minima de 20 questoes. Deve passar por revisao docente antes de aplicacao oficial.`,
      dificuldade_inicial: Number((1.15 + ((proximoNumero + index) % 8) * 0.1).toFixed(2)),
      status: "em_revisao",
    });
    proximoNumero += 1;
  });
}

const questoesAtualizadas = [...questoesAtuais, ...novasQuestoes];
fs.writeFileSync(seedPath, replaceArray("questoesNorteadoras", questoesAtualizadas), "utf8");

const resumo = {
  questoes_anteriores: questoesAtuais.length,
  questoes_novas: novasQuestoes.length,
  questoes_total: questoesAtualizadas.length,
  descritores_priorizados: Array.from(targetDescritores),
  meta_por_descritor: MIN_TARGET,
  status_itens_novos: "em_revisao",
};

const reportPath = path.join(__dirname, "..", "docs", "expansao_descritores_base_v0_3.json");
fs.writeFileSync(reportPath, JSON.stringify(resumo, null, 2), "utf8");

console.log(JSON.stringify(resumo, null, 2));
