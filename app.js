const STORAGE_KEY = "pierre-finance-v1";
const APP_ID = "bolsario";
const BACKUP_FORMAT = "bolsario.backup";
const BACKUP_SCHEMA_VERSION = 2;
const CSV_SCHEMA_VERSION = 2;
const DEFAULT_APP_NAME = "Bolsário";
const VIEWS = ["resumo", "lancamentos", "orcamento", "planejamento", "perfil"];

const defaultCategories = {
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

const accountOptions = ["Carteira", "Conta corrente", "Cartão de crédito", "Pix", "Investimentos"];

const defaultCategoryMeta = {
  Moradia: { icon: "🏠", color: "#0f766e" },
  Mercado: { icon: "🛒", color: "#15803d" },
  Transporte: { icon: "🚗", color: "#2563eb" },
  Saúde: { icon: "❤️", color: "#dc2626" },
  Educação: { icon: "📚", color: "#6d28d9" },
  Lazer: { icon: "🎟️", color: "#be185d" },
  Assinaturas: { icon: "🔁", color: "#0891b2" },
  Dívidas: { icon: "⚠️", color: "#b45309" },
  Outros: { icon: "•", color: "#475569" },
  Salário: { icon: "💼", color: "#2563eb" },
  Freelance: { icon: "🧩", color: "#0891b2" },
  Vendas: { icon: "🏷️", color: "#15803d" },
  Investimentos: { icon: "📈", color: "#6d28d9" },
  Reembolso: { icon: "↩️", color: "#0f766e" },
};

const accentMap = {
  "#0f766e": "#115e59",
  "#2563eb": "#1d4ed8",
  "#6d28d9": "#5b21b6",
  "#be185d": "#9d174d",
  "#b45309": "#92400e",
};

const goalHeadlines = {
  "Controlar gastos": "Organize o mês antes que ele organize você.",
  "Guardar dinheiro": "Dê destino ao dinheiro antes que ele desapareça.",
  "Quitar dívidas": "Veja o caminho da saída com números na mesa.",
  "Organizar renda variável": "Transforme renda irregular em um plano claro.",
  "Planejar uma compra": "Acompanhe o presente sem perder a compra do radar.",
};

const elements = {
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view"),
  brandMark: document.querySelector("#brandMark"),
  appNameLabel: document.querySelector("#appNameLabel"),
  brandTitle: document.querySelector("#brandTitle"),
  topbarEyebrow: document.querySelector("#topbarEyebrow"),
  topbarTitle: document.querySelector("#topbarTitle"),
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
  yearIncomeValue: document.querySelector("#yearIncomeValue"),
  yearExpenseValue: document.querySelector("#yearExpenseValue"),
  yearBalanceValue: document.querySelector("#yearBalanceValue"),
  yearSavingRateValue: document.querySelector("#yearSavingRateValue"),
  annualYearLabel: document.querySelector("#annualYearLabel"),
  annualMonthList: document.querySelector("#annualMonthList"),
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
  categoryFilter: document.querySelector("#categoryFilter"),
  accountFilter: document.querySelector("#accountFilter"),
  startDateFilter: document.querySelector("#startDateFilter"),
  endDateFilter: document.querySelector("#endDateFilter"),
  searchFilter: document.querySelector("#searchFilter"),
  clearFiltersBtn: document.querySelector("#clearFiltersBtn"),
  transactionRows: document.querySelector("#transactionRows"),
  emptyState: document.querySelector("#emptyState"),
  budgetForm: document.querySelector("#budgetForm"),
  budgetCategory: document.querySelector("#budgetCategory"),
  budgetAmount: document.querySelector("#budgetAmount"),
  budgetPercent: document.querySelector("#budgetPercent"),
  budgetList: document.querySelector("#budgetList"),
  budgetSummary: document.querySelector("#budgetSummary"),
  archiveMonthBtn: document.querySelector("#archiveMonthBtn"),
  archiveList: document.querySelector("#archiveList"),
  recurringForm: document.querySelector("#recurringForm"),
  recurringType: document.querySelector("#recurringType"),
  recurringDay: document.querySelector("#recurringDay"),
  recurringDescription: document.querySelector("#recurringDescription"),
  recurringAmount: document.querySelector("#recurringAmount"),
  recurringPercent: document.querySelector("#recurringPercent"),
  recurringCategory: document.querySelector("#recurringCategory"),
  recurringAccount: document.querySelector("#recurringAccount"),
  recurringNotes: document.querySelector("#recurringNotes"),
  generateRecurringBtn: document.querySelector("#generateRecurringBtn"),
  recurringList: document.querySelector("#recurringList"),
  installmentForm: document.querySelector("#installmentForm"),
  installmentDescription: document.querySelector("#installmentDescription"),
  installmentTotal: document.querySelector("#installmentTotal"),
  installmentCount: document.querySelector("#installmentCount"),
  installmentStartMonth: document.querySelector("#installmentStartMonth"),
  installmentCategory: document.querySelector("#installmentCategory"),
  installmentAccount: document.querySelector("#installmentAccount"),
  installmentNotes: document.querySelector("#installmentNotes"),
  installmentList: document.querySelector("#installmentList"),
  goalForm: document.querySelector("#goalForm"),
  goalName: document.querySelector("#goalName"),
  goalTarget: document.querySelector("#goalTarget"),
  goalTargetPercent: document.querySelector("#goalTargetPercent"),
  goalCurrent: document.querySelector("#goalCurrent"),
  goalCurrentPercent: document.querySelector("#goalCurrentPercent"),
  goalDueDate: document.querySelector("#goalDueDate"),
  goalsList: document.querySelector("#goalsList"),
  profileForm: document.querySelector("#profileForm"),
  personName: document.querySelector("#personName"),
  customAppName: document.querySelector("#customAppName"),
  profileGoal: document.querySelector("#profileGoal"),
  monthlyIncome: document.querySelector("#monthlyIncome"),
  themeMode: document.querySelector("#themeMode"),
  expenseCategories: document.querySelector("#expenseCategories"),
  incomeCategories: document.querySelector("#incomeCategories"),
  categoryVisuals: document.querySelector("#categoryVisuals"),
  resetPersonBtn: document.querySelector("#resetPersonBtn"),
  previewMark: document.querySelector("#previewMark"),
  previewAppName: document.querySelector("#previewAppName"),
  previewPersonName: document.querySelector("#previewPersonName"),
  previewGoal: document.querySelector("#previewGoal"),
  previewIncome: document.querySelector("#previewIncome"),
  previewCategories: document.querySelector("#previewCategories"),
  setupGate: document.querySelector("#setupGate"),
  setupForm: document.querySelector("#setupForm"),
  setupName: document.querySelector("#setupName"),
  setupGoal: document.querySelector("#setupGoal"),
  setupIncome: document.querySelector("#setupIncome"),
  skipSetupBtn: document.querySelector("#skipSetupBtn"),
  toast: document.querySelector("#toast"),
};

let state = loadState();
let chartFrame = 0;

function getTodayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentMonth() {
  return getTodayISO().slice(0, 7);
}

function isValidISODate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return false;

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function isValidMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(value || ""));
  if (!match) return false;
  const month = Number(match[2]);
  return month >= 1 && month <= 12;
}

function currency(value) {
  const amount = Number(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(amount) ? amount : 0);
}

function hasInputValue(value) {
  return String(value ?? "").trim() !== "";
}

function roundMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : Number.NaN;
}

function getMonthlyIncomeValue() {
  const income = Number(getProfile().monthlyIncome);
  return Number.isFinite(income) && income > 0 ? income : 0;
}

function resolveAmountFromInputs(amountInput, percentInput) {
  if (hasInputValue(percentInput)) {
    const percent = Number(percentInput);
    const income = getMonthlyIncomeValue();
    return {
      amount: Number.isFinite(percent) && percent >= 0 && income > 0 ? roundMoney((income * percent) / 100) : Number.NaN,
      usesPercent: true,
    };
  }

  return {
    amount: Number(amountInput),
    usesPercent: false,
  };
}

function resolveOptionalAmountFromInputs(amountInput, percentInput) {
  if (hasInputValue(percentInput)) return resolveAmountFromInputs(amountInput, percentInput);

  return {
    amount: hasInputValue(amountInput) ? Number(amountInput) : 0,
    usesPercent: false,
  };
}

function incomePercentLabel(value) {
  const income = getMonthlyIncomeValue();
  const amount = Number(value);
  if (!income || !Number.isFinite(amount) || amount <= 0) return "";

  const percent = (amount / income) * 100;
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(percent)}% da renda`;
}

function shortDate(value) {
  if (!isValidISODate(value)) return "Data inválida";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR").format(new Date(year, month - 1, day));
}

function monthLabel(value) {
  const validValue = isValidMonth(value) ? value : getCurrentMonth();
  const [year, month] = validValue.split("-").map(Number);
  const label = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function yearFromMonth(value) {
  return String(isValidMonth(value) ? value : getCurrentMonth()).slice(0, 4);
}

function addMonths(monthValue, amount) {
  const validValue = isValidMonth(monthValue) ? monthValue : getCurrentMonth();
  const [year, month] = validValue.split("-").map(Number);
  const date = new Date(year, month - 1 + amount, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function daysInMonth(monthValue) {
  const validValue = isValidMonth(monthValue) ? monthValue : getCurrentMonth();
  const [year, month] = validValue.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function dateForMonthDay(monthValue, day) {
  const validValue = isValidMonth(monthValue) ? monthValue : getCurrentMonth();
  const cleanDay = Math.min(Math.max(Number(day) || 1, 1), daysInMonth(validValue));
  return `${validValue}-${String(cleanDay).padStart(2, "0")}`;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeId(value) {
  const id = String(value || "").trim();
  return /^[a-zA-Z0-9_-]+$/.test(id) ? id : uid();
}

function uniqueList(items, fallback = []) {
  const list = items.map((item) => String(item).trim()).filter(Boolean);
  const unique = [...new Set(list)];
  return unique.length ? unique : fallback.slice();
}

function isHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(String(value || "").trim());
}

function normalizeCategoryMeta(meta = {}) {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return { ...defaultCategoryMeta };

  const clean = { ...defaultCategoryMeta };
  Object.entries(meta).forEach(([category, value]) => {
    const cleanCategory = String(category || "").trim();
    if (!cleanCategory || !value || typeof value !== "object" || Array.isArray(value)) return;

    const fallback = clean[cleanCategory] || { icon: "•", color: "#475569" };
    clean[cleanCategory] = {
      icon: String(value.icon || fallback.icon || "•").trim().slice(0, 4) || "•",
      color: isHexColor(value.color) ? String(value.color).trim() : fallback.color,
    };
  });

  return clean;
}

function createDefaultProfile() {
  return {
    personName: "",
    appName: DEFAULT_APP_NAME,
    goal: "Controlar gastos",
    monthlyIncome: "",
    theme: "light",
    accent: "#0f766e",
    setupComplete: false,
    categories: {
      expense: defaultCategories.expense.slice(),
      income: defaultCategories.income.slice(),
    },
    categoryMeta: normalizeCategoryMeta(defaultCategoryMeta),
  };
}

function normalizeProfile(profile = {}) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    profile = {};
  }
  const defaults = createDefaultProfile();
  const categories = profile.categories && typeof profile.categories === "object" && !Array.isArray(profile.categories) ? profile.categories : {};
  const monthlyIncome = Number(profile.monthlyIncome);
  const categoryMeta = normalizeCategoryMeta(profile.categoryMeta);

  return {
    ...defaults,
    ...profile,
    personName: String(profile.personName || "").trim(),
    appName: String(profile.appName || defaults.appName).trim() || defaults.appName,
    goal: goalHeadlines[profile.goal] ? profile.goal : defaults.goal,
    monthlyIncome: Number.isFinite(monthlyIncome) && monthlyIncome > 0 ? monthlyIncome : "",
    theme: profile.theme === "dark" ? "dark" : "light",
    accent: accentMap[profile.accent] ? profile.accent : defaults.accent,
    setupComplete: Boolean(profile.setupComplete),
    categories: {
      expense: uniqueList(Array.isArray(categories.expense) ? categories.expense : [], defaults.categories.expense),
      income: uniqueList(Array.isArray(categories.income) ? categories.income : [], defaults.categories.income),
    },
    categoryMeta,
  };
}

function getProfile() {
  state.profile = normalizeProfile(state.profile);
  return state.profile;
}

function getAppName() {
  return getProfile().appName || DEFAULT_APP_NAME;
}

function getCategories(type) {
  return getProfile().categories[type] || defaultCategories[type];
}

function getAllCategories() {
  return uniqueList([...getCategories("expense"), ...getCategories("income"), ...Object.keys(state.budgets)]);
}

function getCategoryMeta(category) {
  const profile = getProfile();
  return profile.categoryMeta[category] || defaultCategoryMeta[category] || { icon: "•", color: "#475569" };
}

function categoryLabel(category) {
  const meta = getCategoryMeta(category);
  return `${meta.icon} ${category}`;
}

function slug(value) {
  const filename = String(value || DEFAULT_APP_NAME)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return filename || "bolsario";
}

function normalizeTransaction(transaction = {}) {
  if (!transaction || typeof transaction !== "object" || Array.isArray(transaction)) {
    transaction = {};
  }

  const amount = Number(transaction.amount);
  const date = String(transaction.date || "");
  const hasValidDate = isValidISODate(date);

  return {
    id: normalizeId(transaction.id),
    type: transaction.type === "income" ? "income" : "expense",
    description: String(transaction.description || "").trim() || "Lançamento importado",
    amount: Number.isFinite(amount) && amount > 0 ? amount : 0,
    category: String(transaction.category || "Outros").trim() || "Outros",
    account: String(transaction.account || "Não informada").trim() || "Não informada",
    date: hasValidDate ? date : getTodayISO(),
    notes: String(transaction.notes || "").trim(),
    recurringId: transaction.recurringId ? normalizeId(transaction.recurringId) : "",
    installmentId: transaction.installmentId ? normalizeId(transaction.installmentId) : "",
    installmentNumber: Number.isFinite(Number(transaction.installmentNumber)) ? Number(transaction.installmentNumber) : "",
    installmentTotal: Number.isFinite(Number(transaction.installmentTotal)) ? Number(transaction.installmentTotal) : "",
    source: ["manual", "recurring", "installment"].includes(transaction.source) ? transaction.source : "manual",
  };
}

function normalizeTransactions(transactions) {
  if (!Array.isArray(transactions)) return [];
  const seenIds = new Set();

  return transactions
    .map(normalizeTransaction)
    .filter((transaction) => transaction.amount > 0)
    .map((transaction) => {
      if (seenIds.has(transaction.id)) {
        transaction.id = uid();
      }
      seenIds.add(transaction.id);
      return transaction;
    });
}

function normalizeBudgets(budgets = {}) {
  if (!budgets || typeof budgets !== "object" || Array.isArray(budgets)) return {};

  return Object.entries(budgets).reduce((acc, [category, limit]) => {
    const cleanCategory = String(category || "").trim();
    const cleanLimit = Number(limit);
    if (cleanCategory && Number.isFinite(cleanLimit) && cleanLimit > 0) {
      acc[cleanCategory] = cleanLimit;
    }
    return acc;
  }, {});
}

function normalizeRecurringItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const amount = Number(item.amount);
      const day = Number(item.day);
      if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(day)) return null;
      return {
        id: normalizeId(item.id),
        type: item.type === "income" ? "income" : "expense",
        description: String(item.description || "").trim() || "Recorrente",
        amount,
        category: String(item.category || "Outros").trim() || "Outros",
        account: String(item.account || "Conta corrente").trim() || "Conta corrente",
        day: Math.min(Math.max(Math.round(day), 1), 31),
        notes: String(item.notes || "").trim(),
        active: item.active !== false,
        createdAt: isValidISODate(item.createdAt) ? item.createdAt : getTodayISO(),
      };
    })
    .filter(Boolean);
}

function normalizeInstallments(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const totalAmount = Number(item.totalAmount);
      const count = Number(item.installments);
      if (!Number.isFinite(totalAmount) || totalAmount <= 0 || !Number.isFinite(count) || count < 2) return null;
      return {
        id: normalizeId(item.id),
        description: String(item.description || "").trim() || "Compra parcelada",
        totalAmount,
        installments: Math.min(Math.max(Math.round(count), 2), 60),
        category: String(item.category || "Outros").trim() || "Outros",
        account: String(item.account || "Cartão de crédito").trim() || "Cartão de crédito",
        startMonth: isValidMonth(item.startMonth) ? item.startMonth : getCurrentMonth(),
        notes: String(item.notes || "").trim(),
        createdAt: isValidISODate(item.createdAt) ? item.createdAt : getTodayISO(),
      };
    })
    .filter(Boolean);
}

function normalizeGoals(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const target = Number(item.target);
      const current = Number(item.current);
      if (!Number.isFinite(target) || target <= 0) return null;
      return {
        id: normalizeId(item.id),
        name: String(item.name || "").trim() || "Meta financeira",
        target,
        current: Number.isFinite(current) && current > 0 ? current : 0,
        dueDate: isValidISODate(item.dueDate) ? item.dueDate : "",
        createdAt: isValidISODate(item.createdAt) ? item.createdAt : getTodayISO(),
      };
    })
    .filter(Boolean);
}

function normalizeArchives(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item) || !isValidMonth(item.month)) return null;
      return {
        id: normalizeId(item.id),
        month: item.month,
        archivedAt: isValidISODate(item.archivedAt) ? item.archivedAt : getTodayISO(),
        summary: summarize(normalizeTransactions(item.transactions || [])),
        transactions: normalizeTransactions(item.transactions || []),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.month.localeCompare(a.month));
}

function normalizeStateData(value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    value = {};
  }

  return {
    profile: normalizeProfile(value.profile),
    transactions: normalizeTransactions(value.transactions),
    budgets: normalizeBudgets(value.budgets),
    recurring: normalizeRecurringItems(value.recurring),
    installments: normalizeInstallments(value.installments),
    goals: normalizeGoals(value.goals),
    archives: normalizeArchives(value.archives),
  };
}

function extractBackupData(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Backup inválido");
  }

  if (payload.format && payload.format !== BACKUP_FORMAT) {
    throw new Error("Formato de backup não reconhecido");
  }

  const isVersionedBackup = payload.format === BACKUP_FORMAT;
  const data = isVersionedBackup ? payload.data : payload;

  if (!data || typeof data !== "object" || Array.isArray(data) || !Array.isArray(data.transactions)) {
    throw new Error("Dados de backup inválidos");
  }

  return {
    state: normalizeStateData(data),
    schemaVersion: isVersionedBackup ? Number(payload.schemaVersion || 0) : 0,
  };
}

function createBackupPayload() {
  return {
    format: BACKUP_FORMAT,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    app: {
      id: APP_ID,
      name: getAppName(),
      storageKey: STORAGE_KEY,
    },
    data: normalizeStateData(state),
  };
}

function seedState() {
  return {
    profile: createDefaultProfile(),
    transactions: [],
    budgets: {},
    recurring: [],
    installments: [],
    goals: [],
    archives: [],
  };
}

function isLegacyDemoState(value) {
  if (!value || typeof value !== "object") return false;
  if (!Array.isArray(value.transactions) || value.transactions.length !== 5) return false;

  const demoTransactions = [
    ["Salário", 5200],
    ["Aluguel", 1450],
    ["Compras do mês", 730.4],
    ["Combustível", 260],
    ["Cinema e jantar", 190],
  ];
  const hasDemoTransactions = demoTransactions.every(([description, amount]) =>
    value.transactions.some((transaction) => transaction.description === description && Number(transaction.amount) === amount)
  );
  const budgets = value.budgets || {};
  const demoBudgets = {
    Moradia: 1600,
    Mercado: 900,
    Transporte: 420,
    Lazer: 350,
    Assinaturas: 180,
  };
  const budgetKeys = Object.keys(budgets);
  const hasOnlyDemoBudgets =
    budgetKeys.length === Object.keys(demoBudgets).length &&
    budgetKeys.every((key) => Number(budgets[key]) === demoBudgets[key]);

  return hasDemoTransactions && hasOnlyDemoBudgets;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return seedState();
    if (isLegacyDemoState(parsed)) {
      const emptyState = seedState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyState));
      return emptyState;
    }
    return normalizeStateData(parsed);
  } catch {
    return seedState();
  }
}

function saveState() {
  state = normalizeStateData(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function selectedType() {
  return document.querySelector("input[name='type']:checked")?.value || "expense";
}

function getViewFromHash() {
  const view = window.location.hash.replace("#", "");
  return VIEWS.includes(view) ? view : "resumo";
}

function setActiveView(viewName) {
  const activeView = VIEWS.includes(viewName) ? viewName : "resumo";

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
    queueCategoryChartDraw();
  }
}

function queueCategoryChartDraw(transactions = getMonthTransactions()) {
  if (chartFrame) window.cancelAnimationFrame(chartFrame);
  chartFrame = window.requestAnimationFrame(() => {
    chartFrame = 0;
    drawCategoryChart(transactions);
  });
}

function renderOptions(items, selected = "") {
  const options = uniqueList([...items, selected].filter(Boolean));
  return options
    .map((item) => `<option value="${escapeHtml(item)}"${item === selected ? " selected" : ""}>${escapeHtml(item)}</option>`)
    .join("");
}

function renderAccountOptions(selected = "") {
  const accounts = uniqueList([
    ...accountOptions,
    ...state.transactions.map((transaction) => transaction.account),
    ...state.recurring.map((item) => item.account),
    ...state.installments.map((item) => item.account),
    selected,
  ]);
  return renderOptions(accounts, selected);
}

function populateCategorySelects(selectedCategory = elements.category.value, selectedBudgetCategory = elements.budgetCategory.value) {
  const type = selectedType();
  const cleanSelectedCategory = String(selectedCategory || "").trim();
  const cleanSelectedBudgetCategory = String(selectedBudgetCategory || "").trim();

  elements.category.innerHTML = renderOptions(getCategories(type), cleanSelectedCategory);
  if (cleanSelectedCategory) elements.category.value = cleanSelectedCategory;

  elements.budgetCategory.innerHTML = renderOptions([...getCategories("expense"), ...Object.keys(state.budgets)], cleanSelectedBudgetCategory);
  if (cleanSelectedBudgetCategory) elements.budgetCategory.value = cleanSelectedBudgetCategory;

  elements.recurringCategory.innerHTML = renderOptions(getCategories(elements.recurringType.value), elements.recurringCategory.value);
  elements.installmentCategory.innerHTML = renderOptions(getCategories("expense"), elements.installmentCategory.value);
  elements.recurringAccount.innerHTML = renderAccountOptions(elements.recurringAccount.value);
  elements.installmentAccount.innerHTML = renderAccountOptions(elements.installmentAccount.value || "Cartão de crédito");
}

function populateFilters() {
  const currentCategory = elements.categoryFilter.value || "all";
  const currentAccount = elements.accountFilter.value || "all";
  const categoryOptions = ["all", ...getAllCategories()];
  const accountOptionsList = ["all", ...uniqueList(state.transactions.map((transaction) => transaction.account))];

  elements.categoryFilter.innerHTML = categoryOptions
    .map((item) => `<option value="${escapeHtml(item)}"${item === currentCategory ? " selected" : ""}>${item === "all" ? "Todas categorias" : escapeHtml(categoryLabel(item))}</option>`)
    .join("");
  elements.accountFilter.innerHTML = accountOptionsList
    .map((item) => `<option value="${escapeHtml(item)}"${item === currentAccount ? " selected" : ""}>${item === "all" ? "Todas contas" : escapeHtml(item)}</option>`)
    .join("");
}

function getMonthTransactions() {
  const month = isValidMonth(elements.monthFilter.value) ? elements.monthFilter.value : getCurrentMonth();
  return state.transactions.filter((transaction) => transaction.date.startsWith(month));
}

function getFilteredTransactions() {
  const type = elements.typeFilter.value;
  const category = elements.categoryFilter.value;
  const account = elements.accountFilter.value;
  const startDate = elements.startDateFilter.value;
  const endDate = elements.endDateFilter.value;
  const query = elements.searchFilter.value.trim().toLowerCase();
  const hasDateRange = isValidISODate(startDate) || isValidISODate(endDate);

  return (hasDateRange ? state.transactions : getMonthTransactions())
    .filter((transaction) => type === "all" || transaction.type === type)
    .filter((transaction) => category === "all" || transaction.category === category)
    .filter((transaction) => account === "all" || transaction.account === account)
    .filter((transaction) => !isValidISODate(startDate) || transaction.date >= startDate)
    .filter((transaction) => !isValidISODate(endDate) || transaction.date <= endDate)
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

function getYearTransactions() {
  const year = yearFromMonth(elements.monthFilter.value);
  return state.transactions.filter((transaction) => transaction.date.startsWith(year));
}

function updateAnnualSummary() {
  const year = yearFromMonth(elements.monthFilter.value);
  const yearTransactions = getYearTransactions();
  const summary = summarize(yearTransactions);
  elements.annualYearLabel.textContent = year;
  elements.yearIncomeValue.textContent = currency(summary.income);
  elements.yearExpenseValue.textContent = currency(summary.expense);
  elements.yearBalanceValue.textContent = currency(summary.balance);
  elements.yearSavingRateValue.textContent = `${summary.savingRate}%`;

  elements.annualMonthList.innerHTML = "";
  Array.from({ length: 12 }, (_, index) => `${year}-${String(index + 1).padStart(2, "0")}`).forEach((month) => {
    const monthSummary = summarize(state.transactions.filter((transaction) => transaction.date.startsWith(month)));
    const item = document.createElement("article");
    item.className = "annual-month";
    item.innerHTML = `
      <strong>${monthLabel(month).replace(` de ${year}`, "")}</strong>
      <span>${currency(monthSummary.balance)}</span>
      <small>${currency(monthSummary.expense)} gastos</small>
    `;
    elements.annualMonthList.appendChild(item);
  });
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
  const profile = getProfile();
  const budgetTotal = Object.values(state.budgets).reduce((sum, value) => sum + Number(value || 0), 0);
  const budgetUsed = summary.expense;
  const budgetRatio = budgetTotal > 0 ? Math.round((budgetUsed / budgetTotal) * 100) : 0;
  const monthlyIncome = Number(profile.monthlyIncome || 0);

  let title = `${getAppName()} está acompanhando ${profile.personName ? profile.personName : "o seu mês"}`;
  let message = `Objetivo atual: ${profile.goal.toLowerCase()}. Cadastre lançamentos e revise os limites para enxergar o dinheiro sem adivinhação.`;
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
  } else if (monthlyIncome > 0 && summary.expense > monthlyIncome * 0.7) {
    title = "Gastos altos para a renda base";
    message = `Os gastos já somam ${Math.round((summary.expense / monthlyIncome) * 100)}% da renda mensal informada.`;
    color = "var(--warning)";
  } else if (summary.expense > 0) {
    title = "Controle ativo";
    message = `Foram registrados ${currency(summary.expense)} em gastos no mês selecionado.`;
  }

  elements.insightBox.style.borderLeftColor = color;
  elements.insightBox.innerHTML = `
    <div>
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(message)}</span>
    </div>
    <span class="pill">${budgetTotal > 0 ? `${budgetRatio}% do orçamento` : "Sem limites"}</span>
  `;
}

function applyTheme(profile) {
  document.documentElement.dataset.theme = profile.theme;
  document.documentElement.style.setProperty("--primary", profile.accent);
  document.documentElement.style.setProperty("--primary-dark", accentMap[profile.accent] || profile.accent);
}

function updateBranding() {
  const profile = getProfile();
  const appName = getAppName();
  const firstLetter = appName.charAt(0).toUpperCase() || "B";

  document.title = `${appName} | Controle Pessoal`;
  elements.brandMark.textContent = firstLetter;
  elements.appNameLabel.textContent = appName;
  elements.brandTitle.textContent = profile.personName ? `Controle de ${profile.personName}` : "Controle pessoal";
  elements.topbarEyebrow.textContent = profile.personName ? `Painel financeiro de ${profile.personName}` : "Painel financeiro pessoal";
  elements.topbarTitle.textContent = goalHeadlines[profile.goal] || goalHeadlines["Controlar gastos"];
  applyTheme(profile);
  updateProfilePreview(profile);
}

function updateProfilePreview(profile = getProfile()) {
  const appName = profile.appName || DEFAULT_APP_NAME;
  elements.previewMark.textContent = appName.charAt(0).toUpperCase() || "B";
  elements.previewAppName.textContent = appName;
  elements.previewPersonName.textContent = profile.personName ? `Controle de ${profile.personName}` : "Controle pessoal";
  elements.previewGoal.textContent = profile.goal;
  elements.previewIncome.textContent = Number(profile.monthlyIncome) > 0 ? currency(Number(profile.monthlyIncome)) : "Não definida";
  elements.previewCategories.textContent = `${profile.categories.expense.length} gastos • ${profile.categories.income.length} entradas`;
}

function serializeCategoryVisuals(categoryMeta = getProfile().categoryMeta) {
  return getAllCategories()
    .map((category) => {
      const meta = categoryMeta[category] || getCategoryMeta(category);
      return `${category} | ${meta.icon || "•"} | ${meta.color || "#475569"}`;
    })
    .join("\n");
}

function fillProfileForm() {
  const profile = getProfile();
  elements.personName.value = profile.personName;
  elements.customAppName.value = profile.appName;
  elements.profileGoal.value = profile.goal;
  elements.monthlyIncome.value = profile.monthlyIncome || "";
  elements.themeMode.value = profile.theme;
  elements.expenseCategories.value = profile.categories.expense.join("\n");
  elements.incomeCategories.value = profile.categories.income.join("\n");
  elements.categoryVisuals.value = serializeCategoryVisuals(profile.categoryMeta);

  const accentInput = document.querySelector(`input[name="accentColor"][value="${profile.accent}"]`);
  if (accentInput) accentInput.checked = true;
  updateProfilePreview(profile);
}

function parseCategoryField(value, fallback) {
  return uniqueList(String(value || "").split(/[\n,;]+/), fallback);
}

function parseCategoryVisuals(value, fallback = getProfile().categoryMeta) {
  const meta = normalizeCategoryMeta(fallback);
  String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [category, icon, color] = line.split("|").map((part) => String(part || "").trim());
      if (!category) return;
      const previous = meta[category] || defaultCategoryMeta[category] || { icon: "•", color: "#475569" };
      meta[category] = {
        icon: icon || previous.icon,
        color: isHexColor(color) ? color : previous.color,
      };
    });
  return meta;
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const formData = new FormData(elements.profileForm);
  const currentProfile = getProfile();

  state.profile = normalizeProfile({
    ...currentProfile,
    personName: formData.get("personName"),
    appName: formData.get("customAppName"),
    goal: formData.get("profileGoal"),
    monthlyIncome: formData.get("monthlyIncome"),
    theme: formData.get("themeMode"),
    accent: formData.get("accentColor") || currentProfile.accent,
    setupComplete: true,
    categories: {
      expense: parseCategoryField(formData.get("expenseCategories"), defaultCategories.expense),
      income: parseCategoryField(formData.get("incomeCategories"), defaultCategories.income),
    },
    categoryMeta: parseCategoryVisuals(formData.get("categoryVisuals"), currentProfile.categoryMeta),
  });

  saveState();
  populateCategorySelects();
  updateBranding();
  updateSetupGate();
  render();
  showToast("Perfil salvo.");
}

function previewProfileFromForm() {
  const formData = new FormData(elements.profileForm);
  const currentProfile = getProfile();
  const draftProfile = normalizeProfile({
    ...currentProfile,
    personName: formData.get("personName"),
    appName: formData.get("customAppName"),
    goal: formData.get("profileGoal"),
    monthlyIncome: formData.get("monthlyIncome"),
    theme: formData.get("themeMode"),
    accent: formData.get("accentColor") || currentProfile.accent,
    categories: {
      expense: parseCategoryField(formData.get("expenseCategories"), defaultCategories.expense),
      income: parseCategoryField(formData.get("incomeCategories"), defaultCategories.income),
    },
    categoryMeta: parseCategoryVisuals(formData.get("categoryVisuals"), currentProfile.categoryMeta),
  });

  applyTheme(draftProfile);
  updateProfilePreview(draftProfile);
}

function resetForNewPerson() {
  const confirmed = window.confirm("Limpar lançamentos, orçamentos e perfil para outra pessoa?");
  if (!confirmed) return;

  state = {
    profile: createDefaultProfile(),
    transactions: [],
    budgets: {},
    recurring: [],
    installments: [],
    goals: [],
    archives: [],
  };
  saveState();
  resetForm();
  fillProfileForm();
  updateBranding();
  render();
  showToast("App pronto para outra pessoa.");
  updateSetupGate();
}

function updateSetupGate() {
  const profile = getProfile();
  const hasData =
    state.transactions.length ||
    Object.keys(state.budgets).length ||
    state.recurring.length ||
    state.installments.length ||
    state.goals.length;
  elements.setupGate.classList.toggle("hidden", profile.setupComplete || hasData);
}

function handleSetupSubmit(event) {
  event.preventDefault();
  const formData = new FormData(elements.setupForm);
  const income = Number(formData.get("setupIncome"));
  state.profile = normalizeProfile({
    ...getProfile(),
    personName: formData.get("setupName"),
    goal: formData.get("setupGoal"),
    monthlyIncome: Number.isFinite(income) && income > 0 ? income : "",
    setupComplete: true,
  });
  saveState();
  fillProfileForm();
  updateBranding();
  updateSetupGate();
  render();
  showToast("Configuração inicial salva.");
}

function skipSetup() {
  state.profile = normalizeProfile({ ...getProfile(), setupComplete: true });
  saveState();
  updateSetupGate();
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
    const color = getCategoryMeta(category).color || palette[index % palette.length];

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
    item.innerHTML = `<span class="legend-swatch" style="background:${color}"></span>${escapeHtml(categoryLabel(category))}`;
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
      <td>${escapeHtml(categoryLabel(transaction.category))}</td>
      <td>${escapeHtml(transaction.account)}</td>
      <td class="number-cell ${amountClass}">${sign} ${currency(transaction.amount)}</td>
      <td class="action-cell">
        <div class="row-actions">
          <button class="row-action" type="button" title="Editar" aria-label="Editar" data-action="edit" data-id="${escapeHtml(transaction.id)}">
            <svg viewBox="0 0 24 24"><path d="m4 16.7-.7 4 4-.7L18.9 8.4l-3.3-3.3L4 16.7Zm13-13 3.3 3.3 1.2-1.2a2.3 2.3 0 0 0-3.3-3.3L17 3.7Z" /></svg>
          </button>
          <button class="row-action" type="button" title="Excluir" aria-label="Excluir" data-action="delete" data-id="${escapeHtml(transaction.id)}">
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
    const limitIncomeLabel = incomePercentLabel(limit);
    const usedIncomeLabel = incomePercentLabel(used);
    const item = document.createElement("article");
    item.className = "budget-item";
    const severity = percent >= 100 ? "danger" : percent >= 80 ? "warn" : "";
    item.innerHTML = `
      <div class="budget-item-header">
        <span class="budget-item-title">${escapeHtml(categoryLabel(category))}</span>
        <div class="budget-item-meta">
          <span class="budget-item-amount">${currency(used)} de ${currency(limit)}${limitIncomeLabel ? ` (${escapeHtml(limitIncomeLabel)})` : ""}</span>
          <button class="row-action budget-delete" type="button" title="Excluir orçamento" aria-label="Excluir orçamento de ${escapeHtml(category)}" data-category="${escapeHtml(category)}">
            <svg viewBox="0 0 24 24"><path d="M9 3h6l1 2h5v2H3V5h5l1-2Zm-3 6h12l-1 12H7L6 9Zm4 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z" /></svg>
          </button>
        </div>
      </div>
      <div class="progress" aria-label="${percent}% usado em ${escapeHtml(category)}">
        <div class="progress-bar ${severity}" style="width:${Math.min(percent, 100)}%"></div>
      </div>
      <small>${percent}% usado${usedIncomeLabel ? `, gasto ${escapeHtml(usedIncomeLabel)}` : ""}${percent > 100 ? `, passou ${currency(used - limit)}` : ""}</small>
    `;
    elements.budgetList.appendChild(item);
  });
}

function render() {
  const monthTransactions = getMonthTransactions();
  const summary = summarize(monthTransactions);
  updateMetrics(summary);
  updateInsight(summary);
  updateAnnualSummary();
  drawCategoryChart(monthTransactions);
  populateFilters();
  renderTransactions();
  renderBudgets(monthTransactions);
  renderRecurring();
  renderInstallments();
  renderGoals();
  renderArchives();
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
  const amount = Number(formData.get("amount"));
  const date = String(formData.get("date"));
  const transaction = {
    id: elements.editingId.value || uid(),
    type,
    description: String(formData.get("description")).trim(),
    amount,
    category: String(formData.get("category")),
    account: String(formData.get("account")),
    date,
    notes: String(formData.get("notes") || "").trim(),
    recurringId: "",
    installmentId: "",
    installmentNumber: "",
    installmentTotal: "",
    source: "manual",
  };

  if (!transaction.description || !Number.isFinite(transaction.amount) || transaction.amount <= 0 || !isValidISODate(transaction.date)) {
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
  populateCategorySelects(transaction.category);
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
  const hasAmount = hasInputValue(elements.budgetAmount.value);
  const hasPercent = hasInputValue(elements.budgetPercent.value);
  const resolved = resolveAmountFromInputs(elements.budgetAmount.value, elements.budgetPercent.value);
  const amount = roundMoney(resolved.amount);

  if (resolved.usesPercent && !Number.isFinite(amount)) {
    showToast("Defina a renda base mensal no Perfil para usar porcentagem.");
    return;
  }

  if (!category || (!hasAmount && !hasPercent) || !Number.isFinite(amount) || amount < 0) {
    showToast("Informe um limite válido.");
    return;
  }

  if (amount === 0) {
    delete state.budgets[category];
  } else {
    state.budgets[category] = amount;
  }

  elements.budgetAmount.value = "";
  elements.budgetPercent.value = "";
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

function transactionExistsForRecurring(recurringId, month) {
  return state.transactions.some((transaction) => transaction.recurringId === recurringId && transaction.date.startsWith(month));
}

function generateRecurringForMonth(month = elements.monthFilter.value || getCurrentMonth()) {
  const targetMonth = isValidMonth(month) ? month : getCurrentMonth();
  let created = 0;

  state.recurring
    .filter((item) => item.active)
    .forEach((item) => {
      if (transactionExistsForRecurring(item.id, targetMonth)) return;
      state.transactions.push({
        id: uid(),
        type: item.type,
        description: item.description,
        amount: item.amount,
        category: item.category,
        account: item.account,
        date: dateForMonthDay(targetMonth, item.day),
        notes: item.notes,
        recurringId: item.id,
        installmentId: "",
        installmentNumber: "",
        installmentTotal: "",
        source: "recurring",
      });
      created += 1;
    });

  saveState();
  render();
  showToast(created ? `${created} recorrente${created === 1 ? "" : "s"} gerado${created === 1 ? "" : "s"}.` : "Nenhum recorrente pendente.");
}

function handleRecurringSubmit(event) {
  event.preventDefault();
  const formData = new FormData(elements.recurringForm);
  const amountInput = formData.get("recurringAmount");
  const percentInput = formData.get("recurringPercent");
  const resolved = resolveAmountFromInputs(amountInput, percentInput);
  const amount = roundMoney(resolved.amount);
  const day = Number(formData.get("recurringDay"));

  if (resolved.usesPercent && !Number.isFinite(amount)) {
    showToast("Defina a renda base mensal no Perfil para usar porcentagem.");
    return;
  }

  if (!formData.get("recurringDescription") || (!hasInputValue(amountInput) && !hasInputValue(percentInput)) || !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(day)) {
    showToast("Informe descrição, valor e dia válidos.");
    return;
  }

  state.recurring.push({
    id: uid(),
    type: formData.get("recurringType") === "income" ? "income" : "expense",
    description: String(formData.get("recurringDescription")).trim(),
    amount,
    category: String(formData.get("recurringCategory")),
    account: String(formData.get("recurringAccount") || "Conta corrente"),
    day: Math.min(Math.max(Math.round(day), 1), 31),
    notes: String(formData.get("recurringNotes") || "").trim(),
    active: true,
    createdAt: getTodayISO(),
  });

  elements.recurringForm.reset();
  elements.recurringDay.value = "1";
  saveState();
  populateCategorySelects();
  render();
  showToast("Recorrente salvo.");
}

function handleRecurringListClick(event) {
  const button = event.target.closest("button[data-recurring-action]");
  if (!button) return;
  const id = button.dataset.id;
  const item = state.recurring.find((recurring) => recurring.id === id);
  if (!item) return;

  if (button.dataset.recurringAction === "toggle") {
    item.active = !item.active;
  } else if (button.dataset.recurringAction === "delete") {
    const confirmed = window.confirm(`Excluir recorrente "${item.description}"?`);
    if (!confirmed) return;
    state.recurring = state.recurring.filter((recurring) => recurring.id !== id);
  }

  saveState();
  render();
}

function renderRecurring() {
  elements.recurringList.innerHTML = "";
  if (!state.recurring.length) {
    elements.recurringList.innerHTML = `<div class="empty-state"><strong>Nenhum recorrente cadastrado.</strong></div>`;
    return;
  }

  state.recurring.forEach((item) => {
    const recurringIncomeLabel = incomePercentLabel(item.amount);
    const row = document.createElement("article");
    row.className = "compact-item";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(item.description)}</strong>
        <span>${item.type === "income" ? "Entrada" : "Gasto"} • dia ${item.day} • ${escapeHtml(categoryLabel(item.category))}</span>
      </div>
      <div class="compact-actions">
        <div class="compact-value">
          <strong>${currency(item.amount)}</strong>
          ${recurringIncomeLabel ? `<small>${escapeHtml(recurringIncomeLabel)}</small>` : ""}
        </div>
        <button class="row-action" type="button" title="${item.active ? "Pausar" : "Ativar"}" data-recurring-action="toggle" data-id="${escapeHtml(item.id)}">${item.active ? "||" : "▶"}</button>
        <button class="row-action" type="button" title="Excluir" data-recurring-action="delete" data-id="${escapeHtml(item.id)}">×</button>
      </div>
    `;
    elements.recurringList.appendChild(row);
  });
}

function createInstallmentTransactions(plan) {
  const totalCents = Math.round(plan.totalAmount * 100);
  const baseCents = Math.floor(totalCents / plan.installments);
  const remainder = totalCents - baseCents * plan.installments;

  Array.from({ length: plan.installments }, (_, index) => {
    const installmentNumber = index + 1;
    const amountCents = baseCents + (index < remainder ? 1 : 0);
    const month = addMonths(plan.startMonth, index);
    state.transactions.push({
      id: uid(),
      type: "expense",
      description: `${plan.description} (${installmentNumber}/${plan.installments})`,
      amount: amountCents / 100,
      category: plan.category,
      account: plan.account,
      date: dateForMonthDay(month, 1),
      notes: plan.notes,
      recurringId: "",
      installmentId: plan.id,
      installmentNumber,
      installmentTotal: plan.installments,
      source: "installment",
    });
  });
}

function handleInstallmentSubmit(event) {
  event.preventDefault();
  const formData = new FormData(elements.installmentForm);
  const totalAmount = Number(formData.get("installmentTotal"));
  const installments = Number(formData.get("installmentCount"));
  const startMonth = String(formData.get("installmentStartMonth"));

  if (!formData.get("installmentDescription") || !Number.isFinite(totalAmount) || totalAmount <= 0 || !Number.isFinite(installments) || installments < 2 || !isValidMonth(startMonth)) {
    showToast("Informe dados válidos para a compra parcelada.");
    return;
  }

  const plan = {
    id: uid(),
    description: String(formData.get("installmentDescription")).trim(),
    totalAmount,
    installments: Math.min(Math.max(Math.round(installments), 2), 60),
    category: String(formData.get("installmentCategory")),
    account: String(formData.get("installmentAccount") || "Cartão de crédito"),
    startMonth,
    notes: String(formData.get("installmentNotes") || "").trim(),
    createdAt: getTodayISO(),
  };

  state.installments.push(plan);
  createInstallmentTransactions(plan);
  elements.installmentForm.reset();
  elements.installmentCount.value = "2";
  elements.installmentStartMonth.value = getCurrentMonth();
  saveState();
  populateCategorySelects();
  render();
  showToast("Parcelas criadas.");
}

function handleInstallmentListClick(event) {
  const button = event.target.closest("button[data-installment-action]");
  if (!button) return;
  const id = button.dataset.id;
  const plan = state.installments.find((item) => item.id === id);
  if (!plan) return;
  const confirmed = window.confirm(`Excluir compra parcelada "${plan.description}" e suas parcelas?`);
  if (!confirmed) return;
  state.installments = state.installments.filter((item) => item.id !== id);
  state.transactions = state.transactions.filter((transaction) => transaction.installmentId !== id);
  saveState();
  render();
}

function renderInstallments() {
  elements.installmentList.innerHTML = "";
  if (!state.installments.length) {
    elements.installmentList.innerHTML = `<div class="empty-state"><strong>Nenhuma compra parcelada.</strong></div>`;
    return;
  }

  state.installments.forEach((item) => {
    const row = document.createElement("article");
    row.className = "compact-item";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(item.description)}</strong>
        <span>${item.installments}x • ${monthLabel(item.startMonth)} • ${escapeHtml(categoryLabel(item.category))}</span>
      </div>
      <div class="compact-actions">
        <strong>${currency(item.totalAmount)}</strong>
        <button class="row-action" type="button" title="Excluir" data-installment-action="delete" data-id="${escapeHtml(item.id)}">×</button>
      </div>
    `;
    elements.installmentList.appendChild(row);
  });
}

function handleGoalSubmit(event) {
  event.preventDefault();
  const formData = new FormData(elements.goalForm);
  const targetInput = formData.get("goalTarget");
  const targetPercentInput = formData.get("goalTargetPercent");
  const currentInput = formData.get("goalCurrent");
  const currentPercentInput = formData.get("goalCurrentPercent");
  const targetResolved = resolveAmountFromInputs(targetInput, targetPercentInput);
  const currentResolved = resolveOptionalAmountFromInputs(currentInput, currentPercentInput);
  const target = roundMoney(targetResolved.amount);
  const current = roundMoney(currentResolved.amount);
  const dueDate = String(formData.get("goalDueDate") || "");

  if ((targetResolved.usesPercent || currentResolved.usesPercent) && (!Number.isFinite(target) || !Number.isFinite(current))) {
    showToast("Defina a renda base mensal no Perfil para usar porcentagem.");
    return;
  }

  if (!formData.get("goalName") || (!hasInputValue(targetInput) && !hasInputValue(targetPercentInput)) || !Number.isFinite(target) || target <= 0 || !Number.isFinite(current) || current < 0 || (dueDate && !isValidISODate(dueDate))) {
    showToast("Informe dados válidos para a meta.");
    return;
  }

  state.goals.push({
    id: uid(),
    name: String(formData.get("goalName")).trim(),
    target,
    current: Number.isFinite(current) && current > 0 ? current : 0,
    dueDate,
    createdAt: getTodayISO(),
  });

  elements.goalForm.reset();
  elements.goalCurrent.value = "0";
  saveState();
  render();
  showToast("Meta salva.");
}

function handleGoalsListClick(event) {
  const button = event.target.closest("button[data-goal-action]");
  if (!button) return;
  const id = button.dataset.id;
  const goal = state.goals.find((item) => item.id === id);
  if (!goal) return;

  if (button.dataset.goalAction === "delete") {
    const confirmed = window.confirm(`Excluir meta "${goal.name}"?`);
    if (!confirmed) return;
    state.goals = state.goals.filter((item) => item.id !== id);
  }

  saveState();
  render();
}

function renderGoals() {
  elements.goalsList.innerHTML = "";
  if (!state.goals.length) {
    elements.goalsList.innerHTML = `<div class="empty-state"><strong>Nenhuma meta cadastrada.</strong></div>`;
    return;
  }

  state.goals.forEach((goal) => {
    const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
    const currentIncomeLabel = incomePercentLabel(goal.current);
    const targetIncomeLabel = incomePercentLabel(goal.target);
    const row = document.createElement("article");
    row.className = "goal-item";
    row.innerHTML = `
      <div class="budget-item-header">
        <span class="budget-item-title">${escapeHtml(goal.name)}</span>
        <button class="row-action" type="button" title="Excluir" data-goal-action="delete" data-id="${escapeHtml(goal.id)}">×</button>
      </div>
      <div class="progress" aria-label="${percent}% concluído">
        <div class="progress-bar" style="width:${percent}%"></div>
      </div>
      <small>${currency(goal.current)}${currentIncomeLabel ? ` (${escapeHtml(currentIncomeLabel)})` : ""} de ${currency(goal.target)}${targetIncomeLabel ? ` (${escapeHtml(targetIncomeLabel)})` : ""}${goal.dueDate ? ` • ${shortDate(goal.dueDate)}` : ""}</small>
    `;
    elements.goalsList.appendChild(row);
  });
}

function archiveCurrentMonth() {
  const month = isValidMonth(elements.monthFilter.value) ? elements.monthFilter.value : getCurrentMonth();
  const transactions = state.transactions.filter((transaction) => transaction.date.startsWith(month));
  if (!transactions.length) {
    showToast("Nenhum lançamento neste mês.");
    return;
  }

  const confirmed = window.confirm(`Arquivar ${monthLabel(month)} e remover os lançamentos deste mês da lista ativa?`);
  if (!confirmed) return;

  state.archives = state.archives.filter((archive) => archive.month !== month);
  state.archives.push({
    id: uid(),
    month,
    archivedAt: getTodayISO(),
    summary: summarize(transactions),
    transactions,
  });
  state.transactions = state.transactions.filter((transaction) => !transaction.date.startsWith(month));
  saveState();
  render();
  showToast("Mês arquivado.");
}

function renderArchives() {
  elements.archiveList.innerHTML = "";
  if (!state.archives.length) {
    elements.archiveList.innerHTML = `<div class="empty-state"><strong>Nenhum mês arquivado.</strong></div>`;
    return;
  }

  state.archives.slice(0, 6).forEach((archive) => {
    const row = document.createElement("article");
    row.className = "compact-item";
    row.innerHTML = `
      <div>
        <strong>${monthLabel(archive.month)}</strong>
        <span>${archive.transactions.length} lançamentos • arquivado em ${shortDate(archive.archivedAt)}</span>
      </div>
      <div class="compact-actions">
        <strong>${currency(archive.summary.balance)}</strong>
      </div>
    `;
    elements.archiveList.appendChild(row);
  });
}

function exportCsv() {
  const rows = [
    ["data", "tipo", "descricao", "categoria", "conta", "valor", "origem", "observacao"],
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
        transaction.source || "manual",
        transaction.notes || "",
      ]),
  ];

  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(";")).join("\n")}`;
  const filenameBase = slug(getAppName());
  downloadFile(`${filenameBase}-lancamentos-v${CSV_SCHEMA_VERSION}-${getTodayISO()}.csv`, csv, "text/csv;charset=utf-8");

  const backup = JSON.stringify(createBackupPayload(), null, 2);
  setTimeout(() => downloadFile(`${filenameBase}-backup-v${BACKUP_SCHEMA_VERSION}-${getTodayISO()}.json`, backup, "application/json"), 250);
  showToast("Exportei CSV e backup JSON.");
}

function exportPdf() {
  const profile = getProfile();
  const appName = getAppName();
  const month = isValidMonth(elements.monthFilter.value) ? elements.monthFilter.value : getCurrentMonth();
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
        <h1>${escapeHtml(appName)}</h1>
        <span>${monthLabel(month)} • Gerado em ${shortDate(getTodayISO())}</span>
      </div>
      <strong>${profile.personName ? `Arquivo de ${escapeHtml(profile.personName)}` : "Arquivo para conferência pessoal"}</strong>
    </header>

    <section class="print-profile">
      <article><span>Objetivo</span><strong>${escapeHtml(profile.goal)}</strong></article>
      <article><span>Renda base mensal</span><strong>${Number(profile.monthlyIncome) > 0 ? currency(Number(profile.monthlyIncome)) : "Não definida"}</strong></article>
    </section>

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
        ["Categoria", "Gasto", "Limite", "Uso", "Limite/renda"],
        budgetEntries.map(([category, limit]) => {
          const used = categoryEntries.find(([name]) => name === category)?.[1] || 0;
          return [
            escapeHtml(category),
            currency(used),
            currency(Number(limit)),
            `${Math.round((used / Number(limit)) * 100)}%`,
            incomePercentLabel(Number(limit)) || "-",
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
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
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
      const backup = extractBackupData(parsed);
      state = backup.state;
      saveState();
      fillProfileForm();
      updateBranding();
      populateCategorySelects();
      const compatibility = backup.schemaVersion > BACKUP_SCHEMA_VERSION ? " em modo compatibilidade" : "";
      showToast(`Backup importado${compatibility}.`);
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
  elements.categoryFilter.addEventListener("change", renderTransactions);
  elements.accountFilter.addEventListener("change", renderTransactions);
  elements.startDateFilter.addEventListener("change", renderTransactions);
  elements.endDateFilter.addEventListener("change", renderTransactions);
  elements.searchFilter.addEventListener("input", renderTransactions);
  elements.clearFiltersBtn.addEventListener("click", () => {
    elements.typeFilter.value = "all";
    elements.categoryFilter.value = "all";
    elements.accountFilter.value = "all";
    elements.startDateFilter.value = "";
    elements.endDateFilter.value = "";
    elements.searchFilter.value = "";
    renderTransactions();
  });
  elements.transactionForm.addEventListener("submit", handleTransactionSubmit);
  elements.cancelEditBtn.addEventListener("click", resetForm);
  elements.transactionRows.addEventListener("click", handleTableClick);
  elements.budgetForm.addEventListener("submit", handleBudgetSubmit);
  elements.budgetList.addEventListener("click", handleBudgetListClick);
  elements.archiveMonthBtn.addEventListener("click", archiveCurrentMonth);
  elements.recurringType.addEventListener("change", () => populateCategorySelects());
  elements.recurringForm.addEventListener("submit", handleRecurringSubmit);
  elements.generateRecurringBtn.addEventListener("click", () => generateRecurringForMonth());
  elements.recurringList.addEventListener("click", handleRecurringListClick);
  elements.installmentForm.addEventListener("submit", handleInstallmentSubmit);
  elements.installmentList.addEventListener("click", handleInstallmentListClick);
  elements.goalForm.addEventListener("submit", handleGoalSubmit);
  elements.goalsList.addEventListener("click", handleGoalsListClick);
  elements.profileForm.addEventListener("submit", handleProfileSubmit);
  elements.resetPersonBtn.addEventListener("click", resetForNewPerson);
  elements.profileForm.addEventListener("input", previewProfileFromForm);
  elements.profileForm.addEventListener("change", previewProfileFromForm);
  elements.setupForm.addEventListener("submit", handleSetupSubmit);
  elements.skipSetupBtn.addEventListener("click", skipSetup);
  elements.exportBtn.addEventListener("click", exportCsv);
  elements.pdfBtn.addEventListener("click", exportPdf);
  elements.importBtn.addEventListener("click", () => elements.importFile.click());
  elements.importFile.addEventListener("change", (event) => importJson(event.target.files[0]));
  window.addEventListener("resize", () => queueCategoryChartDraw());
}

function init() {
  elements.monthFilter.value = getCurrentMonth();
  elements.date.value = getTodayISO();
  elements.installmentStartMonth.value = getCurrentMonth();
  elements.setupGoal.value = getProfile().goal;
  elements.setupName.value = getProfile().personName;
  elements.setupIncome.value = getProfile().monthlyIncome || "";
  fillProfileForm();
  updateBranding();
  populateCategorySelects();
  bindEvents();
  render();
  setActiveView(getViewFromHash());
  updateSetupGate();
}

init();
