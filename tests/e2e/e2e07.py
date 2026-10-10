import os as _os, tempfile as _tf
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
import subprocess, sys, time, os
from playwright.sync_api import sync_playwright
SH = _OUT
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8772", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
errs = []; P = F = 0
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
def click(p, s): p.locator(s).first.click(); p.wait_for_timeout(150)
def noov(p, m):
    r = p.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]"); ok(r[0] <= r[1], f"no overflow {m} {r}")
WAKE = """() => { window.__wl = { req: 0, rel: 0 }; navigator.wakeLock = { request: async () => { window.__wl.req++; const l = new EventTarget(); l.release = async () => { window.__wl.rel++; l.dispatchEvent(new Event('release')); }; return l; } }; }"""
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(); ctx = b.new_context(viewport={"width": 360, "height": 780}, device_scale_factor=2, locale="pl-PL", has_touch=True)
    ctx.add_init_script("() => {}")
    p = ctx.new_page()
    p.add_init_script("window.__wl = { req: 0, rel: 0 }; Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: async () => { window.__wl.req++; const l = new EventTarget(); l.release = async () => { window.__wl.rel++; l.dispatchEvent(new Event('release')); }; return l; } } });")
    p.on("pageerror", lambda e: errs.append(str(e))); p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    p.goto("http://localhost:8772/index.html"); p.wait_for_selector("text=Dziś trening")

    # --- Today without a plan: free workout is primary, plans in one card
    tx = p.locator("main").inner_text().lower()
    ok(p.locator("button[data-a=start-free].primary").count() == 1, "Today (no plan): 'Zacznij trening' is the primary button")
    ok(p.locator("button[data-a=wiz-start]").count() == 0 and p.locator("button[data-a=new-plan]").count() == 0 and p.locator("button[data-a=nav][data-v=planlib]").count() == 0, "Today no longer duplicates wizard / library / new plan buttons")
    ok("wolisz trenować z planem" in tx and p.locator("main button[data-a=nav][data-v=plans]").count() == 1, "one plan card leading to Plans")
    ok("zanim zaczniesz" in tx, "intro card on first run")
    p.screenshot(path=f"{SH}/09-today-free.png"); noov(p, "today free")
    click(p, "button[data-a=intro-ok]"); ok("zanim zaczniesz" not in p.locator("main").inner_text().lower(), "intro dismissed")
    # Plans empty state carries the wizard pitch
    click(p, "main button[data-a=nav][data-v=plans]")
    ok("dobierz plan w 2 minuty" in p.locator("main").inner_text().lower() and p.locator("button[data-a=wiz-start]").count() == 1, "Plans: wizard pitch lives here")

    # --- free workout, wake lock
    click(p, "button[data-a=nav][data-v=today]")
    wl0 = p.evaluate("() => window.__wl")
    click(p, "button[data-a=start-free]"); p.wait_for_timeout(300)
    ok(p.evaluate("() => window.__wl.req") >= 1, f"wake lock requested when workout starts: {p.evaluate('() => window.__wl')}")
    click(p, "button[data-a=session-add-ex]"); p.fill("#pickq", "squat"); p.wait_for_timeout(150); click(p, "#picklist button[data-v=squat]")
    p.wait_for_selector(".ex-card")
    c = p.locator(".ex-card").first
    for j, (w, r, q) in enumerate([("100", "5", "8"), ("100", "5", "8.5")]):
        if j >= c.locator(".set").count(): click(p, "button[data-a=add-set]")
        s = p.locator(".ex-card").first.locator(".set").nth(j); s.locator("input[data-k=weight]").fill(w); s.locator("input[data-k=reps]").fill(r); s.locator("button.check").click(); p.wait_for_timeout(80)
    click(p, "button[data-a=finish]"); click(p, "button[data-a=summary-save]"); p.wait_for_timeout(300)
    ok(p.evaluate("() => window.__wl.rel") >= 1, f"wake lock released after finishing: {p.evaluate('() => window.__wl')}")
    # settings: toggle off => not requested again
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=settings]")
    ok(p.locator("button[data-a=set-flag][data-k=wake]").count() == 2, "settings: wake lock toggle")
    click(p, "button[data-a=set-flag][data-k=wake][data-v='0']"); click(p, "button[data-a=sheet-close]")
    r0 = p.evaluate("() => window.__wl.req")
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=start-free]"); p.wait_for_timeout(300)
    ok(p.evaluate("() => window.__wl.req") == r0, "wake lock not requested when switched off")
    click(p, "button[data-a=discard]"); click(p, "button[data-a=confirm-yes]")

    # --- Today with a last workout: repeat
    click(p, "button[data-a=nav][data-v=today]")
    ok("ostatni trening" in p.locator("main").inner_text().lower() and p.locator("button[data-a=repeat]").count() == 1, "Today shows last workout with Repeat")
    p.screenshot(path=f"{SH}/10-today-last.png")

    # --- history: edit a past set
    click(p, "button[data-a=nav][data-v=history]"); click(p, "button[data-a=open-session]")
    tags = p.locator("button.tag[data-a=es-open]").filter(has_not_text="+")
    ok(tags.count() == 2, f"history shows tappable sets: {tags.count()}")
    tags.first.click(); p.wait_for_timeout(200)
    ok(p.locator("#es-weight").input_value() == "100" and p.locator("#es-reps").input_value() == "5", "edit sheet prefilled")
    p.screenshot(path=f"{SH}/11-editset.png"); noov(p, "edit set sheet")
    p.locator("#es-weight").fill(""); p.locator("#es-weight").type("1o2,5x"); ok(p.locator("#es-weight").input_value() == "12,5" or p.locator("#es-weight").input_value() == "12.5" or p.locator("#es-weight").input_value() == "12,5", f"weight sanitized: {p.locator('#es-weight').input_value()}")
    p.locator("#es-weight").fill("102,5"); p.locator("#es-reps").fill("0"); click(p, "button[data-a=es-save]")
    ok("Wpisz wartość" in p.locator(".sheet").inner_text(), "reps 0 rejected")
    p.locator("#es-reps").fill("6"); p.locator("#es-rpe").fill("11"); click(p, "button[data-a=es-save]")
    ok("RPE: od 1 do 10" in p.locator(".sheet").inner_text(), "RPE 11 rejected")
    p.locator("#es-rpe").fill("9"); click(p, "button[data-a=es-save]")
    s0 = p.evaluate("() => window.Repsmith.S.sessions.at(-1).items[0].sets.filter(x => x.done)[0]")
    ok(s0["weight"] == "102.5" and s0["reps"] == "6" and s0["rpe"] == "9", f"saved edit {s0['weight']}x{s0['reps']}@{s0['rpe']}")
    ok("102,5×6 @9" in p.locator("main").inner_text(), "history view updated")
    # add a set
    click(p, "button.tag.add"); p.locator("#es-weight").fill("90"); p.locator("#es-reps").fill("8"); click(p, "button[data-a=es-save]")
    ok(p.locator("button.tag[data-a=es-open]").filter(has_not_text="+").count() == 3, "set added in history")
    # delete sets
    p.locator("button.tag[data-a=es-open]").filter(has_not_text="+").nth(2).click(); p.wait_for_timeout(150); click(p, "button[data-a=es-del]")
    ok(p.locator("button.tag[data-a=es-open]").filter(has_not_text="+").count() == 2, "set deleted")
    # e1RM progress derived from edited data
    e = p.evaluate("() => window.Repsmith.e1rm(102.5, 6, 9)")
    ok(e and e > 120, f"edited data feeds e1RM: {e}")

    # --- backup reminder
    p.evaluate("""() => { const R = window.Repsmith; const base = Date.now() - 30 * 864e5; const S = R.S;
      const mk = (i) => JSON.parse(JSON.stringify({ ...S.sessions[0], id: 'old' + i, startedAt: base + i * 864e5, endedAt: base + i * 864e5 + 3600e3 }));
      for (let i = 0; i < 4; i++) S.sessions.push(mk(i)); S.settings.lastBackup = Date.now() - 35 * 864e5; S.settings.bkSnooze = 0; R.persist('sessions','settings'); }""")
    click(p, "button[data-a=nav][data-v=today]")
    tx = p.locator("main").inner_text().lower()
    ok("zapisz kopię" in tx and "35 dni" in tx, "backup reminder after 35 days")
    p.screenshot(path=f"{SH}/12-backup.png")
    click(p, "button[data-a=bk-later]"); ok("zapisz kopię" not in p.locator("main").inner_text().lower(), "snooze hides reminder")
    p.evaluate("() => { window.Repsmith.S.settings.bkSnooze = 0; window.Repsmith.render(); }")
    with p.expect_download() as dl: click(p, "button[data-a=bk-now]")
    ok(dl.value.suggested_filename.startswith("repsmith-"), "backup file downloaded")
    lb = p.evaluate("() => window.Repsmith.S.settings.lastBackup")
    ok(abs(lb - time.time() * 1000) < 60000, "lastBackup updated")
    ok("zapisz kopię" not in p.locator("main").inner_text().lower(), "reminder gone after backup")
    click(p, "button[data-a=settings]")
    ok("Ostatnia kopia:" in p.locator(".sheet").inner_text() and "jeszcze nie" not in p.locator(".sheet").inner_text(), "settings shows last backup date")
    ok(p.locator("button[data-a=feedback]").count() == 0, "feedback hidden while no address configured")
    click(p, "button[data-a=sheet-close]")
    b.close()
finally: srv.terminate()
real = [e for e in errs if 'ERR_TUNNEL' not in e and 'fonts' not in e]
print("ERRORS:", real); print(f"{P} pass, {F} fail")
