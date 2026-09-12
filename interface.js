// @ts-check
/** Presentation-only helpers. Financial state remains owned by app.js. */
const BolsarioUI = (() => {
  /** @template {HTMLElement} T @param {string} id @param {new () => T} Type @returns {T} */
  function element(id, Type) {
    const node = document.getElementById(id);
    if (!(node instanceof Type)) throw new Error(`Elemento ausente: ${id}`);
    return node;
  }

  /** @type {HTMLElement | null} */
  let dialogTrigger = null;
  let resetTransaction = () => {};

  function openTransaction() {
    const dialog = element("transactionDialog", HTMLDialogElement);
    if (dialog.open) return;
    dialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    element("description", HTMLInputElement).focus();
  }

  function closeTransaction() {
    element("transactionDialog", HTMLDialogElement).close();
    if (dialogTrigger?.isConnected && dialogTrigger.getClientRects().length) dialogTrigger.focus();
    else element("quickAddBtn", HTMLButtonElement).focus();
  }

  function requestClose() {
    const dirty =
      ["description", "amount", "editingId"].some((id) =>
        element(id, HTMLInputElement).value.trim(),
      ) || element("notes", HTMLTextAreaElement).value.trim();
    if (dirty && !window.confirm("Descartar este lançamento não salvo?")) return;
    resetTransaction();
    closeTransaction();
  }

  /** @param {string} group @param {string} name @param {boolean} [focus] */
  function selectTab(group, name, focus = false) {
    const nav = document.querySelector(`[data-tabs="${group}"]`);
    if (!nav?.querySelector(`[data-tab="${name}"]`)) return;
    nav.querySelectorAll("button").forEach((button) => {
      const selected = button.dataset.tab === name;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    });
    document.querySelectorAll("[data-panel]").forEach((panel) => {
      if (panel instanceof HTMLElement && panel.dataset.panel?.startsWith(`${group}:`)) {
        panel.hidden = panel.dataset.panel !== `${group}:${name}`;
      }
    });
    if (group === "profile") {
      element("profileSaveStatus", HTMLElement).parentElement?.classList.toggle(
        "hidden",
        name === "data",
      );
    }
  }

  /** @param {string} view */
  function syncView(view) {
    document.body.dataset.view = view;
    element("fileMenu", HTMLDetailsElement).open = false;
  }

  function syncFilters() {
    const count =
      ["categoryFilter", "accountFilter"].filter(
        (id) => element(id, HTMLSelectElement).value !== "all",
      ).length +
      ["startDateFilter", "endDateFilter"].filter((id) => element(id, HTMLInputElement).value)
        .length;
    const badge = element("filterCount", HTMLElement);
    badge.textContent = String(count);
    badge.classList.toggle("hidden", count === 0);
    const invalid = !element("filterError", HTMLElement).classList.contains("hidden");
    ["startDateFilter", "endDateFilter"].forEach((id) =>
      element(id, HTMLInputElement).setAttribute("aria-invalid", String(invalid)),
    );
  }

  /** @param {string} message @param {boolean} [error] */
  function operation(message, error = false) {
    const status = element("operationStatus", HTMLElement);
    status.classList.toggle("hidden", !message);
    status.classList.toggle("is-error", error);
    status.setAttribute("role", error ? "alert" : "status");
    status.replaceChildren(document.createTextNode(message));
    if (error) {
      const dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.className = "icon-button";
      dismiss.setAttribute("aria-label", "Fechar aviso");
      dismiss.title = "Fechar aviso";
      dismiss.innerHTML = icon("X");
      dismiss.addEventListener("click", () => operation(""));
      status.append(dismiss);
    }
  }

  /** @param {boolean} busy */
  function importing(busy) {
    element("importBtn", HTMLButtonElement).disabled = busy;
    element("mainContent", HTMLElement).setAttribute("aria-busy", String(busy));
    if (busy) operation("Lendo backup…");
  }

  const categoryIcons = [
    ["🏠", "Home", "Casa"],
    ["🛒", "ShoppingBasket", "Mercado"],
    ["🚗", "Car", "Transporte"],
    ["❤️", "Heart", "Saúde"],
    ["📚", "BookOpen", "Educação"],
    ["🎟️", "Ticket", "Lazer"],
    ["🔁", "Repeat", "Assinatura"],
    ["⚠️", "TriangleAlert", "Atenção"],
    ["💼", "BriefcaseBusiness", "Trabalho"],
    ["🧩", "Puzzle", "Freelance"],
    ["🏷️", "Tag", "Venda"],
    ["📈", "TrendingUp", "Investimento"],
    ["↩️", "Undo2", "Reembolso"],
    ["•", "Circle", "Geral"],
  ];

  /** @param {string} symbol @returns {string} */
  function categoryIcon(symbol) {
    return icon(categoryIcons.find((item) => item[0] === symbol)?.[1] || "Circle");
  }

  /** @returns {Map<string, {symbol:string, color:string}>} */
  function readVisuals() {
    const result = new Map();
    for (const line of element("categoryVisuals", HTMLTextAreaElement).value.split("\n")) {
      const [name, symbol, color] = line.split("|").map((part) => part.trim());
      if (name)
        result.set(name, {
          symbol: symbol || "•",
          color: /^#[0-9a-f]{6}$/i.test(color || "") ? color : "#475569",
        });
    }
    return result;
  }

  /** @param {Map<string, {symbol:string, color:string}>} values */
  function writeVisuals(values) {
    element("categoryVisuals", HTMLTextAreaElement).value = [...values]
      .map(([name, meta]) => `${name} | ${meta.symbol} | ${meta.color}`)
      .join("\n");
    profileChanged();
  }

  function categorySource() {
    return element(
      element("categoryEditorType", HTMLSelectElement).value === "income"
        ? "incomeCategories"
        : "expenseCategories",
      HTMLTextAreaElement,
    );
  }

  function profileChanged() {
    element("profileSaveStatus", HTMLElement).textContent = "Alterações não salvas";
  }

  function profileSaved() {
    element("profileSaveStatus", HTMLElement).textContent = "Perfil salvo";
  }

  function refreshCategories() {
    const host = element("categoryEditor", HTMLElement);
    const categories = categorySource().value.split("\n").filter(Boolean);
    host.replaceChildren();
    const visuals = readVisuals();
    categories.forEach((name) => {
      const meta = visuals.get(name) || { symbol: "•", color: "#475569" };
      const row = document.createElement("div");
      row.className = "category-editor-row";
      const glyph = document.createElement("span");
      glyph.className = "category-glyph";
      glyph.innerHTML = categoryIcon(meta.symbol);
      const label = document.createElement("strong");
      label.textContent = name;
      const color = document.createElement("input");
      color.type = "color";
      color.value = meta.color;
      color.setAttribute("aria-label", `Cor de ${name}`);
      color.title = `Cor de ${name}`;
      const symbol = document.createElement("select");
      symbol.setAttribute("aria-label", `Ícone de ${name}`);
      categoryIcons.forEach(([value, , title]) => symbol.add(new Option(title, value)));
      if (!categoryIcons.some((item) => item[0] === meta.symbol))
        symbol.add(new Option("Personalizado", meta.symbol));
      symbol.value = meta.symbol;
      const update = () => {
        const current = readVisuals();
        current.set(name, { symbol: symbol.value, color: color.value });
        writeVisuals(current);
        glyph.innerHTML = categoryIcon(symbol.value);
      };
      color.addEventListener("input", update);
      symbol.addEventListener("change", update);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "row-action";
      remove.innerHTML = icon("Trash2");
      remove.setAttribute("aria-label", `Remover categoria ${name}`);
      remove.title = `Remover categoria ${name}`;
      remove.disabled = categories.length < 2;
      remove.addEventListener("click", () => {
        if (
          !window.confirm(
            `Remover "${name}" das opções? Os lançamentos existentes serão preservados.`,
          )
        )
          return;
        categorySource().value = categorySource()
          .value.split("\n")
          .filter((value) => value !== name)
          .join("\n");
        profileChanged();
        refreshCategories();
        element("newCategoryName", HTMLInputElement).focus();
      });
      row.append(glyph, label, symbol, color, remove);
      host.append(row);
    });
  }

  function addCategory() {
    const input = element("newCategoryName", HTMLInputElement);
    const name = input.value.trim();
    const source = categorySource();
    const categories = source.value.split("\n").filter(Boolean);
    const error = element("categoryError", HTMLElement);
    const message = !name
      ? "Informe o nome da categoria."
      : /[|,;\n]/.test(name)
        ? "Use um nome sem vírgula, ponto e vírgula ou barra vertical."
        : categories.some(
              (value) => value.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"),
            )
          ? "Esta categoria já existe."
          : "";
    error.textContent = message;
    error.classList.toggle("hidden", !message);
    input.setAttribute("aria-invalid", String(Boolean(message)));
    if (message) {
      input.focus();
      return;
    }
    source.value = [...categories, name].join("\n");
    input.value = "";
    profileChanged();
    refreshCategories();
    input.focus();
  }

  /** @param {{newTransaction: () => void, resetTransaction: () => void, clearFilters: () => void}} callbacks */
  function init(callbacks) {
    resetTransaction = callbacks.resetTransaction;
    element("closeTransactionBtn", HTMLButtonElement).addEventListener("click", requestClose);
    element("transactionDialog", HTMLDialogElement).addEventListener("cancel", (event) => {
      event.preventDefault();
      requestClose();
    });
    element("emptyActionBtn", HTMLButtonElement).addEventListener("click", () => {
      if (element("emptyActionBtn", HTMLButtonElement).dataset.action === "clear")
        callbacks.clearFilters();
      else callbacks.newTransaction();
    });
    element("toggleFiltersBtn", HTMLButtonElement).addEventListener("click", () => {
      const filters = element("advancedFilters", HTMLElement);
      filters.hidden = !filters.hidden;
      element("toggleFiltersBtn", HTMLButtonElement).setAttribute(
        "aria-expanded",
        String(!filters.hidden),
      );
    });
    document.querySelectorAll("[data-tabs]").forEach((nav) => {
      if (!(nav instanceof HTMLElement)) return;
      const group = nav.dataset.tabs || "";
      const buttons = [...nav.querySelectorAll("button")];
      buttons.forEach((button, index) => {
        button.addEventListener("click", () => selectTab(group, button.dataset.tab || ""));
        button.addEventListener("keydown", (event) => {
          const next =
            event.key === "ArrowRight"
              ? (index + 1) % buttons.length
              : event.key === "ArrowLeft"
                ? (index - 1 + buttons.length) % buttons.length
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? buttons.length - 1
                    : -1;
          if (next < 0) return;
          event.preventDefault();
          selectTab(group, buttons[next].dataset.tab || "", true);
        });
      });
    });
    const menu = element("fileMenu", HTMLDetailsElement);
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    });
    menu.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", () => {
        menu.open = false;
      }),
    );
    document.querySelectorAll("[data-file-action]").forEach((button) => {
      if (!(button instanceof HTMLElement)) return;
      button.addEventListener("click", () =>
        element(button.dataset.fileAction || "", HTMLButtonElement).click(),
      );
    });
    element("categoryEditorType", HTMLSelectElement).addEventListener("change", refreshCategories);
    element("addCategoryBtn", HTMLButtonElement).addEventListener("click", addCategory);
    element("newCategoryName", HTMLInputElement).addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addCategory();
      }
    });
    element("profileForm", HTMLFormElement).addEventListener("input", profileChanged);
    // Native validation must reveal a field before the browser tries to focus it.
    element("profileForm", HTMLFormElement).addEventListener(
      "invalid",
      (event) => {
        if (!(event.target instanceof HTMLElement)) return;
        const panel = event.target.closest("[data-panel]");
        if (panel instanceof HTMLElement && panel.hidden) {
          selectTab("profile", panel.dataset.panel?.split(":")[1] || "personal");
        }
      },
      true,
    );
    const gate = element("setupGate", HTMLElement);
    gate.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const controls = [...gate.querySelectorAll("input, select, button")].filter(
        (node) => node instanceof HTMLElement && node.getClientRects().length,
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first && last instanceof HTMLElement) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last && first instanceof HTMLElement) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  /** @param {boolean} visible */
  function setupVisibility(visible) {
    const shell = document.querySelector(".app-shell");
    if (shell instanceof HTMLElement) shell.inert = visible;
    if (visible) element("setupName", HTMLInputElement).focus();
    else if (element("setupGate", HTMLElement).contains(document.activeElement))
      element("quickAddBtn", HTMLButtonElement).focus();
  }

  return {
    init,
    openTransaction,
    closeTransaction,
    syncView,
    syncFilters,
    operation,
    importing,
    refreshCategories,
    profileSaved,
    categoryIcon,
    selectTab,
    setupVisibility,
  };
})();
