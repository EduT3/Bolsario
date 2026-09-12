# Bolsário

Controle financeiro pessoal simples e direto para usar no navegador. O Bolsário foi feito para registrar entradas e gastos, acompanhar orçamento por categoria e gerar relatórios para arquivamento.

**Site:** [bolsario.vercel.app](https://bolsario.vercel.app)

## Visão Geral

O app funciona sem servidor, banco de dados ou cadastro. Todas as informações ficam salvas no próprio navegador por meio de `localStorage`, o que deixa o uso rápido e privado para controle pessoal.

Principais telas:

- **Resumo:** saldo em destaque, distribuição dos gastos, evolução anual e últimos lançamentos.
- **Lançamentos:** histórico em largura total, cadastro e edição em diálogo, duplicação, exclusão com opção de desfazer, filtros e busca.
- **Orçamento:** limites por categoria com barra de progresso e exclusão individual.
- **Planejamento:** subabas de previsão, recorrentes, parcelas e metas; arquivo mensal separado da rotina de cadastro.
- **Perfil:** dados pessoais, aparência, editor visual de categorias e área de backup e exclusão de dados.

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
7. Abra **Arquivos** para baixar backup, exportar CSV, gerar o relatório PDF ou importar um backup. No histórico, **CSV filtrado** exporta o resultado da busca.

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
- Manrope e ícones Lucide incluídos localmente, com suas licenças
- TypeScript strict via JSDoc na camada de interface
- ESLint, Prettier, Playwright e axe-core para validação
- Vercel para publicação

O app distribuído abre diretamente pelo `index.html`, sem framework ou instalação. O build de desenvolvimento prepara uma cópia estática em `dist/`, incluindo fontes e ícones locais.

## Estrutura

```text
.
|-- index.html   # Estrutura das telas
|-- styles.css   # Layout, tema e responsividade
|-- app.js       # Regras financeiras, armazenamento e renderização de dados
|-- interface.js # Diálogos, foco, subabas e editor visual
|-- vendor/      # Fonte, ícones e licenças locais
|-- scripts/     # Build estático e geração do conjunto de ícones
|-- tests/       # Testes das regras e do navegador
|-- docs/        # Registro de melhorias e continuidade
`-- README.md    # Documentação do projeto
```

## Verificação

O app continua abrindo diretamente pelo `index.html`. Para desenvolver e validar, use Node.js 24 e Microsoft Edge:

```powershell
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:browser
npm.cmd run format:check
```

Os testes de navegador usam Playwright com perfil isolado e dados fictícios, nos temas claro/escuro e larguras 320, 390, 768, 1024 e 1440 px. Para testar a distribuição gerada:

```powershell
$env:BOLSARIO_TEST_DIST='1'
npm.cmd run test:browser
```

Capturas ficam em `artifacts/`; relatórios e traces em `playwright-report/` e `test-results/`. Essas pastas são ignoradas pelo Git. O diálogo nativo de salvar PDF não é automatizado; o conteúdo e os estilos do relatório são verificados. `npm.cmd run format` aplica o padrão do Prettier.

O typecheck estrito cobre `interface.js`, a configuração e os novos testes de navegador. O motor financeiro legado em `app.js` permanece JavaScript, coberto por lint e testes unitários: não houve conversão artificial de todo o projeto para TypeScript. Configurações seguem as documentações de [TypeScript](https://www.typescriptlang.org/tsconfig/checkJs.html), [Playwright](https://playwright.dev/docs/test-configuration) e [ESLint](https://eslint.org/docs/latest/use/configure/configuration-files).

A auditoria, a direção visual e os limites da validação estão em [Auditoria da interface](docs/INTERFACE-AUDIT.md). Orientações para futuras alterações estão em [AGENTS.md](AGENTS.md).

Os resultados da reformulação, as correções da segunda rodada visual e os limites dos testes estão em [Revisão da implementação](docs/INTERFACE-VALIDATION.md).

## Ideias Futuras

- Instalação como PWA.
- Importação assistida de extratos CSV, com prévia e prevenção de duplicatas.
- Resumo por trimestre.

## Status

Projeto em evolução para uso pessoal e compartilhamento com outras pessoas.

As melhorias locais e os resultados de validação estão em [Registro de melhorias](docs/MELHORIAS-2026-09.md). A versão do site depende da publicação do repositório.
