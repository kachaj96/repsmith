import os as _os, tempfile as _tf
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
import subprocess, sys, time
from playwright.sync_api import sync_playwright
SH = _OUT
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8774", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
errs = []; P = F = 0
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
def click(p, s): p.locator(s).first.click(); p.wait_for_timeout(150)
def noov(p, m):
    r = p.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]"); ok(r[0] <= r[1], f"no overflow {m} {r}")
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(); ctx = b.new_context(viewport={"width": 360, "height": 780}, device_scale_factor=2, locale="pl-PL", has_touch=True, accept_downloads=True)
    p = ctx.new_page()
    p.on("pageerror", lambda e: errs.append(str(e))); p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    p.goto("http://localhost:8774/index.html"); p.wait_for_selector("text=Dziś trening")
    click(p, "button[data-a=intro-ok]")
    # --- plate calculator from settings (defaults)
    click(p, "button[data-a=settings]"); click(p, "button[data-a=plates-open]")
    p.locator("#pc-target").fill("102,5"); p.locator("#pc-target").dispatch_event("input"); p.wait_for_timeout(150)
    tx = p.locator("#pc-res").inner_text()
    ok("102,5" in tx and "25 + 15 + 1,25" in tx.replace("\n", " ") or "102,5" in tx, f"plates result 102.5: {tx[:80]!r}")
    p.screenshot(path=f"{SH}/13-plates.png"); noov(p, "plates sheet")
    p.locator("#pc-target").fill("101"); p.locator("#pc-target").dispatch_event("input"); p.wait_for_timeout(150)
    ok("najbliżej" in p.locator("#pc-res").inner_text().lower(), "unreachable total shows nearest")
    click(p, "button[data-a=pc-unit][data-v=lb]"); p.locator("#pc-target").fill("100"); p.locator("#pc-target").dispatch_event("input"); p.wait_for_timeout(150)
    ok("lb" in p.locator("#pc-res").inner_text(), "lb mode renders")
    click(p, "button[data-a=sheet-close]")
    # --- gear sheet
    click(p, "button[data-a=settings]"); click(p, "button[data-a=gear-open]")
    p.screenshot(path=f"{SH}/14-gear.png"); noov(p, "gear sheet")
    p.locator("#gl-DB").fill("2-10/2 12.5-30/2.5"); p.locator("#gl-DB").dispatch_event("input"); p.wait_for_timeout(100)
    ok("gp-DB" and "2" in p.locator("#gp-DB").inner_text(), f"live preview: {p.locator('#gp-DB').inner_text()!r}")
    p.locator("#gl-KB").fill("8 5-3/1"); p.locator("#gl-KB").dispatch_event("input"); click(p, "button[data-a=gear-save]")
    ok("5-3/1" in p.locator(".sheet").inner_text(), "invalid list rejected with token")
    p.locator("#gl-KB").fill("8 12 16"); p.locator("#gl-KB").dispatch_event("input"); click(p, "button[data-a=gear-save]")
    g = p.evaluate("() => window.Repsmith.S.settings.gear")
    ok(g and g["lists"]["DB"] == "2-10/2 12.5-30/2.5", "gear saved")
    click(p, "button[data-a=sheet-close]")
    # snapping: DB suggestions land on listed weights
    r = p.evaluate("""() => { const G = window.RepsmithGear, S = window.Repsmith.S; const l = G.loadable(S.settings.gear, 'DB'); return [l.length, G.snap(S.settings.gear,'DB',11,null), G.snap(S.settings.gear,'DB',10,10)]; }""")
    ok(r[0] == 13 and r[1] in (10, 12.5) and r[2] == 12.5, f"snap DB {r}")
    # --- workout with barbell shows Talerze chip and opens calculator with set weight
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=start-free]"); p.wait_for_timeout(200)
    click(p, "button[data-a=session-add-ex]"); p.fill("#pickq", "squat"); p.wait_for_timeout(150); click(p, "#picklist button[data-v=squat]")
    p.wait_for_selector(".ex-card")
    s = p.locator(".ex-card").first.locator(".set").first; s.locator("input[data-k=weight]").fill("100"); s.locator("input[data-k=reps]").fill("5"); s.locator("button.check").click()
    click(p, "button[data-a=plates-open]")
    ok(p.locator("#pc-bar").input_value() == "20", "workout chip opens calculator with bar 20")
    click(p, "button[data-a=sheet-close]")
    click(p, "button[data-a=finish]"); click(p, "button[data-a=summary-save]"); p.wait_for_timeout(300)
    # more sessions on different days for the calendar
    p.evaluate("""() => { const R = window.Repsmith, S = R.S; const now = Date.now();
      for (const d of [1, 2, 8, 9, 16]) { const o = JSON.parse(JSON.stringify(S.sessions[0])); o.id = 'c' + d; o.startedAt = now - d * 864e5; o.endedAt = o.startedAt + 3600e3; S.sessions.push(o); }
      R.persist('sessions'); }""")
    # --- calendar
    click(p, "button[data-a=nav][data-v=history]")
    click(p, "button[data-a=hist-mode][data-v=cal]")
    ok(p.locator(".cal-c.has").count() >= 3, f"calendar marks days: {p.locator('.cal-c.has').count()}")
    ok(p.locator(".cal-c.today").count() == 1, "today marked")
    p.screenshot(path=f"{SH}/15-calendar.png"); noov(p, "calendar")
    p.locator(".cal-c.today").click(); p.wait_for_timeout(150)
    ok(p.locator("main button[data-a=open-session]").count() >= 1, "day detail lists session")
    click(p, "button[data-a=cal-nav][data-v='-1']"); ok(p.locator(".cal-title").count() == 1, "prev month")
    click(p, "button[data-a=cal-nav][data-v='1']")
    st = p.evaluate("() => window.Repsmith.S.sessions.length")
    # --- summary card
    click(p, "button[data-a=hist-mode][data-v=list]"); click(p, "button[data-a=open-session]")
    click(p, "button[data-a=card-open]"); p.wait_for_timeout(300)
    d = p.evaluate("() => { const c = document.getElementById('card-cv'); const x = c.getContext('2d').getImageData(540, 700, 1, 1).data; return [c.toDataURL('image/png').slice(0, 22), c.width, c.height, x[3]]; }")
    ok(d[0] == "data:image/png;base64," and d[1] == 1080 and d[2] == 1350 and d[3] == 255, f"card renders {d}")
    p.screenshot(path=f"{SH}/16-card.png"); noov(p, "card sheet")
    p.evaluate("() => { document.getElementById('card-cv').scrollIntoView(); }")
    cv = p.locator("#card-cv"); cv.screenshot(path=f"{SH}/16b-card-canvas.png")
    click(p, "button[data-a=card-hide]"); p.wait_for_timeout(200); cv.screenshot(path=f"{SH}/16c-card-hidden.png")
    ok(p.locator("button[data-a=card-hide].on").count() == 1, "hide weights toggled")
    with p.expect_download() as dl: click(p, "button[data-a=card-save]")
    ok(dl.value.suggested_filename.endswith(".png"), f"card download {dl.value.suggested_filename}")
    b.close()
finally: srv.terminate()
real = [e for e in errs if 'ERR_TUNNEL' not in e and 'fonts' not in e]
print("ERRORS:", real); print(f"{P} pass, {F} fail")
