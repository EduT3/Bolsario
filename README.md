# Bolsário

Controle financeiro pessoal simples e direto para usar no navegador. O Bolsário foi feito para registrar entradas e gastos, acompanhar orçamento por categoria e gerar relatórios para arquivamento.

**Site:** [bolsario.vercel.app](https://bolsario.vercel.app)

## Visão Geral

O app funciona sem servidor, banco de dados ou cadastro. Todas as informações ficam salvas no próprio navegador por meio de `localStorage`, o que deixa o uso rápido e privado para controle pessoal.

Principais telas:

- **Resumo:** saldo do mês, entradas, gastos, taxa de economia, comparação com o mês anterior e resumo anual.
- **Lançamentos:** cadastro, edição, duplicação, exclusão com opção de desfazer, filtros e busca de entradas e despesas.
- **Orçamento:** limites por categoria com barra de progresso e exclusão individual.
- **Planejamento:** recorrências, compras parceladas, metas, arquivo mensal e projeção dos próximos seis meses.
- **Perfil:** personalização de nome, objetivo financeiro, renda base, tema, cor principal e categorias.

## Recursos

- Primeiro acesso começa zerado, sem dados fictícios.
- Dados persistem ao atualizar a página com `F5`.
- Exportação de todos os lançamentos em CSV ou apenas dos resultados filtrados.
- Backup completo em JSON, em um comando separado do CSV.
- Importação com confirmação antes de substituir os dados atuais.
- Busca sem diferenciar acentos, ordenação e totais dos resultados filtrados.
- Histórico dividido em páginas de 20 lançamentos; o CSV filtrado inclui todas as páginas.
- Navegação entre meses por setas e pelos meses do resumo anual.
- Recorrências sem duplicar o mês já gerado e parcelas com distribuição exata dos centavos.
- Limites, recorrências e metas também podem usar percentuais da renda base.
- Relatório mensal em PDF pelo fluxo de impressão do navegador.
- Tema claro e escuro.
- Navegação inferior no celular e lançamentos sem rolagem lateral.
- Personalização para uso por outras pessoas.

## Como Usar

1. Abra o app pelo link publicado ou execute o arquivo `index.html` localmente.
2. Vá até **Perfil** e configure nome, objetivo, renda base, tema e categorias.
3. Registre entradas e gastos em **Lançamentos**.
4. Defina limites em **Orçamento**.
5. Acompanhe o mês em **Resumo**.
6. Em **Planejamento**, organize recorrências, parcelas e metas.
7. Use os botões superiores para baixar o backup completo, exportar CSV ou gerar PDF. Os botões têm nomes ao passar o mouse e rótulos para leitores de tela.

Ao duplicar um lançamento, o formulário abre para revisão antes de salvar. A cópia é manual, mesmo quando a origem é uma recorrência ou parcela. Após excluir um lançamento, **Desfazer** fica disponível por até 12 segundos, ou até outra ação mostrar uma nova mensagem.

## Backup e Privacidade

Os dados não são enviados para um servidor. Eles ficam no navegador em que o app é usado.

Para evitar perda de informações:

- exporte o backup JSON periodicamente;
- guarde o arquivo em uma pasta segura;
- importe o backup quando trocar de navegador, computador ou celular.

Ao limpar dados do navegador, trocar de perfil do navegador ou usar modo anônimo, os dados locais podem ser perdidos.

O backup JSON usa o formato `bolsario.backup`, versão 2. Backups antigos sem envelope e versões 1 e 2 são aceitos. Versões futuras são rejeitadas para evitar descartar campos desconhecidos. Importar **substitui** o conjunto atual, não mescla os dados. CSV é um relatório, não um backup importável.

A renda base serve para planejamento e cálculos percentuais; ela não cria automaticamente uma entrada no saldo. O saldo e a taxa de economia usam os lançamentos registrados, inclusive parcelas com datas futuras. A comparação mensal usa os registros de cada mês, sem projetar valores ausentes.

## Tecnologias

- HTML
- CSS
- JavaScript puro
- Ícones Lucide incluídos localmente
- Vercel para publicação

O projeto não depende de framework, build ou instalação de pacotes para funcionar.

## Estrutura

```text
.
|-- index.html   # Estrutura das telas
|-- styles.css   # Layout, tema e responsividade
|-- app.js       # Regras de negócio, armazenamento e interações
|-- vendor/      # Ícones locais e licença
|-- scripts/     # Geração opcional do conjunto de ícones
|-- tests/       # Testes das regras e do navegador
|-- docs/        # Registro de melhorias e continuidade
`-- README.md    # Documentação do projeto
```

## Verificação

O app continua abrindo diretamente pelo `index.html`, sem instalação. Para verificar as regras com Node.js:

```powershell
npm.cmd test
```

Os testes de navegador usam Playwright e Microsoft Edge instalado, em um perfil isolado com dados fictícios:

```powershell
npm.cmd install
npm.cmd run test:browser
```

Resultados e capturas são gravados em `artifacts/`, ignorado pelo Git. O diálogo nativo de salvar PDF não é automatizado; o conteúdo e os estilos do relatório são verificados. Os ícones já acompanham o projeto; `npm.cmd run build:icons` só é necessário para regenerá-los.

## Ideias Futuras

- Instalação como PWA.
- Divisão da tela de planejamento em subtelas.
- Importação assistida de extratos CSV, com prévia e prevenção de duplicatas.
- Resumo por trimestre.

## Status

Projeto em evolução para uso pessoal e compartilhamento com outras pessoas.

As melhorias locais e os resultados de validação estão em [Registro de melhorias](docs/MELHORIAS-2026-09.md). A versão do site depende da publicação do repositório.
