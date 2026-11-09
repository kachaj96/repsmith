/* The start screen controller (Smith Motion Language, docs/MOTION.md). Same state machine as Runsmith's src/splash.ts.

   Two things happen on a launch and they do not know about each other: the animation in index.html (CSS, starts at first paint) and the app
   init in app.js (database, exercise file, first screen). The main UI is shown only when BOTH are done:

     playing  ->  waiting  ->  leaving  ->  done
        |            ^
        +- app ready first: stays in "playing" until the animation ends (a fast init never shortens it)

   - The animation is done when the .sp-end marker (as long as the whole timeline, hold included) has finished. With reduced motion there is no
     animation: the finished logo is shown for a short, fixed moment instead.
   - If init is slow the finished logo stays (state "waiting"); the animation is never restarted or looped. After a while a calm line says it
     takes longer, later a retry button appears, so the screen cannot hang with no way out.
   - If init fails, the animation still finishes, then the start screen leaves and the error screen that app.js drew is what the person sees.
   - While the screen is up the app below is inert. A hidden page pauses the animation, so it is seen in full when the person comes back.
     It plays on a real launch only (the flag below), never on a tab change or a return from the background. */
(function (root) {
  'use strict';
  var SPLASH_MS = 1600;          // the whole timeline, hold included: keep in step with .sp-end in index.html and TIMELINE in scripts/brand.mjs
  var REDUCED_HOLD_MS = 600, SLOW_HINT_MS = 5000, SLOW_RETRY_MS = 12000, FLAG = 'smith.splash';
  var TEXT = {
    pl: { slow: 'Wczytywanie trwa dłużej niż zwykle…', retry: 'Spróbuj ponownie' },
    en: { slow: 'Loading is taking longer than usual…', retry: 'Try again' },
  };

  /* o: { el, app, reduced, doc, store, reload }  (doc, store and reload are injectable for tests) */
  function createSplash(o) {
    var el = o.el, app = o.app, reduced = !!o.reduced, doc = o.doc || document;
    var store = o.store || (function () { try { return sessionStorage; } catch (e) { return null; } })();
    var reload = o.reload || function () { location.reload(); };
    var state = 'playing', resolveFinished;
    var finished = new Promise(function (r) { resolveFinished = r; });
    function wake() { if (app) app.removeAttribute('inert'); }
    var api = { get state() { return state; }, settle: function () {}, finished: finished };
    if (!el || (doc.documentElement.dataset && doc.documentElement.dataset.splash === 'skip')) {
      if (el) el.remove(); wake(); state = 'done'; resolveFinished(); return api;
    }

    // 1. the animation
    var animationDone = new Promise(function (resolve) {
      var over = false, seen = 0, watchdog = null;
      function fin() { if (over) return; over = true; clearInterval(watchdog); doc.removeEventListener('visibilitychange', onVis); resolve(); }
      function onVis() { el.classList.toggle('paused', !!doc.hidden); }
      var end = el.querySelector('.sp-end');
      if (reduced) setTimeout(fin, REDUCED_HOLD_MS);
      if (!end) setTimeout(fin, SPLASH_MS);
      if (end) end.addEventListener('animationend', fin);
      // the animation may have ended before this code ran (slow script loading): ask it, do not wait for an event that already fired
      var anim = !reduced && end && typeof end.getAnimations === 'function' ? end.getAnimations()[0] : null;
      if (anim) anim.finished.then(fin, function () { /* cancelled: the watchdog decides */ });
      doc.addEventListener('visibilitychange', onVis); onVis();
      // counts visible time only, so a stuck animation cannot hold the screen for ever
      watchdog = setInterval(function () { if (!doc.hidden) seen += 250; if (seen >= SPLASH_MS + 2500) fin(); }, 250);
    });

    // 2. the app
    var settle;
    var appDone = new Promise(function (r) { settle = r; });
    api.settle = settle;

    // 3. both
    var slow1, slow2;
    animationDone.then(function () {
      if (state !== 'playing') return;
      state = 'waiting';
      var hint = el.querySelector('.sp-hint');
      if (!hint) return;
      var tx = TEXT[doc.documentElement.lang === 'en' ? 'en' : 'pl'];
      slow1 = setTimeout(function () { hint.textContent = tx.slow; hint.hidden = false; }, SLOW_HINT_MS);
      slow2 = setTimeout(function () {
        var b = doc.createElement('button'); b.type = 'button'; b.className = 'sp-retry'; b.textContent = tx.retry;
        b.onclick = reload; hint.appendChild(b);
      }, SLOW_RETRY_MS);
    });
    Promise.all([animationDone, appDone]).then(function () {
      clearTimeout(slow1); clearTimeout(slow2);
      state = 'leaving';
      wake();
      el.classList.add('out');
      var gone = false;
      function remove() {
        if (gone) return; gone = true; el.remove();
        try { if (store) store.setItem(FLAG, 'played'); } catch (e) { /* storage blocked: it just plays again next time */ }
        state = 'done'; resolveFinished();
      }
      el.addEventListener('transitionend', remove);
      setTimeout(remove, reduced ? 160 : 420);
    });
    return api;
  }

  function start() {
    return createSplash({
      el: document.getElementById('splash'), app: document.getElementById('app'),
      reduced: typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }

  var API = { createSplash: createSplash, start: start, SPLASH_MS: SPLASH_MS, REDUCED_HOLD_MS: REDUCED_HOLD_MS, SLOW_HINT_MS: SLOW_HINT_MS, SLOW_RETRY_MS: SLOW_RETRY_MS, FLAG: FLAG };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else { root.RepsmithSplash = API; root.__splash = start(); }
})(typeof window !== 'undefined' ? window : globalThis);
