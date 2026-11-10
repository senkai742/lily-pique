const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const ts = require('typescript');

function fixture(overrides = {}, orderOverrides = {}, updateFails = false) {
  let updates = 0;
  let requests = 0;
  const order = { id: 'order-1', grand_total: 620, payment_status: 'pending', ...orderOverrides };
  const payment = { status: 'COMPLETED', transaction_id: 'txn-1', amount: '620.00', currency: 'BDT',
    payment_method: 'bkash', metadata: { order_id: 'order-1', payment_token: 'token-1' }, ...overrides };
  const query = {
    select() { return this; }, eq() { return this; },
    single: async () => ({ data: order, error: null }),
    update() { updates++; return this; },
    then(resolve) { resolve({ error: updateFails ? new Error('database unavailable') : null }); },
  };
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('lib/rupantorpay.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, {
    exports: module.exports, module, URL, AbortSignal,
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.com', SUPABASE_SERVICE_ROLE_KEY: 'test',
      SITE_URL: 'https://shop.example.com', RUPANTORPAY_API_KEY: 'test-key' } },
    require: () => ({ createClient: () => ({ from: () => query }) }),
    fetch: async () => { requests++; return { ok: true, json: async () => payment }; },
  });
  return { verify: () => module.exports.verifyOrderPayment('order-1', 'token-1', 'txn-1'),
    updates: () => updates, requests: () => requests };
}

test('matching completed bKash payment is saved', async () => {
  const f = fixture(); assert.equal(await f.verify(), true); assert.equal(f.updates(), 1);
});
for (const [name, change] of Object.entries({
  amount: { amount: '1' }, currency: { currency: 'USD' }, method: { payment_method: 'nagad' },
  transaction: { transaction_id: 'other' }, order: { metadata: { order_id: 'other', payment_token: 'token-1' } },
  token: { metadata: { order_id: 'order-1', payment_token: 'other' } }, missingMetadata: { metadata: null },
})) test(`rejects mismatched ${name}`, async () => {
  const f = fixture(change); await assert.rejects(f.verify); assert.equal(f.updates(), 0);
});
test('pending payments stay pending', async () => {
  const f = fixture({ status: 'PENDING' }); assert.equal(await f.verify(), false); assert.equal(f.updates(), 0);
});
test('repeated confirmation does not write again', async () => {
  const f = fixture({}, { payment_status: 'paid' }); assert.equal(await f.verify(), true);
  assert.equal(f.requests(), 0); assert.equal(f.updates(), 0);
});
test('failed database writes do not report success', async () => {
  const f = fixture({}, {}, true); await assert.rejects(f.verify);
});
