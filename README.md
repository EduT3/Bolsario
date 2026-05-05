# Bolsário

Controle financeiro pessoal simples e direto para usar no navegador. O Bolsário foi feito para registrar entradas e gastos, acompanhar orçamento por categoria e gerar relatórios para arquivamento.

**Acesse:** https://bolsario.vercel.app

## Visão Geral

O app funciona sem servidor, banco de dados ou cadastro. Todas as informações ficam salvas no próprio navegador por meio de `localStorage`, o que deixa o uso rápido e privado para controle pessoal.

Principais telas:

- **Resumo:** saldo do mês, entradas, gastos, taxa de economia e gráfico por categoria.
- **Lançamentos:** cadastro, edição, exclusão, filtro e busca de entradas e despesas.
- **Orçamento:** limites por categoria com barra de progresso e exclusão individual.
- **Perfil:** personalização de nome, objetivo financeiro, renda base, tema, cor principal e categorias.

## Recursos

- Primeiro acesso começa zerado, sem dados fictícios.
- Dados persistem ao atualizar a página com `F5`.
- Exportação de lançamentos em CSV.
- Backup completo em JSON.
- Importação de backup para outro navegador ou computador.
- Relatório mensal em PDF pelo fluxo de impressão do navegador.
- Tema claro e escuro.
- Layout responsivo para desktop e celular.
- Personalização para uso por outras pessoas.

## Como Usar

1. Abra o app pelo link publicado ou execute o arquivo `index.html` localmente.
2. Vá até **Perfil** e configure nome, objetivo, renda base, tema e categorias.
3. Registre entradas e gastos em **Lançamentos**.
4. Defina limites em **Orçamento**.
5. Acompanhe o mês em **Resumo**.
6. Use os botões superiores para exportar CSV/backup JSON ou gerar PDF.

## Backup e Privacidade

Os dados não são enviados para um servidor. Eles ficam no navegador em que o app é usado.

Para evitar perda de informações:

- exporte o backup JSON periodicamente;
- guarde o arquivo em uma pasta segura;
- importe o backup quando trocar de navegador, computador ou celular.

Ao limpar dados do navegador, trocar de perfil do navegador ou usar modo anônimo, os dados locais podem ser perdidos.

## Tecnologias

- HTML
- CSS
- JavaScript puro
- Vercel para publicação

O projeto não depende de framework, build ou instalação de pacotes para funcionar.

## Estrutura

```text
.
|-- index.html   # Estrutura das telas
|-- styles.css   # Layout, tema e responsividade
|-- app.js       # Regras de negócio, armazenamento e interações
`-- README.md    # Documentação do projeto
```

## Ideias Futuras

- Lançamentos recorrentes.
- Compras parceladas.
- Metas financeiras.
- Instalação como PWA.
- PIN local para bloquear o acesso.
- Resumos por trimestre e ano.

## Status

Projeto em evolução para uso pessoal e compartilhamento com outras pessoas.
