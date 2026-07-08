-- SIDEP-CE - revisao de duplicidades do banco base de itens
-- Objetivo: reformular itens com enunciado identico ou contexto repetido,
-- preservando os codigos das questoes para nao quebrar avaliacoes ja criadas.

update questao_mvp as q
set
  enunciado = v.enunciado,
  alternativa_a = v.alternativa_a,
  alternativa_b = v.alternativa_b,
  alternativa_c = v.alternativa_c,
  alternativa_d = v.alternativa_d,
  alternativa_e = v.alternativa_e,
  gabarito = v.gabarito,
  justificativa = v.justificativa,
  atualizada_em = now()
from (
  values
    (
      'Q-INF-0041',
      $sidep$Em um computador, a memória RAM se diferencia do armazenamento em disco porque a RAM:$sidep$,
      $sidep$Guarda permanentemente todos os arquivos do usuário.$sidep$,
      $sidep$É usada temporariamente enquanto programas estão em execução.$sidep$,
      $sidep$Funciona apenas quando não há sistema operacional.$sidep$,
      $sidep$Substitui teclado, mouse e monitor.$sidep$,
      $sidep$Serve exclusivamente para conexão com a internet.$sidep$,
      'B',
      $sidep$Item reformulado para ampliar o D01/D02: avalia distinção entre memória temporária e armazenamento, sem repetir definição de hardware.$sidep$
    ),
    (
      'Q-INF-0044',
      $sidep$Ao sincronizar uma pasta com um serviço de nuvem, como Google Drive ou OneDrive, o usuário consegue principalmente:$sidep$,
      $sidep$Acessar e recuperar arquivos em diferentes dispositivos conectados à conta.$sidep$,
      $sidep$Aumentar automaticamente a memória RAM do computador.$sidep$,
      $sidep$Impedir qualquer falha de internet.$sidep$,
      $sidep$Transformar arquivos em programas executáveis.$sidep$,
      $sidep$Eliminar a necessidade de senha.$sidep$,
      'A',
      $sidep$Item reformulado para D02: avalia função prática da sincronização em nuvem, não apenas identificação do conceito.$sidep$
    ),
    (
      'Q-INF-0045',
      $sidep$Em Python, o comando usado para receber uma informação digitada pelo usuário é:$sidep$,
      $sidep$print()$sidep$,
      $sidep$input()$sidep$,
      $sidep$echo()$sidep$,
      $sidep$display()$sidep$,
      $sidep$scan()$sidep$,
      'B',
      $sidep$Item reformulado para avaliar entrada de dados, evitando repetição com o item sobre saída usando print().$sidep$
    ),
    (
      'Q-INF-0046',
      $sidep$Observe o código abaixo. Qual será a saída? <pre>nota = 5
if nota >= 6:
    print('Aprovado')
else:
    print('Reprovado')</pre>$sidep$,
      $sidep$nota >= 6$sidep$,
      $sidep$Reprovado$sidep$,
      $sidep$Aprovado$sidep$,
      $sidep$5$sidep$,
      $sidep$Nenhuma saída$sidep$,
      'B',
      $sidep$Item reformulado para variar o caso de teste da estrutura condicional, evitando repetição literal do exemplo com nota 7.$sidep$
    ),
    (
      'Q-INF-0048',
      $sidep$Em Python, no comando <pre>nota = 7</pre>, o operador '=' é usado para:$sidep$,
      $sidep$Atribuir o valor 7 à variável nota.$sidep$,
      $sidep$Comparar se nota é igual a 7.$sidep$,
      $sidep$Somar nota com 7.$sidep$,
      $sidep$Criar um comentário.$sidep$,
      $sidep$Encerrar o programa.$sidep$,
      'A',
      $sidep$Item reformulado para diferenciar atribuição (=) de comparação (==), evitando duplicidade com o item sobre operador de igualdade.$sidep$
    ),
    (
      'Q-INF-0050',
      $sidep$Durante a manutenção, um computador liga, mas apresenta bipes repetidos e não exibe imagem. Uma verificação inicial coerente é:$sidep$,
      $sidep$Conferir o encaixe dos módulos de memória RAM e testar outro módulo compatível.$sidep$,
      $sidep$Formatar imediatamente o disco rígido sem diagnóstico.$sidep$,
      $sidep$Trocar o cabo de rede antes de abrir o gabinete.$sidep$,
      $sidep$Alterar a senha do sistema operacional.$sidep$,
      $sidep$Instalar um editor de texto atualizado.$sidep$,
      'A',
      $sidep$Item reformulado para D11: avalia diagnóstico inicial de hardware relacionado à memória RAM, evitando repetição com definição básica de informática.$sidep$
    ),
    (
      'Q-INF-0059',
      $sidep$Em Programação II, observe a função abaixo. Qual valor será exibido? <pre>def calcular_total(valores):
    total = 0
    for valor in valores:
        total = total + valor
    return total

print(calcular_total([2, 3, 5]))</pre>$sidep$,
      $sidep$5$sidep$,
      $sidep$8$sidep$,
      $sidep$10$sidep$,
      $sidep$[2, 3, 5]$sidep$,
      $sidep$Nenhum valor, pois a função não retorna nada.$sidep$,
      'C',
      $sidep$Item reformulado para D08: avalia uso de função, lista e acumulação em Programação II, evitando repetição com item introdutório de laço do D06.$sidep$
    ),
    (
      'Q-INF-0060',
      $sidep$Em Programação II, qual é a principal vantagem de criar uma função para calcular a média de notas em diferentes partes de um sistema?$sidep$,
      $sidep$Impedir o uso de listas no programa.$sidep$,
      $sidep$Eliminar a necessidade de variáveis.$sidep$,
      $sidep$Substituir todos os comandos condicionais.$sidep$,
      $sidep$Reutilizar a lógica de cálculo, reduzindo repetição de código.$sidep$,
      $sidep$Transformar automaticamente o programa em aplicativo web.$sidep$,
      'D',
      $sidep$Item reformulado para D08: avalia modularização e reutilização de código, competência própria de Programação II.$sidep$
    ),
    (
      'Q-INF-0061',
      $sidep$Considere a lista em Python: <pre>idades = [15, 16, 17]
idades.append(18)</pre> Após a execução, qual será o conteúdo da lista?$sidep$,
      $sidep$[18]$sidep$,
      $sidep$[15, 16, 17, 18]$sidep$,
      $sidep$[15, 16, 18]$sidep$,
      $sidep$[16, 17, 18]$sidep$,
      $sidep$O código apaga a lista original.$sidep$,
      'B',
      $sidep$Item reformulado para D08: avalia operação de lista em contexto de continuidade, sem repetir conceito básico do D06.$sidep$
    ),
    (
      'Q-INF-0063',
      $sidep$Em um sistema maior, o professor orienta dividir o programa em funções como cadastrar_aluno(), calcular_media() e emitir_relatorio(). Essa prática é chamada de:$sidep$,
      $sidep$Comentário de código.$sidep$,
      $sidep$Modularização.$sidep$,
      $sidep$Conversão de tipo.$sidep$,
      $sidep$Formatação de tela.$sidep$,
      $sidep$Instalação de biblioteca.$sidep$,
      'B',
      $sidep$Item reformulado para D08: avalia organização modular de programas, reduzindo repetição com itens de saída de laço.$sidep$
    )
) as v(codigo, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, gabarito, justificativa)
where q.codigo = v.codigo;
