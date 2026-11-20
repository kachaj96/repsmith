import os as _os, subprocess, sys, time
from playwright.sync_api import sync_playwright
import _nosplash  # noqa: F401
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8777", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
P = F = 0; errs = []
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(); p = b.new_context(viewport={"width": 360, "height": 780}, locale="pl-PL", has_touch=True).new_page()
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.goto("http://localhost:8777/index.html"); p.wait_for_selector("text=Dziś trening")
    p.evaluate("() => { window.Repsmith.S.templates = []; window.Repsmith.A['plib-use']({ dataset: { v: 'BENCH-PRIO-W4' } }); }")
    p.wait_for_selector("#wv-kg")
    p.fill("#wv-kg", "122,4"); p.wait_for_timeout(100)
    ok("120" in p.locator("#wave-res").inner_text(), "1RM 122.4 -> WB 120 shown live")
    p.locator("button[data-a=wave-kind][data-v=e1rm]").click(); p.wait_for_timeout(100)
    p.fill("#wv-kg", "123,3"); p.wait_for_timeout(100)
    ok("120" in p.locator("#wave-res").inner_text(), "e1RM 123.3 x 0.975 -> WB 120")
    p.fill("#wv-kg", "")
    p.locator("button[data-a=wave-start-save]").click(); p.wait_for_timeout(150)
    ok(p.locator("#sheet [role=alert], .sheet [role=alert]").count() >= 1, "empty weight is rejected")
    p.fill("#wv-kg", "123,3"); p.locator("button[data-a=wave-start-save]").click(); p.wait_for_timeout(400)
    ok(p.evaluate("() => { const t = window.Repsmith.S.templates[0]; return t && t.wave && t.wave.wb; }") == 120, "plan created with WB 120")
    ok(p.evaluate("() => window.Repsmith.S.maxes['bench-press'] == null"), "WB is not stored as a 1RM")
    p.locator("button[data-a=start-day]").click(); p.wait_for_timeout(500)
    p.locator('button[data-a=ready-pick][data-v="4"]').click(); p.wait_for_timeout(500)
    txt = p.locator("main").inner_text()
    ok("105-107,5 kg" in txt and "88-90% WB 120" in txt, "Monday week 1: single range from WB")
    ok("back-off 90-92,5 kg" in txt, "back-off range shown")
    ok(p.evaluate("() => { const a = window.Repsmith.S.active; const it = a.items[0]; return it.sets.filter(s => s.kind === 'top').length === 1 && it.sets.filter(s => s.kind === 'backoff').length === 2; }"), "bench: 1 top + 2 back-off sets")
    ph = p.evaluate("() => [...document.querySelectorAll('button.fv[data-k=weight]')].map(i => i.dataset.ph)")
    ok("105" in ph and "90" in ph, "weights prefilled with the lower value (105 / 90)")
    ok(p.evaluate("() => { const l = window.Repsmith.S.active.items.find(i => i.exId === 'reverse-lunge'); return !l; }"), "reverse lunge is on Friday, not Monday")
    ok(p.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"), "no horizontal overflow")
    # end of the cycle: window with the proposal
    p.evaluate("() => { const R = window.Repsmith, S = R.S; S.active = null; const tp = S.templates[0]; tp.cycle.start = Date.now() - 40 * 864e5; S.sessions = []; for (let i = 0; i < 12; i++) S.sessions.push({ id: 'z' + i, templateId: tp.id, dayId: tp.days[i % 3].id, name: 'x', startedAt: Date.now() - 30 * 864e5 + i * 864e5, endedAt: Date.now() - 30 * 864e5 + i * 864e5 + 3600e3, items: [] }); R.render(); }")
    p.wait_for_timeout(300)
    ok(p.locator("button[data-a=wave-next]").count() == 1, "end card offers the next cycle")
    p.locator("button[data-a=wave-next]").click(); p.wait_for_selector("#wv-own")
    ok(p.input_value("#wv-own") == "120", "no control set: base proposed unchanged")
    p.fill("#wv-own", "122,5"); p.locator("button[data-a=wave-next-save]").click(); p.wait_for_timeout(300)
    ok(p.evaluate("() => { const w = window.Repsmith.S.templates[0].wave; return w.wb === 122.5 && w.hist.length === 2 && w.hist[1].manual === true; }"), "manual base saved to history, new cycle")
    ok(p.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"), "no overflow after")
    # second cycle with a real control set: 100 x 6 @9 after 100 x 5 @9, Monday single in week 3 on plan
    p.evaluate("""() => { const R = window.Repsmith, S = R.S; const tp = S.templates[0]; const t0 = Date.now() - 40 * 864e5; tp.cycle.start = t0;
      tp.wave.hist.push({ at: t0, wb: 120, next: 120, ctl: { kg: 100, reps: 5, rpe: 9, e1: 119.5, weaker: false }, comp: false });
      const mk = (id, i, wk, items) => ({ id, templateId: tp.id, dayId: tp.days[i % 3].id, name: 'x', week: { week: wk }, startedAt: t0 + (wk * 3 + i) * 864e5, endedAt: t0 + (wk * 3 + i) * 864e5 + 3600e3, items });
      const top = (kg, reps, rpe) => [{ id: 'a', kind: 'top', done: true, weight: String(kg), reps: String(reps), rpe: String(rpe) }];
      S.sessions = [];
      for (let i = 0; i < 12; i++) S.sessions.push(mk('q' + i, i, Math.floor(i / 3) + 1, []));
      S.sessions[6].items = [{ id: 'm', exId: 'bench-press', reps: '1', rpe: 8, wave: { lo: 110, hi: 112.5, amrap: false }, sets: top(110, 1, 8) }];
      S.sessions[8].items = [{ id: 'f', exId: 'bench-press', reps: '4+', rpe: 9, wave: { lo: 100, hi: 100, amrap: true }, sets: top(100, 6, 9) }];
      R.render(); }""")
    p.wait_for_timeout(300)
    p.locator("button[data-a=wave-next]").click(); p.wait_for_selector("#wv-own")
    ok(p.input_value("#wv-own") == "125", "better control set and single on plan: base +2.5 proposed (122.5 + 2.5 here, base was 122.5)")
    ok("100 kg × 6" in p.locator("#sheet, .sheet").first.inner_text().replace("\u00a0", " "), "control set shown in the window")
    p.locator("input[data-a=wave-comp]").check(); p.wait_for_timeout(200)
    ok(p.input_value("#wv-own") == "122.5" or p.input_value("#wv-own") == "122,5", "not comparable: base stays")
    p.locator("button[data-a=wave-next-save]").click(); p.wait_for_timeout(300)
    # Friday: the reverse lunge is one row per set (both legs together)
    p.evaluate("() => { const R = window.Repsmith, S = R.S; S._pickedDay = S.templates[0].days[2].id; R.render(); }"); p.wait_for_timeout(200)
    p.locator("button[data-a=start-day]").click(); p.wait_for_timeout(300)
    if p.locator('button[data-a=ready-pick][data-v="4"]').count(): p.locator('button[data-a=ready-pick][data-v="4"]').click(); p.wait_for_timeout(400)
    ok(p.evaluate("() => { const l = window.Repsmith.S.active.items.find(i => i.exId === 'reverse-lunge'); return l && l.sets.length === 2 && l.sets.every(s => !s.side); }"), "reverse lunge: 2 rows, no L/R split")
    b.close()
finally: srv.terminate()
print("ERRORS:", errs); print(f"{P} pass, {F} fail")
