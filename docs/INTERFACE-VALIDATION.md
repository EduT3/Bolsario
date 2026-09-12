# Bolsario: revisao da implementacao

Data: 2026-09-12. Trabalho local, sem publicacao no GitHub ou Vercel.

## Resultado por fluxo

1. **Primeiro acesso:** zerado, renda base sem lancamento automatico, foco contido na configuracao inicial e persistencia ao atualizar.
2. **Resumo:** saldo prioritario, entradas e gastos com cores semanticas, distribuicao acessivel com todas as categorias, evolucao anual e ultimos lancamentos.
3. **Lancamentos:** historico em largura total; editor em dialogo com retorno de foco, confirmacao para descartar rascunho, duplicacao, exclusao e desfazer.
4. **Filtros e arquivos:** filtros secundarios recolhiveis, erro de intervalo invalido, CSV completo mesmo com paginacao, backup v2 com confirmacao e erro persistente para versoes incompativeis.
5. **Orcamento e planejamento:** listas antes dos editores na tela e no documento; subabas, limites percentuais, recorrencia sem duplicacao, parcelas com centavos exatos, metas e arquivo mensal.
6. **Perfil:** subabas pessoais, aparencia, categorias e dados; editor visual de categorias sem remover lancamentos antigos, temas persistentes e exclusao de dados isolada.

## Segunda revisao visual

Inspecao das capturas geradas pela aplicacao executada em contextos isolados do Playwright. A segunda rodada comparou, entre outras telas, Perfil/Aparencia em 320px com o mesmo estado sintetico da primeira implementacao.

Correcoes resultantes:

- Remocao de altura vazia no cabecalho mobile e correcao de uma grade que mantinha uma tela inativa visivel.
- Correcao de largura minima da grade em tablet.
- Subabas do perfil em duas linhas no celular, sem nomes cortados.
- Indicadores do resumo em linhas em 320px para melhorar a leitura de valores altos.
- Grafico anual compacto quando vazio, com entradas, gastos e saldo do mes selecionado ao lado da comparacao visual.
- Barras de orcamento e metas com semantica de medidor; lista de categorias rolavel pelo teclado.
- Campo invalido de perfil revela sua subaba antes de receber foco, evitando uma validacao invisivel ao salvar por outra aba.
- Acoes do planejamento padronizadas em icones Lucide com rotulos acessiveis; acao de gerar recorrencias junto da lista.
- Verificacao adicional de nomes longos, saldo negativo alto e dialogo em 320 x 568px.

O estudo no [Figma](https://www.figma.com/design/nJQ5NEqqVGUdzeNhwxsOsK) registra a hierarquia tipografica com valores ficticios. Nao e uma biblioteca completa de componentes nem uma replica de todas as telas.

## Verificacoes

- Instalacao reproduzivel: `npm.cmd ci`.
- Lint, TypeScript strict na camada de interface e formatacao aprovados.
- 16 testes financeiros aprovados.
- Build estatico aprovado; testes finais apontam para `dist/index.html` via `file://`.
- 21 testes Playwright aprovados; uma repeticao da matriz de screenshots e dispensada intencionalmente no segundo projeto.
- Matriz das cinco telas em 320, 390, 768, 1024 e 1440px, nos dois temas; sem overflow global e sem campos escapando dos seus limites.
- Verificacoes automaticas axe-core sem violacoes encontradas nas regras WCAG 2 A/AA e 2.1 AA executadas para telas, subabas, dialogo e configuracao inicial.
- Sem erros JavaScript nos fluxos cobertos. Backup schema 2 e chave `pierre-finance-v1` preservados.

Capturas sinteticas em `artifacts/review-final/`, com estados vazios, preenchidos, subabas, dialogos e variantes de tamanho. As capturas da primeira implementacao estao em `artifacts/review-1/`. Relatorios e traces ficam em `playwright-report/` e `test-results/`. Esses arquivos sao locais e ignorados pelo Git; podem ser regenerados pelos testes.

## Limites

- O navegador integrado bloqueou a abertura do arquivo local por politica de URL. Nao houve contorno desse bloqueio; a revisao visual local utilizou os testes headless explicitamente solicitados e suas capturas, nao uma sessao interativa aberta no navegador integrado.
- Testado em Microsoft Edge/Chromium no Windows. Viewports mobile e toque simulado nao equivalem a testes em aparelhos reais, Safari ou Firefox.
- Verificacoes automaticas e de teclado nao certificam conformidade integral de acessibilidade nem substituem uso real com leitor de tela.
- PDF: conteudo e estilos de impressao verificados, sem operar o dialogo nativo do sistema ou certificar cada paginacao de um PDF salvo.
- `app.js` legado continua em JavaScript com lint e testes financeiros; strict cobre `interface.js`, declaracoes e testes/configuracao novos. Nao houve supressoes com `any` ou `ts-ignore` na nova camada.
- Dados pessoais e perfil real do navegador nao foram usados nos testes. As capturas live da auditoria inicial sao privadas e nao devem ser publicadas.
- Nenhum Git foi inicializado nesta pasta. A versao publicada so muda depois de uma solicitacao separada de publicacao.
