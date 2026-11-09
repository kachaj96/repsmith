/* The start screen controller (splash.js): the main UI waits for BOTH the animation and the app. Plain node, with a small stand-in for the DOM.
   The animation is a CSS timeline in index.html, so its end is signalled by the animationend event of the .sp-end marker, as a browser does. */
const { mock } = require('node:test');
const fs = require('fs'), path = require('path'); const A = p => path.join(__dirname, '../..', p);
const Splash = require('../../splash.js');
let P = 0, F = 0; const ok = (c, m) => { if (c) P++; else { F++; console.log('FAIL', m); } };
const flush = async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); };

function fixture({ skip = false, hidden = false, lang = 'pl' } = {}) {
  const listeners = {};
  const doc = {
    hidden, documentElement: { lang, dataset: skip ? { splash: 'skip' } : {} },
    addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); }, removeEventListener: (t, f) => { listeners[t] = (listeners[t] || []).filter(x => x !== f); },
    createElement: () => ({ append() {}, set textContent(v) { this._t = v; } }), fire: t => (listeners[t] || []).forEach(f => f()),
  };
  const cls = new Set(), endL = {}, tL = {};
  const hint = { hidden: true, textContent: '', kids: [], appendChild(k) { this.kids.push(k); } };
  const end = { addEventListener: (t, f) => { endL[t] = f; } };
  const el = {
    removed: false, classList: { add: c => cls.add(c), remove: c => cls.delete(c), contains: c => cls.has(c), toggle: (c, on) => (on ? cls.add(c) : cls.delete(c)) },
    querySelector: s => (s === '.sp-end' ? end : s === '.sp-hint' ? hint : null), addEventListener: (t, f) => { tL[t] = f; }, remove() { this.removed = true; },
  };
  const attrs = new Set(['inert']);
  const app = { removeAttribute: a => attrs.delete(a), hasAttribute: a => attrs.has(a) };
  const store = { m: {}, setItem(k, v) { this.m[k] = v; }, getItem(k) { return this.m[k] ?? null; } };
  let reloads = 0;
  return { doc, el, app, hint, store, cls, end: () => endL.animationend(), reloads: () => reloads, make: reduced => Splash.createSplash({ el, app, reduced: !!reduced, doc, store, reload: () => { reloads++; } }) };
}

(async () => {
  mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const T = ms => { mock.timers.tick(ms); };

  { // a fast init never shortens the animation
    const f = fixture(); const s = f.make(false); s.settle('ready'); T(Splash.SPLASH_MS - 50); await flush();
    ok(s.state === 'playing' && !f.el.removed && !f.cls.has('out') && f.app.hasAttribute('inert'), 'fast init: 50 ms before the end the screen is up, the app inert');
    f.end(); await flush();
    ok(s.state === 'leaving' && f.cls.has('out') && !f.app.hasAttribute('inert'), 'fast init: when the animation ends it fades out and the app is usable');
    T(500); await flush();
    ok(s.state === 'done' && f.el.removed && f.store.m['smith.splash'] === 'played', 'fast init: the screen is removed and the session flag is set');
  }
  { // slow init
    const f = fixture(); const s = f.make(false); f.end(); await flush();
    ok(s.state === 'waiting', 'slow init: animation done, app not: waiting');
    T(Splash.SLOW_HINT_MS + 10); await flush();
    ok(f.hint.hidden === false && /dłużej/.test(f.hint.textContent) && f.hint.kids.length === 0, 'slow init: a calm line after 5 s, no retry yet');
    T(Splash.SLOW_RETRY_MS - Splash.SLOW_HINT_MS); await flush();
    ok(f.hint.kids.length === 1, 'slow init: a retry button after 12 s');
    ok(s.state === 'waiting' && !f.cls.has('out') && f.app.hasAttribute('inert') && !f.el.removed, 'slow init: the same finished screen stays, not restarted, app not shown');
    s.settle('ready'); await flush(); T(500); await flush();
    ok(s.state === 'done' && !f.app.hasAttribute('inert'), 'slow init: the app appears as soon as it is ready');
  }
  { // failed init
    const f = fixture(); const s = f.make(false); s.settle('failed'); await flush();
    ok(s.state === 'playing' && f.app.hasAttribute('inert'), 'failed init: the animation still finishes first');
    f.end(); await flush(); T(500); await flush();
    ok(s.state === 'done' && f.el.removed && !f.app.hasAttribute('inert'), 'failed init: then the screen leaves and the error screen below is usable');
  }
  { // stuck animation
    const f = fixture(); const s = f.make(false); s.settle('ready'); T(Splash.SPLASH_MS + 2500 + 600); await flush(); T(500); await flush();
    ok(s.state === 'done', 'watchdog: a stuck animation cannot hold the screen');
  }
  { // hidden page
    const f = fixture({ hidden: true }); const s = f.make(false); s.settle('ready');
    ok(f.cls.has('paused'), 'hidden: the animation is paused');
    T(20000); await flush();
    ok(s.state === 'playing', 'hidden: unseen time does not count');
    f.doc.hidden = false; f.doc.fire('visibilitychange');
    ok(!f.cls.has('paused'), 'visible again: the animation resumes');
    f.end(); await flush(); T(500); await flush();
    ok(s.state === 'done', 'visible again: finishes normally');
  }
  { // reduced motion
    const f = fixture(); const s = f.make(true); s.settle('ready'); T(Splash.REDUCED_HOLD_MS - 50); await flush();
    ok(s.state === 'playing', 'reduced motion: the finished logo is held for a fixed moment');
    T(60); await flush(); ok(s.state === 'leaving', 'reduced motion: then it leaves');
    T(200); await flush(); ok(s.state === 'done', 'reduced motion: with a short crossfade');
  }
  { // same session
    const f = fixture({ skip: true }); const s = f.make(false);
    ok(s.state === 'done' && f.el.removed && !f.app.hasAttribute('inert'), 'same session: no start screen, the app is not left inert');
  }
  mock.timers.reset();

  // the files agree
  const html = fs.readFileSync(A('index.html'), 'utf8'), css = fs.readFileSync(A('app.css'), 'utf8');
  ok(html.includes(`animation: sp-end ${Splash.SPLASH_MS / 1000}s`), 'the end marker lasts as long as SPLASH_MS');
  ok(html.includes('<div id="app" inert>'), 'the app starts inert');
  const rm = (html.match(/prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/) || [])[1] || '';
  ok(['.sp-tile', '.sp-name', '.sp-rv', '.sp-end'].every(s => rm.includes(s)) && rm.includes('stroke-dashoffset: 0'), 'reduced motion switches every animation off and shows the finished logo');
  ok(!/#splash/.test(css), 'app.css no longer carries start screen rules (they live next to the markup)');
  ok(html.indexOf('splash.js') > 0 && html.indexOf('splash.js') < html.indexOf('app.js'), 'splash.js loads before app.js');
  console.log(`splash tests: ${P} pass, ${F} fail`); process.exit(F ? 1 : 0);
})();
