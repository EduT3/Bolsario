# Bolsario: auditoria e direcao de interface

Data: 2026-09-11. Auditoria anterior a qualquer alteracao de codigo.

## Evidencias e limites

Capturas atuais em artifacts/audit-before (nao publicar: as capturas live contem perfil pessoal).

1. 01-perfil-live.png: identidade repetida, preview redundante, configuracao tecnica de categorias, acao destrutiva junto de salvar.
2. 02-resumo-live.png: quatro cards iguais, aviso generico antes do saldo, 12 meses zerados com destaque excessivo.
3. 03-lancamentos-live.png: formulario comprime tabela; valor fora da area visivel em desktop; oito filtros/ordenacao sem hierarquia.
4. 04-orcamento-live.png: cadastro recebe mais destaque que acompanhamento; salvar usa simbolo parecido com exclusao.
5. 05-planejamento-live.png: arquivos e previsao antes de tres formularios sempre abertos; rolagem longa e grandes vazios.
6. resumo-1440.png: estado local com dados sinteticos; legendas repetem barras, distribuicao desigual entre grafico e ano.
7. lancamentos-390.png: estado local sintetico com mais de 6000px de altura; dados apenas depois de formulario e filtros.
8. Testes de referencia: 12 grupos passaram, cinco telas em 1440/1024/768/390/320px; sem overflow global. Isso nao mede facilidade de uso.

Producao estava vazia no mes auditado. Fluxos destrutivos, importacao e dados preenchidos foram avaliados apenas em contexto isolado local. PDF nativo do sistema nao foi operado.

## Diagnostico

| Area         | Achado                                                                           | Prioridade |
| ------------ | -------------------------------------------------------------------------------- | ---------- |
| Identidade   | Monograma generico em caixa, nome repetido, subtitulos intercambiaveis           | Media      |
| Hierarquia   | Cards equivalentes ocultam prioridade do saldo; informacao repetida              | Alta       |
| Dashboard    | 12 cards anuais dominam; falta comparacao visual ao longo do tempo               | Alta       |
| Navegacao    | Cinco abas claras, mas planejamento volta a empilhar tarefas                     | Alta       |
| Header       | Acoes sem rotulo e mes presentes ate no perfil                                   | Alta       |
| Tipografia   | Inter declarada mas nao carregada; excesso de negrito e caixa alta               | Media      |
| Cores        | Preferencia pessoal invade hierarquia; emojis criam outra linguagem              | Media      |
| Espacamento  | Muitos gaps ad hoc e folhas de estilo com sobrescritas acumuladas                | Media      |
| Cards/radius | 8px nao e extremo, mas caixas com tratamento uniforme banalizam importancia      | Alta       |
| Sombras      | Diferenca desnecessaria entre temas, hover em indicador nao clicavel             | Baixa      |
| Graficos     | Legenda duplica dados, apenas sete categorias, canvas sem valores acessiveis     | Alta       |
| Tabela       | Formulario estreita area util e causa scroll horizontal                          | Alta       |
| Filtros      | Todos aparecem sem distinguir busca rapida de refinamento                        | Media      |
| Formularios  | Categoria depende de texto serializado; dados e aparencia misturados             | Alta       |
| Botoes       | Salvar orcamento com simbolo inadequado; destrutivos perto de salvar             | Alta       |
| Interacao    | Foco basico existe; falta dialogo com retorno de foco e subabas por teclado      | Media      |
| Estados      | Vazios sem acao proxima; importacao sem busy; erros via toast temporario         | Alta       |
| Mobile       | Sem overflow global, mas lancamentos muito abaixo do formulario; baixa densidade | Alta       |

## Direcao

Registro financeiro pessoal preciso. Manrope local, pesos 400/500/600/700/800, numeros tabulares. Saldo 40px desktop/32px mobile; titulos 24px; secao 16px; corpo 14px; metadados 12px. Sem tamanho proporcional ao viewport e sem tracking negativo.

Branco/grafite para estrutura; acento do perfil apenas para acoes/selecao; azul e vermelho semanticos estaveis; verde para progresso positivo. Contraste nos dois temas. Escala 4/8/12/16/24/32; radius 4px controle, 6px dialogo; sombra apenas em elementos sobrepostos.

Secoes sem moldura. Resumo com saldo protagonista, faixa secundaria de entradas/gastos/economia, distribuicao em barras com valor e percentual acessiveis, evolucao anual comparativa sem 12 cards. Historico em largura total e editor em dialogo. Planejamento por subabas. Perfil com grupos e editor visual de categorias.

Estudo tipografico em Figma (dados ficticios): https://www.figma.com/design/nJQ5NEqqVGUdzeNhwxsOsK

## Plano e preservacao

1. Estrutura global e menu de arquivos; manter hashes e navegacao.
2. Tokens, tipografia local e componentes de formulario, lista, dialogo, estados.
3. Resumo e graficos integrados; todos os valores continuam calculados pelo motor existente.
4. Historico, filtros, cadastro/edicao/duplicacao em dialogo com foco.
5. Subabas do planejamento e perfil; categorias visuais sem mudar o formato do backup.
6. Mobile, teclado, validacao, importacao busy e mensagens persistentes de falha.
7. Tooling, testes e screenshots. Segunda rodada visual obrigatoria apos implementacao.

Sem alteracao de chave localStorage ou schema2. Sem dados de demonstracao na inicializacao. Sem sincronizacao remota, novas contas ou migracao forçada a framework.
