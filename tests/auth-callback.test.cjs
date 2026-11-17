const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');

function fixture(fails = false) {
  const calls = [];
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('app/auth/callback/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, { exports: module.exports, module, URL,
    require(name) {
      if (name === 'next/server') return { NextResponse: { redirect: url => ({ location: url.href }) } };
      if (name === '@/utils/supabase/server') return { createClient: async () => ({ auth: {
        exchangeCodeForSession: async code => { calls.push(['code', code]); return { error: fails ? new Error('expired') : null }; },
        verifyOtp: async data => { calls.push(['token', data.token_hash, data.type]); return { error: fails ? new Error('expired') : null }; },
      } }) };
      throw new Error(`Unexpected import ${name}`);
    },
  });
  return { calls, visit: query => { const url = new URL(`https://shop.example/auth/callback${query}`); return module.exports.GET({ nextUrl: url, url: url.href }); } };
}
test('default email link exchanges PKCE code and signs into account', async () => {
  const f = fixture(); assert.equal((await f.visit('?code=valid')).location, 'https://shop.example/account');
  assert.deepEqual(f.calls, [['code', 'valid']]);
});
for (const type of ['email', 'signup', 'magiclink']) test(`custom ${type} confirmation link verifies token hash`, async () => {
  const f = fixture(); assert.equal((await f.visit(`?token_hash=valid&type=${type}`)).location, 'https://shop.example/account');
  assert.deepEqual(f.calls, [['token', 'valid', type]]);
});
test('expired or already used email link returns a visible failure', async () => {
  const f = fixture(true); assert.equal((await f.visit('?code=expired')).location, 'https://shop.example/account?signin=expired');
});
test('missing or unsupported tokens never invoke authentication', async () => {
  for (const query of ['', '?token_hash=x&type=recovery', '?token_hash=x&type=invalid', '?type=email']) {
    const f = fixture(); assert.equal((await f.visit(query)).location, 'https://shop.example/account?signin=expired'); assert.equal(f.calls.length, 0);
  }
});
test('email callback cannot redirect customers to an external URL', async () => {
  const f = fixture(); assert.equal((await f.visit('?code=valid&next=https://evil.example')).location, 'https://shop.example/account');
});
