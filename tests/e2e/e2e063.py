import os as _os, tempfile as _tf
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
import subprocess, sys, time, os
from playwright.sync_api import sync_playwright
SH = _OUT; os.makedirs(SH, exist_ok=True)
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8771", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
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
    b = pw.chromium.launch(); p = b.new_context(viewport={"width": 360, "height": 780}, device_scale_factor=2, locale="pl-PL", has_touch=True).new_page()
    p.on("pageerror", lambda e: errs.append(str(e))); p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    p.goto("http://localhost:8771/index.html"); p.wait_for_selector("text=Dobierz plan")
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=new-plan]")
    ok("Jak chcesz budować plan" in p.locator("main").inner_text() and p.locator("button[data-a=np-create]").count() == 2, "mode screen before exercise picking")
    ok(p.locator("#pickq").count() == 0, "picker not open yet")
    p.screenshot(path=f"{SH}/07-newplan.png"); noov(p, "newplan")
    p.locator("#np-name").fill("Moje FBW")
    click(p, "button[data-a=np-create][data-v=simple]")
    p.wait_for_selector("#pickq"); ok(True, "after choosing, exercise picker opens")
    p.fill("#pickq", "squat"); p.wait_for_timeout(150); click(p, "#picklist button[data-v=squat]")
    t = p.locator(".sheet").inner_text()
    ok(p.locator("button[data-a=item-method]").count() == 0 and p.locator("button[data-a=ef-mode]").count() == 0 and p.locator("button[data-a=orm-open]").count() == 0, "simple sheet: no progression/intensity/1RM controls")
    ok(p.locator("#it-sets").count() == 1 and p.locator("#it-rest").count() == 1 and p.locator("button[data-a=tg-mode]").count() == 2 and p.locator("input[data-a=item-prog]").count() == 1, "simple sheet: sets, rest, reps fixed/range, auto-suggest toggle")
    ok(p.locator("button[data-a=tg-mode][data-v=amrap]").count() == 0, "no AMRAP in simple")
    ok("Serie × powtórzenia × przerwa" in t, "hint shown")
    p.screenshot(path=f"{SH}/08-simple-sheet.png"); noov(p, "simple sheet")
    p.locator("#it-sets").fill("4"); click(p, "button[data-a=tg-mode][data-v=fixed]"); p.locator("#tg-lo").fill("5"); p.locator("#it-rest").fill("120")
    click(p, "button[data-a=item-save]")
    it = p.evaluate("() => window.Repsmith.S.templates.at(-1)")
    ok(it["mode"] == "simple" and it["name"] == "Moje FBW", f"plan mode simple, name kept: {it['mode']} {it['name']}")
    i0 = it["days"][0]["items"][0]
    ok(i0["sets"] == 4 and i0["reps"] == "5" and i0["rest"] == 120 and i0["rpe"] is None and not i0.get("pct"), f"saved simple item {i0['sets']}x{i0['reps']} rest {i0['rest']} rpe {i0['rpe']}")
    meta = p.locator("button[data-a=edit-item] .meta").first.inner_text()
    ok(meta == "4 × 5 · 120 s", f"row meta without method/RPE: {meta!r}")
    ok("Tryb prosty" in p.locator("main").inner_text(), "plan shows Tryb prosty")
    # second exercise: range default
    click(p, "button[data-a=day-add-ex]"); p.fill("#pickq", "curl"); p.wait_for_timeout(150); click(p, "#picklist button >> nth=0")
    ok(p.locator("button[data-a=tg-mode][data-v=range].on").count() == 1, "default isolation exercise is a range")
    click(p, "button[data-a=item-save]")
    # run a workout with the simple plan: suggestion appears after a finished session
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=start-day]")
    if p.locator("button[data-a=ready-pick]").count(): click(p, "button[data-a=ready-pick][data-v='']")
    p.wait_for_selector(".ex-card")
    c0 = p.locator(".ex-card").first
    for j in range(c0.locator(".set").count()):
        s = c0.locator(".set").nth(j); s.locator("input[data-k=weight]").fill("100"); s.locator("input[data-k=reps]").fill("5"); s.locator("button.check").click(); p.wait_for_timeout(60)
    click(p, "button[data-a=finish]"); click(p, "button[data-a=summary-save]"); p.wait_for_timeout(300)
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=start-day]")
    if p.locator("button[data-a=ready-pick]").count(): click(p, "button[data-a=ready-pick][data-v='']")
    p.wait_for_selector(".ex-card")
    sg = p.locator(".ex-card").first.locator(".sug").inner_text()
    ok("105 kg" in sg, f"simple plan: automatic progression works (P2): {sg}")
    click(p, "button[data-a=discard]"); click(p, "button[data-a=confirm-yes]")
    # turn off auto suggestions
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=open-plan] >> nth=-1"); click(p, "button[data-a=edit-item] >> nth=0")
    p.locator("input[data-a=item-prog]").uncheck(); click(p, "button[data-a=item-save]")
    ok(p.evaluate("() => window.Repsmith.S.templates.at(-1).days[0].items[0].noprog") is True, "noprog saved")
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=start-day]")
    if p.locator("button[data-a=ready-pick]").count(): click(p, "button[data-a=ready-pick][data-v='']")
    p.wait_for_selector(".ex-card")
    ok(p.locator(".ex-card").first.locator(".sug").count() == 0 or "105" not in p.locator(".ex-card").first.locator(".sug").inner_text(), "auto-suggest off: no load suggestion")
    click(p, "button[data-a=discard]"); click(p, "button[data-a=confirm-yes]")
    # switch to advanced through plan menu, item keeps data
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=open-plan] >> nth=-1")
    click(p, "button[data-a=plan-menu]"); click(p, "button[data-a=menu-pick][data-v=mode]")
    ok("Tryb zaawansowany" in p.locator("main").inner_text(), "menu switches to advanced")
    click(p, "button[data-a=edit-item] >> nth=0")
    ok(p.locator("button[data-a=ef-mode]").count() == 3 and p.locator("#it-sets").input_value() == "4", "advanced sheet shows all, data kept")
    click(p, "button[data-a=sheet-close]")
    click(p, "button[data-a=plan-mode]")
    ok("Tryb prosty" in p.locator("main").inner_text(), "chip toggles back to simple")
    # advanced item opened in simple plan: hidden-advanced note, nothing lost
    p.evaluate("() => { const R = window.Repsmith; const it = R.S.templates.at(-1).days[0].items[0]; it.method = 'P1'; it.scheme = 'topback'; it.rpe = 8; it.rpeMax = 8; it.backoffReps = '6-8'; delete it.noprog; R.persist('templates'); R.render(); }")
    click(p, "button[data-a=edit-item] >> nth=0")
    ok("ustawienia zaawansowane" in p.locator(".sheet").inner_text(), "simple sheet warns about hidden advanced settings")
    click(p, "button[data-a=item-save]")
    k = p.evaluate("() => window.Repsmith.S.templates.at(-1).days[0].items[0]")
    ok(k["method"] == "P1" and k["rpe"] == 8 and k["backoffReps"] == "6-8" and k["scheme"] == "topback", f"advanced settings untouched by simple save: {k['method']} {k['rpe']} {k['backoffReps']}")
    # advanced new plan: old flow
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=new-plan]"); click(p, "button[data-a=np-create][data-v=advanced]")
    p.wait_for_selector("#pickq"); p.fill("#pickq", "squat"); p.wait_for_timeout(150); click(p, "#picklist button[data-v=squat]")
    ok(p.locator("button[data-a=ef-mode]").count() == 3, "advanced plan: full editor")
    # library / wizard plans stay advanced
    ok(p.evaluate("() => window.Repsmith.S.templates.at(-1).mode") == "advanced", "advanced mode stored")
    b.close()
finally: srv.terminate()
real = [e for e in errs if 'ERR_TUNNEL' not in e and 'fonts' not in e]
print("ERRORS:", real); print(f"{P} pass, {F} fail")
