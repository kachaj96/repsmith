"""v0.10.4: equipment line and muscle tag on the card, set menu (failure, drop, warm-up, note, delete), exercise history sheet."""
import os as _os, tempfile as _tf, subprocess, sys, time
from playwright.sync_api import sync_playwright
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8790", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
errs = []; P = F = 0
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
def click(p, s): p.locator(s).first.click(); p.wait_for_timeout(150)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(); ctx = b.new_context(viewport={"width": 360, "height": 780}, device_scale_factor=2, locale="pl-PL", has_touch=True)
    p = ctx.new_page()
    p.on("pageerror", lambda e: errs.append(str(e))); p.on("console", lambda m: errs.append(m.text) if m.type == "error" and "TUNNEL" not in m.text and "fonts" not in m.text else None)
    p.goto("http://localhost:8790/index.html"); p.wait_for_selector("text=Dziś trening"); click(p, "button[data-a=intro-ok]")
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=nav][data-v=planlib]"); click(p, "button[data-a=plib-goal][data-v=Peak]")
    click(p, "button[data-a=plib-open][data-v=PEAK-BENCH-12]"); click(p, "button[data-a=plib-use]")
    p.evaluate("() => { const S = window.Repsmith.S; S.maxes['bench-press'] = { kg: 120, at: Date.now() }; window.Repsmith.persist('maxes'); }")
    # a finished earlier workout with the incline press, one failure and one drop set
    p.evaluate("""() => { const R = window.Repsmith, S = R.S; const at = Date.now() - 3 * 864e5;
      S.sessions.push({ id: 'old1', name: '1 · Ciężki bench', templateId: null, startedAt: at, endedAt: at + 3600e3, items: [{ id: 'oi', exId: 'incline-dumbbell-press', sets: [
        { id: 'a1', kind: 'work', done: true, weight: '30', reps: '8', rpe: '8' }, { id: 'a2', kind: 'work', done: true, weight: '30', reps: '7', rpe: '10', fail: true }, { id: 'a3', kind: 'work', done: true, weight: '22', reps: '9', rpe: '', drop: true }] }] });
      R.persist('sessions'); R.render(); }""")
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=start-day]"); click(p, "button[data-a=ready-pick][data-v='']"); p.wait_for_timeout(300)
    cards = p.locator(".ex-card")
    ok(cards.count() == 5, f"5 cards: {cards.count()}")
    c1 = cards.nth(1)
    ok("hantle" in c1.locator(".ex-sub").inner_text().lower(), "equipment line: " + c1.locator(".ex-sub").inner_text())
    ok(c1.locator(".mtag").count() == 1, "muscle tag: " + c1.locator(".mtag").inner_text())
    p.screenshot(path=f"{_OUT}/01-card.png")
    # history sheet
    c1.locator("button[data-a=ex-hist]").click(); p.wait_for_timeout(200)
    sh = p.locator("#sheet").inner_text()
    ok("30 kg" in sh or "30×8" in sh.replace(" ", ""), "history lists the old sets: " + sh.replace("\n", " | ")[:200])
    ok("upadek" in sh and "drop" in sh, "history shows failure and drop marks")
    p.screenshot(path=f"{_OUT}/02-hist.png")
    click(p, "button[data-a=hist-progress]"); p.wait_for_timeout(200)
    ok("Postęp" in p.locator("main").inner_text() or "POSTĘP" in p.locator("main").inner_text().upper(), "history opens progress")
    p.evaluate("() => window.Repsmith.S.view") 
    click(p, "button[data-a=nav][data-v=workout]")
    p.wait_for_timeout(300)
    c1 = p.locator(".ex-card").nth(1)
    # set menu: failure
    c1.locator("button.kind-btn").first.click(); p.wait_for_timeout(200)
    p.screenshot(path=f"{_OUT}/03-menu.png")
    click(p, "button[data-a=menu-pick][data-v=fail]"); p.wait_for_timeout(200)
    st = p.evaluate("() => { const s = window.Repsmith.S.active.items[1].sets[0]; return [s.fail, s.rpe, s.rpeAuto]; }")
    ok(st == [True, "10", True], f"failure sets RPE 10: {st}")
    ok("UPADEK" in p.locator(".ex-card").nth(1).inner_text().upper(), "failure tag visible")
    # drop on second set
    p.locator(".ex-card").nth(1).locator("button.kind-btn").nth(1).click(); click(p, "button[data-a=menu-pick][data-v=drop]")
    ok(p.evaluate("() => window.Repsmith.S.active.items[1].sets[1].drop") is True, "drop flag set")
    # warm-up toggle
    p.locator(".ex-card").nth(1).locator("button.kind-btn").nth(2).click(); click(p, "button[data-a=menu-pick][data-v=kind]")
    ok(p.evaluate("() => window.Repsmith.S.active.items[1].sets[2].kind") == "warmup", "set marked as warm-up")
    # note
    p.locator(".ex-card").nth(1).locator("button.kind-btn").first.click(); click(p, "button[data-a=menu-pick][data-v=note]")
    p.fill("#sn", "bujanie na końcu"); click(p, "button[data-a=setnote-save]")
    ok(p.evaluate("() => window.Repsmith.S.active.items[1].sets[0].note") == "bujanie na końcu", "set note saved")
    p.screenshot(path=f"{_OUT}/04-flags.png", full_page=True)
    # unilateral pair delete (triceps one-arm = item 4)
    n0 = p.evaluate("() => window.Repsmith.S.active.items[4].sets.length")
    p.locator(".ex-card").nth(4).locator("button.kind-btn").first.click(); click(p, "button[data-a=menu-pick][data-v=del]")
    n1 = p.evaluate("() => window.Repsmith.S.active.items[4].sets.length")
    ok(n0 - n1 == 2, f"deleting a unilateral set removes both sides: {n0}->{n1}")
    # done set with fail + drop excluded from PR/e1RM
    print("errors:", errs); b.close()
finally:
  srv.terminate()
print(f"{P} pass, {F} fail")
