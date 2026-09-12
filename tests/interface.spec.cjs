// @ts-check
const { test, expect } = require("@playwright/test");
const { default: AxeBuilder } = require("@axe-core/playwright");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

/** @typedef {import('@playwright/test').Page} Page */
/** @typedef {{id:string,type:string,description:string,amount:number,date:string,category:string,account:string,source?:string,recurringId?:string,installmentId?:string}} Transaction */
/** @typedef {{transactions:Transaction[],profile:{personName:string,theme:string,categories:{expense:string[],income:string[]},categoryMeta:Record<string,{icon:string,color:string}>},budgets:Record<string,number>,recurring:unknown[],installments:unknown[],goals:unknown[],archives:unknown[]}} SavedState */
const root = path.resolve(__dirname, "..");
const appUrl = pathToFileURL(
  path.join(root, process.env.BOLSARIO_TEST_DIST ? "dist/index.html" : "index.html"),
).href;
const shotDir = path.join(root, "artifacts", process.env.BOLSARIO_VISUAL_PASS || "review-1");
/** @type {WeakMap<Page, string[]>} */
const pageErrors = new WeakMap();

function fixture() {
  const categories = [
    "Moradia",
    "Mercado",
    "Transporte",
    "Saúde",
    "Educação",
    "Lazer",
    "Assinaturas",
    "Dívidas",
    "Outros",
  ];
  const examples = [
    "Aluguel",
    "Supermercado",
    "Combustível",
    "Farmácia",
    "Curso de idiomas",
    "Cinema",
    "Internet",
    "Empréstimo",
    "Café",
  ];
  const amounts = [1250, 348.55, 160, 84.9, 180, 52, 99.9, 250, 21.5];
  return {
    profile: { personName: "Perfil de teste", setupComplete: true, monthlyIncome: 5000 },
    budgets: { Moradia: 1500, Mercado: 500, Transporte: 300 },
    recurring: [],
    installments: [],
    goals: [],
    archives: [],
    transactions: [
      {
        id: "salary",
        type: "income",
        description: "Salário",
        amount: 5000,
        date: "2026-09-01",
        category: "Salário",
        account: "Conta corrente",
        notes: "",
      },
      ...Array.from({ length: 25 }, (_, i) => ({
        id: `expense-${i}`,
        type: "expense",
        description: examples[i % 9],
        amount: i < 9 ? amounts[i] : 10 + i / 10,
        date: `2026-09-${String(2 + i).padStart(2, "0")}`,
        category: categories[i % 9],
        account: "Banco personalizado",
        notes: "",
        source: i === 0 ? "recurring" : "manual",
        recurringId: i === 0 ? "rent" : "",
      })),
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `previous-${i}`,
        type: "income",
        description: "Renda mensal",
        amount: 3200 + i * 150,
        date: `2026-${String(i + 1).padStart(2, "0")}-01`,
        category: "Salário",
        account: "Conta corrente",
        notes: "",
      })),
    ],
  };
}

/** @param {Page} page @returns {Promise<SavedState>} */
async function saved(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("pierre-finance-v1") || "{}"));
}

/** @param {Page} page @param {unknown} data @param {boolean | null} [accept] */
async function upload(page, data, accept = true) {
  if (accept !== null)
    page.once("dialog", (dialog) => (accept ? dialog.accept() : dialog.dismiss()));
  await page.locator("#importFile").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await expect(page.locator("#importFile")).toHaveValue("");
  await expect(page.locator("#mainContent")).toHaveAttribute("aria-busy", "false");
}

/** @param {Page} page @param {string} view */
async function navigate(page, view) {
  await page.locator(`.nav-item[href="#${view}"]`).click();
  await expect(page.locator(".view.active")).toHaveCount(1);
  await expect(page.locator(`#${view}`)).toBeVisible();
}

/** @param {Page} page */
async function populate(page) {
  await upload(page, fixture());
  await navigate(page, "resumo");
  await page.locator("#monthFilter").fill("2026-09");
  await page.locator("#monthFilter").dispatchEvent("change");
}

/** @param {Page} page @param {string} id */
async function fileAction(page, id) {
  await page.locator("#fileMenu summary").click();
  await page.locator(`#${id}`).click();
}

test.beforeEach(async ({ page }) => {
  const errors = /** @type {string[]} */ ([]);
  pageErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(appUrl);
  await page.locator("#skipSetupBtn").click();
});
test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

test("configuração inicial com foco contido e renda sem lançamento automático", async ({
  page,
}, testInfo) => {
  // This page belongs to an isolated Playwright context, never the user's profile.
  await page.evaluate(() => localStorage.removeItem("pierre-finance-v1"));
  await page.reload();
  await expect(page.locator("#setupName")).toBeFocused();
  await expect(page.locator(".app-shell")).toHaveAttribute("inert", "");
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("#skipSetupBtn")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#setupName")).toBeFocused();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations.map((issue) => issue.id)).toEqual([]);
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({ path: path.join(shotDir, `setup-${testInfo.project.name}.png`) });
  await page.locator("#setupName").fill("Perfil inicial de teste");
  await page.locator("#setupIncome").fill("4000");
  await page.locator('#setupForm button[type="submit"]').click();
  await expect(page.locator("#setupGate")).not.toBeVisible();
  await expect(page.locator(".app-shell")).not.toHaveAttribute("inert");
  expect((await saved(page)).transactions).toHaveLength(0);
  await page.reload();
  await expect(page.locator("#setupGate")).not.toBeVisible();
});

test("primeiro acesso, diálogo, persistência, duplicação e desfazer", async ({ page }) => {
  expect((await saved(page)).transactions).toEqual([]);
  await page.locator("#quickAddBtn").click();
  await expect(page.getByRole("dialog", { name: "Novo lançamento" })).toBeVisible();
  await expect(page.locator("#description")).toBeFocused();
  await page.locator('label[for="typeIncome"]').click();
  await expect(page.locator("#category")).toHaveValue("Salário");
  await page.locator("#description").fill("Entrada teste");
  await page.locator("#amount").fill("3000.10");
  await page.locator('#transactionForm button[type="submit"]').click();
  await expect(page.locator("#transactionDialog")).not.toBeVisible();
  await expect(page.locator("#quickAddBtn")).toBeFocused();
  await page.reload();
  expect((await saved(page)).transactions[0].amount).toBe(3000.1);
  await page.locator('#transactionRows [data-action="duplicate"]').click();
  expect((await saved(page)).transactions).toHaveLength(1);
  await expect(page.locator("#editingId")).toHaveValue("");
  await page.locator("#description").fill("Cópia manual");
  await page.locator('#transactionForm button[type="submit"]').click();
  expect((await saved(page)).transactions).toHaveLength(2);
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator('#transactionRows [data-action="delete"]').first().click();
  expect((await saved(page)).transactions).toHaveLength(1);
  await page.locator("#toastUndoBtn").click();
  expect((await saved(page)).transactions).toHaveLength(2);
  await page.locator("#quickAddBtn").click();
  await page.locator("#description").fill("Rascunho");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.keyboard.press("Escape");
  await expect(page.locator("#transactionDialog")).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.keyboard.press("Escape");
  await expect(page.locator("#transactionDialog")).not.toBeVisible();
  expect((await saved(page)).transactions).toHaveLength(2);
});

test("filtros, paginação, datas inválidas, edição de recorrente", async ({ page }) => {
  await populate(page);
  await navigate(page, "lancamentos");
  await expect(page.locator("#transactionRows tr")).toHaveCount(20);
  await page.locator("#nextPageBtn").click();
  await expect(page.locator("#transactionRows tr")).toHaveCount(6);
  await page.locator("#searchFilter").fill("saude");
  await expect(page.locator("#transactionRows tr")).toHaveCount(3);
  await page.locator("#searchFilter").fill("aluguel");
  await page.locator("#sortFilter").selectOption("amount-desc");
  await page.locator('#transactionRows [data-action="edit"]').first().click();
  await expect(page.locator("#account")).toHaveValue("Banco personalizado");
  await page.locator("#amount").fill("1250.20");
  await page.locator('#transactionForm button[type="submit"]').click();
  expect(
    (await saved(page)).transactions.find((item) => item.id === "expense-0")?.recurringId,
  ).toBe("rent");
  await page.locator("#toggleFiltersBtn").click();
  await page.locator("#startDateFilter").fill("2026-09-20");
  await page.locator("#endDateFilter").fill("2026-09-01");
  await expect(page.locator("#filterError")).toBeVisible();
  await expect(page.locator("#startDateFilter")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#filteredExportBtn")).toBeDisabled();
  await page.locator("#emptyActionBtn").click();
  await expect(page.locator("#filterError")).not.toBeVisible();
  await expect(page.locator("#transactionRows tr")).toHaveCount(20);
});

test("backup v2, cancelamento, erro persistente, CSV completo e PDF", async ({ page }) => {
  await populate(page);
  const before = await saved(page);
  await upload(page, { ...fixture(), transactions: [] }, false);
  expect(await saved(page)).toEqual(before);
  await upload(page, { format: "bolsario.backup", schemaVersion: 999, data: fixture() }, null);
  expect(await saved(page)).toEqual(before);
  await expect(page.locator("#operationStatus")).toContainText("versão não suportada");
  await expect(page.locator("#operationStatus")).toHaveAttribute("role", "alert");
  await page.getByRole("button", { name: "Fechar aviso" }).click();
  const download = page.waitForEvent("download");
  await fileAction(page, "backupBtn");
  const downloaded = await (await download).path();
  if (!downloaded) throw new Error("Missing JSON download");
  const backup = JSON.parse(fs.readFileSync(downloaded, "utf8"));
  expect(backup.schemaVersion).toBe(2);
  await upload(page, backup);
  expect((await saved(page)).transactions).toEqual(before.transactions);
  await navigate(page, "lancamentos");
  await page.locator("#typeFilter").selectOption("expense");
  const csvDownload = page.waitForEvent("download");
  await page.locator("#filteredExportBtn").click();
  const csvFile = await (await csvDownload).path();
  if (!csvFile) throw new Error("Missing CSV download");
  const csv = fs.readFileSync(csvFile, "utf8");
  expect(csv.trim().split("\n")).toHaveLength(26);
  expect(csv).not.toContain("Salário");
  await page.evaluate(() => {
    window.print = () => {};
  });
  await fileAction(page, "pdfBtn");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#printReport")).toBeVisible();
  await expect(page.locator(".app-shell")).not.toBeVisible();
  expect(await page.locator("#printReport").innerText()).toContain("Perfil de teste");
});

test("orçamento, recorrência, centavos de parcelas, metas e arquivo", async ({ page }) => {
  await populate(page);
  await navigate(page, "orcamento");
  await page.locator("#budgetCategory").selectOption("Mercado");
  await page.locator("#budgetPercent").fill("10");
  await page.locator('#budgetForm button[type="submit"]').click();
  expect((await saved(page)).budgets.Mercado).toBe(500);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Excluir orçamento de Mercado", exact: true }).click();
  expect((await saved(page)).budgets.Mercado).toBeUndefined();
  await navigate(page, "planejamento");
  await page.getByRole("tab", { name: "Recorrentes", exact: true }).click();
  await expect(page.locator("#installmentForm")).not.toBeVisible();
  await page.locator("#recurringDescription").fill("Internet mensal");
  await page.locator("#recurringAmount").fill("100");
  await page.locator("#recurringDay").fill("15");
  await page.locator("#recurringSubmitBtn").click();
  await page.locator("#generateRecurringBtn").click();
  const generated = (await saved(page)).transactions.length;
  await page.locator("#generateRecurringBtn").click();
  expect((await saved(page)).transactions).toHaveLength(generated);
  await page.getByRole("tab", { name: "Parcelas", exact: true }).click();
  await page.locator("#installmentDescription").fill("Compra parcelada");
  await page.locator("#installmentTotal").fill("100");
  await page.locator("#installmentCount").fill("3");
  await page.locator("#installmentSubmitBtn").click();
  const installments = (await saved(page)).transactions.filter(
    (item) => item.source === "installment",
  );
  expect(installments).toHaveLength(3);
  expect(installments.reduce((sum, item) => sum + Math.round(item.amount * 100), 0)).toBe(10000);
  await page.getByRole("tab", { name: "Metas", exact: true }).click();
  await page.locator("#goalName").fill("Reserva");
  await page.locator("#goalTargetPercent").fill("100");
  await page.locator("#goalCurrent").fill("1000");
  await page.locator("#goalSubmitBtn").click();
  expect((await saved(page)).goals).toHaveLength(1);
  await page.getByRole("tab", { name: "Previsão", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#archiveMonthBtn").click();
  expect((await saved(page)).archives).toHaveLength(1);
});

test("perfil, editor visual de categorias e remoção sem perder histórico", async ({ page }) => {
  await populate(page);
  await navigate(page, "perfil");
  await expect(page.locator(".month-picker")).not.toBeVisible();
  await page.locator("#personName").fill("Nome atualizado");
  await page.getByRole("tab", { name: "Categorias", exact: true }).click();
  await page.locator("#newCategoryName").fill("Viagem");
  await page.locator("#newCategoryName").press("Enter");
  await expect(page.getByLabel("Ícone de Viagem", { exact: true })).toBeVisible();
  await page.getByLabel("Cor de Viagem", { exact: true }).fill("#2563eb");
  await page.getByLabel("Ícone de Viagem", { exact: true }).selectOption("🚗");
  await page.locator("#newCategoryName").fill("viagem");
  await page.locator("#addCategoryBtn").click();
  await expect(page.locator("#categoryError")).toHaveText("Esta categoria já existe.");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Remover categoria Mercado", exact: true }).click();
  await page.locator('#profileForm button[type="submit"]').click();
  const state = await saved(page);
  expect(state.profile.personName).toBe("Nome atualizado");
  expect(state.profile.categories.expense).toContain("Viagem");
  expect(state.profile.categories.expense).not.toContain("Mercado");
  expect(state.profile.categoryMeta.Viagem.color).toBe("#2563eb");
  expect(state.transactions.some((item) => item.category === "Mercado")).toBe(true);
  await page.reload();
  await page.getByRole("tab", { name: "Aparência", exact: true }).click();
  await page.locator("#themeMode").selectOption("dark");
  await page.locator('#profileForm button[type="submit"]').click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("tab", { name: "Dados e backup", exact: true }).click();
  await expect(page.locator("#resetPersonBtn")).toBeVisible();
  await expect(page.locator('#profileForm button[type="submit"]')).not.toBeVisible();
});

test("teclado, subabas e navegação de mês", async ({ page }) => {
  await populate(page);
  await page.locator("#previousMonthBtn").click();
  await expect(page.locator("#monthFilter")).toHaveValue("2026-08");
  await page.locator('.annual-month[data-month="2026-09"]').click();
  await expect(page.locator("#monthFilter")).toHaveValue("2026-09");
  await expect(page.locator('#categoryLegend [role="listitem"]')).toHaveCount(9);
  await navigate(page, "planejamento");
  await page.getByRole("tab", { name: "Previsão", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Recorrentes", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Metas", exact: true })).toBeFocused();
  await page.locator("#fileMenu summary").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#fileMenu")).not.toHaveAttribute("open");
});

test("acessibilidade e nenhuma falha de JavaScript nos dois temas", async ({ page }) => {
  /** @type {string[]} */
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await populate(page);
  for (const theme of ["light", "dark"]) {
    await navigate(page, "perfil");
    await page.getByRole("tab", { name: "Aparência", exact: true }).click();
    await page.locator("#themeMode").selectOption(theme);
    await page.locator('#profileForm button[type="submit"]').click();
    for (const view of ["resumo", "lancamentos", "orcamento", "planejamento", "perfil"]) {
      await navigate(page, view);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((issue) => ({
          id: issue.id,
          nodes: issue.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});

test("screenshots e dimensões em cinco larguras, ambos os temas", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Matriz de tamanhos executada uma vez.");
  test.setTimeout(120000);
  fs.mkdirSync(shotDir, { recursive: true });
  await populate(page);
  for (const theme of ["light", "dark"]) {
    await navigate(page, "perfil");
    await page.getByRole("tab", { name: "Aparência", exact: true }).click();
    await page.locator("#themeMode").selectOption(theme);
    await page.locator('#profileForm button[type="submit"]').click();
    await expect(page.locator("#toast")).not.toHaveClass(/show/, { timeout: 7000 });
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
      for (const view of ["resumo", "lancamentos", "orcamento", "planejamento", "perfil"]) {
        await navigate(page, view);
        await page.evaluate(() => document.fonts.ready.then(() => undefined));
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(overflow, `${view}/${theme}/${width}`).toBe(false);
        expect(
          await page
            .locator(".view")
            .evaluateAll(
              (nodes) => nodes.filter((node) => node.getBoundingClientRect().width > 0).length,
            ),
        ).toBe(1);
        const badFields = await page
          .locator('input:not([type="radio"]):not([type="hidden"]), select, textarea')
          .evaluateAll((nodes) =>
            nodes
              .filter((node) => {
                const rect = node.getBoundingClientRect();
                if (!rect.width || !rect.height) return false;
                const parent = node.parentElement?.getBoundingClientRect();
                return parent && (rect.right > parent.right + 1 || rect.left < parent.left - 1);
              })
              .map((node) => node.id),
          );
        expect(badFields, `${view}/${width}`).toEqual([]);
        await page.screenshot({
          path: path.join(shotDir, `${view}-${theme}-${width}.png`),
          fullPage: true,
        });
        await page.screenshot({
          path: path.join(shotDir, `${view}-${theme}-${width}-viewport.png`),
        });
      }
    }
  }
});

test("revisão visual de subabas, formulário e estados vazios", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  fs.mkdirSync(shotDir, { recursive: true });
  const suffix = testInfo.project.name;
  for (const view of ["resumo", "lancamentos", "orcamento", "planejamento", "perfil"]) {
    await navigate(page, view);
    await page.screenshot({ path: path.join(shotDir, `empty-${view}-${suffix}.png`) });
  }
  await populate(page);
  await navigate(page, "planejamento");
  await page.getByRole("tab", { name: "Recorrentes", exact: true }).click();
  await page.locator("#recurringDescription").fill("Internet mensal");
  await page.locator("#recurringAmount").fill("99.90");
  await page.locator("#recurringSubmitBtn").click();
  await page.getByRole("tab", { name: "Parcelas", exact: true }).click();
  await page.locator("#installmentDescription").fill("Computador pessoal");
  await page.locator("#installmentTotal").fill("3600");
  await page.locator("#installmentCount").fill("12");
  await page.locator("#installmentSubmitBtn").click();
  await page.getByRole("tab", { name: "Metas", exact: true }).click();
  await page.locator("#goalName").fill("Reserva de emergência");
  await page.locator("#goalTarget").fill("15000");
  await page.locator("#goalCurrent").fill("6000");
  await page.locator("#goalSubmitBtn").click();
  for (const theme of ["light", "dark"]) {
    await navigate(page, "perfil");
    await page.getByRole("tab", { name: "Aparência", exact: true }).click();
    await page.locator("#themeMode").selectOption(theme);
    await page.locator('#profileForm button[type="submit"]').click();
    await expect(page.locator("#toast")).not.toHaveClass(/show/, { timeout: 7000 });
    for (const view of ["perfil", "planejamento"]) {
      await navigate(page, view);
      const tabs = await page.locator(`#${view} [role="tab"]`).all();
      for (const tab of tabs) {
        await tab.click();
        const id = await tab.getAttribute("id");
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          results.violations.map((issue) => ({
            id: issue.id,
            nodes: issue.nodes.map((node) => node.target),
          })),
        ).toEqual([]);
        await page.screenshot({
          path: path.join(shotDir, `${id}-${theme}-${suffix}.png`),
          fullPage: true,
        });
      }
    }
    await page.locator("#quickAddBtn").click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations.map((issue) => issue.id)).toEqual([]);
    await page.screenshot({ path: path.join(shotDir, `dialog-${theme}-${suffix}.png`) });
    await page.locator("#closeTransactionBtn").click();
  }
});

test("campos inválidos em outra subaba, rótulos longos e tela baixa", async ({
  page,
}, testInfo) => {
  await populate(page);
  await navigate(page, "perfil");
  await page.locator("#monthlyIncome").fill("-1");
  await page.getByRole("tab", { name: "Aparência", exact: true }).click();
  await page.locator('#profileForm button[type="submit"]').click();
  await expect(page.getByRole("tab", { name: "Dados pessoais", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#monthlyIncome")).toBeFocused();
  await page.locator("#monthlyIncome").fill("5000");
  await page.locator("#customAppName").fill("MeuControleFinanceiroPessoal2026");
  await page.locator('#profileForm button[type="submit"]').click();
  await expect(page.locator("#toast")).not.toHaveClass(/show/, { timeout: 7000 });
  await page.setViewportSize({ width: 320, height: 568 });
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({ path: path.join(shotDir, `long-name-${testInfo.project.name}.png`) });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await navigate(page, "resumo");
  await page.locator("#quickAddBtn").click();
  await page.locator("#description").fill("Descrição extensa de um lançamento financeiro pessoal");
  await page.locator("#amount").fill("1234567.89");
  await page.locator('#transactionForm button[type="submit"]').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(shotDir, `short-dialog-${testInfo.project.name}.png`) });
  await page.locator('#transactionForm button[type="submit"]').click();
  await navigate(page, "resumo");
  await expect(page.locator("#toast")).not.toHaveClass(/show/, { timeout: 7000 });
  await page.screenshot({ path: path.join(shotDir, `large-balance-${testInfo.project.name}.png`) });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const duplicates = await page.locator("[id]").evaluateAll((nodes) => {
    const ids = nodes.map((node) => node.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicates).toEqual([]);
});
