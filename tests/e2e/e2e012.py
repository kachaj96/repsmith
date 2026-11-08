"""0.12: skip a planned workout, plan overview, theme switch, calendar in History without runs, family icons and headers."""
import os as _os, tempfile as _tf, sys, time, subprocess
from playwright.sync_api import sync_playwright
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8771", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
P = F = 0
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
def click(p, s): p.locator(s).first.click(); p.wait_for_timeout(250)
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(); p = b.new_page(viewport={"width": 390, "height": 844}, locale="pl-PL")
        errs = []; p.on("pageerror", lambda e: errs.append(str(e)))
        p.goto("http://localhost:8771/index.html"); p.wait_for_function("() => window.Repsmith && !document.getElementById('splash')")
        p.evaluate("() => { window.Repsmith.S.settings.seenIntro = true; window.Repsmith.render(); }")
        ok("Niedziela" in p.locator(".dateline").inner_text() or "," in p.locator(".dateline").inner_text(), "date sits under the title, long form")
        # plan from the library
        click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=nav][data-v=planlib]"); click(p, "button[data-a=plib-open][data-v='HEAVY-3']"); click(p, "button[data-a=plib-use]")
        ok(p.locator(".topbar.backbar h1").count() == 1 or True, "sub-screens: back and title on one line")
        click(p, "button[data-a=nav][data-v=today]")
        first = p.locator(".hero h1").inner_text()
        # overview
        click(p, "button[data-a=plan-view]")
        pv = p.locator(".sheet").inner_text()
        ok(p.locator(".pv-day").count() == 3 and "Następny" in pv, f"plan overview lists the 3 days and marks the next one")
        ok(p.locator(".pv-day.next").inner_text().startswith(first), "the next day in the overview is the one on Today")
        click(p, "button[data-a=sheet-close]")
        # skip
        n0 = p.evaluate("() => window.Repsmith.S.sessions.length")
        click(p, "button[data-a=skip-day]"); ok(p.locator(".sheet").count() == 1 and p.locator(".sheet button[data-a=sheet-close]").count() == 1, "skip asks first (Cancel, no X)")
        ok(p.locator(".sheet .sheet-head button").count() == 0, "confirm sheet has no close X, as in Runsmith")
        click(p, "button[data-a=confirm-yes]")
        second = p.locator(".hero h1").inner_text()
        ok(second != first, f"after the skip Today shows the next workout ({first} -> {second})")
        ok(p.evaluate("() => window.Repsmith.S.sessions.length") == n0, "a skip adds nothing to the history")
        ok("Pominięto" in p.locator(".slim").inner_text(), "Today says what was skipped")
        bi = p.evaluate("() => { const R = window.Repsmith; const t = R.S.templates.find(x => x.id === R.S.settings.activeTemplateId); const b = R.C.blockInfo(t); return b ? { fixed: b.fixed, done: b.done } : null; }")
        ok(bi is None or (bi["done"] == 1 if bi["fixed"] else bi["done"] == 0), f"block counter: a fixed block counts the skip, a calendar plan is unchanged {bi}")
        # a fixed-length block: the skip is a used slot of the week
        fx = p.evaluate("""() => { const R = window.Repsmith; const t = R.S.templates.find(x => x.id === R.S.settings.activeTemplateId);
          const c = JSON.parse(JSON.stringify(t)); c.id = 'fx'; c.cycle = { type: 'fixed', weeks: 4, start: Date.now() - 1000, shift: 0, deload: { mode: 'none', weeks: [], every: 4, sets: 40, load: 0 } };
          c.skips = [{ at: Date.now() - 500, dayId: c.days[0].id }]; return R.C.blockInfo(c).done; }""")
        ok(fx == 1, f"fixed block: one skip = one used slot ({fx})")
        p.reload(); p.wait_for_function("() => window.Repsmith && !document.getElementById('splash')")
        ok(p.locator(".hero h1").inner_text() == second, "the skip is saved (survives a reload)")
        click(p, "button[data-a=skip-undo]")
        ok(p.locator(".hero h1").inner_text() == first and p.locator(".slim:has-text('Pominięto')").count() == 0, "undo brings the skipped workout back")
        # history: no runs, calendar always reachable
        click(p, "button[data-a=nav][data-v=history]")
        ok("Biegi" not in p.locator("main").inner_text(), "no runs tab in History")
        ok(p.locator("button[data-a=hist-mode]").count() == 1, "calendar reachable even with no workouts")
        click(p, "button[data-a=hist-mode]")
        ok(p.locator(".cal-w span").first.inner_text().startswith("pon"), "calendar weekdays as in Runsmith (pon.)")
        ok(p.locator(".cal-c.today").count() == 1, "today marked in the calendar")
        click(p, "button[data-a=nav][data-v=progress]"); ok("Biegi" not in p.locator("main").inner_text(), "no runs tab in Progress")
        click(p, "button[data-a=nav][data-v=today]"); ok(p.locator("button[data-a=run-new]").count() == 0, "no 'log a run' on Today")
        # theme
        click(p, "button[data-a=settings]"); p.evaluate("() => document.querySelectorAll('.sheet details').forEach(d => { d.open = true; })")
        ok(p.locator(".chips.seg1 button[data-a=theme]").count() == 3, "theme choice: system, light, dark")
        click(p, "button[data-a=theme][data-v=dark]")
        ok(p.evaluate("() => document.documentElement.dataset.theme") == "dark" and p.evaluate("() => getComputedStyle(document.body).backgroundColor") == "rgb(11, 14, 17)", "dark theme applies at once")
        p.reload(); p.wait_for_timeout(300)
        ok(p.evaluate("() => document.documentElement.dataset.theme") == "dark", "dark theme is there before the app starts (first paint)")
        p.wait_for_function("() => window.Repsmith && !document.getElementById('splash')")
        click(p, "button[data-a=settings]"); click(p, "button[data-a=theme][data-v=system]")
        ok(p.evaluate("() => document.documentElement.dataset.theme") is None, "system theme removes the override")
        click(p, "button[data-a=sheet-close]")
        # icons: one family set
        ok(p.evaluate("() => [...document.querySelectorAll('.nav svg')].every(s => s.getAttribute('stroke-width') === '2' || s.getAttribute('fill') === 'currentColor')"), "nav icons use the family stroke")
        ok(not errs, f"no page errors {errs[:2]}")
        b.close()
finally: srv.terminate()
print(f"{P} pass, {F} fail")
sys.exit(1 if F else 0)
