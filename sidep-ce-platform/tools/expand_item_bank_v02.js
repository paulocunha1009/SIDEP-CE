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
  if (arrayStart < 0) throw new Error(`Array start not found: ${name}`);
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
  if (start < 0) throw new Error(`Array not found: ${name}`);
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
  const prefix = source.slice(0, arrayStart);
  const suffix = source.slice(arrayEnd);
  return `${prefix}${JSON.stringify(value, null, 2)};${suffix}`;
}

const descritores = extractArray("descritoresNorteadores");
const questoesAtuais = extractArray("questoesNorteadoras");
const descritorPorCodigo = Object.fromEntries(descritores.map((item) => [item.codigo, item]));

function countByDescritor(questoes) {
  return questoes.reduce((acc, questao) => {
    acc[questao.descritor_codigo] = (acc[questao.descritor_codigo] || 0) + 1;
    return acc;
  }, {});
}

function normalize(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}

function optionSet(correct, distractors, seed) {
  const letters = ["A", "B", "C", "D", "E"];
  const options = distractors.slice(0, 4);
  const index = seed % 5;
  options.splice(index, 0, correct);
  return {
    alternativa_a: options[0],
    alternativa_b: options[1],
    alternativa_c: options[2],
    alternativa_d: options[3],
    alternativa_e: options[4],
    gabarito: letters[index],
  };
}

const bancoComplementar = {
  D05: [
    ["Uma escola quer registrar presença dos estudantes. Antes de escrever o algoritmo, o primeiro passo correto é:", "identificar entradas, processamento e saída esperada do problema.", ["escolher a cor da tela do sistema.", "comprar um servidor antes de entender a demanda.", "instalar um editor de imagens.", "apagar os dados antigos da escola."]],
    ["Em um algoritmo para calcular a média de duas notas, as entradas são:", "as duas notas informadas pelo usuário.", ["a mensagem final exibida.", "o resultado da divisão.", "o nome do compilador.", "a cor do boletim."]],
    ["Ao representar uma solução por fluxograma, a sequência lógica deve mostrar:", "início, entradas, processamento, decisões quando houver e saída.", ["apenas a saída final.", "somente os erros do programa.", "a marca do computador usado.", "o histórico de versões do sistema."]],
    ["Um pseudocódigo é útil porque:", "descreve a lógica da solução antes da linguagem de programação.", ["substitui toda necessidade de teste.", "é usado apenas para desenhar interfaces.", "serve exclusivamente para formatar textos.", "impede que o programa tenha erros."]],
    ["Para resolver um problema computacional complexo, a decomposição significa:", "dividir o problema em partes menores e ordenadas.", ["executar tudo de uma vez sem planejamento.", "escolher sempre a linguagem mais difícil.", "salvar arquivos sem organização.", "usar apenas comandos de impressão."]],
  ],
  D07: [
    ["Em uma estrutura condicional, o bloco else é executado quando:", "a condição do if não é atendida.", ["o programa sempre inicia.", "a variável é declarada.", "o arquivo é salvo.", "a lista é criada."]],
    ["Um laço while deve possuir uma condição de parada para:", "evitar repetição infinita e controlar o fluxo do programa.", ["impedir uso de variáveis.", "trocar o tipo do arquivo.", "remover o sistema operacional.", "formatar o monitor."]],
  ],
  D10: [
    ["Um programa deveria imprimir 10, mas imprime 8. A ação técnica mais adequada é:", "testar o fluxo e verificar valores intermediários para localizar o erro.", ["trocar o monitor do computador.", "aumentar o tamanho da fonte.", "formatar o sistema operacional imediatamente.", "ignorar o erro se o programa abrir."]],
    ["Em depuração, um teste de mesa serve para:", "acompanhar manualmente variáveis e saídas passo a passo.", ["medir a velocidade da internet.", "substituir o banco de dados.", "criar imagens para o sistema.", "compactar arquivos do projeto."]],
    ["Ao prever a saída de um código, o estudante deve observar principalmente:", "a ordem de execução dos comandos e alterações nas variáveis.", ["a cor do editor de código.", "o nome do arquivo apenas.", "o tamanho do monitor.", "a marca do teclado."]],
    ["Um erro de lógica ocorre quando:", "o programa executa, mas produz resultado incorreto.", ["o cabo de energia está desconectado.", "o navegador não abre páginas.", "a impressora está sem papel.", "o mouse está sem bateria."]],
    ["Ao justificar uma correção em código, a melhor explicação técnica é aquela que:", "relaciona o erro encontrado, a causa e o efeito da mudança.", ["diz apenas que agora funcionou.", "troca todos os nomes de variáveis sem motivo.", "remove comentários úteis do código.", "altera a interface sem testar a regra."]],
  ],
  D12: [
    ["Durante a montagem de um computador, a memória RAM deve ser instalada:", "no slot compatível da placa-mãe, com encaixe firme e alinhado.", ["na porta HDMI do monitor.", "dentro da fonte de alimentação.", "sobre o cooler do processador.", "na entrada de rede RJ-45."]],
    ["Após instalar um novo dispositivo, o técnico deve verificar:", "se o equipamento foi reconhecido e se os drivers estão corretos.", ["se a mesa está pintada.", "se o navegador tem favoritos.", "se há imagens na área de trabalho.", "se a fonte do texto está maior."]],
    ["Antes de ligar um computador recém-montado, é essencial conferir:", "conexões de energia, encaixes dos componentes e ausência de curto.", ["a senha do e-mail pessoal.", "a quantidade de músicas no sistema.", "o papel da impressora.", "o tema visual do navegador."]],
    ["A BIOS/UEFI é acessada normalmente para:", "configurar inicialização, reconhecer hardware e ajustar parâmetros básicos.", ["editar imagens vetoriais.", "criar postagens em redes sociais.", "fazer consultas SQL.", "desenhar fluxogramas."]],
    ["Ao instalar um sistema operacional, uma etapa técnica necessária é:", "selecionar unidade/partição correta e seguir o procedimento de instalação.", ["trocar a placa de vídeo obrigatoriamente.", "excluir a documentação do equipamento.", "desligar o cooler do processador.", "remover a memória RAM."]],
  ],
  D13: [
    ["Um computador desliga sozinho após alguns minutos. Uma hipótese técnica inicial é:", "superaquecimento ou falha na fonte de alimentação.", ["falta de acento no editor de texto.", "erro no alinhamento de um cartaz.", "excesso de links em uma página.", "ausência de comentários no código."]],
    ["Lentidão constante pode ser investigada inicialmente por:", "uso de CPU, memória, armazenamento e programas em segundo plano.", ["quantidade de cores do papel de parede.", "modelo da cadeira do laboratório.", "tamanho do cabo HDMI apenas.", "nome do usuário no sistema."]],
    ["Manutenção preventiva em hardware inclui:", "limpeza adequada, verificação de cabos, ventilação e atualização de registros.", ["apagar todos os arquivos do estudante.", "desativar a ventilação do gabinete.", "usar água diretamente na placa-mãe.", "trocar peças sem diagnóstico."]],
    ["Quando o computador não liga, o primeiro diagnóstico deve verificar:", "energia, cabos, tomada, fonte e sinais da placa-mãe.", ["a extensão do arquivo de texto.", "a paleta de cores da interface.", "o comando SELECT do banco.", "o tamanho da imagem do site."]],
    ["Um bom registro de manutenção deve conter:", "sintoma, testes realizados, causa provável, ação tomada e responsável.", ["apenas o nome do técnico.", "somente a cor do gabinete.", "um elogio ao equipamento.", "o preço de peças sem contexto."]],
  ],
  D14: [
    ["Na bancada de manutenção, a organização correta busca:", "reduzir riscos, evitar perda de peças e melhorar a qualidade do serviço.", ["aumentar a quantidade de cabos soltos.", "misturar parafusos sem identificação.", "deixar líquidos próximos à placa-mãe.", "trabalhar sem iluminação."]],
    ["Uma prática segura ao manusear componentes internos é:", "desligar o equipamento e adotar cuidado contra descarga eletrostática.", ["tocar contatos metálicos sem cuidado.", "mexer na fonte ligada.", "usar força excessiva nos slots.", "apoiar placas sobre superfície molhada."]],
    ["O registro técnico de uma atividade prática serve para:", "documentar procedimento, resultado, responsável e evidências do serviço.", ["substituir a execução do procedimento.", "decorar a capa do relatório.", "ocultar falhas encontradas.", "eliminar a necessidade de teste."]],
    ["Qualidade em manutenção de hardware significa:", "seguir procedimento, testar o resultado e entregar equipamento confiável.", ["trocar peças aleatoriamente.", "avaliar apenas pela aparência.", "ignorar sintomas intermitentes.", "não comunicar o usuário."]],
    ["Ao descartar componentes eletrônicos danificados, a conduta adequada é:", "encaminhar para descarte ou reaproveitamento conforme orientação ambiental.", ["jogar no lixo comum da sala.", "queimar os componentes.", "guardar sem identificação.", "entregar a qualquer pessoa sem registro."]],
  ],
  D15: [
    ["A tag HTML <nav> é usada semanticamente para:", "indicar uma área de navegação da página.", ["criar banco de dados.", "executar código Python.", "configurar endereço IP.", "instalar driver de vídeo."]],
  ],
  D16: [
    ["Em CSS, um seletor de classe é indicado por:", "ponto antes do nome da classe, como .menu.", ["cerquilha antes do nome, como #menu.", "duas barras antes do nome, como //menu.", "sinal de porcentagem, como %menu.", "parênteses antes do nome, como (menu)."]],
    ["Para criar layout flexível em uma seção, uma propriedade CSS comum é:", "display: flex.", ["font-type: table.", "image-mode: center.", "database: true.", "sql-select: flex."]],
    ["Responsividade em uma página web significa:", "adaptar a interface a diferentes tamanhos de tela.", ["bloquear acesso em celulares.", "usar sempre largura fixa de 2000px.", "remover todo texto da página.", "trocar HTML por planilha."]],
    ["A propriedade CSS color altera:", "a cor do texto do elemento.", ["o endereço do servidor.", "o tipo de banco de dados.", "a senha do usuário.", "a rota do sistema operacional."]],
  ],
  D17: [
    ["Em uma página web, um evento de clique pode ser usado para:", "executar uma ação quando o usuário seleciona um botão.", ["formatar fisicamente o computador.", "trocar o processador.", "definir chave estrangeira.", "criar backup automático de rede."]],
    ["Validação de formulário no navegador busca:", "verificar se os campos obrigatórios e formatos foram preenchidos corretamente.", ["aumentar a memória RAM.", "testar a voltagem da fonte.", "substituir o roteador.", "criar uma imagem transparente."]],
    ["JavaScript em uma página web é usado principalmente para:", "adicionar interações e comportamentos dinâmicos.", ["montar fisicamente computadores.", "criar tabelas SQL diretamente no gabinete.", "definir topologia de cabos.", "limpar a bancada de hardware."]],
    ["Ao clicar em 'Enviar', o sistema mostra erro se o e-mail estiver vazio. Isso é exemplo de:", "validação de entrada.", ["normalização de banco.", "endereçamento IP.", "montagem de hardware.", "exportação de imagem."]],
    ["Manipular o DOM significa:", "alterar elementos da página por meio de scripts.", ["trocar cabos de rede.", "configurar BIOS.", "criar entidade-relacionamento.", "calibrar fonte de alimentação."]],
  ],
  D18: [
    ["Em um gerenciador de conteúdo, organizar categorias serve para:", "facilitar localização, manutenção e publicação dos conteúdos.", ["aumentar a memória física do servidor.", "trocar o teclado do usuário.", "definir a voltagem da fonte.", "substituir todas as imagens por texto."]],
    ["Ao publicar notícia em site escolar, uma boa prática é:", "revisar título, texto, imagem, fonte e data antes da publicação.", ["publicar sem verificar autoria.", "usar imagens sem relação com o tema.", "apagar conteúdos antigos sem backup.", "ignorar acessibilidade."]],
    ["Um CMS é usado para:", "gerenciar páginas, posts, mídias e conteúdos de um site.", ["testar memória RAM.", "montar circuitos de robótica.", "atribuir endereço IP manualmente.", "fazer solda em placa-mãe."]],
    ["Manter conteúdo digital atualizado é importante porque:", "garante informação confiável e útil para os usuários.", ["impede o funcionamento de links.", "reduz a segurança das senhas.", "apaga o banco de dados automaticamente.", "desativa o sistema operacional."]],
    ["Ao inserir imagem em uma publicação, o texto alternativo ajuda:", "usuários com leitores de tela e melhora acessibilidade.", ["a trocar a fonte do computador.", "a aumentar a velocidade do processador.", "a criar cabo de rede.", "a formatar disco rígido."]],
  ],
  D19: [
    ["Uma tela de cadastro integrada a dados precisa:", "validar entrada, enviar informações e persistir registros.", ["apenas escolher cor de fundo.", "ignorar erros do usuário.", "desligar o servidor após cada envio.", "não guardar nenhuma informação."]],
    ["Persistência de dados em uma aplicação significa:", "salvar informações para consulta posterior.", ["trocar o monitor.", "mudar o formato da fonte.", "apagar toda sessão ao carregar.", "usar apenas imagens estáticas."]],
    ["Em uma aplicação simples, a interface conversa com a lógica quando:", "ações do usuário acionam regras do sistema.", ["o cabo de energia esquenta.", "o roteador muda de cor.", "a impressora fica sem papel.", "o usuário altera o papel de parede."]],
    ["Um formulário que salva dados de uma associação comunitária deve priorizar:", "campos necessários, validação, segurança e recuperação dos registros.", ["campos duplicados sem finalidade.", "ausência de confirmação.", "senhas visíveis em tela.", "exclusão automática sem aviso."]],
    ["Ao integrar front-end e banco de dados, um risco a evitar é:", "enviar dados sem validação ou proteção adequada.", ["usar labels claros.", "testar o envio.", "exibir mensagem de erro.", "confirmar cadastro concluído."]],
  ],
  D20: [
    ["Em modelagem de dados, uma entidade representa:", "um objeto ou conceito relevante sobre o qual se deseja armazenar informações.", ["um cabo de rede.", "uma cor da interface.", "um comando de repetição.", "uma tecla do teclado."]],
    ["No problema de uma biblioteca, 'Livro' pode ser modelado como:", "entidade.", ["operador lógico.", "tag HTML.", "propriedade CSS.", "sensor analógico."]],
    ["Atributos de uma entidade Estudante podem ser:", "nome, matrícula, turma e data de nascimento.", ["switch, roteador e cabo.", "if, else e while.", "margin, color e display.", "sensor, motor e placa."]],
    ["Cardinalidade em banco de dados indica:", "quantas ocorrências de uma entidade podem se relacionar com outra.", ["a cor do botão na tela.", "o tamanho físico do gabinete.", "a senha do administrador.", "a versão do navegador."]],
    ["Em uma associação, associar Produtor e Produto ajuda a:", "representar quem produz quais itens e organizar informações.", ["formatar um cartaz.", "trocar a placa-mãe.", "instalar um antivírus.", "criar um laço de repetição."]],
  ],
  D21: [
    ["Chave primária é usada para:", "identificar de forma única cada registro de uma tabela.", ["mudar a cor da página.", "ligar o computador.", "calcular média aritmética.", "compactar uma imagem."]],
    ["Chave estrangeira serve para:", "relacionar registros entre tabelas.", ["aumentar o brilho do monitor.", "definir o idioma do teclado.", "trocar o cabo HDMI.", "criar um comentário no código."]],
    ["Uma tabela Alunos deve ter campos como:", "id, nome, turma e matrícula.", ["sensor, motor e buzzer.", "header, footer e nav apenas.", "if, while e print.", "switch, cabo e roteador."]],
    ["Integridade referencial evita:", "relacionamentos inválidos entre registros de tabelas.", ["imagens sem transparência.", "fontes pequenas em cartazes.", "computador sem teclado.", "loop infinito em Python."]],
    ["Ao definir campos de uma tabela, o tipo de dado deve:", "combinar com a informação armazenada.", ["ser sempre texto para tudo.", "ser escolhido pela cor do formulário.", "depender do tamanho do monitor.", "ser ignorado em sistemas simples."]],
  ],
  D22: [
    ["O comando SQL usado para consultar dados é:", "SELECT.", ["INSERT para apagar registros.", "DELETE para criar tabela.", "UPDATE para abrir navegador.", "PRINT para modelar entidades."]],
    ["Para inserir novo registro em uma tabela, usa-se:", "INSERT.", ["SELECT.", "DELETE.", "DROP sempre.", "PING."]],
    ["Para alterar dados já existentes em uma tabela, usa-se:", "UPDATE.", ["CREATE apenas.", "SELECT sempre.", "HTML.", "CSS."]],
    ["Para excluir registros de uma tabela com critério, usa-se:", "DELETE com condição adequada.", ["SELECT sem filtro.", "DISPLAY FLEX.", "INPUT.", "FOR sem variável."]],
    ["A cláusula WHERE em SQL serve para:", "filtrar registros conforme uma condição.", ["definir cor da página.", "montar placa-mãe.", "calibrar sensor.", "escolher topologia física."]],
  ],
  D23: [
    ["Backup de banco de dados é importante para:", "recuperar informações em caso de falha, erro ou perda.", ["aumentar contraste de uma imagem.", "trocar o roteador.", "substituir o teclado.", "formatar texto no HTML."]],
    ["Controle de acesso em banco de dados busca:", "permitir que cada usuário acesse apenas o necessário.", ["deixar todos como administrador.", "mostrar senhas em relatórios.", "apagar logs de acesso.", "liberar dados sem critério."]],
    ["Consistência dos dados significa:", "manter informações coerentes e válidas conforme regras definidas.", ["usar sempre fonte grande.", "salvar imagens em PNG.", "trocar a cor do cabo.", "executar código sem testar."]],
    ["Uma boa política de recuperação deve prever:", "rotina de backup, teste de restauração e responsáveis.", ["apenas prometer que nada falhará.", "guardar senha em papel aberto.", "excluir cópias antigas sem critério.", "usar somente o computador do professor."]],
    ["Dados sensíveis em banco devem ser tratados com:", "segurança, controle de acesso e finalidade definida.", ["publicação aberta em redes sociais.", "compartilhamento irrestrito.", "ausência de senha.", "cópia em qualquer dispositivo."]],
  ],
  D24: [
    ["Em redes, um switch é usado principalmente para:", "interligar dispositivos em uma rede local.", ["processar imagens.", "armazenar banco SQL.", "executar código Python.", "controlar fonte ATX."]],
    ["Uma topologia estrela caracteriza-se por:", "dispositivos conectados a um ponto central.", ["todos os computadores sem conexão.", "dados salvos em planilha.", "um único cabo sem equipamentos.", "uso obrigatório de IA generativa."]],
    ["O roteador tem como função comum:", "encaminhar tráfego entre redes diferentes.", ["editar CSS.", "formatar disco rígido.", "modelar entidades.", "criar classes em POO."]],
    ["Cabo de par trançado é exemplo de:", "meio físico de transmissão em rede.", ["tipo de variável.", "atributo HTML.", "campo de banco lógico.", "ferramenta de design."]],
    ["Endereço MAC está associado principalmente:", "à identificação física de interface de rede.", ["à senha do banco.", "ao nome de uma classe.", "à cor da página.", "à resolução da imagem."]],
  ],
  D25: [
    ["Endereço IP serve para:", "identificar logicamente um dispositivo em uma rede.", ["definir a cor do site.", "medir temperatura do processador.", "criar uma classe.", "salvar imagem transparente."]],
    ["DHCP é usado para:", "atribuir configurações de rede automaticamente.", ["criar tabelas SQL.", "compactar arquivos.", "formatar texto HTML.", "testar tipografia."]],
    ["DNS tem a função de:", "traduzir nomes de domínio para endereços IP.", ["aumentar memória RAM.", "criar pseudocódigo.", "alterar contraste de imagem.", "trocar fonte de alimentação."]],
    ["Compartilhamento de recursos em rede pode envolver:", "pastas, impressoras ou serviços acessíveis por usuários autorizados.", ["qualquer senha aberta para todos.", "remover antivírus.", "desligar todos os dispositivos.", "usar cabo sem conector."]],
    ["Para testar conectividade básica entre máquinas, pode-se usar:", "ping.", ["SELECT.", "display flex.", "input().", "alt text."]],
  ],
  D26: [
    ["Se um computador não acessa a rede, uma primeira verificação é:", "cabo/conexão, IP, gateway e DNS.", ["paleta de cores do sistema.", "classe CSS do botão.", "nome do projeto integrador.", "tipo de imagem do cartaz."]],
    ["Alta latência em rede significa:", "demora na comunicação entre origem e destino.", ["falta de contraste visual.", "erro de entidade-relacionamento.", "ausência de encapsulamento.", "superaquecimento do monitor."]],
    ["Quando o ping para o gateway falha, isso pode indicar:", "problema local de conexão ou configuração de rede.", ["erro de tipografia.", "ausência de chave primária.", "falha de pseudocódigo.", "imagem sem transparência."]],
    ["Diagnosticar segurança em rede inclui verificar:", "senhas, atualizações, permissões e acessos indevidos.", ["apenas papel de parede.", "somente tamanho da fonte.", "apenas cor dos cabos.", "somente marca do monitor."]],
    ["Um conflito de IP ocorre quando:", "dois dispositivos usam o mesmo endereço na rede.", ["duas imagens têm o mesmo tamanho.", "duas classes possuem métodos.", "duas tabelas têm nomes curtos.", "dois estudantes usam Python."]],
  ],
  D27: [
    ["Ao planejar rede para uma escola pequena, deve-se levantar:", "quantidade de usuários, ambientes, equipamentos e serviços necessários.", ["apenas a cor das paredes.", "somente o nome dos alunos.", "o estilo do cartaz.", "a linguagem de programação favorita."]],
    ["Uma rede para associação comunitária deve considerar:", "cobertura, segurança, custo, manutenção e finalidade de uso.", ["apenas velocidade máxima sem necessidade.", "ausência de senhas.", "compartilhamento sem responsáveis.", "cabos soltos sem identificação."]],
    ["No planejamento de rede, mapa ou diagrama ajuda a:", "visualizar pontos, equipamentos, conexões e organização.", ["calcular média de notas.", "criar atributos de uma classe.", "editar contraste de imagem.", "instalar memória RAM."]],
    ["Escolher entre cabo e Wi-Fi depende de:", "mobilidade, estabilidade, distância, custo e ambiente.", ["somente da cor do roteador.", "apenas do tamanho do monitor.", "do tipo de fonte usada no cartaz.", "da extensão do arquivo HTML."]],
    ["Um plano básico de rede deve incluir:", "equipamentos, endereçamento, segurança, responsáveis e manutenção.", ["somente lista de senhas abertas.", "apenas nomes dos computadores.", "nenhum desenho da solução.", "descarte dos roteadores."]],
  ],
  D28: [
    ["Sensor em robótica é um componente que:", "capta informações do ambiente para o sistema.", ["gera relatório escolar sozinho.", "substitui banco de dados.", "é sempre uma imagem PNG.", "serve apenas para decoração."]],
    ["Atuador em um protótipo é responsável por:", "executar uma ação física, como mover, acender ou emitir som.", ["criar chave primária.", "formatar parágrafo.", "consultar domínio DNS.", "calcular média em planilha."]],
    ["Uma placa como Arduino ou micro:bit pode ser usada para:", "controlar sensores, atuadores e lógica de automação.", ["substituir todos os computadores da escola.", "criar sozinha um banco relacional.", "funcionar apenas como monitor.", "apagar redes sem fio."]],
    ["Automação em protótipo envolve:", "ler dados, processar condições e acionar respostas.", ["trocar fonte do texto.", "criar apenas cartazes.", "salvar dados sem finalidade.", "ignorar sensores."]],
    ["Um sensor de umidade em projeto do campo pode ajudar a:", "monitorar condição do solo para tomada de decisão.", ["aumentar contraste de uma imagem.", "alterar tema do navegador.", "trocar cabo HDMI.", "desenhar classe Aluno."]],
  ],
  D29: [
    ["Em robótica, usar if/else permite:", "acionar respostas diferentes conforme leitura de sensores.", ["formatar um banco de dados.", "trocar a placa-mãe.", "publicar post automaticamente sem regra.", "substituir todo teste prático."]],
    ["Um protótipo que liga LED quando há pouca luz usa:", "leitura de sensor, condição lógica e atuação.", ["apenas edição de imagem.", "somente chave estrangeira.", "somente topologia em estrela.", "apenas texto alternativo."]],
    ["Monitoramento de território com tecnologia pode envolver:", "coleta de dados locais e resposta automatizada ou relatório.", ["ignorar contexto da comunidade.", "usar dados sem finalidade.", "apagar registros de campo.", "impedir participação dos estudantes."]],
    ["Programar repetição em protótipo serve para:", "ler continuamente sensores ou atualizar estados.", ["desmontar o computador.", "trocar senha de rede.", "formatar uma imagem.", "criar cardinalidade."]],
    ["Ao testar protótipo de automação, é necessário:", "verificar entrada, processamento, saída e segurança do funcionamento.", ["avaliar só a cor dos fios.", "evitar qualquer registro.", "ignorar falhas intermitentes.", "nunca revisar o código."]],
  ],
  D30: [
    ["Inteligência artificial pode ser entendida como:", "conjunto de técnicas que permitem sistemas realizar tarefas associadas à inteligência humana.", ["um tipo de cabo de rede.", "uma fonte de alimentação.", "um seletor CSS.", "uma extensão de imagem."]],
    ["Aprendizagem de máquina usa dados para:", "identificar padrões e apoiar previsões ou decisões.", ["aumentar brilho do monitor.", "soldar componentes.", "formatar texto em HTML.", "definir chave estrangeira sempre."]],
    ["IA generativa é conhecida por:", "produzir textos, imagens, códigos ou outros conteúdos a partir de instruções.", ["trocar memória RAM.", "conectar cabos de rede.", "limpar gabinete.", "criar energia elétrica."]],
    ["Um risco em sistemas de IA é:", "reproduzir vieses ou erros presentes nos dados e instruções.", ["exigir sempre cabo azul.", "não funcionar sem impressora.", "apagar automaticamente todo hardware.", "impedir uso de internet."]],
    ["Dados são importantes para IA porque:", "alimentam treinamento, análise de padrões e funcionamento de modelos.", ["substituem a revisão humana em todos os casos.", "eliminam ética.", "tornam testes desnecessários.", "garantem respostas sempre corretas."]],
  ],
  D31: [
    ["Uso ético de IA na escola exige:", "finalidade pedagógica, revisão humana e proteção de dados.", ["divulgar dados pessoais em prompts.", "aceitar toda resposta sem conferir.", "substituir completamente o professor.", "impedir transparência no uso."]],
    ["Ao usar IA para relatório pedagógico, deve-se evitar:", "enviar dados pessoais identificáveis sem necessidade e autorização.", ["usar descritores agregados.", "revisar recomendações.", "explicar limites da ferramenta.", "manter finalidade educacional."]],
    ["Um limite da IA generativa é:", "poder produzir informação incorreta ou imprecisa.", ["ser sempre infalível.", "dispensar avaliação docente.", "corrigir automaticamente toda desigualdade.", "calibrar TRI sem dados."]],
    ["Em projeto técnico comunitário, IA deve ser usada para:", "apoiar decisões com transparência, contexto e supervisão humana.", ["impor decisão sem consulta.", "ignorar cultura local.", "expor dados sensíveis.", "substituir validação prática."]],
    ["Responsabilidade no uso de IA envolve:", "registrar critérios, revisar resultados e assumir decisão humana.", ["culpar a ferramenta por qualquer decisão.", "usar sem explicar aos envolvidos.", "eliminar registro de uso.", "gerar notas automaticamente sem professor."]],
  ],
  D32: [
    ["Contraste visual adequado ajuda principalmente a:", "melhorar legibilidade e destacar informações importantes.", ["apagar a mensagem principal.", "reduzir leitura em telas pequenas.", "misturar texto e fundo.", "substituir revisão de conteúdo."]],
    ["Hierarquia da informação em design serve para:", "organizar elementos conforme importância e orientar o olhar do leitor.", ["deixar todos os textos iguais.", "esconder títulos.", "eliminar espaçamento.", "usar cores sem critério."]],
  ],
  D33: [
    ["Para imagem com transparência, um formato adequado é:", "PNG.", ["TXT.", "SQL.", "EXE.", "CSV sem imagem."]],
    ["Ao exportar arte para impressão, deve-se observar:", "resolução, tamanho, formato e finalidade do material.", ["apenas o nome do arquivo.", "somente a senha do usuário.", "a marca do mouse.", "o endereço IP do roteador."]],
    ["Ferramenta vetorial é mais adequada quando:", "o material precisa ser redimensionado sem perder qualidade.", ["a imagem deve ficar sempre pixelada.", "o arquivo será um banco SQL.", "o texto precisa virar cabo.", "o computador não tem monitor."]],
    ["Antes de publicar material digital, é importante verificar:", "formato, legibilidade, peso do arquivo e compatibilidade.", ["apenas se a cor favorita aparece.", "se o cabo está enrolado.", "se existe chave primária.", "se o ventilador liga."]],
  ],
  D34: [
    ["Material digital acessível deve considerar:", "legibilidade, contraste, texto alternativo e clareza da mensagem.", ["apenas efeitos visuais.", "texto pequeno para caber mais.", "imagens sem descrição.", "cores sem contraste."]],
    ["Uma campanha digital para a comunidade deve priorizar:", "mensagem clara, público-alvo, canal adequado e responsabilidade social.", ["excesso de informações sem hierarquia.", "uso de termos sem contexto.", "ausência de revisão.", "imagens sem relação com o tema."]],
    ["Ao criar post informativo para redes sociais, a hierarquia visual ajuda a:", "destacar informações principais e orientar a leitura.", ["esconder o assunto central.", "misturar todos os textos.", "remover contraste.", "impedir compreensão."]],
    ["Acessibilidade em materiais digitais é importante porque:", "amplia o acesso e a compreensão por diferentes públicos.", ["serve apenas para estética.", "reduz a necessidade de clareza.", "dispensa revisão.", "impede comunicação comunitária."]],
  ],
  D35: [
    ["No projeto integrador, levantar necessidades reais significa:", "escutar usuários e compreender problemas antes de propor solução.", ["começar programando sem pergunta.", "copiar solução sem contexto.", "ignorar a comunidade.", "definir tecnologia antes do problema."]],
    ["Requisito de sistema descreve:", "necessidade ou condição que a solução deve atender.", ["cor preferida do professor apenas.", "tipo de cabo usado no laboratório.", "marca do computador.", "formato do cartaz."]],
    ["Uma boa proposta tecnológica contextualizada deve:", "relacionar problema, usuários, recursos, limites e impacto esperado.", ["prometer solução sem viabilidade.", "ignorar manutenção.", "não ouvir interessados.", "usar dados sem finalidade."]],
    ["Entrevista diagnóstica em projeto serve para:", "coletar informações com usuários e validar a demanda.", ["substituir testes técnicos.", "definir nota automaticamente.", "trocar hardware.", "apagar documentos antigos."]],
    ["Para escola ou comunidade, uma solução digital deve considerar:", "necessidade real, facilidade de uso, sustentabilidade e segurança.", ["apenas aparência.", "somente moda tecnológica.", "ausência de treinamento.", "coleta excessiva de dados."]],
  ],
  D36: [
    ["Prototipar uma solução de software significa:", "criar versão inicial para testar ideia, fluxo ou funcionalidade.", ["entregar produto sem teste.", "formatar computadores.", "fazer cartaz final.", "trocar roteador."]],
    ["Documentar um projeto de software ajuda a:", "registrar requisitos, decisões, uso, testes e manutenção.", ["substituir a execução do sistema.", "ocultar problemas.", "impedir colaboração.", "eliminar necessidade de versionamento."]],
    ["Teste de software busca:", "verificar se a solução atende requisitos e identificar falhas.", ["avaliar apenas a cor da interface.", "ignorar entradas inválidas.", "trocar peças físicas.", "definir topologia da rede."]],
    ["Apresentar solução de software exige:", "explicar problema, funcionamento, resultados, limites e próximos passos.", ["mostrar só o nome do sistema.", "não demonstrar uso.", "esconder dificuldades.", "evitar perguntas."]],
    ["Planejamento de projeto de software deve incluir:", "tarefas, responsáveis, prazos, recursos e critérios de entrega.", ["apenas imagens decorativas.", "somente senhas do sistema.", "cabos e tomadas.", "um texto sem objetivos."]],
  ],
  D37: [
    ["Em prática de laboratório de hardware, o registro técnico deve conter:", "procedimento, evidências, resultado, falhas e responsável.", ["somente uma foto sem legenda.", "apenas a cor da bancada.", "o nome do aluno sem atividade.", "um comentário informal."]],
    ["Colaboração em laboratório técnico significa:", "dividir tarefas, comunicar riscos e respeitar procedimentos.", ["cada pessoa agir sem avisar.", "ocultar erros do grupo.", "ignorar segurança.", "desorganizar ferramentas."]],
    ["Qualidade em prática de infraestrutura envolve:", "planejamento, execução segura, teste e documentação.", ["execução sem teste.", "cabos sem identificação.", "ausência de registro.", "troca aleatória de equipamento."]],
    ["Antes de mexer em equipamento do laboratório, o estudante deve:", "conhecer procedimento, riscos, ferramentas e autorização.", ["começar sem orientação.", "ligar tudo ao mesmo tempo.", "usar força excessiva.", "desmontar sem registrar."]],
    ["Uma evidência válida de prática laboratorial pode ser:", "checklist, fotos contextualizadas, relatório e validação do professor.", ["boato sobre o funcionamento.", "apenas nota verbal.", "arquivo vazio.", "print sem identificação."]],
  ],
  D38: [
    ["Organização do trabalho técnico envolve:", "planejar tarefas, cumprir responsabilidades e comunicar andamento.", ["agir sem prazos.", "evitar registro.", "ignorar colegas.", "não validar entregas."]],
    ["Comunicação profissional em equipe técnica exige:", "clareza, respeito, objetividade e registro quando necessário.", ["uso de mensagens ofensivas.", "omitir problemas.", "prometer sem verificar.", "não ouvir usuários."]],
    ["Responsabilidade em atividade produtiva significa:", "assumir tarefas, seguir critérios e responder pela qualidade da entrega.", ["culpar sempre outra pessoa.", "entregar sem revisar.", "ignorar combinado.", "não cumprir segurança."]],
    ["Técnicas produtivas ajudam a:", "organizar fluxo de trabalho, reduzir desperdício e melhorar resultados.", ["aumentar improviso sem controle.", "apagar evidências.", "trocar ferramentas sem necessidade.", "eliminar planejamento."]],
    ["Em ambiente profissional, colaboração significa:", "contribuir para objetivo comum respeitando papéis e combinados.", ["competir escondendo informação.", "não registrar decisões.", "desfazer trabalho dos colegas.", "ignorar orientações."]],
  ],
  D39: [
    ["Portfólio profissional serve para:", "apresentar projetos, habilidades, evidências e evolução do estudante.", ["guardar senhas pessoais.", "substituir todo estágio.", "ocultar trabalhos realizados.", "mostrar apenas fotos sem contexto."]],
    ["Planejar carreira técnica envolve:", "identificar objetivos, competências, oportunidades e ações de desenvolvimento.", ["esperar oportunidades sem preparação.", "ignorar formação continuada.", "não registrar experiências.", "evitar feedback."]],
    ["No estágio, postura profissional inclui:", "pontualidade, ética, comunicação e responsabilidade nas tarefas.", ["expor dados da empresa.", "não seguir orientações.", "ocultar dúvidas importantes.", "usar equipamentos sem autorização."]],
    ["Estratégia de inserção no mundo do trabalho pode incluir:", "currículo, portfólio, networking, certificações e preparação para entrevista.", ["apenas esperar indicação.", "não atualizar contato.", "não demonstrar projetos.", "evitar aprender tecnologias."]],
    ["Um bom relato de experiência de estágio deve:", "descrever atividades, aprendizagens, desafios, evidências e reflexão técnica.", ["listar apenas horários.", "copiar texto genérico.", "não relacionar ao curso.", "omitir responsabilidades."]],
  ],
  D40: [
    ["Uma proposta de inovação deve começar por:", "problema real, público-alvo, solução e valor gerado.", ["nome bonito sem problema.", "tecnologia escolhida ao acaso.", "ausência de usuários.", "promessa sem validação."]],
    ["Em gestão de startup, MVP significa:", "produto mínimo viável para testar hipótese com usuários.", ["manual de venda pública.", "modelo visual pronto.", "memória virtual principal.", "método de varredura de portas."]],
    ["Impacto social de uma solução digital pode ser avaliado por:", "benefícios para pessoas, comunidade, acesso, eficiência ou inclusão.", ["apenas quantidade de cores.", "tamanho do logotipo.", "marca do computador.", "número de cabos usados."]],
    ["Empreendedorismo técnico envolve:", "identificar oportunidade, propor solução, testar viabilidade e ajustar com feedback.", ["criar produto sem ouvir usuários.", "ignorar custos.", "não medir resultado.", "evitar parceria."]],
    ["Pitch de solução digital deve comunicar:", "problema, solução, público, diferencial, viabilidade e impacto.", ["somente slogan.", "apenas equipe sem proposta.", "dados pessoais dos usuários.", "conteúdo sem objetivo."]],
  ],
};

const MIN_QUESTOES_POR_DESCRITOR = 5;
const contagem = countByDescritor(questoesAtuais);
let proximoNumero = Math.max(
  ...questoesAtuais.map((questao) => Number(String(questao.codigo).match(/\d+$/)?.[0] || 0)),
) + 1;

const novasQuestoes = [];

for (const [codigoDescritor, itens] of Object.entries(bancoComplementar)) {
  const descritor = descritorPorCodigo[codigoDescritor];
  if (!descritor) throw new Error(`Descritor nao encontrado: ${codigoDescritor}`);
  const faltam = Math.max(0, MIN_QUESTOES_POR_DESCRITOR - (contagem[codigoDescritor] || 0));
  itens.slice(0, faltam).forEach(([enunciado, correta, distratores], index) => {
    const codigo = `Q-INF-V02-${String(proximoNumero).padStart(4, "0")}`;
    const opcoes = optionSet(correta, distratores, proximoNumero + index);
    novasQuestoes.push({
      codigo,
      descritor_codigo: codigoDescritor,
      componente_curricular: descritor.componente_curricular,
      enunciado,
      ...opcoes,
      justificativa: `Item complementar v0.2 criado para cobrir o descritor ${codigoDescritor} da Matriz SIDEP-CE v0.1. Deve passar por revisao docente antes de aplicacao oficial.`,
      dificuldade_inicial: Number((1.25 + ((proximoNumero + index) % 6) * 0.12).toFixed(2)),
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
  descritores_cobertos: Object.keys(bancoComplementar).length,
  status_itens_novos: "em_revisao",
};

const reportPath = path.join(__dirname, "..", "docs", "expansao_banco_questoes_v0_2.json");
fs.writeFileSync(reportPath, JSON.stringify(resumo, null, 2), "utf8");

console.log(JSON.stringify(resumo, null, 2));
