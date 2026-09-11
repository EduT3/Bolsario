# Bolsário: melhorias e continuidade

Atualizado em 11/09/2026. Trabalho local concluído para o escopo abaixo, sem commit, sincronização ou publicação nesta execução.

## Pedido e ordem de execução

Eduardo autorizou avaliar e melhorar o aplicativo com Astra, nesta ordem: funcionalidades, usabilidade e visual. Houve um pedido temporário para guardar o plano devido ao limite de uso; depois ele autorizou retomar. Este registro distingue o que foi entregue de possíveis próximos passos.

## Diagnóstico confirmado

- O app já possuía recorrências, parcelas, metas, projeção de seis meses e resumo anual. Não são funcionalidades novas desta entrega.
- O evento de troca entre Gasto/Entrada era passado como categoria, podendo criar `[object Event]`.
- Excluir um lançamento em edição deixava o formulário apontando para um ID inexistente.
- Contas personalizadas de backups não apareciam corretamente no formulário de edição.
- CSV e JSON eram baixados juntos, sujeitos a bloqueio de downloads múltiplos.
- A importação substituía os dados sem confirmação e normalizava versões futuras, podendo perder campos desconhecidos.
- Campos de rádio invisíveis tinham largura de página e causavam transbordamento horizontal.
- O gráfico usava cores fixas pouco legíveis no tema escuro e uma largura mínima inadequada ao celular.
- Os testes reproduziram arredondamento incorreto de 1,005, metadata vazia convertida em zero ao normalizar novamente e planos gerando parcelas de valor zero.

## Funcionalidades concluídas

- Duplicação abre um formulário para revisão e só grava ao salvar. Cópias de itens gerados se tornam manuais, sem vínculo de recorrência ou parcela.
- Exclusão de lançamento com desfazer por até 12 segundos, até outra mensagem ou até substituir/limpar o perfil. Editar/excluir não deixa ID inválido no formulário.
- Totais de entradas, gastos e saldo dos resultados filtrados; ordenação por data, valor e descrição; paginação de 20 itens.
- Busca sem diferenciar acentos e indicação de intervalo de datas inválido.
- CSV completo e CSV filtrado separados do backup JSON completo. CSV filtrado inclui todas as páginas.
- Importação com confirmação, cancelamento sem alteração e rejeição de versões futuras. Gravação da importação ocorre antes da substituição do estado em memória.
- Navegação mensal por setas, retorno ao mês atual e seleção pelo resumo anual.
- Comparação em reais com o mês anterior, ou indicação de ausência de registros anteriores.
- Correções de arredondamento e soma em centavos, normalização estável dos campos de origem e bloqueio de criação de parcelas menores que R$ 0,01.
- Uso total do orçamento considera apenas categorias com limites cadastrados.

## Usabilidade e visual concluídos

- Atalho de novo lançamento com confirmação antes de descartar formulário preenchido.
- Após salvar, o mês do lançamento fica visível e os filtros são limpos; novo formulário volta à categoria de gasto padrão.
- Títulos específicos por aba, navegação móvel inferior e foco visível por teclado.
- Tabela adaptada ao celular, campos contidos no formulário e botões de ação maiores.
- Layout mais leve, seções sem painéis decorativos, tipografia de tamanho estável e cores distintas para entradas e gastos.
- Ícones locais Lucide com licença, sem CDN ou dependência de rede para abrir o app.
- Gráfico adaptado à largura, quantidade de categorias e tema, sem texto sobreposto às barras.
- README atualizado e scripts de verificação reproduzíveis.

## Verificações

- `node --check app.js`: aprovado durante a implementação.
- `node --test tests/finance.test.cjs`: 16 testes aprovados, zero falhas e zero TODOs.
- `node tests/browser.cjs`: 12 grupos de verificações aprovados com Playwright e Edge headless, em contexto isolado e dados fictícios.
- Navegador: primeiro acesso, persistência após recarregar, tipo/categoria, duplicação, excluir/desfazer, conta importada, origem, filtros, ordenação, paginação, meses e comparação.
- Arquivos: cancelar/importar legado, rejeitar versão futura sem alterar dados, backup v2 exportado e reimportado e CSV filtrado abrangendo itens fora da página visível.
- Planejamento: gerar recorrência repetidamente sem duplicar, rejeitar parcela zero e distribuir R$ 100,00 em três parcelas sem perder centavos.
- Relatório: conteúdo mensal e estilos de impressão; diálogo nativo de impressão não automatizado.
- Layout: cinco abas em 1440, 1024, 768, 390 e 320 pixels sem transbordamento da página; campos dentro dos formulários; pixels do gráfico presentes. Tema escuro e ausência de erros JavaScript verificados.
- Capturas em `artifacts/`, com inspeção visual de resumo e lançamentos. Esses arquivos são evidência local com dados fictícios e não entram no Git.

Não foram usados dados financeiros reais nem alterado o perfil de navegação do Eduardo. Não houve teste em iPhone/Safari, Android físico ou site de produção. Isso não equivale a uma auditoria completa de todas as funções existentes.

## Alterações parciais

Não há implementação intencionalmente incompleta no escopo acima. O acabamento foi aplicado às telas existentes; uma reorganização maior do planejamento permanece uma ideia futura, não uma entrega parcialmente ativada.

## Próximos passos opcionais

1. Funcionalidades: avaliar importação assistida de extratos CSV com prévia e deduplicação. Não implementada.
2. Usabilidade: dividir Planejamento em subtelas para recorrências, parcelas e metas. Não implementado.
3. Visual: validar em aparelhos físicos, principalmente Safari/iOS, e revisar a experiência com muitas categorias e nomes extremos.
4. Publicação: conferir o clone Git correto, revisar o diff e publicar quando solicitado. Esta pasta não tem `.git`; isso foi confirmado nesta execução. Não inicializar outro repositório automaticamente.

## Arquivos e ambiente para retomar

- Pasta de trabalho: `C:\Users\eduar\OneDrive\Pictures\PROGRAMAÇÃO\Bolsario`.
- Alterados: `app.js`, `index.html`, `styles.css`, `README.md`.
- Adicionados: `vendor/icons.js`, `vendor/lucide-LICENSE`, `scripts/build-icons.cjs`, `tests/finance.test.cjs`, `tests/browser.cjs`, `package.json`, `.gitignore` e este documento.
- A chave de armazenamento continua `pierre-finance-v1` e o backup continua versão 2. Não houve migração para outro armazenamento.
- Para compartilhar o app, incluir `vendor/` junto de HTML, CSS e JS.
- O histórico da tarefa aponta o clone `C:\Users\eduar\Documents\Codex\2026-04-27\crie-um-aplicativo-ou-pograma-para\github-sync-bolsario`, remoto `https://github.com/EduT3/Bolsario.git`. Reconfirmar caminho, alterações e remoto antes de sincronizar; não foi acessado/publicado nesta execução.
- Os testes usaram as dependências empacotadas do Codex via `NODE_PATH`; a instalação de pacotes descrita no README não foi executada neste ambiente.
- A tentativa de usar agent-browser não encontrou a ferramenta local e o acesso ao registro npm falhou. A validação foi feita com Playwright já disponível e Edge instalado.
