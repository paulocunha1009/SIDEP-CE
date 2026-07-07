
var BANCO = {
  ano1: {
    label: "1º ano — Informática Básica + Lógica de Programação I",
    turmaPadrao: "1ª TEC. INF.",
    blocos: [
      {
        nome: "Bloco A — Informática Básica",
        itens: [
          { q: "A parte física de um computador — teclado, mouse, tela, gabinete — é chamada de:", op: ["Software.", "Hardware.", "Sistema operacional.", "Firmware social.", "Aplicativo."], r: 1 },
          { q: "O programa que gerencia o hardware e permite que outros softwares funcionem é o:", op: ["Navegador.", "Antivírus.", "Sistema operacional.", "Editor de texto.", "Compilador."], r: 2 },
          { q: "Windows, Linux e macOS são exemplos de:", op: ["Editores de planilha.", "Sistemas operacionais.", "Navegadores.", "Linguagens de programação.", "Antivírus."], r: 1 },
          { q: "Um arquivo de texto salvo com formatação (negrito, título) foi provavelmente criado em um(a):", op: ["Editor de planilhas.", "Editor de apresentações.", "Editor de texto.", "Navegador.", "Player de vídeo."], r: 2 },
          { q: "Para organizar gastos do mês com soma automática por categoria, o programa mais indicado é:", op: ["Editor de texto.", "Editor de planilhas.", "Editor de apresentações.", "Navegador.", "Sistema operacional."], r: 1 },
          { q: "Uma \"pasta\" no computador serve para:", op: ["Executar programas diretamente.", "Agrupar e organizar arquivos.", "Substituir o sistema operacional.", "Proteger a internet de vírus.", "Armazenar apenas fotos."], r: 1 },
          { q: "Você recebe um e-mail suspeito pedindo senha bancária, com link duvidoso. A atitude mais segura é:", op: ["Clicar para conferir se é verdade.", "Responder com a senha, pois parece urgente.", "Não clicar, não enviar dados e verificar a autenticidade da mensagem.", "Encaminhar para os colegas.", "Ignorar, mas manter a mesma senha em tudo."], r: 2 },
          { q: "Uma senha considerada mais segura combina:", op: ["Data de nascimento.", "A mesma senha em todos os sites.", "Letras maiúsculas, minúsculas, números e símbolos, diferente em cada serviço.", "Sequência simples como \"123456\".", "Nome do usuário repetido."], r: 2 },
          { q: "Internet e navegador (como o Chrome) são a mesma coisa?", op: ["Sim, são sinônimos.", "Não: internet é a rede mundial; navegador é o programa usado para acessá-la.", "Sim, ambos são hardware.", "Não: navegador é um vírus.", "Não: internet é um tipo de cabo."], r: 1 },
          { q: "Antes de instalar um programa desconhecido baixado da internet, o mais seguro é:", op: ["Instalar direto.", "Verificar a fonte e, se possível, checar com antivírus antes.", "Desligar o antivírus para agilizar.", "Compartilhar o arquivo antes de testar.", "Nenhuma das anteriores."], r: 1 },
          { q: "A unidade de medida que indica a capacidade de armazenamento de um pendrive é:", op: ["Hertz (Hz).", "Watts (W).", "Bytes (KB, MB, GB).", "Decibéis (dB).", "Pixels por polegada (PPI)."], r: 2 },
          { q: "Um dispositivo de ENTRADA de dados no computador é:", op: ["Monitor.", "Impressora.", "Teclado.", "Caixa de som.", "Projetor."], r: 2 },
          { q: "Um dispositivo de SAÍDA de dados é:", op: ["Mouse.", "Teclado.", "Monitor.", "Scanner.", "Microfone."], r: 2 },
          { q: "A extensão \".pdf\" geralmente indica um arquivo:", op: ["Editável em qualquer editor de imagem.", "De documento com formatação preservada para leitura.", "Executável (programa).", "De música.", "De planilha."], r: 1 },
          { q: "\"Backup\" é o termo usado para:", op: ["Apagar arquivos desnecessários.", "Cópia de segurança de dados.", "Vírus de computador.", "Atualização automática do sistema.", "Tipo de rede sem fio."], r: 1 },
          { q: "Um exemplo de malware (programa malicioso) é:", op: ["Navegador.", "Vírus de computador.", "Editor de texto.", "Sistema operacional.", "Impressora."], r: 1 },
          { q: "A rede sem fio usada para conectar computadores à internet em casa é chamada de:", op: ["Bluetooth.", "USB.", "Wi-Fi.", "HDMI.", "VGA."], r: 2 },
          { q: "Copiar um texto selecionado e colá-lo em outro lugar corresponde, respectivamente, aos atalhos:", op: ["Ctrl+Z e Ctrl+Y.", "Ctrl+C e Ctrl+V.", "Ctrl+X e Ctrl+P.", "Ctrl+A e Ctrl+S.", "Ctrl+B e Ctrl+I."], r: 1 },
          { q: "Guardar arquivos em serviços como Google Drive ou OneDrive é um exemplo de uso de:", op: ["Armazenamento em nuvem.", "Memória RAM.", "Disco rígido local apenas.", "Sistema operacional offline.", "Rede local sem internet."], r: 0 },
          { q: "Usar linguagem respeitosa, não compartilhar boatos e citar fontes ao postar conteúdo na internet faz parte do conceito de:", op: ["Hardware.", "Cidadania digital.", "Firmware.", "Overclock.", "Streaming."], r: 1 }
        ]
      },
      {
        nome: "Bloco B — Lógica de Programação I (Python)",
        itens: [
          { q: "Uma sequência lógica de passos para resolver um problema, antes de virar código, é chamada de:", op: ["Sistema operacional.", "Algoritmo.", "Navegador.", "Servidor.", "Banco de dados."], r: 1 },
          { q: "A diferença entre algoritmo e programa é que:", op: ["São a mesma coisa.", "O algoritmo é a lógica dos passos; o programa é essa lógica escrita em uma linguagem que o computador entende.", "O algoritmo só existe em Python.", "O programa é sempre mais lento que o algoritmo.", "Não existe relação entre os dois."], r: 1 },
          { q: "Em um fluxograma, o símbolo em forma de losango (diamante) representa:", op: ["Início ou fim.", "Uma estrutura de decisão (Sim/Não).", "Entrada de dados apenas.", "Uma variável.", "Um comentário no código."], r: 1 },
          { q: "Em Python, o comando usado para exibir uma mensagem na tela é:", op: ["echo()", "printf()", "print()", "display()", "show()"], r: 2 },
          { q: "Observe: nome = input('Digite seu nome: '). O comando input() serve para:", op: ["Exibir o nome na tela.", "Armazenar o valor digitado pelo usuário na variável.", "Calcular o tamanho do nome.", "Apagar o conteúdo da variável.", "Verificar se o nome está correto."], r: 1 },
          { q: "Uma VARIÁVEL em programação é:", op: ["Um tipo de impressora.", "Um espaço na memória onde se guarda um valor que pode mudar durante a execução.", "Um símbolo usado apenas em fluxogramas.", "Um comando que encerra o programa.", "Uma linguagem de programação."], r: 1 },
          { q: "Qual será a saída do código abaixo?\n<pre>idade = 15\nprint('Minha idade é', idade)</pre>", op: ["idade", "Minha idade é idade", "15", "Minha idade é 15", "Erro de sintaxe"], r: 3 },
          { q: "Observe o código abaixo. Qual será a saída?\n<pre>nota = 7\nif nota >= 6:\n    print('Aprovado')\nelse:\n    print('Reprovado')</pre>", op: ["nota >= 6", "Reprovado", "Aprovado", "7", "Nenhuma saída"], r: 2 },
          { q: "O comando elif em Python é utilizado para:", op: ["Encerrar o programa.", "Repetir um bloco de código.", "Verificar uma nova condição quando a condição anterior do if foi falsa.", "Declarar uma variável.", "Mostrar erro na tela."], r: 2 },
          { q: "Em Python, os tipos de dado int, float, str e bool representam, respectivamente:", op: ["Texto, número inteiro, decimal e lógico.", "Número inteiro, número decimal, texto e valor lógico (verdadeiro/falso).", "Lista, dicionário, texto e número.", "Apenas números.", "Apenas textos."], r: 1 },
          { q: "Qual será a saída do código abaixo?\n<pre>contador = 1\nwhile contador <= 3:\n    print(contador)\n    contador = contador + 1</pre>", op: ["1 2 3 4", "0 1 2 3", "1 2 3", "Loop infinito", "Nenhuma saída"], r: 2 },
          { q: "Quantas vezes o código abaixo exibirá 'Olá'?\n<pre>for i in range(4):\n    print('Olá')</pre>", op: ["3 vezes.", "5 vezes.", "1 vez.", "4 vezes.", "0 vezes."], r: 3 },
          { q: "Em Python, o operador \"==\" é usado para:", op: ["Atribuir um valor a uma variável.", "Comparar se dois valores são iguais.", "Somar dois números.", "Criar um comentário.", "Multiplicar valores."], r: 1 },
          { q: "Os operadores lógicos \"and\", \"or\" e \"not\" em Python servem para:", op: ["Realizar apenas operações matemáticas.", "Combinar ou negar condições lógicas.", "Substituir o comando print().", "Criar variáveis automaticamente.", "Formatar texto."], r: 1 },
          { q: "A indentação (espaços no início da linha) em Python é importante porque:", op: ["É apenas estética, não afeta o funcionamento.", "Define blocos de código (ex.: o que pertence a um if ou loop).", "Só é usada em comentários.", "Impede erros de digitação automaticamente.", "Não tem função alguma em Python."], r: 1 },
          { q: "Um comentário em Python (linha que o interpretador ignora) é escrito com o símbolo:", op: ["//", "#", "<!-- -->", "/* */", "::"], r: 1 },
          { q: "Qual será o valor impresso pelo código abaixo?\n<pre>soma = 0\ni = 1\nwhile i <= 5:\n    soma = soma + i\n    i = i + 1\nprint(soma)</pre>", op: ["10", "5", "15", "25", "6"], r: 2 },
          { q: "Uma lista em Python (ex.: idades = [15, 16, 17]) serve para:", op: ["Armazenar um único valor.", "Armazenar uma coleção de valores em uma única variável.", "Substituir o print().", "Criar apenas números decimais.", "Executar comandos condicionais."], r: 1 },
          { q: "O código abaixo tenta somar dois números, mas apresenta um erro comum de iniciantes. Qual é o erro?\n<pre>a = input('Digite um número: ')\nb = input('Digite outro número: ')\nprint(a + b)</pre>", op: ["Não há erro, o código está correto.", "input() sempre retorna texto (string); é preciso converter para número com int() antes de somar.", "print() não pode receber variáveis.", "A variável \"a\" não pode se chamar assim.", "Falta um \"else\" no código."], r: 1 },
          { q: "Em um fluxograma que representa \"ler a nota do aluno e verificar se passou\", a ordem correta dos símbolos é:", op: ["Fim → Entrada → Decisão → Início.", "Início → Entrada (ler nota) → Decisão (nota ≥ 6?) → Saída (resultado) → Fim.", "Decisão → Início → Entrada → Fim.", "Início → Saída → Entrada → Fim.", "Início → Processamento → Fim → Decisão."], r: 1 }
        ]
      }
    ]
  },
  ano2: {
    label: "2º ano — 8 disciplinas já ministradas",
    turmaPadrao: "2ª TEC. INF.",
    blocos: [
      {
        nome: "Bloco A — Informática Básica",
        itens: [
          { q: "A parte física do computador (teclado, tela, gabinete) é chamada de:", op: ["Software.", "Hardware.", "Sistema operacional.", "Firmware social.", "Aplicativo."], r: 1 },
          { q: "O programa responsável por gerenciar o hardware e permitir que outros softwares funcionem é:", op: ["Editor de texto.", "Navegador.", "Sistema operacional.", "Antivírus.", "Compilador."], r: 2 },
          { q: "Diante de um e-mail suspeito pedindo dados bancários, a atitude mais segura é:", op: ["Clicar no link para conferir.", "Responder com os dados solicitados.", "Não clicar, não enviar dados e verificar a autenticidade.", "Encaminhar aos colegas.", "Ignorar, mas manter a mesma senha em tudo."], r: 2 },
          { q: "\"Backup\" é o termo usado para:", op: ["Vírus de computador.", "Cópia de segurança de dados.", "Atualização automática.", "Tipo de rede sem fio.", "Apagar arquivos."], r: 1 },
          { q: "Guardar arquivos em serviços como Google Drive é um exemplo de:", op: ["Armazenamento em nuvem.", "Memória RAM.", "Disco rígido local apenas.", "Rede local sem internet.", "Sistema operacional offline."], r: 0 }
        ]
      },
      {
        nome: "Bloco B — Lógica de Programação I (Python)",
        itens: [
          { q: "Uma VARIÁVEL em programação é:", op: ["Um tipo de impressora.", "Um espaço na memória onde se guarda um valor que pode mudar.", "Um símbolo usado só em fluxogramas.", "Um comando que encerra o programa.", "Uma linguagem de programação."], r: 1 },
          { q: "Em Python, o comando para exibir uma mensagem na tela é:", op: ["echo()", "printf()", "print()", "display()", "show()"], r: 2 },
          { q: "Qual será a saída do código abaixo?\n<pre>nota = 7\nif nota >= 6:\n    print('Aprovado')\nelse:\n    print('Reprovado')</pre>", op: ["nota >= 6", "Reprovado", "Aprovado", "7", "Nenhuma saída"], r: 2 },
          { q: "O comando input() em Python serve para:", op: ["Exibir texto na tela.", "Armazenar o valor digitado pelo usuário em uma variável.", "Calcular operações matemáticas.", "Apagar variáveis.", "Encerrar o programa."], r: 1 },
          { q: "O operador \"==\" em Python é usado para:", op: ["Atribuir um valor a uma variável.", "Comparar se dois valores são iguais.", "Somar dois números.", "Criar um comentário.", "Multiplicar valores."], r: 1 }
        ]
      },
      {
        nome: "Bloco C — Arquitetura e Manutenção de Computadores",
        itens: [
          { q: "Um componente que armazena dados de forma permanente, mesmo com o computador desligado, é:", op: ["A memória RAM.", "O processador (CPU).", "O disco de armazenamento (HD/SSD).", "A placa de vídeo.", "O sistema operacional."], r: 2 },
          { q: "A memória RAM se diferencia do disco de armazenamento porque:", op: ["É permanente, como o HD.", "É temporária: perde os dados quando o computador é desligado.", "Não tem relação com desempenho do computador.", "Serve apenas para conectar periféricos.", "É um tipo de software."], r: 1 },
          { q: "O componente considerado o \"cérebro\" do computador, responsável por executar instruções, é:", op: ["A fonte de alimentação.", "O processador (CPU).", "O gabinete.", "O monitor.", "O teclado."], r: 1 },
          { q: "Diante de um computador que \"trava direto\" e apresenta lentidão, o primeiro passo de um diagnóstico técnico é:", op: ["Formatar o computador sem investigar.", "Verificar sistematicamente possíveis causas (superaquecimento, memória, softwares em excesso).", "Trocar todos os componentes por padrão.", "Desligar e nunca mais ligar.", "Ignorar, pois não é possível diagnosticar."], r: 1 },
          { q: "A placa que conecta todos os componentes do computador (processador, memória, etc.) é chamada de:", op: ["Placa de vídeo.", "Placa-mãe.", "Placa de rede.", "Fonte de alimentação.", "Placa de som."], r: 1 }
        ]
      },
      {
        nome: "Bloco D — Programação Orientada a Objetos",
        itens: [
          { q: "Em Programação Orientada a Objetos, uma CLASSE é:", op: ["Um valor numérico fixo.", "Um molde/modelo que define atributos e comportamentos de um tipo de objeto.", "Um comando de repetição.", "Um tipo de erro de sintaxe.", "Um arquivo de imagem."], r: 1 },
          { q: "Um OBJETO, em POO, é:", op: ["A mesma coisa que uma variável simples.", "Uma instância concreta criada a partir de uma classe.", "Um tipo de comentário no código.", "Um erro de execução.", "Um comando de impressão."], r: 1 },
          { q: "Em uma classe \"Aluno\" com atributos nome, idade e curso, esses atributos representam:", op: ["Ações que o aluno realiza.", "Características/dados que descrevem o aluno.", "Erros de programação.", "Comandos de repetição.", "Bibliotecas externas."], r: 1 },
          { q: "Um MÉTODO, em uma classe, representa:", op: ["Um atributo apenas.", "Uma ação/comportamento que os objetos da classe podem realizar.", "Um erro de sintaxe.", "Um tipo de dado numérico.", "Um comentário no código."], r: 1 },
          { q: "A principal vantagem de organizar um sistema em classes e objetos é:", op: ["Deixar o código mais difícil de entender.", "Organizar e reaproveitar código, representando entidades do mundo real de forma estruturada.", "Impedir que o programa seja executado.", "Eliminar a necessidade de variáveis.", "Tornar o programa mais lento."], r: 1 }
        ]
      },
      {
        nome: "Bloco E — Lógica de Programação II",
        itens: [
          { q: "Qual será a saída do código abaixo?\n<pre>contador = 1\nwhile contador <= 3:\n    print(contador)\n    contador = contador + 1</pre>", op: ["1 2 3 4", "0 1 2 3", "1 2 3", "Loop infinito", "Nenhuma saída"], r: 2 },
          { q: "Quantas vezes o código abaixo exibirá 'Olá'?\n<pre>for i in range(4):\n    print('Olá')</pre>", op: ["3 vezes.", "5 vezes.", "1 vez.", "4 vezes.", "0 vezes."], r: 3 },
          { q: "Uma lista em Python (ex.: idades = [15, 16, 17]) serve para:", op: ["Armazenar um único valor.", "Armazenar uma coleção de valores em uma única variável.", "Substituir o print().", "Criar apenas números decimais.", "Executar comandos condicionais."], r: 1 },
          { q: "A principal diferença entre o laço for e o laço while em Python é que:", op: ["São exatamente iguais em todos os casos.", "O for é geralmente usado quando se sabe o número de repetições (ou percorre uma sequência); o while repete enquanto uma condição for verdadeira.", "O while nunca pode ser usado com listas.", "O for não pode usar range().", "O while é exclusivo para números decimais."], r: 1 },
          { q: "Qual valor será impresso pelo código abaixo?\n<pre>soma = 0\ni = 1\nwhile i <= 5:\n    soma = soma + i\n    i = i + 1\nprint(soma)</pre>", op: ["10", "5", "15", "25", "6"], r: 2 }
        ]
      },
      {
        nome: "Bloco F — HTML/CSS",
        itens: [
          { q: "A sigla CSS significa Cascading Style Sheets e é usada para:", op: ["Estruturar o conteúdo da página.", "Definir a aparência visual (cores, fontes, layout) da página.", "Programar a lógica do site.", "Armazenar dados em banco de dados.", "Substituir o HTML completamente."], r: 1 },
          { q: "Uma folha de estilo CSS pode ser aplicada a uma página HTML de que formas?", op: ["Apenas dentro da tag <body>.", "Inline (no próprio elemento), interna (tag <style>) ou externa (arquivo .css separado).", "Somente por meio de programas pagos.", "CSS não pode ser aplicado a HTML.", "Apenas via linha de comando."], r: 1 },
          { q: "As tags semânticas do HTML5, como <header>, <main> e <footer>, se diferenciam da <div> porque:", op: ["Não há diferença nenhuma.", "Descrevem o significado do conteúdo, tornando o código mais organizado e acessível; a <div> é um container genérico.", "Só funcionam em navegadores antigos.", "São usadas apenas para imagens.", "<div> é mais moderna que as tags semânticas."], r: 1 },
          { q: "Para inserir uma imagem em HTML garantindo acessibilidade a leitores de tela, o atributo obrigatório na tag <img> é:", op: ["title", "width", "href", "alt", "class"], r: 3 },
          { q: "O elemento HTML usado para criar um link (hiperlink) que leva a outra página é:", op: ["<link>", "<src>", "<a>", "<nav>", "<button>"], r: 2 }
        ]
      },
      {
        nome: "Bloco G — Sistemas Operacionais",
        itens: [
          { q: "A principal função de um sistema operacional é:", op: ["Editar textos e planilhas.", "Gerenciar o hardware e permitir que os demais programas funcionem.", "Criar páginas de internet.", "Armazenar apenas fotos e vídeos.", "Substituir qualquer outro programa."], r: 1 },
          { q: "Durante a instalação de um sistema operacional, a criação de um usuário serve para:", op: ["Definir a cor do papel de parede apenas.", "Controlar o acesso e personalizar configurações e permissões para cada pessoa que usa o computador.", "Aumentar a velocidade do processador.", "Substituir a necessidade de senha.", "Ativar o Wi-Fi automaticamente."], r: 1 },
          { q: "Manter o sistema operacional atualizado é importante principalmente porque:", op: ["Deixa o computador mais lento de propósito.", "Corrige falhas de segurança e melhora a estabilidade do sistema.", "É apenas uma formalidade sem efeito real.", "Impede o uso de qualquer programa novo.", "Apaga todos os arquivos do usuário."], r: 1 },
          { q: "A capacidade de um sistema operacional executar vários programas ao mesmo tempo é chamada de:", op: ["Backup.", "Multitarefa.", "Firewall.", "Overclock.", "Streaming."], r: 1 },
          { q: "O sistema de arquivos de um sistema operacional é responsável por:", op: ["Definir a cor da interface.", "Organizar e gerenciar como os dados são armazenados e recuperados no disco.", "Conectar o computador à internet.", "Substituir o processador.", "Executar apenas jogos."], r: 1 }
        ]
      },
      {
        nome: "Bloco H — Design Gráfico",
        itens: [
          { q: "Em uma peça de comunicação visual (cartaz, banner), a \"hierarquia visual\" se refere a:", op: ["Usar o máximo de cores possível.", "Organizar os elementos de forma que o mais importante se destaque primeiro ao olhar.", "Usar apenas texto, sem imagens.", "Ignorar o público-alvo da peça.", "Usar sempre fundo preto."], r: 1 },
          { q: "Um formato de imagem que preserva transparência (fundo sem cor) é:", op: ["JPG.", "PNG.", "DOCX.", "MP3.", "TXT."], r: 1 },
          { q: "Escolher fontes (tipografia) legíveis e um tamanho adequado ao meio de divulgação (impresso ou digital) é importante para garantir:", op: ["Que a peça pareça mais cara.", "A legibilidade e a comunicação eficiente da mensagem.", "Que o arquivo fique menor automaticamente.", "Que apenas designers profissionais entendam a peça.", "Nada relevante; qualquer fonte funciona igual."], r: 1 },
          { q: "A combinação de cores em uma peça gráfica deve considerar principalmente:", op: ["Usar todas as cores disponíveis ao mesmo tempo.", "Contraste, legibilidade e coerência com a identidade do que está sendo comunicado.", "Usar sempre tons de cinza, independentemente do contexto.", "A cor não influencia a comunicação visual.", "Escolher cores aleatoriamente."], r: 1 },
          { q: "Uma peça gráfica feita para divulgar um evento comunitário deve, sobretudo:", op: ["Priorizar apenas a estética, sem se preocupar com a informação.", "Comunicar claramente as informações essenciais (o quê, quando, onde) de forma visualmente organizada.", "Ser o mais complexa possível.", "Evitar qualquer texto.", "Ser idêntica a peças de outras comunidades, sem adaptação."], r: 1 }
        ]
      }
    ]
  }
};

var estado = {
  etapa: "inicio",
  ano: null,
  nome: "",
  turma: "",
  itemAtual: 0,
  respostas: {},
  iniciadoEm: null,
  finalizadoEm: null
};

var app = document.getElementById("app");
var modalRoot = document.getElementById("modal-root");
var steps = [
  ["1", "Preparação", "curso, turma e finalidade"],
  ["2", "Aplicação", "itens por descritor"],
  ["3", "Diagnóstico", "proficiência pré-TRI"],
  ["4", "Intervenção", "trilhas de recomposição"]
];

function setEtapa(etapa) {
  estado.etapa = etapa;
  renderStepper();
}

function renderStepper() {
  var idx = { inicio: 0, identificacao: 0, quiz: 1, resultado: 2 }[estado.etapa] || 0;
  document.getElementById("stepper").innerHTML = steps.map(function(s, i) {
    return '<div class="step ' + (i === idx ? 'ativo' : '') + '"><b>' + s[0] + '</b><div><strong>' + s[1] + '</strong><span>' + s[2] + '</span></div></div>';
  }).join("");
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderEnunciado(texto) {
  var partes = String(texto).split(/(<pre>[\s\S]*?<\/pre>)/g);
  return partes.map(function(p) {
    if (p.indexOf("<pre>") === 0) {
      var codigo = p.replace(/<\/?pre>/g, "");
      return "<pre>" + escapeHtml(codigo) + "</pre>";
    }
    return escapeHtml(p).replace(/\n/g, "<br>");
  }).join("");
}

function totalItens(ano) {
  var banco = BANCO[ano || estado.ano];
  return banco.blocos.reduce(function(total, bloco) { return total + bloco.itens.length; }, 0);
}

function flattenItens() {
  var banco = BANCO[estado.ano];
  var lista = [];
  banco.blocos.forEach(function(bloco, bIdx) {
    bloco.itens.forEach(function(item, iIdx) {
      lista.push({ bloco: bloco, blocoIndex: bIdx, item: item, itemIndex: iIdx, chave: bIdx + "_" + iIdx });
    });
  });
  return lista;
}

function itemDificuldade(bIdx, iIdx) {
  return 0.65 + ((bIdx % 4) * 0.18) + ((iIdx % 5) * 0.07);
}

function pesoItem(bIdx, iIdx) {
  return 1 + itemDificuldade(bIdx, iIdx);
}

function nivelProficiência(escala) {
  if (escala >= 720) return { nivel: "Nível 5", nome: "Integrador", classe: "ok", texto: "Integra conhecimentos, propõe soluções e comunica decisões técnicas." };
  if (escala >= 620) return { nivel: "Nível 4", nome: "Autônomo", classe: "ok", texto: "Seleciona estratégias e executa procedimentos com segurança." };
  if (escala >= 500) return { nivel: "Nível 3", nome: "Intermediário", classe: "mid", texto: "Resolve problemas previsíveis e justifica procedimentos." };
  if (escala >= 380) return { nivel: "Nível 2", nome: "Básico operacional", classe: "mid", texto: "Executa tarefas simples em situações conhecidas." };
  return { nivel: "Nível 1", nome: "Inicial", classe: "low", texto: "Necessita recomposição de pré-requisitos e acompanhamento próximo." };
}

function classificarBloco(pct) {
  if (pct >= 70) return { classe: "ok", texto: "Consolidado" };
  if (pct >= 40) return { classe: "mid", texto: "Em desenvolvimento" };
  return { classe: "low", texto: "Prioridade" };
}

function mostrarAlerta(msg) {
  modalRoot.innerHTML = '<div class="modal"><div class="modal-box"><p>' + escapeHtml(msg) + '</p><div class="btn-row"><button class="btn primary" id="modal-ok">Entendi</button></div></div></div>';
  document.getElementById("modal-ok").onclick = function() { modalRoot.innerHTML = ""; };
}

function mostrarConfirmacao(msg, confirmar) {
  modalRoot.innerHTML = '<div class="modal"><div class="modal-box"><p>' + escapeHtml(msg) + '</p><div class="btn-row"><button class="btn ghost" id="modal-voltar">Voltar</button><button class="btn orange" id="modal-confirmar">Finalizar</button></div></div></div>';
  document.getElementById("modal-voltar").onclick = function() { modalRoot.innerHTML = ""; };
  document.getElementById("modal-confirmar").onclick = function() { modalRoot.innerHTML = ""; confirmar(); };
}

function renderInicio() {
  setEtapa("inicio");
  app.innerHTML = '<section class="panel">' +
    '<h2 class="panel-title">Avaliação diagnóstica online</h2>' +
    '<p class="lead">Escolha a turma para iniciar a aplicação. O instrumento foi desenhado para uso pedagógico: ele identifica descritores críticos e orienta trilhas de recomposição, sem substituir a decisão docente.</p>' +
    '<div class="notice"><strong>Nota metodológica:</strong> esta versão trabalha com análise diagnóstica e estimativa pré-TRI. A calibração TRI depende de volume amostral, itens-âncora e aplicações futuras.</div>' +
    '<div class="choice-grid">' +
      Object.keys(BANCO).map(function(ano) {
        var b = BANCO[ano];
        return '<button class="ano-card" data-ano="' + ano + '"><small>Curso Técnico em Informática</small><strong>' + escapeHtml(b.label) + '</strong><span>' + totalItens(ano) + ' itens · relatório por bloco · trilha de intervenção</span></button>';
      }).join("") +
    '</div></section>';
  app.querySelectorAll(".ano-card").forEach(function(btn) {
    btn.addEventListener("click", function() {
      estado.ano = btn.dataset.ano;
      estado.turma = BANCO[estado.ano].turmaPadrao || "";
      renderIdentificacao();
    });
  });
}

function renderIdentificacao() {
  setEtapa("identificacao");
  var banco = BANCO[estado.ano];
  app.innerHTML = '<section class="panel">' +
    '<h2 class="panel-title">Identificação da aplicação</h2>' +
    '<p class="lead">' + escapeHtml(banco.label) + '</p>' +
    '<div class="form-grid">' +
      '<div><label class="form-label" for="nome">Nome do(a) estudante</label><input id="nome" type="text" autocomplete="name" placeholder="Digite o nome completo"></div>' +
      '<div><label class="form-label" for="turma">Turma</label><input id="turma" type="text" value="' + escapeHtml(estado.turma) + '"></div>' +
    '</div>' +
    '<div class="notice"><strong>Finalidade:</strong> diagnosticar competências técnicas por descritor, apoiar planejamento docente e produzir evidências para recomposição das aprendizagens.</div>' +
    '<div class="btn-row"><button class="btn ghost" id="voltar">Voltar</button><button class="btn green" id="iniciar">Iniciar avaliação</button></div>' +
  '</section>';
  document.getElementById("voltar").onclick = renderInicio;
  document.getElementById("iniciar").onclick = function() {
    var nome = document.getElementById("nome").value.trim();
    var turma = document.getElementById("turma").value.trim();
    if (!nome) return mostrarAlerta("Informe o nome do(a) estudante antes de iniciar.");
    estado.nome = nome;
    estado.turma = turma || banco.turmaPadrao || "";
    estado.itemAtual = 0;
    estado.respostas = {};
    estado.iniciadoEm = new Date().toISOString();
    renderQuiz();
  };
}

function renderQuiz() {
  setEtapa("quiz");
  var itens = flattenItens();
  var atual = itens[estado.itemAtual];
  var respondidas = Object.keys(estado.respostas).length;
  var pct = Math.round((respondidas / itens.length) * 100);
  var letras = ["A", "B", "C", "D", "E"];
  app.innerHTML = '<div class="exam-layout">' +
    '<aside class="sidebar">' +
      '<div class="progress-label"><span>Progresso</span><strong>' + respondidas + '/' + itens.length + '</strong></div>' +
      '<div class="progress"><div style="width:' + pct + '%"></div></div>' +
      '<div class="mini-map">' + itens.map(function(it, idx) {
        var cls = idx === estado.itemAtual ? "atual" : (estado.respostas[it.chave] !== undefined ? "respondida" : "");
        return '<button class="nav-dot ' + cls + '" data-index="' + idx + '">' + (idx + 1) + '</button>';
      }).join("") + '</div>' +
      '<div class="notice"><strong>Pré-TRI:</strong> cada item recebe peso diagnóstico por dificuldade estimada. A escala exibida é preliminar, não calibrada.</div>' +
    '</aside>' +
    '<section class="question-card">' +
      '<div class="descriptor-row">' +
        '<span class="pill blue">Item ' + (estado.itemAtual + 1) + ' de ' + itens.length + '</span>' +
        '<span class="pill green">' + escapeHtml(atual.bloco.nome.replace(/^Bloco [A-Z] — /, "")) + '</span>' +
        '<span class="pill orange">Peso pré-TRI ' + pesoItem(atual.blocoIndex, atual.itemIndex).toFixed(2) + '</span>' +
      '</div>' +
      '<h2 class="question-title">Descritor em avaliação</h2>' +
      '<div class="question-text">' + renderEnunciado(atual.item.q) + '</div>' +
      '<div class="options">' + atual.item.op.map(function(op, idx) {
        var selected = estado.respostas[atual.chave] === idx;
        return '<label class="option ' + (selected ? 'selected' : '') + '">' +
          '<input type="radio" name="resposta" value="' + idx + '" ' + (selected ? 'checked' : '') + '>' +
          '<span class="letter">' + letras[idx] + '</span><span>' + escapeHtml(op) + '</span>' +
        '</label>';
      }).join("") + '</div>' +
      '<div class="btn-row">' +
        '<button class="btn ghost" id="anterior">← Anterior</button>' +
        '<button class="btn primary" id="proximo">Próximo →</button>' +
        '<button class="btn orange" id="finalizar">Finalizar diagnóstico</button>' +
      '</div>' +
    '</section></div>';

  app.querySelectorAll(".nav-dot").forEach(function(btn) {
    btn.onclick = function() { estado.itemAtual = Number(btn.dataset.index); renderQuiz(); };
  });
  app.querySelectorAll("input[name=resposta]").forEach(function(radio) {
    radio.onchange = function() {
      estado.respostas[atual.chave] = Number(radio.value);
      if (estado.itemAtual < itens.length - 1) estado.itemAtual += 1;
      renderQuiz();
    };
  });
  document.getElementById("anterior").onclick = function() {
    estado.itemAtual = Math.max(0, estado.itemAtual - 1);
    renderQuiz();
  };
  document.getElementById("proximo").onclick = function() {
    estado.itemAtual = Math.min(itens.length - 1, estado.itemAtual + 1);
    renderQuiz();
  };
  document.getElementById("finalizar").onclick = function() {
    var faltam = itens.length - Object.keys(estado.respostas).length;
    if (faltam > 0) return mostrarConfirmacao(faltam + " item(ns) ainda não foram respondidos. Deseja finalizar mesmo assim?", renderResultados);
    renderResultados();
  };
}

function calcularResultados() {
  var banco = BANCO[estado.ano];
  var totalAcertos = 0;
  var total = 0;
  var pesoAcertos = 0;
  var pesoTotal = 0;
  var blocos = [];
  banco.blocos.forEach(function(bloco, bIdx) {
    var acertos = 0;
    var pesoBloco = 0;
    var pesoOk = 0;
    bloco.itens.forEach(function(item, iIdx) {
      var chave = bIdx + "_" + iIdx;
      var peso = pesoItem(bIdx, iIdx);
      pesoBloco += peso;
      pesoTotal += peso;
      total += 1;
      if (estado.respostas[chave] === item.r) {
        acertos += 1;
        totalAcertos += 1;
        pesoOk += peso;
        pesoAcertos += peso;
      }
    });
    var pct = Math.round((acertos / bloco.itens.length) * 100);
    var prof = Math.round(200 + 600 * (pesoOk / pesoBloco));
    blocos.push({ nome: bloco.nome, acertos: acertos, total: bloco.itens.length, pct: pct, prof: prof, status: classificarBloco(pct) });
  });
  var pctGeral = Math.round((totalAcertos / total) * 100);
  var escala = Math.round(200 + 600 * (pesoAcertos / pesoTotal));
  return { totalAcertos: totalAcertos, total: total, pctGeral: pctGeral, escala: escala, nivel: nivelProficiência(escala), blocos: blocos };
}

function recomendacao(bloco) {
  if (bloco.pct >= 70) return "Manter aprofundamento com projeto prático e item-âncora de acompanhamento.";
  if (bloco.pct >= 40) return "Revisar conceitos-chave, propor prática guiada e reaplicar itens equivalentes.";
  return "Prioridade de recomposição: retomar pré-requisitos, formar grupo de apoio e aplicar trilha curta por descritor.";
}

function renderResultados() {
  setEtapa("resultado");
  estado.finalizadoEm = new Date().toISOString();
  var banco = BANCO[estado.ano];
  var r = calcularResultados();
  var linhas = r.blocos.map(function(b) {
    return '<tr><td>' + escapeHtml(b.nome) + '</td><td>' + b.acertos + '/' + b.total + '</td><td>' + b.pct + '%</td><td>' + b.prof + '</td><td><span class="status ' + b.status.classe + '">' + b.status.texto + '</span></td></tr>';
  }).join("");
  var intervencoes = r.blocos.map(function(b) {
    return '<div class="intervention"><strong>' + escapeHtml(b.nome) + '</strong><br>' + recomendacao(b) + '</div>';
  }).join("");
  app.innerHTML = '<section class="panel print-only"><h1>Relatório diagnóstico SIDEP-CE</h1></section>' +
    '<section class="panel">' +
      '<h2 class="panel-title">Boletim diagnóstico por competências</h2>' +
      '<p class="lead">Estudante: <strong>' + escapeHtml(estado.nome) + '</strong> · Turma: <strong>' + escapeHtml(estado.turma) + '</strong> · ' + escapeHtml(banco.label) + '</p>' +
      '<div class="results-grid">' +
        '<div class="score-card"><div class="big">' + r.escala + '</div><div>escala diagnóstica pré-TRI</div><div class="scale">' + r.totalAcertos + ' de ' + r.total + ' itens · ' + r.pctGeral + '% de acerto bruto</div><div class="level">' + r.nivel.nivel + ' · ' + r.nivel.nome + '</div></div>' +
        '<div><div class="notice"><strong>Interpretação:</strong> ' + r.nivel.texto + ' A escala é uma estimativa diagnóstica ponderada, ainda sem calibração TRI oficial.</div><table><thead><tr><th>Bloco / descritor</th><th>Acertos</th><th>%</th><th>Escala</th><th>Situação</th></tr></thead><tbody>' + linhas + '</tbody></table></div>' +
      '</div>' +
    '</section>' +
    '<section class="panel"><h2 class="panel-title">Plano de intervenção pedagógica</h2><p class="lead">Recomendações automáticas para orientar o professor. Devem ser revisadas pela equipe docente antes da aplicação.</p>' + intervencoes +
      '<div class="btn-row"><button class="btn primary" id="imprimir">Imprimir relatório</button><button class="btn green" id="baixar">Baixar dados JSON</button><button class="btn ghost" id="nova">Nova aplicação</button></div>' +
    '</section>';
  document.getElementById("imprimir").onclick = function() { window.print(); };
  document.getElementById("baixar").onclick = baixarRelatorio;
  document.getElementById("nova").onclick = function() {
    estado = { etapa: "inicio", ano: null, nome: "", turma: "", itemAtual: 0, respostas: {}, iniciadoEm: null, finalizadoEm: null };
    renderInicio();
  };
}

function baixarRelatorio() {
  var resultado = calcularResultados();
  var dados = {
    sistema: "SIDEP-CE",
    finalidade: "Avaliação diagnóstica pré-TRI",
    estudante: estado.nome,
    turma: estado.turma,
    curso: BANCO[estado.ano].label,
    iniciadoEm: estado.iniciadoEm,
    finalizadoEm: estado.finalizadoEm,
    resultado: resultado
  };
  var blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "relatorio-sidep-ce-" + estado.turma.replace(/\W+/g, "-").toLowerCase() + ".json";
  a.click();
  URL.revokeObjectURL(url);
}

renderInicio();
