const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const ts = require('typescript');

function load(path, dependencies = {}) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, { exports: module.exports, module, Date, Intl, URL, URLSearchParams, Response,
    process: { env: { RUPANTORPAY_API_KEY: "test", SITE_URL: "https://shop.example" } },
    require: name => { if (!(name in dependencies)) throw new Error(`Unexpected import: ${name}`); return dependencies[name]; },
  });
  return module.exports;
}
const policy = load('config/vip.ts');
test('VIP discount excludes shipping and rounds to cents', () => {
  assert.equal(policy.vipDiscount(1000, true), 150);
  assert.equal(1000 - policy.vipDiscount(1000, true) + 190, 1040);
  assert.equal(1000 - policy.vipDiscount(1000, true) + 420, 1270);
  assert.equal(policy.vipDiscount(99.99, true), 15);
  assert.equal(policy.vipDiscount(1000, false), 0);
});
test('phone formatting normalizes to one membership identity', () => {
  for (const phone of ['01712345678', '+8801712345678', '008801712345678', '+880 1712-345678']) {
    assert.equal(policy.normalizePhone(phone), '+8801712345678');
  }
  for (const phone of ['017', 'abc', '+1234567890', '8801212345678']) assert.equal(policy.normalizePhone(phone), null);
});
test('four-day notice uses Bangladesh date across midnight and month boundary', () => {
  const now = new Date('2026-11-30T18:30:00Z');
  assert.equal(policy.earliestDeliveryDate(now), '2026-12-05');
  assert.equal(policy.validDeliveryDate('2026-12-04', now), false);
  assert.equal(policy.validDeliveryDate('2026-12-05', now), true);
  assert.equal(policy.validDeliveryDate('2026-12-32', now), false);
  assert.equal(policy.validDeliveryDate('2027-02-30', now), false);
});
function fixture(paymentChanges = {}, membershipChanges = {}, options = {}) {
  let writes = 0; let requests = 0;
  const member = { id: 'member-1', status: 'pending', fee: 1500, payment_method: 'bkash', ...membershipChanges };
  const payment = { status: 'COMPLETED', currency: 'BDT', transaction_id: 'txn-1', amount: '1500.00', payment_method: 'bkash',
    metadata: { membership_id: 'member-1', payment_token: 'secret-1' }, ...paymentChanges };
  const query = {
    select() { return this; }, eq() { return this; },
    single: async () => ({ data: member, error: options.missing ? new Error('missing') : null }),
    update() { writes++; return this; },
    maybeSingle: async () => ({ data: options.noRows ? null : { id: member.id }, error: options.writeError ? new Error('write failed') : null }),
  };
  const { verifyMembershipPayment } = load('lib/vip-payments.ts', {
    '@/config/vip': policy,
    '@/lib/rupantorpay': { orderDatabase: () => ({ from: () => query }), rupantorRequest: async () => { requests++; return payment; } },
  });
  return { verify: () => verifyMembershipPayment('member-1', 'secret-1', 'txn-1'), writes: () => writes, requests: () => requests };
}
for (const method of ['bkash', 'nagad']) test(`verified ${method} payment activates membership`, async () => {
  const f = fixture({ payment_method: method }, { payment_method: method });
  assert.equal(await f.verify(), true); assert.equal(f.writes(), 1);
});
for (const [name, change] of Object.entries({ amount: { amount: '15' }, currency: { currency: 'USD' }, method: { payment_method: 'nagad' }, transaction: { transaction_id: 'other' },
  orderReplay: { metadata: { order_id: 'member-1', payment_token: 'secret-1' } }, token: { metadata: { membership_id: 'member-1', payment_token: 'wrong' } }, metadata: { metadata: null }, invalidAmount: { amount: 'NaN' },
})) test(`rejects membership payment with mismatched ${name}`, async () => {
  const f = fixture(change); await assert.rejects(f.verify); assert.equal(f.writes(), 0);
});
test('pending membership payment never activates benefits', async () => {
  const f = fixture({ status: 'PENDING' }); assert.equal(await f.verify(), false); assert.equal(f.writes(), 0);
});
test('repeated verified callback is idempotent', async () => {
  const f = fixture({}, { status: 'active' }); assert.equal(await f.verify(), true); assert.equal(f.writes(), 0); assert.equal(f.requests(), 0);
});
test('activation write failure does not report success', async () => {
  await assert.rejects(fixture({}, {}, { writeError: true }).verify);
});
test('zero-row activation does not report success while membership remains pending', async () => {
  await assert.rejects(fixture({}, {}, { noRows: true }).verify);
});
test('unknown membership cannot activate', async () => {
  const f = fixture({}, {}, { missing: true }); await assert.rejects(f.verify); assert.equal(f.requests(), 0);
});

function checkoutFixture({ active = false, signedIn = false, earlyAccess = false, bodyChanges = {}, accountError = false } = {}) {
  const captured = { order: null, provider: null };
  const db = { from(table) {
    const query = {
      select() { return this; }, eq() { return this; },
      insert(value) { if (table === 'orders') captured.order = value; return this; },
      async single() { return { data: table === 'products' ? { id: 'product-1', name: 'Bouquet', vip_early_access: earlyAccess }
        : table === 'product_variants' ? { price: 1000, color: 'Pink', hex_code: '#fff', images: [] } : { id: 'order-1' }, error: null }; },
      then(resolve) { resolve({ error: null }); },
    }; return query;
  } };
  const handler = load('app/api/orders/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/rupantorpay': { orderDatabase: () => db, paymentOrigin: () => 'https://shop.example', rupantorRequest: async (_, body) => { captured.provider = body; return { status: true, payment_url: 'https://payment.rupantorpay.com/pay/test' }; } },
    '@/config/order-policy': load('config/order-policy.ts'), '@/config/vip': policy,
    '@/lib/customer': { customerContext: async () => { if (accountError) throw new Error('db unavailable'); return { user: signedIn || active ? { id: 'user-1' } : null, membership: active ? { status: 'active' } : null }; } },
    'node:crypto': { randomUUID: () => 'test-token' },
  });
  const body = { first_name: 'Test', last_name: 'Buyer', email: 'test@example.com', phone: '01712345678', address: 'Street', city: 'Dhaka', district: 'Dhaka', postal_code: '1200',
    delivery_zone: 'inside', policy_accepted: true, delivery_date: policy.earliestDeliveryDate(), grand_total: active ? 1040 : 1190, payment_method: 'bkash',
    items: [{ id: '11111111-1111-1111-1111-111111111111', color: 'Pink', quantity: 1 }], ...bodyChanges };
  return { captured, call: () => handler.POST({ json: async () => body }) };
}
test('VIP checkout charges discounted products plus full delivery, saves fulfillment benefits', async () => {
  const f = checkoutFixture({ active: true, bodyChanges: { note_card_message: 'Happy birthday', preferred_delivery_time: 'Afternoon' } });
  assert.equal((await f.call()).status, 201);
  assert.equal(f.captured.order.vip_discount, 150); assert.equal(f.captured.order.shipping, 190);
  assert.equal(f.captured.order.user_id, 'user-1'); assert.equal(f.captured.order.vip_member, true);
  assert.equal(f.captured.order.note_card_message, 'Happy birthday'); assert.equal(f.captured.provider.amount, '1040');
});
test('outside Dhaka retains full delivery charge with VIP discount', async () => {
  const f = checkoutFixture({ active: true, bodyChanges: { delivery_zone: 'outside', grand_total: 1270 } });
  assert.equal((await f.call()).status, 201); assert.equal(f.captured.order.shipping, 420); assert.equal(f.captured.provider.amount, '1270');
});
test('guest cannot forge membership or discounted prices', async () => {
  const f = checkoutFixture({ bodyChanges: { vip_member: true, vip_discount: 150, grand_total: 1040 } });
  assert.equal((await f.call()).status, 409); assert.equal(f.captured.order, null);
});
test('signed-in nonmember pays regular price and has account-linked order', async () => {
  const f = checkoutFixture({ signedIn: true }); assert.equal((await f.call()).status, 201);
  assert.equal(f.captured.order.vip_discount, 0); assert.equal(f.captured.order.user_id, 'user-1');
});
test('guest cannot buy an early-access product by submitting its ID', async () => {
  const f = checkoutFixture({ earlyAccess: true }); assert.equal((await f.call()).status, 400); assert.equal(f.captured.order, null);
});
test('VIP can buy an early-access product', async () => {
  const f = checkoutFixture({ earlyAccess: true, active: true }); assert.equal((await f.call()).status, 201);
});
for (const change of [{ policy_accepted: false }, { delivery_date: '2020-01-01' }, { delivery_zone: 'other' }, { note_card_message: 'Forged VIP card' }]) {
  test(`checkout rejects invalid policy or benefit input ${JSON.stringify(change)}`, async () => {
    const f = checkoutFixture({ bodyChanges: change }); assert.equal((await f.call()).status, 400); assert.equal(f.captured.order, null);
  });
}

function joinFixture({ user = { id: 'user-1', email: 'vip@example.com', email_confirmed_at: '2026-11-17' }, membership = null, duplicate = false, providerFails = false, bodyChanges = {} } = {}) {
  let insert = null; let providerCalls = 0;
  const query = { insert(value) { insert = value; return this; }, select() { return this; },
    single: async () => ({ data: duplicate ? null : { id: 'member-1' }, error: duplicate ? { code: '23505' } : null }),
    update() { return this; }, eq() { return this; }, then(resolve) { resolve({ error: null }); } };
  const handler = load('app/api/vip-membership/route.ts', {
    '@/lib/customer': { customerContext: async () => ({ user, membership }) }, '@/config/vip': policy,
    'node:crypto': { randomUUID: () => 'secret-token' },
    '@/lib/rupantorpay': { orderDatabase: () => ({ from: () => query }), paymentOrigin: () => 'https://shop.example', rupantorRequest: async () => { providerCalls++; if (providerFails) throw new Error('timeout'); return { status: true, payment_url: 'https://payment.rupantorpay.com/pay/member' }; } },
  });
  return { insert: () => insert, calls: () => providerCalls, call: () => handler.POST({ json: async () => ({ full_name: 'VIP Buyer', phone: '01712345678', payment_method: 'nagad', terms_accepted: true, fee: 1, ...bodyChanges }) }) };
}
test('membership fee and identity are server controlled', async () => {
  const f = joinFixture(); assert.equal((await f.call()).status, 201);
  assert.equal(f.insert().fee, 1500); assert.equal(f.insert().user_id, 'user-1'); assert.equal(f.insert().phone, '+8801712345678');
});
test('membership purchase requires verified account', async () => {
  for (const user of [null, { id: 'user-1', email: 'vip@example.com' }]) {
    const f = joinFixture({ user }); assert.equal((await f.call()).status, 401); assert.equal(f.calls(), 0);
  }
});
test('active membership cannot be purchased twice', async () => {
  const f = joinFixture({ membership: { status: 'active' } }); assert.equal((await f.call()).status, 409); assert.equal(f.calls(), 0);
});
test('pending membership resumes saved session without another provider checkout', async () => {
  const f = joinFixture({ membership: { status: 'pending', checkout_url: 'https://payment.rupantorpay.com/pay/existing' } });
  const response = await f.call(); assert.equal((await response.json()).paymentUrl, 'https://payment.rupantorpay.com/pay/existing'); assert.equal(f.calls(), 0);
});
test('duplicate concurrent membership insert cannot start a second provider payment', async () => {
  const f = joinFixture({ duplicate: true }); assert.equal((await f.call()).status, 409); assert.equal(f.calls(), 0);
});
test('membership terms must be accepted before a payment session is created', async () => {
  const f = joinFixture({ bodyChanges: { terms_accepted: false } }); assert.equal((await f.call()).status, 400); assert.equal(f.calls(), 0);
});
test('provider timeout retains pending membership for recovery', async () => {
  const f = joinFixture({ providerFails: true }); assert.equal((await f.call()).status, 502); assert.equal(f.insert().fee, 1500);
  const retry = joinFixture({ membership: { status: 'pending', checkout_url: null } }); assert.equal((await retry.call()).status, 409); assert.equal(retry.calls(), 0);
});
test('customer accounts cannot invoke existing admin mutation endpoints', async () => {
  let tableTouched = false;
  const server = { createClient: async () => ({ rpc: async () => ({ data: false }), from: () => { tableTouched = true; throw new Error('should not touch tables'); } }) };
  for (const [path, methods] of [
    ['app/api/categories/route.ts', ['POST']], ['app/api/categories/[id]/route.ts', ['PUT', 'DELETE']],
    ['app/api/products/[id]/route.ts', ['DELETE']], ['app/api/orders/[id]/route.ts', ['PATCH']],
  ]) {
    const route = load(path, { '@/utils/supabase/server': server, 'next/server': { NextResponse: Response } });
    for (const method of methods) assert.equal((await route[method]({}, { params: Promise.resolve({ id: 'test' }) })).status, 403);
  }
  assert.equal(tableTouched, false);
});
