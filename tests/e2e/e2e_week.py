import os as _os, tempfile as _tf, subprocess, sys, time
from playwright.sync_api import sync_playwright
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8775", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
P = F = 0; errs = []
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(); p = b.new_context(viewport={"width": 360, "height": 780}, locale="pl-PL", has_touch=True).new_page()
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.goto("http://localhost:8775/index.html"); p.wait_for_selector("text=Dziś trening")
    def seed(days):
        p.evaluate("""(days) => { const R = window.Repsmith, S = R.S; S.sessions = [];
          const mk = (d, i) => ({ id: 'w' + i, name: 'Trening ' + i, startedAt: Date.now() - d * 864e5, endedAt: Date.now() - d * 864e5 + 3600e3,
            items: [{ id: 'i' + i, exId: 'squat', sets: [{ id: 's' + i, done: true, kind: 'work', weight: '100', reps: '5' }] }] });
          days.forEach((d, i) => S.sessions.push(mk(d, i))); R.render(); }""", days)
        p.wait_for_timeout(150)
    seed([0.5, 1.5, 3, 5, 6])
    ok(p.locator("button[data-a=repeat]").count() == 3, "5 sessions in a week: 3 rows shown")
    ok(p.locator("button[data-a=week-toggle]").count() == 1, "toggle present")
    p.locator("button[data-a=week-toggle]").click(); p.wait_for_timeout(150)
    ok(p.locator("button[data-a=repeat]").count() == 5, "expanded shows all 5")
    ok(p.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"), "no overflow")
    p.locator("button[data-a=week-toggle]").click(); p.wait_for_timeout(100)
    seed([2]); ok(p.locator("button[data-a=repeat]").count() == 1 and p.locator("button[data-a=week-toggle]").count() == 0, "one session: no toggle")
    seed([20, 30]); ok(p.locator("button[data-a=repeat]").count() == 1 and "ostatni trening" in p.locator("main").inner_text().lower(), "nothing this week: falls back to the last workout")
    p.locator("button[data-a=repeat]").click(); p.wait_for_timeout(300)
    ok(p.locator(".ex-card").count() == 1, "repeat starts a workout")
    b.close()
finally: srv.terminate()
print("ERRORS:", errs); print(f"{P} pass, {F} fail")
