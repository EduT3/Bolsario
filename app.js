const STORAGE_KEY = "pierre-finance-v1";
const APP_NAME = "Bolsário";

const categories = {
  expense: [
    "Moradia",
    "Mercado",
    "Transporte",
    "Saúde",
    "Educação",
    "Lazer",
    "Assinaturas",
    "Dívidas",
    "Outros",
  ],
  income: ["Salário", "Freelance", "Vendas", "Investimentos", "Reembolso", "Outros"],
};

const palette = ["#0f766e", "#2563eb", "#b45309", "#dc2626", "#6d28d9", "#0891b2", "#15803d", "#be185d", "#475569"];

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view"),
  monthFilter: document.querySelector("#monthFilter"),
  exportBtn: document.querySelector("#exportBtn"),
  pdfBtn: document.querySelector("#pdfBtn"),
  importBtn: document.querySelector("#importBtn"),
  importFile: document.querySelector("#importFile"),
  printReport: document.querySelector("#printReport"),
  insightBox: document.querySelector("#insightBox"),
  balanceValue: document.querySelector("#balanceValue"),
  balanceHint: document.querySelector("#balanceHint"),
  incomeValue: document.querySelector("#incomeValue"),
  incomeHint: document.querySelector("#incomeHint"),
  expenseValue: document.querySelector("#expenseValue"),
  expenseHint: document.querySelector("#expenseHint"),
  savingRateValue: document.querySelector("#savingRateValue"),
  savingHint: document.querySelector("#savingHint"),
  transactionForm: document.querySelector("#transactionForm"),
  editingId: document.querySelector("#editingId"),
  formTitle: document.querySelector("#formTitle"),
  cancelEditBtn: document.querySelector("#cancelEditBtn"),
  description: document.querySelector("#description"),
  amount: document.querySelector("#amount"),
  date: document.querySelector("#date"),
  category: document.querySelector("#category"),
  account: document.querySelector("#account"),
  notes: document.querySelector("#notes"),
  typeExpense: document.querySelector("#typeExpense"),
  typeIncome: document.querySelector("#typeIncome"),
  categoryChart: document.querySelector("#categoryChart"),
  categoryLegend: document.querySelector("#categoryLegend"),
  topCategory: document.querySelector("#topCategory"),
  typeFilter: document.querySelector("#typeFilter"),
  searchFilter: document.querySelector("#searchFilter"),
  clearFiltersBtn: document.querySelector("#clearFiltersBtn"),
  transactionRows: document.querySelector("#transactionRows"),
  emptyState: document.querySelector("#emptyState"),
  budgetForm: document.querySelector("#budgetForm"),
  budgetCategory: document.querySelector("#budgetCategory"),
  budgetAmount: document.querySelector("#budgetAmount"),
  budgetList: document.querySelector("#budgetList"),
  budgetSummary: document.querySelector("#budgetSummary"),
  toast: document.querySelector("#toast"),
};

let state = loadState();

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentMonth() {
  return getTodayISO().slice(0, 7);
}

function currency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

function shortDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR").format(new Date(year, month - 1, day));
}

function monthLabel(value) {
  const [year, month] = value.split("-").map(Number);
  const label = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function seedState() {
  const month = getCurrentMonth();
  return {
    transactions: [
      {
        id: uid(),
        type: "income",
        description: "Salário",
        amount: 5200,
        category: "Salário",
        account: "Conta corrente",
        date: `${month}-05`,
        notes: "Entrada principal",
      },
      {
        id: uid(),
        type: "expense",
        description: "Aluguel",
        amount: 1450,
        category: "Moradia",
        account: "Pix",
        date: `${month}-06`,
        notes: "",
      },
      {
        id: uid(),
        type: "expense",
        description: "Compras do mês",
        amount: 730.4,
        category: "Mercado",
        account: "Cartão de crédito",
        date: `${month}-08`,
        notes: "",
      },
      {
        id: uid(),
        type: "expense",
        description: "Combustível",
        amount: 260,
        category: "Transporte",
        account: "Cartão de crédito",
        date: `${month}-11`,
        notes: "",
      },
      {
        id: uid(),
        type: "expense",
        description: "Cinema e jantar",
        amount: 190,
        category: "Lazer",
        account: "Carteira",
        date: `${month}-18`,
        notes: "",
      },
    ],
    budgets: {
      Moradia: 1600,
      Mercado: 900,
      Transporte: 420,
      Lazer: 350,
      Assinaturas: 180,
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    return {
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      budgets: parsed.budgets && typeof parsed.budgets === "object" ? parsed.budgets : {},
    };
  } catch {
    return seedState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function selectedType() {
  return document.querySelector("input[name='type']:checked").value;
}

function getViewFromHash() {
  const view = window.location.hash.replace("#", "");
  return ["resumo", "lancamentos", "orcamento"].includes(view) ? view : "resumo";
}

function setActiveView(viewName) {
  const activeView = ["resumo", "lancamentos", "orcamento"].includes(viewName) ? viewName : "resumo";

  elements.views.forEach((view) => {
    const isActive = view.dataset.view === activeView;
    view.classList.toggle("active", isActive);
    view.setAttribute("aria-hidden", String(!isActive));
  });

  elements.navItems.forEach((item) => {
    const isActive = item.getAttribute("href") === `#${activeView}`;
    item.classList.toggle("active", isActive);
    if (isActive) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  if (activeView === "resumo") {
    window.requestAnimationFrame(() => drawCategoryChart(getMonthTransactions()));
  }
}

function populateCategorySelects() {
  const type = selectedType();
  elements.category.innerHTML = categories[type].map((category) => `<option value="${category}">${category}</option>`).join("");
  elements.budgetCategory.innerHTML = categories.expense.map((category) => `<option value="${category}">${category}</option>`).join("");
}

function getMonthTransactions() {
  const month = elements.monthFilter.value || getCurrentMonth();
  return state.transactions.filter((transaction) => transaction.date.startsWith(month));
}

function getFilteredTransactions() {
  const type = elements.typeFilter.value;
  const query = elements.searchFilter.value.trim().toLowerCase();

  return getMonthTransactions()
    .filter((transaction) => type === "all" || transaction.type === type)
    .filter((transaction) => {
      if (!query) return true;
      return [transaction.description, transaction.category, transaction.account, transaction.notes]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function summarize(transactions) {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  return {
    income,
    expense,
    balance: income - expense,
    incomeCount: transactions.filter((transaction) => transaction.type === "income").length,
    expenseCount: transactions.filter((transaction) => transaction.type === "expense").length,
    savingRate: income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
  };
}

function updateMetrics(summary) {
  elements.balanceValue.textContent = currency(summary.balance);
  elements.incomeValue.textContent = currency(summary.income);
  elements.expenseValue.textContent = currency(summary.expense);
  elements.savingRateValue.textContent = `${summary.savingRate}%`;

  elements.balanceHint.textContent = summary.balance >= 0 ? "Fechamento positivo" : "Atenção ao caixa";
  elements.incomeHint.textContent = `${summary.incomeCount} ${summary.incomeCount === 1 ? "lançamento" : "lançamentos"}`;
  elements.expenseHint.textContent = `${summary.expenseCount} ${summary.expenseCount === 1 ? "lançamento" : "lançamentos"}`;
  elements.savingHint.textContent = summary.savingRate >= 20 ? "Boa margem de economia" : "Tente mirar em 20%";
}

function updateInsight(summary) {
  const budgetTotal = Object.values(state.budgets).reduce((sum, value) => sum + Number(value || 0), 0);
  const budgetUsed = summary.expense;
  const budgetRatio = budgetTotal > 0 ? Math.round((budgetUsed / budgetTotal) * 100) : 0;

  let title = `${APP_NAME} está acompanhando o seu mês`;
  let message = "Cadastre seus lançamentos e revise os limites para enxergar o dinheiro sem adivinhação.";
  let color = "var(--primary)";

  if (summary.income > 0 && summary.savingRate >= 20) {
    title = "Mês saudável até aqui";
    message = `Você guardou ${summary.savingRate}% das entradas. Mantenha os gastos essenciais sob controle.`;
    color = "var(--good)";
  } else if (summary.balance < 0) {
    title = "Saída maior que entrada";
    message = `O mês está negativo em ${currency(Math.abs(summary.balance))}. Veja as categorias mais pesadas antes de novos gastos.`;
    color = "var(--expense)";
  } else if (budgetRatio > 90) {
    title = "Orçamento quase no limite";
    message = `Você já usou ${budgetRatio}% dos limites cadastrados para este mês.`;
    color = "var(--warning)";
  } else if (summary.expense > 0) {
    title = "Controle ativo";
    message = `Foram registrados ${currency(summary.expense)} em gastos no mês selecionado.`;
  }

  elements.insightBox.style.borderLeftColor = color;
  elements.insightBox.innerHTML = `
    <div>
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
    <span class="pill">${budgetTotal > 0 ? `${budgetRatio}% do orçamento` : "Sem limites"}</span>
  `;
}

function expensesByCategory(transactions) {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});
}

function drawCategoryChart(transactions) {
  const canvas = elements.categoryChart;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.floor(rect.width * ratio));
  canvas.height = Math.floor(280 * ratio);
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, rect.width, 280);

  const entries = Object.entries(expensesByCategory(transactions)).sort((a, b) => b[1] - a[1]);
  elements.categoryLegend.innerHTML = "";

  if (!entries.length) {
    elements.topCategory.textContent = "Sem dados";
    ctx.fillStyle = "#667085";
    ctx.font = "700 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sem gastos no mês selecionado", rect.width / 2, 135);
    return;
  }

  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  const max = Math.max(...entries.map(([, value]) => value));
  const left = 126;
  const right = 22;
  const top = 18;
  const barHeight = 26;
  const gap = 16;
  const width = Math.max(120, rect.width - left - right);

  elements.topCategory.textContent = `${entries[0][0]} ${Math.round((entries[0][1] / total) * 100)}%`;

  entries.slice(0, 7).forEach(([category, value], index) => {
    const y = top + index * (barHeight + gap);
    const barWidth = (value / max) * width;
    const color = palette[index % palette.length];

    ctx.fillStyle = "#344054";
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(category, left - 12, y + 18);

    ctx.fillStyle = "#eef2f4";
    roundRect(ctx, left, y, width, barHeight, 6);
    ctx.fill();

    ctx.fillStyle = color;
    roundRect(ctx, left, y, Math.max(6, barWidth), barHeight, 6);
    ctx.fill();

    ctx.fillStyle = "#171923";
    ctx.textAlign = "left";
    ctx.font = "800 12px system-ui, sans-serif";
    ctx.fillText(currency(value), left + Math.min(barWidth + 10, width - 70), y + 18);

    const item = document.createElement("span");
    item.className = "legend-item";
    item.innerHTML = `<span class="legend-swatch" style="background:${color}"></span>${category}`;
    elements.categoryLegend.appendChild(item);
  });
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function renderTransactions() {
  const transactions = getFilteredTransactions();
  elements.transactionRows.innerHTML = "";
  elements.emptyState.classList.toggle("hidden", transactions.length > 0);

  transactions.forEach((transaction) => {
    const row = document.createElement("tr");
    const amountClass = transaction.type === "income" ? "amount-income" : "amount-expense";
    const sign = transaction.type === "income" ? "+" : "-";
    row.innerHTML = `
      <td>${shortDate(transaction.date)}</td>
      <td>
        <strong>${escapeHtml(transaction.description)}</strong>
        ${transaction.notes ? `<br><small>${escapeHtml(transaction.notes)}</small>` : ""}
      </td>
      <td>${escapeHtml(transaction.category)}</td>
      <td>${escapeHtml(transaction.account)}</td>
      <td class="number-cell ${amountClass}">${sign} ${currency(transaction.amount)}</td>
      <td class="action-cell">
        <div class="row-actions">
          <button class="row-action" type="button" title="Editar" aria-label="Editar" data-action="edit" data-id="${transaction.id}">
            <svg viewBox="0 0 24 24"><path d="m4 16.7-.7 4 4-.7L18.9 8.4l-3.3-3.3L4 16.7Zm13-13 3.3 3.3 1.2-1.2a2.3 2.3 0 0 0-3.3-3.3L17 3.7Z" /></svg>
          </button>
          <button class="row-action" type="button" title="Excluir" aria-label="Excluir" data-action="delete" data-id="${transaction.id}">
            <svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h5v2H3V5h5l1-2Zm-3 6h12l-1 12H7L6 9Zm4 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z" /></svg>
          </button>
        </div>
      </td>
    `;
    elements.transactionRows.appendChild(row);
  });
}

function renderBudgets(transactions) {
  const spending = expensesByCategory(transactions);
  const entries = Object.entries(state.budgets)
    .filter(([, limit]) => Number(limit) > 0)
    .sort((a, b) => a[0].localeCompare(b[0]));

  elements.budgetSummary.textContent = `${entries.length} ${entries.length === 1 ? "categoria" : "categorias"}`;
  elements.budgetList.innerHTML = "";

  if (!entries.length) {
    elements.budgetList.innerHTML = `
      <div class="empty-state">
        <strong>Nenhum orçamento cadastrado.</strong>
        <span>Defina limites para comparar o planejado com o realizado.</span>
      </div>
    `;
    return;
  }

  entries.forEach(([category, limit]) => {
    const used = spending[category] || 0;
    const percent = limit > 0 ? Math.round((used / limit) * 100) : 0;
    const item = document.createElement("article");
    item.className = "budget-item";
    const severity = percent >= 100 ? "danger" : percent >= 80 ? "warn" : "";
    item.innerHTML = `
      <div class="budget-item-header">
        <span class="budget-item-title">${escapeHtml(category)}</span>
        <div class="budget-item-meta">
          <span class="budget-item-amount">${currency(used)} de ${currency(limit)}</span>
          <button class="row-action budget-delete" type="button" title="Excluir orçamento" aria-label="Excluir orçamento de ${escapeHtml(category)}" data-category="${escapeHtml(category)}">
            <svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h5v2H3V5h5l1-2Zm-3 6h12l-1 12H7L6 9Zm4 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z" /></svg>
          </button>
        </div>
      </div>
      <div class="progress" aria-label="${percent}% usado em ${escapeHtml(category)}">
        <div class="progress-bar ${severity}" style="width:${Math.min(percent, 100)}%"></div>
      </div>
      <small>${percent}% usado${percent > 100 ? `, passou ${currency(used - limit)}` : ""}</small>
    `;
    elements.budgetList.appendChild(item);
  });
}

function render() {
  const monthTransactions = getMonthTransactions();
  const summary = summarize(monthTransactions);
  updateMetrics(summary);
  updateInsight(summary);
  drawCategoryChart(monthTransactions);
  renderTransactions();
  renderBudgets(monthTransactions);
}

function resetForm() {
  elements.transactionForm.reset();
  elements.editingId.value = "";
  elements.date.value = getTodayISO();
  elements.typeExpense.checked = true;
  elements.formTitle.textContent = "Adicionar gasto ou entrada";
  elements.cancelEditBtn.classList.add("hidden");
  populateCategorySelects();
}

function handleTransactionSubmit(event) {
  event.preventDefault();
  const formData = new FormData(elements.transactionForm);
  const type = selectedType();
  const transaction = {
    id: elements.editingId.value || uid(),
    type,
    description: String(formData.get("description")).trim(),
    amount: Number(formData.get("amount")),
    category: String(formData.get("category")),
    account: String(formData.get("account")),
    date: String(formData.get("date")),
    notes: String(formData.get("notes") || "").trim(),
  };

  if (!transaction.description || !transaction.amount || transaction.amount <= 0 || !transaction.date) {
    showToast("Preencha descrição, valor e data.");
    return;
  }

  if (elements.editingId.value) {
    state.transactions = state.transactions.map((item) => (item.id === transaction.id ? transaction : item));
    showToast("Lançamento atualizado.");
  } else {
    state.transactions.push(transaction);
    showToast("Lançamento salvo.");
  }

  saveState();
  resetForm();
  render();
}

function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const transaction = state.transactions.find((item) => item.id === button.dataset.id);
  if (!transaction) return;

  if (button.dataset.action === "delete") {
    const confirmed = window.confirm(`Excluir "${transaction.description}"?`);
    if (!confirmed) return;
    state.transactions = state.transactions.filter((item) => item.id !== transaction.id);
    saveState();
    showToast("Lançamento excluído.");
    render();
    return;
  }

  elements.editingId.value = transaction.id;
  elements.formTitle.textContent = "Editar lançamento";
  elements.cancelEditBtn.classList.remove("hidden");
  elements.typeExpense.checked = transaction.type === "expense";
  elements.typeIncome.checked = transaction.type === "income";
  populateCategorySelects();
  elements.description.value = transaction.description;
  elements.amount.value = transaction.amount;
  elements.date.value = transaction.date;
  elements.category.value = transaction.category;
  elements.account.value = transaction.account;
  elements.notes.value = transaction.notes || "";
  elements.transactionForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleBudgetSubmit(event) {
  event.preventDefault();
  const category = elements.budgetCategory.value;
  const amount = Number(elements.budgetAmount.value);

  if (!category || amount < 0) {
    showToast("Informe um limite válido.");
    return;
  }

  if (amount === 0) {
    delete state.budgets[category];
  } else {
    state.budgets[category] = amount;
  }

  elements.budgetAmount.value = "";
  saveState();
  showToast(amount === 0 ? "Orçamento removido." : "Orçamento salvo.");
  render();
}

function handleBudgetListClick(event) {
  const button = event.target.closest(".budget-delete");
  if (!button) return;

  const category = button.dataset.category;
  if (!Object.prototype.hasOwnProperty.call(state.budgets, category)) return;

  const confirmed = window.confirm(`Excluir orçamento de "${category}"?`);
  if (!confirmed) return;

  delete state.budgets[category];
  saveState();
  showToast("Orçamento excluído.");
  render();
}

function exportCsv() {
  const rows = [
    ["data", "tipo", "descricao", "categoria", "conta", "valor", "observacao"],
    ...state.transactions
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((transaction) => [
        transaction.date,
        transaction.type === "income" ? "entrada" : "gasto",
        transaction.description,
        transaction.category,
        transaction.account,
        transaction.amount.toFixed(2),
        transaction.notes || "",
      ]),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(";")).join("\n");
  downloadFile(`bolsario-lancamentos-${getTodayISO()}.csv`, csv, "text/csv;charset=utf-8");

  const backup = JSON.stringify(state, null, 2);
  setTimeout(() => downloadFile(`bolsario-backup-${getTodayISO()}.json`, backup, "application/json"), 250);
  showToast("Exportei CSV e backup JSON.");
}

function exportPdf() {
  const month = elements.monthFilter.value || getCurrentMonth();
  const transactions = getMonthTransactions().slice().sort((a, b) => a.date.localeCompare(b.date));
  const summary = summarize(transactions);
  const categoryEntries = Object.entries(expensesByCategory(transactions)).sort((a, b) => b[1] - a[1]);
  const budgetEntries = Object.entries(state.budgets)
    .filter(([, limit]) => Number(limit) > 0)
    .sort((a, b) => a[0].localeCompare(b[0]));

  elements.printReport.innerHTML = `
    <header class="print-header">
      <div>
        <p>Relatório financeiro mensal</p>
        <h1>${APP_NAME}</h1>
        <span>${monthLabel(month)} • Gerado em ${shortDate(getTodayISO())}</span>
      </div>
      <strong>Arquivo para conferência pessoal</strong>
    </header>

    <section class="print-metrics">
      <article><span>Saldo</span><strong>${currency(summary.balance)}</strong></article>
      <article><span>Entradas</span><strong>${currency(summary.income)}</strong></article>
      <article><span>Gastos</span><strong>${currency(summary.expense)}</strong></article>
      <article><span>Economia</span><strong>${summary.savingRate}%</strong></article>
    </section>

    <section class="print-section">
      <h2>Gastos por categoria</h2>
      ${renderReportTable(
        ["Categoria", "Valor", "Participação"],
        categoryEntries.map(([category, value]) => [
          escapeHtml(category),
          currency(value),
          `${Math.round((value / Math.max(summary.expense, 1)) * 100)}%`,
        ]),
        "Sem gastos no mês selecionado."
      )}
    </section>

    <section class="print-section">
      <h2>Orçamento</h2>
      ${renderReportTable(
        ["Categoria", "Gasto", "Limite", "Uso"],
        budgetEntries.map(([category, limit]) => {
          const used = categoryEntries.find(([name]) => name === category)?.[1] || 0;
          return [
            escapeHtml(category),
            currency(used),
            currency(Number(limit)),
            `${Math.round((used / Number(limit)) * 100)}%`,
          ];
        }),
        "Nenhum orçamento cadastrado."
      )}
    </section>

    <section class="print-section">
      <h2>Lançamentos</h2>
      ${renderReportTable(
        ["Data", "Tipo", "Descrição", "Categoria", "Conta", "Valor"],
        transactions.map((transaction) => [
          shortDate(transaction.date),
          transaction.type === "income" ? "Entrada" : "Gasto",
          escapeHtml(transaction.description),
          escapeHtml(transaction.category),
          escapeHtml(transaction.account),
          `${transaction.type === "income" ? "+" : "-"} ${currency(transaction.amount)}`,
        ]),
        "Nenhum lançamento encontrado para este mês."
      )}
    </section>
  `;

  document.body.classList.add("printing-report");
  const cleanup = () => {
    document.body.classList.remove("printing-report");
    elements.printReport.innerHTML = "";
  };

  window.addEventListener("afterprint", cleanup, { once: true });
  window.setTimeout(() => {
    if (document.body.classList.contains("printing-report")) cleanup();
  }, 60000);
  window.requestAnimationFrame(() => window.print());
  showToast("Relatório pronto para salvar como PDF.");
}

function renderReportTable(headers, rows, emptyMessage) {
  if (!rows.length) {
    return `<p class="print-empty">${emptyMessage}</p>`;
  }

  return `
    <table>
      <thead>
        <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows
          .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
          .join("")}
      </tbody>
    </table>
  `;
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!Array.isArray(parsed.transactions) || typeof parsed.budgets !== "object") {
        throw new Error("Formato inválido");
      }
      state = {
        transactions: parsed.transactions.map((transaction) => ({
          ...transaction,
          id: transaction.id || uid(),
          amount: Number(transaction.amount),
        })),
        budgets: parsed.budgets || {},
      };
      saveState();
      showToast("Backup importado.");
      render();
    } catch {
      showToast("Não consegui importar este arquivo JSON.");
    } finally {
      elements.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function bindEvents() {
  elements.navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const view = item.getAttribute("href").replace("#", "");
      history.pushState(null, "", `#${view}`);
      setActiveView(view);
    });
  });
  document.querySelectorAll("input[name='type']").forEach((input) => {
    input.addEventListener("change", populateCategorySelects);
  });
  window.addEventListener("hashchange", () => setActiveView(getViewFromHash()));
  elements.monthFilter.addEventListener("change", render);
  elements.typeFilter.addEventListener("change", renderTransactions);
  elements.searchFilter.addEventListener("input", renderTransactions);
  elements.clearFiltersBtn.addEventListener("click", () => {
    elements.typeFilter.value = "all";
    elements.searchFilter.value = "";
    renderTransactions();
  });
  elements.transactionForm.addEventListener("submit", handleTransactionSubmit);
  elements.cancelEditBtn.addEventListener("click", resetForm);
  elements.transactionRows.addEventListener("click", handleTableClick);
  elements.budgetForm.addEventListener("submit", handleBudgetSubmit);
  elements.budgetList.addEventListener("click", handleBudgetListClick);
  elements.exportBtn.addEventListener("click", exportCsv);
  elements.pdfBtn.addEventListener("click", exportPdf);
  elements.importBtn.addEventListener("click", () => elements.importFile.click());
  elements.importFile.addEventListener("change", (event) => importJson(event.target.files[0]));
  window.addEventListener("resize", () => drawCategoryChart(getMonthTransactions()));
}

function init() {
  elements.monthFilter.value = getCurrentMonth();
  elements.date.value = getTodayISO();
  populateCategorySelects();
  bindEvents();
  render();
  setActiveView(getViewFromHash());
}

init();
