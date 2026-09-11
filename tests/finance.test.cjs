const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

function harness() {
  const source = readFileSync(join(__dirname, '..', 'app.js'), 'utf8');
  // Remove only the final bootstrap call; fail loudly if its shape changes.
  assert.match(source, /\binit\(\);\s*$/);
  const nodes = new Map();
  const storage = new Map();
  const unexpected = () => { throw new Error('Unexpected UI initialization'); };
  const context = vm.createContext({
    document: {
      querySelector(selector) {
        if (!nodes.has(selector)) nodes.set(selector, { value: '', addEventListener: unexpected });
        return nodes.get(selector);
      },
      querySelectorAll: () => [],
      createElement: unexpected,
    },
    window: { addEventListener: unexpected },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
  });
  vm.runInContext(source.replace(/\binit\(\);\s*$/, ''), context, { timeout: 1000 });
  const run = (code) => vm.runInContext(code, context, { timeout: 1000 });
  const plain = (code) => JSON.parse(JSON.stringify(run(code)));
  const put = (name, value) => { context[name] = structuredClone(value); };
  const filters = (values) => {
    for (const [name, value] of Object.entries(values)) {
      put('__filter', value);
      run(`elements[${JSON.stringify(name)}].value = __filter`);
    }
  };
  filters({ monthFilter: '2026-09', typeFilter: 'all', categoryFilter: 'all', accountFilter: 'all', sortFilter: 'date-desc' });
  return { run, plain, put, filters, storage };
}

function transaction(overrides = {}) {
  return { id: 'tx-1', type: 'expense', description: 'Compra', amount: 10,
    category: 'Mercado', account: 'Pix', date: '2026-09-10', notes: '', ...overrides };
}

function plan(overrides = {}) {
  return { id: 'plan-1', description: 'Compra', totalAmount: 100, installments: 3,
    category: 'Mercado', account: 'Pix', startMonth: '2026-12', notes: 'nota', ...overrides };
}

test('harness loads without init or storage writes', () => {
  const h = harness();
  assert.deepEqual(h.plain('state.transactions'), []);
  assert.equal(h.storage.size, 0);
  assert.equal(h.run('elements.monthFilter.value'), '2026-09');
});

test('normalization preserves transaction origin metadata and trims text', () => {
  const h = harness();
  const input = transaction({ description: ' Compra ', amount: '10.23', notes: ' nota ',
    recurringId: 'rec-1', installmentId: 'plan-1', installmentNumber: 2,
    installmentTotal: 3, source: 'installment' });
  h.put('input', input);
  assert.deepEqual(h.plain('normalizeTransaction(input)'), {
    ...input, description: 'Compra', amount: 10.23, notes: 'nota',
  });
  assert.equal(h.run('input.description'), ' Compra ');
});

test('normalization rejects nonpositive amounts and repairs duplicate IDs', () => {
  const h = harness();
  h.put('input', [transaction(), transaction(), transaction({ amount: -1 }),
    transaction({ amount: 'invalid' }), null]);
  const result = h.plain('normalizeTransactions(input)');
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 'tx-1');
  assert.notEqual(result[0].id, result[1].id);
});

test('summary adds cents exactly and counts income and expenses', () => {
  const h = harness();
  h.put('input', [transaction({ type: 'income', amount: 0.1 }),
    transaction({ type: 'income', amount: 0.2 }), transaction({ amount: 0.1 })]);
  assert.deepEqual(h.plain('summarize(input)'), {
    income: 0.3, expense: 0.1, balance: 0.2, incomeCount: 2, expenseCount: 1, savingRate: 67,
  });
  assert.deepEqual(h.plain('summarize([])'), {
    income: 0, expense: 0, balance: 0, incomeCount: 0, expenseCount: 0, savingRate: 0,
  });
  assert.equal(h.run('roundMoney(12.346)'), 12.35);
});

for (const [totalAmount, installments] of [[100, 3], [0.05, 2], [1234.57, 60]]) {
  test(`installments preserve total cents: ${totalAmount} / ${installments}`, () => {
    const h = harness();
    h.put('plan', plan({ totalAmount, installments }));
    h.run('createInstallmentTransactions(plan)');
    const rows = h.plain('state.transactions');
    assert.equal(rows.length, installments);
    const cents = rows.map((row) => Math.round(row.amount * 100));
    assert.equal(cents.reduce((sum, amount) => sum + amount, 0), Math.round(totalAmount * 100));
    assert.ok(Math.max(...cents) - Math.min(...cents) <= 1);
    rows.forEach((row, index) => {
      assert.equal(row.installmentId, 'plan-1');
      assert.equal(row.installmentNumber, index + 1);
      assert.equal(row.installmentTotal, installments);
      assert.equal(row.source, 'installment');
      assert.equal(row.notes, 'nota');
    });
    assert.equal(rows[0].date, '2026-12-01');
    assert.equal(rows[1].date, '2027-01-01');
    h.run('saveState()');
    assert.equal(h.plain('state.transactions').length, installments);
  });
}

test('legacy and v2 backups round-trip financial collections and metadata', () => {
  const h = harness();
  h.put('input', { transactions: [transaction({ source: 'recurring', recurringId: 'rec-1', installmentNumber: 0, installmentTotal: 0 })],
    profile: { personName: 'Pessoa', categoryMeta: { Especial: { icon: 'X', color: '#123456' } } },
    budgets: { Mercado: 100 }, recurring: [{ id: 'rec-1', amount: 10, day: 3 }],
    installments: [plan()], goals: [{ id: 'goal-1', target: 100, current: 10 }],
    archives: [{ id: 'arc-1', month: '2026-08', transactions: [transaction({ amount: 5, installmentNumber: 0, installmentTotal: 0 })] }],
  });
  assert.equal(h.run('extractBackupData(input).schemaVersion'), 0);
  h.run('state = extractBackupData(input).state');
  const expected = h.plain('state');
  const backup = h.plain('createBackupPayload()');
  assert.equal(backup.format, 'bolsario.backup');
  assert.equal(backup.schemaVersion, 2);
  assert.equal(backup.app.id, 'bolsario');
  assert.ok(Number.isFinite(Date.parse(backup.exportedAt)));
  h.put('backup', backup);
  assert.deepEqual(h.plain('extractBackupData(backup).state'), expected);
  assert.equal(expected.transactions[0].recurringId, 'rec-1');
  assert.deepEqual(expected.profile.categoryMeta.Especial, { icon: 'X', color: '#123456' });
  assert.equal(expected.archives[0].summary.expense, 5);
});

test('unsupported backup versions and malformed payloads are rejected without mutation', () => {
  const h = harness();
  const before = h.plain('state');
  for (const payload of [null, [], {}, { transactions: {} },
    { format: 'other', transactions: [] },
    ...[3, 999, 0, -1, 1.5, '2', null].map((schemaVersion) => ({
      format: 'bolsario.backup', schemaVersion, data: { transactions: [] },
    }))]) {
    h.put('input', payload);
    assert.throws(() => h.run('extractBackupData(input)'), /backup|vers\u00e3o/i);
  }
  assert.deepEqual(h.plain('state'), before);
  assert.equal(h.storage.size, 0);
});

test('search ignores accents, case and outer whitespace in all searchable fields', () => {
  const h = harness();
  for (const field of ['description', 'category', 'account', 'notes']) {
    h.put('input', [transaction({ [field]: 'Educa\u00e7\u00e3o' }), transaction({ id: 'other' })]);
    h.run('state.transactions = input');
    h.filters({ searchFilter: '  EDUCACAO  ' });
    assert.deepEqual(h.plain('getFilteredTransactions().map(t => t.id)'), ['tx-1'], field);
  }
});

test('date ranges override month, include endpoints and reject inverted ranges', () => {
  const h = harness();
  h.put('input', [transaction({ id: 'aug', date: '2026-08-31' }), transaction(),
    transaction({ id: 'oct', date: '2026-10-01' })]);
  h.run('state.transactions = input');
  assert.deepEqual(h.plain('getFilteredTransactions().map(t => t.id)'), ['tx-1']);
  h.filters({ startDateFilter: '2026-08-31', endDateFilter: '2026-10-01' });
  assert.deepEqual(h.plain('getFilteredTransactions().map(t => t.id)'), ['oct', 'tx-1', 'aug']);
  h.filters({ startDateFilter: '2026-10-02' });
  assert.deepEqual(h.plain('getFilteredTransactions()'), []);
  h.filters({ startDateFilter: '', endDateFilter: '2026-08-31' });
  assert.deepEqual(h.plain('getFilteredTransactions().map(t => t.id)'), ['aug']);
});

test('type, category and account filters compose', () => {
  const h = harness();
  h.put('input', [transaction(), transaction({ id: 'income', type: 'income' }),
    transaction({ id: 'account', account: 'Carteira' }), transaction({ id: 'category', category: 'Outros' })]);
  h.run('state.transactions = input');
  h.filters({ typeFilter: 'expense', categoryFilter: 'Mercado', accountFilter: 'Pix' });
  assert.deepEqual(h.plain('getFilteredTransactions().map(t => t.id)'), ['tx-1']);
});

test('all sort modes and amount ties preserve original state order', () => {
  const h = harness();
  h.put('input', [transaction({ id: 'a', description: 'Abacate', amount: 20, date: '2026-09-01' }),
    transaction({ id: 'c', description: 'Caju', amount: 10, date: '2026-09-03' }),
    transaction({ id: 'b', description: 'Banana', amount: 20, date: '2026-09-02' })]);
  h.run('state.transactions = input');
  for (const [sortFilter, expected] of Object.entries({
    'date-desc': ['c', 'b', 'a'], 'date-asc': ['a', 'b', 'c'],
    'amount-desc': ['b', 'a', 'c'], 'amount-asc': ['c', 'b', 'a'],
    description: ['a', 'b', 'c'],
  })) {
    h.filters({ sortFilter });
    assert.deepEqual(h.plain('getFilteredTransactions().map(t => t.id)'), expected, sortFilter);
    assert.deepEqual(h.plain('state.transactions.map(t => t.id)'), ['a', 'c', 'b']);
  }
});

test('normalization is idempotent for absent installment metadata', () => {
  const h = harness();
  h.put('input', transaction());
  assert.deepEqual(h.plain('normalizeTransaction(normalizeTransaction(input))'),
    h.plain('normalizeTransaction(input)'));
});

test('decimal half-cent rounds up', () => {
  assert.equal(harness().run('roundMoney(1.005)'), 1.01);
});

test('invalid installment plans throw RangeError without mutating existing transactions', () => {
  const h = harness();
  h.put('input', [transaction()]);
  h.run('state.transactions = input');
  const before = h.plain('state.transactions');
  for (const overrides of [
    { totalAmount: 0.01, installments: 3 },
    { totalAmount: 0 },
    { totalAmount: -1 },
    { totalAmount: Infinity },
    { totalAmount: NaN },
    { installments: 1 },
    { installments: 61 },
    { installments: 2.5 },
  ]) {
    h.put('plan', plan(overrides));
    assert.equal(h.run('isValidInstallmentPlan(plan)'), false);
    // Match the VM error by name because its constructor belongs to another realm.
    assert.throws(() => h.run('createInstallmentTransactions(plan)'), { name: 'RangeError' });
    assert.deepEqual(h.plain('state.transactions'), before);
    assert.equal(h.run('state.transactions === input'), true);
    assert.equal(h.storage.size, 0);
  }
  for (const installments of [2, 60]) {
    h.put('plan', plan({ totalAmount: installments / 100, installments }));
    assert.equal(h.run('isValidInstallmentPlan(plan)'), true);
  }
});
