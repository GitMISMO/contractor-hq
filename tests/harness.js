// Opens Service Orders in a headless browser against a pretend sign-in and a pretend save
// relay, with the made-up data in fixtures.js. Nothing real is read or changed: every
// request to the real relay address is answered here, and anything else outside is blocked.
//
//   const { open, mkStore } = require('./harness');
//   const s = await open({ who: 'admin', browser, version: '20261108a' });
//
// `version` opens the Test Copy at releases/<version>/; without it the live files are used.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FX = require('./fixtures');

const ROOT = path.resolve(__dirname, '..');
const RELAY = 'https://rgvdi67cg27o5kcmiytcqbqnrm0hmztx.lambda-url.us-east-1.on.aws';
const ORIGIN = 'https://resources.mismo.org';
const S = FX.STAFF;
const USERS = {
  admin: { name: S.admin.name, email: S.admin.email, access: { 'so-northwind': 'admin', 'so-bluebird': 'admin', 'so-northwind-hours': 'admin', 'so-bluebird-hours': 'admin', 'team-hq': 'admin' } },
  vp: { name: S.vp.name, email: S.vp.email, access: { 'so-northwind': 'staff', 'so-bluebird': 'staff', 'team-hq': 'staff' } },
  president: { name: S.president.name, email: S.president.email, access: { 'so-northwind': 'staff', 'so-bluebird': 'staff' } },
  casey: { name: 'Casey Contractor', email: 'casey@northwind.test', access: { 'so-northwind-hours': 'staff' } },
  sam: { name: 'Sam Signer', email: 'sam@northwind.test', access: { 'so-northwind': 'staff' } },
  riley: { name: S.reviewer.name, email: S.reviewer.email, access: { 'team-hq': 'staff' } }
};
let SHA = 1;
function mkStore() { return { S: FX.seed(), sha: {}, head: {}, log: [] }; }
const b64 = s => Buffer.from(s, 'utf8').toString('base64');

/* The page's own relay settings name the real companies; during the checks they name the
   made-up ones instead. Everything else in the page is served exactly as it is. */
function testPage(html) {
  return html.replace(/<script>window\.RELAY=(\{[\s\S]*?\});<\/script>/, (m, json) => {
    const cfg = JSON.parse(json);
    Object.assign(cfg, FX.RELAY_CONFIG);
    return '<script>window.RELAY=' + JSON.stringify(cfg) + ';</script>';
  });
}

async function open(opts) {
  opts = opts || {};
  const store = opts.store || mkStore();
  const u = USERS[opts.who || 'admin'];
  const own = !opts.browser;
  const browser = opts.browser || await chromium.launch();
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 1280, height: 900 }, colorScheme: opts.dark ? 'dark' : 'light' });
  const page = await ctx.newPage();
  const errs = [];
  const reqs = [];   // every relay path the page asked for, so a check can prove what it never asked
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    // A refused relay call the page expects (no access, not found, a version clash it retries) is not an error.
    if (/status of (401|403|404|409|423)/.test(t)) return;
    errs.push('console: ' + t);
  });
  await ctx.route('**/*', async route => {
    const req = route.request(); const url = new URL(req.url());
    if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') return route.fulfill({ status: 200, body: '' });
    if (url.origin === RELAY) { reqs.push(decodeURIComponent(url.pathname)); return relay(route, req, url, u, store); }
    if (url.origin === ORIGIN) {
      let p = url.pathname; if (p.endsWith('/')) p += 'index.html';
      // The shared MISMO sign-in: a copy of the live /assets/session.js (tests/shared-session.js), so the
      // checks sign in, send codes and reset passwords through the same screen people see.
      if (p === '/assets/session.js') return route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(path.join(__dirname, 'shared-session.js')) });
      // The shared Back-button helper is tested as it is live (CN-033); MISMO_BACK can point at a local copy.
      if (p === '/assets/back.js') return route.fulfill({ status: 200, contentType: 'application/javascript', body: await backJs() });
      if (!p.startsWith('/contractor-hq/')) return route.fulfill({ status: 404, body: 'not part of the checks' });
      const file = path.join(ROOT, p.slice('/contractor-hq/'.length));
      if (!file.startsWith(ROOT) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: 'not found' });
      const ext = path.extname(file);
      const ct = { '.js': 'application/javascript', '.html': 'text/html', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/json' }[ext] || 'text/plain';
      let body = fs.readFileSync(file);
      if (ext === '.html') body = testPage(body.toString('utf8'));
      return route.fulfill({ status: 200, contentType: ct, body });
    }
    return route.abort();   // nothing else outside is reached during the checks
  });
  // `now` stands the page on another day (for example '2026-11-30T15:00:00'), for date rules.
  const t0 = opts.now ? new Date(opts.now).getTime() : Date.now();
  if (opts.now) await page.clock.setFixedTime(new Date(opts.now));
  const sess = { token: 't', name: u.name, email: u.email, access: u.access, expiresAt: new Date(t0 + 8 * 3600e3).toISOString() };
  if (!opts.noSession) {
    await ctx.addInitScript(([s]) => {
      // Seeded once per tab, like a real sign-in: a reload after signing out must stay signed out.
      try { if (sessionStorage.getItem('__seeded')) return; sessionStorage.setItem('__seeded', '1');
        sessionStorage.setItem('resources:service-orders:session', s); localStorage.setItem('resources:session', s); } catch (e) {}
    }, [JSON.stringify(sess)]);
  }
  const base = ORIGIN + '/contractor-hq/' + (opts.version ? 'releases/' + opts.version + '/' : '');
  await page.goto(base + (opts.path || ''));
  return { browser, ctx, page, store, errs, reqs, close: () => own ? browser.close() : ctx.close() };
}

/* The pretend relay: the same routes, answers and version clashes as the real one. */
function relay(route, req, url, u, store) {
  const parts = url.pathname.split('/').filter(Boolean);
  const proj = decodeURIComponent(parts[0]); const kind = parts[1];
  const rest = parts.slice(2).map(decodeURIComponent).join('/'); const m = req.method();
  const json = (st, b) => route.fulfill({ status: st, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(b) });
  if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
  if (kind === 'auth' && rest === 'login') {
    const body = JSON.parse(req.postData() || '{}');
    store.logins = (store.logins || 0) + 1; store.fails = store.fails || 0;
    if (store.fails >= 5) return json(423, { error: 'LOCKED', message: 'This account is locked after 5 incorrect passwords.' });
    if (body.password !== 'right') {
      store.fails++;
      if (store.fails >= 5) return json(423, { error: 'LOCKED', message: 'locked' });
      return json(401, { error: 'SIGNIN_FAILED', remaining: 5 - store.fails, message: 'That email and password do not match an account.' });
    }
    store.loginBodies = (store.loginBodies || []).concat([body]);
    // Two-step sign-in: with store.needCode set, a browser the relay does not remember gets a code.
    if (store.needCode && (!store.device || body.device !== store.device)) {
      store.tickets = (store.tickets || 0) + 1;
      return json(200, { codeRequired: true, ticket: 'tk' + store.tickets });
    }
    return json(200, { token: 't', name: u.name, email: u.email, access: u.access, expiresAt: new Date(Date.now() + 8 * 3600e3).toISOString() });
  }
  if (kind === 'auth' && rest === 'code') {
    const body = JSON.parse(req.postData() || '{}');
    store.codes = (store.codes || []).concat([body]);
    if (body.ticket !== 'tk' + store.tickets) return json(400, { error: 'OLD_CODE', message: 'That code is from an older email. Use the newest one.' });
    if (body.code !== '123456') return json(401, { error: 'WRONG_CODE', message: 'That code is not right. One more wrong code locks the account.' });
    store.device = 'dev-' + store.tickets;
    return json(200, { token: 't', device: store.device, name: u.name, email: u.email, access: u.access, expiresAt: new Date(Date.now() + 8 * 3600e3).toISOString() });
  }
  if (kind === 'auth' && rest === 'password') {
    const body = JSON.parse(req.postData() || '{}');
    if ((req.headers()['authorization'] || '') !== 'Bearer t') return json(401, { error: 'TOKEN_STALE' });
    if (body.current !== 'right') return json(400, { error: 'BAD_PASSWORD', problems: ['Your current password is not right.'] });
    store.pwChanged = body.password;
    return json(200, { token: 't2', device: 'dev-pw', email: u.email, expiresAt: new Date(Date.now() + 8 * 3600e3).toISOString() });
  }
  if (kind === 'auth' && rest === 'me') {
    if ((req.headers()['authorization'] || '') !== 'Bearer t') return json(401, { error: 'TOKEN_STALE' });
    return json(200, { name: u.name, email: u.email, access: u.access });
  }
  if (kind === 'auth' && rest === 'forgot') {
    // The real relay answers the same whether or not the account exists.
    store.forgot = (store.forgot || []).concat([JSON.parse(req.postData() || '{}').email]);
    return json(200, { ok: true });
  }
  const acc = u.access[proj];
  if (!acc) return json(403, { error: 'NO_ACCESS' });
  // A relay just woken up that GitHub turns away for its first few reads (store.flaky = how many).
  if (m === 'GET' && store.flaky > 0) { store.flaky--; store.refused = (store.refused || 0) + 1; return json(502, { error: 'GITHUB', status: 403 }); }
  const key = proj + '|' + rest;
  if (kind === 'file' && m === 'GET') {
    if (proj.endsWith('-hours') && !/^(orders-public|hours|notify)\//.test(rest)) return json(403, { error: 'PATH_NOT_READABLE' });
    const k2 = key.replace('-hours|', '|');
    const v = store.S[k2]; if (v === undefined) return json(404, { error: 'NOT_FOUND' });
    const content = v && v.__b64 ? v.__b64 : b64(JSON.stringify(v));
    return json(200, { path: rest, size: content.length, sha: 'b' + (store.sha[k2] || 0), content });
  }
  if (kind === 'data') {
    const k2 = proj + '|data/' + rest + '.json';
    if (m === 'GET') { const v = store.S[k2]; return json(200, { data: v === undefined ? null : v, sha: v === undefined ? null : 's' + (store.sha[k2] || 0) }); }
    if (m === 'PUT') {
      const body = JSON.parse(req.postData() || '{}'); const cur = 's' + (store.sha[k2] || 0);
      if (store.S[k2] !== undefined && body.sha && body.sha !== cur) return json(409, { error: 'CONFLICT' });
      store.S[k2] = body.content; store.sha[k2] = (store.sha[k2] || 0) + 1; store.log.push({ put: k2 });
      return json(200, { sha: 's' + store.sha[k2] });
    }
  }
  if (kind === 'commit' && m === 'POST') {
    const body = JSON.parse(req.postData() || '{}'); const p2 = proj.replace(/-hours$/, '');
    // A check can make a teammate save first, so this save arrives on an out-of-date copy.
    if (store.beforeCommit && !/head-probe/.test(JSON.stringify(body.files.map(f => f.path)))) {
      const fn = store.beforeCommit; store.beforeCommit = null; fn(body, p2, () => { store.head[p2] = 'c' + (SHA++); });
    }
    const h = store.head[p2] || 'c0';
    if (body.parentSha && body.parentSha !== h) return json(409, { error: 'CONFLICT', head: h });
    if (proj.endsWith('-hours') && body.files.some(f => !/^(hours|notify)\//.test(f.path))) return json(403, { error: 'PATH_NOT_WRITABLE' });
    for (const f of body.files) {
      const k2 = p2 + '|' + f.path; if (f.path === 'notify/.head-probe') continue;
      store.S[k2] = f.encoding === 'base64' ? { __b64: f.content } : JSON.parse(f.content); store.sha[k2] = (store.sha[k2] || 0) + 1;
    }
    const nh = 'c' + (SHA++); store.head[p2] = nh; store.log.push({ commit: proj, files: body.files.map(f => f.path), msg: body.message });
    return json(200, { commit: nh, savedBy: u.name });
  }
  if (kind === 'ask') return json(404, { error: 'NOT_FOUND' });
  return json(404, { error: 'NOT_FOUND' });
}

/* The shared Back-button helper (resources.mismo.org/assets/back.js), fetched once from the live copy. */
let BACK = null;
async function backJs() {
  if (BACK !== null) return BACK;
  try {
    if (process.env.MISMO_BACK) BACK = fs.readFileSync(process.env.MISMO_BACK, 'utf8');
    else { const r = await fetch('https://resources.mismo.org/assets/back.js'); BACK = r.ok ? await r.text() : ''; }
  } catch (e) { BACK = ''; }
  return BACK;
}

module.exports = { open, mkStore, USERS, FX, ROOT };
