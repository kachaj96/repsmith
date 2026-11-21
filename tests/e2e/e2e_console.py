"""0.18: set console for other logging types: unilateral (L/R), time, bodyweight + extra kg, supersets, fixed effort."""
import os as _os, subprocess, sys, time
from playwright.sync_api import sync_playwright
import _nosplash  # noqa: F401
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8785", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
P = F = 0; errs = []
def tap(loc):  # 0.19: the console is taller (48 px keys); bring the field above it first, as a thumb scroll would
    loc.evaluate("e => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -72); }"); loc.click()
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(); p = b.new_context(viewport={"width": 360, "height": 760}, locale="pl-PL", has_touch=True).new_page()
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.goto("http://localhost:8785/index.html"); p.wait_for_selector("text=Dziś trening")
    p.evaluate("""() => { const R = window.Repsmith, S = R.S; const mk = (id, ex, sets, extra = {}) => ({ id, exId: ex, scheme: 'straight', rest: 60, backoffPct: 90, sets: Array.from({ length: sets }, (_, k) => ({ id: id + k, kind: 'work', side: null, weight: '', reps: '', rpe: '', time: '', dist: '', done: false, target: { reps: '8', rpe: 8, rpeMax: 9 } })), ...extra });
      const uni = mk('u', 'one-arm-dumbbell-row', 0); uni.sets = ['L', 'R', 'L', 'R'].map((sd, k) => ({ id: 'u' + k, kind: 'work', side: sd, weight: '', reps: '', rpe: '', time: '', dist: '', done: false, target: { reps: '10' } }));
      S.active = { id: 'w', name: 'Test', templateId: null, startedAt: Date.now(), items: [uni, mk('t', 'plank', 2), mk('b', 'pull-up', 2), mk('g1', 'lat-pulldown', 2, { group: 'g' }), mk('g2', 'pec-deck', 2, { group: 'g' })], effort: 'rir', notes: [] };
      S.view = 'workout'; R.render(); }""")
    p.wait_for_timeout(300)
    tags = p.locator(".ex-card").first.locator(".kind-btn .kl").all_inner_texts()
    ok(tags == ["1L", "1P", "2L", "2P"], f"unilateral rows tagged per side ({tags})")
    tap(p.locator(".ex-card").nth(1).locator("button.fv[data-k=time]").first); p.wait_for_timeout(100)
    ok(p.locator("#con .ct:not(.rp)").count() == 1 and "s" in p.locator("#con .ct small").first.inner_text(), "time exercise: one value in the console (seconds)")
    for k in "45": p.locator(f'#con button[data-a=con-key][data-v="{k}"]').click()
    p.locator("#con button[data-a=con-log]").click(); p.wait_for_timeout(150)
    ok(p.evaluate("() => window.Repsmith.S.active.items[1].sets[0].time") == "45", "time saved: 45 s")
    tap(p.locator(".ex-card").nth(2).locator("button.fv[data-k=weight]").first); p.wait_for_timeout(100)
    for _ in range(2): p.locator("#con button[data-a=con-step][data-k=weight][data-v='-2.5']").click()
    ok(p.evaluate("() => window.Repsmith.S.active.items[2].sets[0].weight") == "-5", "bodyweight exercise: assisted (negative extra kg) allowed with the stepper")
    p.locator("#con button[data-a=con-close]").click()
    # superset: logging set 1 of the first exercise moves the console to set 1 of its partner
    p.evaluate("() => window.Repsmith.stopTimer()")
    tap(p.locator(".ex-card").nth(3).locator("button.fv[data-k=reps]").first); p.wait_for_timeout(100)
    p.locator("#con button[data-a=con-log]").click(); p.wait_for_timeout(150)
    ok(p.evaluate("() => window.Repsmith.S.con && window.Repsmith.S.con.s") == "g20", "superset: the console moves to the partner exercise, same round")
    ok(p.evaluate("() => !window.Repsmith.S.timer"), "superset: no rest between partners")
    p.locator("#con button[data-a=con-log]").click(); p.wait_for_timeout(150)
    ok(p.evaluate("() => !!window.Repsmith.S.timer"), "superset: rest starts after the round")
    ok(p.evaluate("() => window.Repsmith.S.con && window.Repsmith.S.con.s") == "g11", "superset: back to the first exercise for round 2")
    # fixed effort shows feel chips instead of RPE numbers
    p.evaluate("() => { const S = window.Repsmith.S; S.active.effort = 'fixed'; window.Repsmith.render(); }"); p.wait_for_timeout(100)
    p.locator("#con button[data-a=con-pad][data-k=rpe]").click(); p.wait_for_timeout(80)
    ok(p.locator("#con .con-grid.three button").count() == 3, "fixed effort: easy / as planned / hard on the RPE tab")
    p.locator("#con button[data-a=con-feel][data-v=hard]").click(); p.wait_for_timeout(100)
    ok(p.evaluate("() => window.Repsmith.S.active.items[3].sets[1].rpe") == "9.5", "hard = target RPE + 1.5")
    # collapse: a finished exercise folds to one line
    p.evaluate("() => { const S = window.Repsmith.S; S.con = null; S.active.items[1].sets.forEach(x => x.done = true); window.Repsmith.render(); }"); p.wait_for_timeout(100)
    ok(p.locator(".ex-card").nth(1).get_attribute("class").find(" col") >= 0 and p.locator(".ex-card").nth(1).locator(".set").count() == 0, "finished exercise collapses")
    p.locator(".ex-card").nth(1).locator("button[data-a=ex-col]").click(); p.wait_for_timeout(100)
    ok(p.locator(".ex-card").nth(1).locator(".set").count() == 2, "and opens again on tap")
    ok(p.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"), "no horizontal overflow")
    b.close()
finally: srv.terminate()
print("ERRORS:", errs); print(f"{P} pass, {F} fail")
