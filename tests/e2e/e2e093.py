import os as _os, tempfile as _tf, sys, subprocess, time, json
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
FIX = _os.path.join(_HERE, "..", "fixtures", "hevy_sample.csv")
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8783", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
errs = []; P = F = 0
def settings(p):
    # 0.10+ groups the settings in collapsible sections: open them all first
    p.locator("button[data-a=settings]").first.click(); p.wait_for_timeout(150)
    p.evaluate("() => document.querySelectorAll('.sheet details').forEach(d => { d.open = true; })")

def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
def click(p, s): p.locator(s).first.click(); p.wait_for_timeout(250)
INIT = """() => { const o = IDBObjectStore.prototype.put; IDBObjectStore.prototype.put = function () { if (window.__failPut) throw new DOMException('quota', 'QuotaExceededError'); return o.apply(this, arguments); }; }"""
n = lambda p: p.evaluate("() => window.Repsmith.S.sessions.length")
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(); ctx = b.new_context(viewport={"width": 402, "height": 874}, locale="pl-PL", has_touch=True)
    p = ctx.new_page(); p.on("pageerror", lambda e: errs.append(str(e)))
    reqs = []; p.on("request", lambda r: reqs.append(r.url))
    p.add_init_script("(" + INIT + ")()")
    p.goto("http://localhost:8783/index.html"); p.wait_for_selector("text=Dziś trening"); click(p, "button[data-a=intro-ok]")
    p.wait_for_timeout(500)
    ext = [u for u in reqs if not u.startswith("http://localhost") and not u.startswith("data:")]
    ok(not ext, f"no request leaves localhost: {ext[:3]}")
    ok(p.evaluate("async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').length; }") >= 1, "local fonts load")
    # --- save failure bar
    p.evaluate("() => { window.__failPut = true; }")
    ok(p.evaluate("() => window.Repsmith.persist('settings')") is False, "persist reports failure")
    p.wait_for_timeout(200)
    ok(p.locator("#savebar").count() == 1 and "Nie udało się zapisać" in p.locator("#savebar").inner_text(), "failure banner shown")
    ok(p.locator("#savebar button[data-a=bk-now]").count() == 1, "banner offers a backup")
    p.evaluate("() => { window.__failPut = false; }")
    ok(p.evaluate("() => window.Repsmith.persist('settings')") is True, "persist ok again")
    p.wait_for_timeout(100); ok(p.locator("#savebar").count() == 0, "banner clears after a good save")
    # --- hevy import needs a safety copy
    settings(p); p.set_input_files("#hevyfile", FIX); p.wait_for_selector(".hv-r")
    p.evaluate("() => { window.__failPut = true; }"); click(p, "button[data-a=hv-go]"); p.wait_for_timeout(300)
    ok(n(p) == 0, "import refused when the safety copy cannot be saved")
    ok("niczego nie zmieniam" in p.locator("body").inner_text(), "message says nothing changed")
    p.evaluate("() => { window.__failPut = false; }")
    click(p, "button[data-a=hv-go]"); p.wait_for_timeout(500)
    ok(n(p) == 2, "import works with the safety copy")
    # (0.9.3-only layout checks for the Today backup banner and the history row are not part of 0.11, which keeps the 0.10 layout)
    # undo hevy
    settings(p)
    ok(p.locator("button[data-a=undo-import]").count() == 1, "undo button after import")
    p.evaluate("() => { const R = window.Repsmith; R.S.sessions.push({ id: 'x1', name: 'later', startedAt: Date.now(), endedAt: Date.now() + 1000, items: [], notes: [] }); }")
    click(p, "button[data-a=undo-import]"); p.wait_for_timeout(200)
    tx = p.locator(".sheet").inner_text(); ok("znikną" in tx, f"undo says what is lost: {tx[:120]!r}")
    click(p, "button[data-a=confirm-yes]"); p.wait_for_timeout(400)
    ok(n(p) == 0 and p.evaluate("() => window.Repsmith.S.customExercises.length") == 0, "undo restores the state before the import")
    settings(p); ok(p.locator("button[data-a=undo-import]").count() == 0, "undo button gone after use")
    click(p, "button[data-a=sheet-close]")
    # --- backup file import
    settings(p); p.set_input_files("#hevyfile", FIX); p.wait_for_selector(".hv-r"); click(p, "button[data-a=hv-go]"); p.wait_for_timeout(400)
    bk = p.evaluate("() => { const o = window.Repsmith.backupObj(); return o; }")
    old = dict(bk); old["sessions"] = bk["sessions"][:1]; old["exportedAt"] = "2026-01-05T10:00:00.000Z"
    f1 = _os.path.join(_tf.gettempdir(), "bk_old.json"); open(f1, "w").write(json.dumps(old))
    new = dict(bk); new["schema"] = 99; f2 = _os.path.join(_tf.gettempdir(), "bk_new.json"); open(f2, "w").write(json.dumps(new))
    settings(p); p.set_input_files("#importfile", f2); p.wait_for_timeout(300)
    ok("nowszej wersji" in p.locator("body").inner_text() and n(p) == 2, "backup from a newer schema is refused")
    settings(p) if p.locator(".sheet").count() == 0 else None
    p.set_input_files("#importfile", f1); p.wait_for_timeout(300)
    tx = p.locator(".sheet").inner_text(); ok("5 sty 2026" in tx and "teraz treningów: 2" in tx, f"confirm names date and counts: {tx[:150]!r}")
    click(p, "button[data-a=confirm-yes]"); p.wait_for_timeout(400)
    ok(n(p) == 1, "older backup loaded")
    settings(p); click(p, "button[data-a=undo-import]"); click(p, "button[data-a=confirm-yes]"); p.wait_for_timeout(400)
    ok(n(p) == 2, "undo brings back the state before loading the backup")
    # --- sizes and contrast on real screens
    def minfont():
        return p.evaluate("""() => { let m = 99, who = ''; for (const el of document.querySelectorAll('body *')) { if (!el.childNodes.length) continue; const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (!own) continue; const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue; const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < m) { m = fs; who = el.className || el.tagName; } } return [m, who]; }""")
    for v in ["today", "history", "plans", "progress"]:
        if p.locator(f"button[data-a=nav][data-v={v}]").count(): click(p, f"button[data-a=nav][data-v={v}]")
        m = minfont(); ok(m[0] >= 12, f"smallest text on {v}: {m}")
        ok(p.evaluate("() => document.documentElement.scrollWidth <= innerWidth"), f"no horizontal overflow on {v}")
    settings(p); m = minfont(); ok(m[0] >= 12, f"smallest text in settings: {m}")
    cr = p.evaluate("""() => { const lum = c => { const [r, g, b] = c.match(/\\d+/g).map(Number).map(x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
      const ratio = (a, b) => { const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x); return (h + .05) / (l + .05); };
      const i = document.querySelector('.sheet input, .sheet select'); const cs = getComputedStyle(i); const bg = getComputedStyle(document.body).backgroundColor;
      return [ratio(cs.borderTopColor, bg), ratio(cs.borderTopColor, cs.backgroundColor)]; }""")
    ok(cr[0] >= 3 and cr[1] >= 3, f"input outline contrast on page and on its own fill: {cr}")
    p.screenshot(path=f"{_OUT}/93-settings.png")
    ok(not errs, f"no page errors {errs[:2]}")
    b.close()
finally: srv.terminate()
print(f"{P} pass, {F} fail")
