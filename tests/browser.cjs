const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const artifacts = path.join(root, "artifacts");
const checks = [];
const check = (name) => { checks.push(name); console.log(`OK: ${name}`); };

async function main() {
  fs.mkdirSync(artifacts, { recursive: true });
  const browser = await chromium.launch({ channel: process.env.BOLSARIO_BROWSER_CHANNEL || "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "pt-BR", reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const persisted = () => page.evaluate(() => localStorage.getItem("pierre-finance-v1"));
  const transactions = async () => JSON.parse(await persisted()).transactions;
  const upload = async (payload, accept = true) => {
    if (accept !== null) page.once("dialog", (dialog) => accept ? dialog.accept() : dialog.dismiss());
    await page.locator("#importFile").setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(payload)) });
    await page.waitForFunction(() => document.querySelector("#importFile").value === "");
  };
  try {
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    await page.locator("#skipSetupBtn").click();
    assert.equal(await page.locator(".view.active").count(), 1);
    assert.equal((await transactions()).length, 0);
    check("Primeiro acesso zerado e apenas uma aba visivel");

    await page.locator("#quickAddBtn").click();
    await page.locator('label[for="typeIncome"]').click();
    assert.equal(await page.locator("#category").inputValue(), "Salário");
    assert.equal(await page.locator('#category option[value="[object Event]"]').count(), 0);
    await page.locator("#description").fill("Salário de teste");
    await page.locator("#amount").fill("3000.10");
    await page.locator('#transactionForm button[type="submit"]').click();
    assert.equal(await page.locator("#category").inputValue(), "Moradia");
    await page.reload();
    assert.equal((await transactions())[0].amount, 3000.1);
    check("Troca de tipo sem categoria invalida e persistencia apos atualizar");

    await page.locator('a[href="#lancamentos"]').click();
    await page.locator('[data-action="duplicate"]').click();
    assert.equal(await page.locator("#editingId").inputValue(), "");
    assert.equal((await transactions()).length, 1);
    await page.locator("#description").fill("Cópia manual");
    await page.locator('#transactionForm button[type="submit"]').click();
    assert.equal((await transactions()).length, 2);
    assert.equal((await transactions())[1].source, "manual");
    await page.locator('[data-action="edit"]').first().click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator('[data-action="delete"]').first().click();
    assert.equal(await page.locator("#editingId").inputValue(), "");
    assert.equal((await transactions()).length, 1);
    await page.locator("#toastUndoBtn").click();
    assert.equal((await transactions()).length, 2);
    check("Duplicacao revisavel, exclusao durante edicao e desfazer");

    const month = await page.locator("#monthFilter").inputValue();
    await page.locator("#previousMonthBtn").click();
    assert.notEqual(await page.locator("#monthFilter").inputValue(), month);
    const previousMonth = await page.locator("#monthFilter").inputValue();
    await page.locator("#description").fill("Entrada do mês anterior");
    await page.locator('label[for="typeIncome"]').click();
    await page.locator("#amount").fill("100");
    await page.locator("#date").fill(`${previousMonth}-01`);
    await page.locator('#transactionForm button[type="submit"]').click();
    await page.locator("#currentMonthBtn").click();
    assert.equal(await page.locator("#monthFilter").inputValue(), month);
    assert.match(await page.locator("#monthComparison").textContent(), /5\.900,20/);
    check("Navegacao mensal, retorno ao mes atual e diferenca calculada entre meses");

    const fixture = {
      profile: { personName: "Perfil de teste", setupComplete: true, monthlyIncome: 5000 },
      budgets: { Mercado: 500 }, recurring: [], installments: [], goals: [], archives: [],
      transactions: Array.from({ length: 26 }, (_, index) => ({
        id: `fixture-${index}`, type: index === 0 ? "income" : "expense", description: index === 0 ? "Salário" : `Saúde ${String(index).padStart(2, "0")}`,
        amount: index === 0 ? 5000 : index + 0.25, date: `${month}-${String(index + 1).padStart(2, "0")}`,
        category: index === 0 ? "Salário" : "Mercado", account: "Banco personalizado", notes: "Teste isolado",
        source: index === 1 ? "recurring" : "manual", recurringId: index === 1 ? "recurrence-1" : "",
      })),
    };
    const beforeCancel = await persisted();
    await upload(fixture, false);
    assert.equal(await persisted(), beforeCancel);
    await upload(fixture);
    assert.equal((await transactions()).length, 26);
    assert.equal(await page.locator("#transactionRows tr").count(), 20);
    assert.match(await page.locator("#filteredSummary").innerText(), /26/);
    await page.locator("#nextPageBtn").click();
    assert.equal(await page.locator("#transactionRows tr").count(), 6);
    await page.locator("#searchFilter").fill("saude");
    assert.match(await page.locator("#pageInfo").innerText(), /1–20 de 25/);
    await page.locator("#sortFilter").selectOption("amount-asc");
    assert.match(await page.locator("#transactionRows tr").first().innerText(), /1,25/);
    await page.locator('[data-action="edit"]').first().click();
    assert.equal(await page.locator("#account").inputValue(), "Banco personalizado");
    await page.locator("#amount").fill("1.50");
    await page.locator('#transactionForm button[type="submit"]').click();
    assert.equal((await transactions()).find((item) => item.id === "fixture-1").recurringId, "recurrence-1");
    check("Importacao cancelavel, conta personalizada, origem preservada, paginacao e busca sem acento");

    await page.locator("#startDateFilter").fill(`${month}-20`);
    await page.locator("#endDateFilter").fill(`${month}-01`);
    assert.equal(await page.locator("#filterError").isVisible(), true);
    assert.equal(await page.locator("#filteredExportBtn").isDisabled(), true);
    await page.locator("#clearFiltersBtn").click();
    const beforeFuture = await persisted();
    await upload({ format: "bolsario.backup", schemaVersion: 999, data: fixture }, null);
    assert.equal(await persisted(), beforeFuture);
    assert.match(await page.locator("#toastMessage").innerText(), /versão não suportada/);
    check("Intervalo invalido sinalizado e backup futuro rejeitado sem alterar dados");

    const backupDownload = page.waitForEvent("download");
    await page.locator("#backupBtn").click();
    const backupFile = await backupDownload;
    const backupPayload = JSON.parse(fs.readFileSync(await backupFile.path(), "utf8"));
    assert.equal(backupPayload.schemaVersion, 2);
    assert.equal(backupPayload.data.transactions.length, 26);
    await page.locator("#typeFilter").selectOption("expense");
    const csvDownload = page.waitForEvent("download");
    await page.locator("#filteredExportBtn").click();
    const csvFile = await csvDownload;
    const csv = fs.readFileSync(await csvFile.path(), "utf8");
    assert.equal(csv.trim().split("\n").length, 26);
    assert.equal(csv.includes("Salário"), false);
    await upload(backupPayload);
    assert.deepEqual(JSON.parse(await persisted()).transactions, backupPayload.data.transactions);
    check("Backup JSON v2 round-trip e CSV de todos os resultados, alem da pagina visivel");

    await page.locator('a[href="#planejamento"]').click();
    await page.locator("#recurringDescription").fill("Aluguel automático");
    await page.locator("#recurringAmount").fill("150");
    await page.locator("#recurringDay").fill("15");
    await page.locator("#recurringSubmitBtn").click();
    await page.locator("#generateRecurringBtn").click();
    const afterGeneration = (await transactions()).length;
    await page.locator("#generateRecurringBtn").click();
    assert.equal((await transactions()).length, afterGeneration);
    await page.locator("#installmentDescription").fill("Compra de teste");
    await page.locator("#installmentTotal").fill("0.01");
    await page.locator("#installmentCount").fill("3");
    await page.locator("#installmentSubmitBtn").click();
    assert.equal((await transactions()).length, afterGeneration);
    await page.locator("#installmentTotal").fill("100");
    await page.locator("#installmentSubmitBtn").click();
    const installmentRows = (await transactions()).filter((item) => item.source === "installment");
    assert.equal(installmentRows.length, 3);
    assert.equal(installmentRows.reduce((sum, item) => sum + Math.round(item.amount * 100), 0), 10000);
    check("Recorrencia sem gerar duplicatas e parcelamento com total exato, sem parcelas zeradas");

    await page.locator('a[href="#lancamentos"]').click();
    await page.locator("#searchFilter").fill("Aluguel automático");
    await page.locator('[data-action="duplicate"]').click();
    await page.locator("#description").fill("Cópia de recorrente");
    await page.locator('#transactionForm button[type="submit"]').click();
    const copied = (await transactions()).find((item) => item.description === "Cópia de recorrente");
    assert.equal(copied.source, "manual");
    assert.equal(copied.recurringId, "");
    check("Duplicar uma recorrencia cria lancamento manual sem vinculo automatico");

    const originalPrint = await page.evaluate(() => {
      window.__originalPrint = window.print;
      window.print = () => {};
      return true;
    });
    await page.locator("#pdfBtn").click();
    assert.match(await page.locator("#printReport").textContent(), /Relatório financeiro mensal/);
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator(".app-shell").isVisible(), false);
    assert.equal(await page.locator("#printReport").isVisible(), true);
    await page.evaluate(() => { window.dispatchEvent(new Event("afterprint")); window.print = window.__originalPrint; });
    await page.emulateMedia({ media: "screen" });
    assert.equal(await page.locator(".app-shell").isVisible(), true);
    assert.ok(originalPrint);
    check("Relatorio mensal e estilos de impressao preservados (dialogo nativo nao testado)");

    for (const viewport of [{ width: 1440, height: 1000 }, { width: 1024, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
      await page.setViewportSize(viewport);
      for (const view of ["resumo", "lancamentos", "orcamento", "planejamento", "perfil"]) {
        await page.locator(`a[href="#${view}"]`).click();
        await page.evaluate(() => window.scrollTo(0, 0));
        assert.equal(await page.locator(".view.active").count(), 1);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 1) {
          console.log(await page.evaluate(() => [...document.querySelectorAll("main, .view-stack, .view.active, .view.active section, .view.active form")].map((el) => ({ tag: el.tagName, id: el.id, className: el.className, width: el.getBoundingClientRect().width, grid: getComputedStyle(el).gridTemplateColumns }))));
          console.log(await page.evaluate(() => [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > innerWidth && !el.closest(".table-wrap")).map((el) => ({ tag: el.tagName, id: el.id, className: el.className, right: el.getBoundingClientRect().right, position: getComputedStyle(el).position })).slice(0, 20)));
          await page.screenshot({ path: path.join(artifacts, "overflow.png"), fullPage: true });
        }
        assert.ok(overflow <= 1, `${view} at ${viewport.width}: overflow ${overflow}`);
        const outsideInputs = await page.evaluate(() => [...document.querySelectorAll(".view.active .form-row input, .view.active .form-row select")].filter((input) => input.getBoundingClientRect().width && input.getBoundingClientRect().right > input.parentElement.getBoundingClientRect().right + 1).map((input) => input.id));
        assert.deepEqual(outsideInputs, [], `Campos fora do formulario: ${view} at ${viewport.width}`);
        if (view === "resumo") {
          assert.ok(await page.evaluate(() => {
            const canvas = document.querySelector("#categoryChart");
            const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
            return pixels.some((value, index) => index % 4 === 3 && value > 0);
          }), "Grafico precisa ter pixels desenhados");
        }
        if (view === "resumo" || view === "lancamentos") await page.screenshot({ path: path.join(artifacts, `${view}-${viewport.width}.png`), fullPage: true });
      }
    }
    check("Cinco abas sem overflow em 1440, 1024, 768, 390 e 320 px; campos contidos e grafico desenhado");
    await page.locator("#themeMode").selectOption("dark");
    await page.locator('#profileForm button[type="submit"]').click();
    await page.locator('a[href="#resumo"]').click();
    await page.screenshot({ path: path.join(artifacts, "resumo-dark-320.png"), fullPage: true });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    assert.deepEqual(errors, []);
    check("Tema escuro e nenhum erro JavaScript no navegador");
    fs.writeFileSync(path.join(artifacts, "browser-results.json"), JSON.stringify({ checks, errors }, null, 2));
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
