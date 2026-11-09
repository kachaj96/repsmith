"""The start animation (docs/MOTION.md): the whole timeline plays before the main UI, whatever the init speed; no replay; failures; themes;
reduced motion; sizes. Does not import _nosplash: here the start is a real launch."""
import os as _os, subprocess, sys, time
from playwright.sync_api import sync_playwright
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8793", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
URL = "http://localhost:8793/index.html"
P = F = 0
def ok(c, m, extra=""):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m, extra)

WATCH = """() => {
  window.__sp = { out: null, usable: null };
  new MutationObserver(() => {
    const sp = document.getElementById('splash'), app = document.getElementById('app');
    if (sp && sp.classList.contains('out') && window.__sp.out === null) window.__sp.out = performance.now();
    if (app && !app.hasAttribute('inert') && window.__sp.usable === null) window.__sp.usable = performance.now();
  }).observe(document, { subtree: true, attributes: true, childList: true });
}"""
SLOW = """() => { const f = window.fetch; window.fetch = (u, ...a) => String(u).includes('exercises.json') ? new Promise(r => setTimeout(r, 3500)).then(() => f(u, ...a)) : f(u, ...a); }"""
FAIL = """() => { const f = window.fetch; window.fetch = (u, ...a) => String(u).includes('exercises.json') ? Promise.reject(new Error('boom')) : f(u, ...a); }"""
def page_for(b, init=(), **kw):
    ctx = b.new_context(locale="pl-PL", **kw); p = ctx.new_page()
    errs = []; p.on("pageerror", lambda e: errs.append(str(e)))
    for s in init: p.add_init_script("(" + s + ")()")
    p.goto(URL); return ctx, p, errs

try:
  with sync_playwright() as pw:
    b = pw.chromium.launch()
    VP = {"viewport": {"width": 390, "height": 844}}
    # cold start, fast init
    ctx, p, errs = page_for(b, [WATCH], **VP)
    p.wait_for_selector("#splash", state="attached"); p.wait_for_timeout(900)
    mid = p.evaluate("() => ({ splash: !!document.getElementById('splash'), out: document.getElementById('splash')?.classList.contains('out'), inert: document.getElementById('app').hasAttribute('inert') })")
    ok(mid["splash"] and not mid["out"] and mid["inert"], "start: 0.9 s in, the start screen is up and the app below is inert (a fast init does not cut it short)", mid)
    offs = p.evaluate("() => [...document.querySelectorAll('.sp-rv')].map(x => parseFloat(getComputedStyle(x).strokeDashoffset))")
    ok(any(o > 0 for o in offs), "start: at 0.9 s the symbol is still being drawn", offs)
    p.wait_for_selector("#splash", state="detached", timeout=4000)
    t = p.evaluate("() => window.__sp")
    ok(t["out"] is not None and t["out"] >= 1550 and t["usable"] >= t["out"] - 5 and t["usable"] < 2600, "start: the app is usable only after the full timeline (>= 1.6 s), the screen fades first", t)
    ok(p.locator("text=Dziś trening").count() > 0 and not p.evaluate("() => document.getElementById('app').hasAttribute('inert')"), "start: the main screen is there and usable")
    ok(not errs, "start: no page errors", errs)
    p.evaluate("() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }")
    p.wait_for_timeout(300)
    ok(p.locator("#splash").count() == 0, "start: no replay after a return from the background")
    p.reload(); p.wait_for_timeout(200)
    ok(p.locator("#splash:visible").count() == 0 and not p.evaluate("() => document.getElementById('app').hasAttribute('inert')"), "start: a reload in the same session shows the app at once")
    ctx.close()

    # slow init
    ctx, p, errs = page_for(b, [WATCH, SLOW], **VP)
    p.wait_for_selector("#splash", state="attached"); p.wait_for_timeout(2800)
    st = p.evaluate("() => ({ splash: !!document.getElementById('splash'), out: document.getElementById('splash')?.classList.contains('out'), inert: document.getElementById('app').hasAttribute('inert'), running: document.getAnimations().filter(a => a.playState === 'running').length, name: getComputedStyle(document.querySelector('.sp-name')).opacity, ui: document.querySelectorAll('#app .brand').length })")
    ok(st["splash"] and not st["out"] and st["inert"] and st["running"] == 0 and st["name"] == "1" and st["ui"] == 0, "slow init: the finished logo stays, nothing runs or restarts, no unready UI", st)
    p.wait_for_selector("#splash", state="detached", timeout=6000)
    t = p.evaluate("() => window.__sp")
    ok(t["usable"] >= 3400, "slow init: the app appears when it is ready (about 3.5 s), not before", t)
    ctx.close()

    # failed init
    ctx, p, errs = page_for(b, [FAIL], **VP)
    p.wait_for_selector("#splash", state="attached"); p.wait_for_selector("#splash", state="detached", timeout=5000)
    ok("Nie udało się uruchomić" in p.inner_text("#app") and p.locator("#app button:has-text('Spróbuj ponownie')").count() == 1 and not p.evaluate("() => document.getElementById('app').hasAttribute('inert')"), "failed init: the start screen leaves, the error and a retry button are shown")
    ctx.close()

    # light and dark
    for scheme, bg, name in (("light", "rgb(244, 245, 246)", None), ("dark", "rgb(11, 14, 17)", None)):
        ctx, p, errs = page_for(b, color_scheme=scheme, **VP)
        p.wait_for_selector("#splash", state="attached")
        c = p.evaluate("() => ({ bg: getComputedStyle(document.getElementById('splash')).backgroundColor, tile: document.querySelector('.sp-tile rect').getAttribute('fill') })")
        ok(c["bg"] == bg and c["tile"] == "#9C421D", f"start [{scheme}]: background and tile colours", c)
        ctx.close()

    # reduced motion
    ctx, p, errs = page_for(b, [WATCH], reduced_motion="reduce", **VP)
    p.wait_for_selector("#splash", state="attached")
    r = p.evaluate("() => ({ anims: document.getAnimations().filter(a => a.animationName && a.animationName.startsWith('sp-')).length, name: getComputedStyle(document.querySelector('.sp-name')).opacity, off: [...document.querySelectorAll('.sp-rv')].every(x => parseFloat(getComputedStyle(x).strokeDashoffset) === 0) })")
    ok(r["anims"] == 0 and r["name"] == "1" and r["off"], "reduced motion: no animation, the finished logo from the first frame", r)
    p.wait_for_selector("#splash", state="detached", timeout=3000)
    t = p.evaluate("() => window.__sp")
    ok(550 <= t["usable"] < 1800, "reduced motion: a short fixed moment, then the app", t)
    ctx.close()

    # sizes
    for w, h in ((320, 568), (360, 740), (412, 915), (768, 1024)):
        ctx, p, errs = page_for(b, viewport={"width": w, "height": h})
        p.wait_for_selector("#splash", state="attached"); p.wait_for_timeout(1300)
        g = p.evaluate("() => { const r = document.querySelector('.sp-tile').getBoundingClientRect(), n = document.querySelector('.sp-name').getBoundingClientRect(); return { cx: (r.left + r.right) / 2, top: r.top, tb: r.bottom, nl: n.left, nr: n.right, nb: n.bottom }; }")
        ok(abs(g["cx"] - w / 2) < 1 and g["top"] > 0 and g["nb"] < h and g["nl"] > 0 and g["nr"] < w and g["nb"] > g["tb"], f"start [{w}x{h}]: centred, wordmark below, all inside", g)
        ctx.close()
    b.close()
finally:
    srv.terminate()
print(f"splash e2e: {P} pass, {F} fail"); sys.exit(1 if F else 0)
