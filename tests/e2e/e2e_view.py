"""0.17: workout view switches (auto rest, suggestions, tips, media), simple/advanced presets, set rows."""
import os as _os, subprocess, sys, time
from playwright.sync_api import sync_playwright
import _nosplash  # noqa: F401
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8783", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
P = F = 0; errs = []
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEklEQVR4nGNgYGD4z0AEYBxVSFUAAG8VAQHT8U7OAAAAAElFTkSuQmCC"
SEED = """() => { const R = window.Repsmith, S = R.S;
  S.sessions = [{ id: 'old', templateId: 'x', name: 'old', startedAt: Date.now() - 3*864e5, endedAt: Date.now() - 3*864e5 + 3600e3, items: [
    { id: 'o1', exId: 'bench-press', sets: [{ id: 'a', kind: 'top', side: null, done: true, weight: '102.5', reps: '1', rpe: '7.5' }, { id: 'b', kind: 'backoff', side: null, done: true, weight: '92.5', reps: '5', rpe: '' }, { id: 'c', kind: 'backoff', side: null, done: false, weight: '95', reps: '5', rpe: '9' }] }] }];
  S.notes['bench-press'] = { text: 'Łopatki ściągnięte' }; S.media = { 'bench-press': { imgs: [{ id: 'm1', src: '%s' }], links: [], cap: '' } };
  R.persist('sessions', 'notes', 'media'); R.render(); }""" % PNG
sel = lambda p, q: p.locator(q)
def vis_sets(p): return p.evaluate("() => [...document.querySelectorAll('.ex-card')][0].querySelectorAll('.set').length")
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch()
    ctx = b.new_context(viewport={"width": 360, "height": 760}, locale="pl-PL", color_scheme="dark", has_touch=True)
    p = ctx.new_page(); p.on("pageerror", lambda e: errs.append(str(e)))
    p.goto("http://localhost:8783/index.html"); p.wait_for_selector("text=Dziś trening")
    ok(p.evaluate("() => ['autoRest','showSug','showCues','showMedia'].every(k => window.Repsmith.S.settings[k] === undefined)"), "existing users: no stored switches (all on = advanced, nothing changes for them)")
    p.evaluate("() => { window.Repsmith.S.templates = []; window.Repsmith.A['plib-use']({ dataset: { v: 'BENCH-PRIO-W4' } }); }")
    p.wait_for_selector("#wv-kg"); p.fill("#wv-kg", "120"); p.locator("button[data-a=wave-start-save]").click(); p.wait_for_timeout(300)
    p.evaluate(SEED)
    p.locator("button[data-a=start-day]").click(); p.wait_for_timeout(300)
    if p.locator('button[data-a=ready-pick][data-v="4"]').count(): p.locator('button[data-a=ready-pick][data-v="4"]').click(); p.wait_for_timeout(300)
    card = p.locator(".ex-card").first
    # 3. previous result: recorded sets only, missing RPE shown as @-
    prevs = card.locator(".set .prev").all_inner_texts()
    tags = card.locator(".kind-btn .kl").all_inner_texts()
    ok(tags == ["1", "2", "3", "4", "5", "6"], f"sets numbered 1..6, no set-type names ({tags})")
    ok(prevs[3] == "102,5×1 @7,5" and prevs[4] == "92,5×5 @–" and prevs[5] == "–", f"previous: with RPE, without RPE, unconfirmed set not used ({prevs[3:6]})")
    ok("bez RPE" in (card.locator(".set .prev").nth(4).get_attribute("aria-label") or ""), "missing RPE is read out as 'bez RPE'")
    ok(p.locator(".ex-card").nth(1).locator(".set .prev").first.inner_text() == "–", "no history: dash, nothing invented")
    # advanced (default)
    ok(card.locator(".sug").count() == 1 and card.locator(".ex-thumb img").count() == 1 and card.locator(".cues-d").count() == 1, "advanced: suggestion, thumbnail and folded tips")
    ph = card.locator("button.fv[data-k=weight]").nth(3).get_attribute("data-ph")
    ok(ph == "105", f"advanced: weight field shows the suggested 105 ({ph})")
    ok(card.locator(".cues-d").get_attribute("open") is None and card.locator(".note-d").get_attribute("open") is None, "tips and note are folded to one line")
    ok(card.locator(".set.cur").count() == 1 and card.locator(".set").first.get_attribute("class").find("cur") >= 0, "the first open set is marked as current")
    # 1. auto rest on
    card.locator("button[data-a=set-done]").first.click(); p.wait_for_timeout(200)
    ok(p.locator("#timer").count() == 1, "auto rest on: timer starts after a set")
    p.evaluate("() => window.Repsmith.stopTimer()")
    ok(card.locator(".set.cur").count() == 1 and "cur" in card.locator(".set").nth(1).get_attribute("class"), "current marker moves to the next set")
    # quick switch during the workout
    card.locator("button[data-a=item-menu]").click(); p.wait_for_timeout(150); p.locator("#sheet button[data-v=view]").click(); p.wait_for_timeout(150)
    ok(p.locator("#sheet .switch").count() == 4 and "Zaawansowany" in p.locator("#sheet .chip.on").inner_text(), "workout view sheet: 4 switches, advanced selected")
    p.locator("#sheet button.switch[data-k=autoRest]").click(); p.wait_for_timeout(150)
    ok("Własne" in p.locator("#sheet").inner_text(), "changing one switch shows 'custom'")
    p.locator("#sheet button[data-a=sheet-close]").first.click(); p.wait_for_timeout(150)
    card.locator("button[data-a=set-done]").nth(1).click(); p.wait_for_timeout(200)
    ok(p.locator("#timer").count() == 0, "auto rest off: no timer after a set")
    ok(card.locator("button[data-a=rest-start]").count() == 1, "manual rest button shown")
    card.locator("button[data-a=rest-start]").click(); p.wait_for_timeout(150)
    ok(p.locator("#timer").count() == 1, "manual rest button starts the timer")
    p.evaluate("() => window.Repsmith.stopTimer()")
    # 2/4/5: simple preset
    card.locator("button[data-a=item-menu]").click(); p.wait_for_timeout(150); p.locator("#sheet button[data-v=view]").click(); p.wait_for_timeout(150)
    p.locator("#sheet button[data-a=view-mode][data-v=simple]").click(); p.wait_for_timeout(150)
    ok(p.evaluate("() => ['autoRest','showSug','showCues','showMedia'].every(k => window.Repsmith.S.settings[k] === false)"), "simple preset turns the 4 switches off")
    p.locator("#sheet button[data-a=sheet-close]").first.click(); p.wait_for_timeout(150)
    ok(card.locator(".sug").count() == 0 and p.locator(".ex-card .sug").count() == 0, "suggestions off: no suggestion line anywhere")
    ph = card.locator("button.fv[data-k=weight]").nth(3).get_attribute("data-ph")
    ok(ph == "102,5", f"suggestions off: weight field shows the previous result ({ph})")
    ok(p.locator(".ex-thumb").count() == 0 and card.locator("h3.ex-name").count() == 1, "media off: no thumbnails, no empty tile, plain name")
    ok(card.locator(".cues-d").count() == 0 and card.locator(".note-d").count() == 1, "tips off, note still there")
    card.locator(".note-d summary").click(); p.wait_for_timeout(100)
    ok(card.locator(".note-full").is_visible() and card.locator(".note-d button[data-a=note]").count() == 1, "note opens and can be edited")
    ok(p.evaluate("() => window.Repsmith.S.templates[0].days[0].items[0].cue != null && (window.Repsmith.S.active.items[0].cues || []).length > 0"), "tips are hidden, not deleted")
    # 8. logging: type values incl. a decimal three-digit weight
    card.locator("button.fv[data-k=weight]").nth(3).click(); p.wait_for_timeout(100)
    ok(p.locator("#con").count() == 1 and p.locator("#con .con-pad").count() == 1, "tapping the weight opens the set console with the number pad")
    p.locator(".ex-card").first.locator("button.fv.rpe").nth(4).click(); p.wait_for_timeout(80)
    ok(p.locator("#con .ct").count() == 3 and p.locator("#con .con-grid").count() == 1 and p.locator("#con .ct.rp.on").count() == 1, "tapping RPE opens the same console on the RPE tab")
    card.locator("button.fv[data-k=weight]").nth(3).click(); p.wait_for_timeout(80)
    for k in "102.5": p.locator(f'#con button[data-a=con-key][data-v="{k}"]').click()
    ok(p.locator("#con .ct.on .mid b").inner_text() == "102,5", "typed value shows in the console")
    p.locator("#con button[data-a=con-pad][data-k=rpe]").click(); p.wait_for_timeout(80)
    ok(p.locator("#con .con-grid button").count() == 9 and p.locator("#con .ct").count() == 3, "RPE is a tab of the same console (kg, reps, RPE stay on screen)")
    p.locator("#con button[data-a=con-rpe][data-v='8']").click()
    p.locator("#con button[data-a=con-pad][data-k=reps]").click(); p.wait_for_timeout(80)
    ok(p.locator("#con .con-pad").count() == 1, "and back to the number pad from the reps tab")
    w = card.locator("button.fv[data-k=weight]").nth(3)
    ok(w.evaluate("e => e.scrollWidth <= e.clientWidth") and w.inner_text() == "102,5", "102,5 fits in the weight cell at 360 px")
    p.locator("#con button[data-a=con-log]").click(); p.wait_for_timeout(200)
    ok(p.locator("#con").count() == 1 and p.evaluate("() => window.Repsmith.S.con && window.Repsmith.S.active.items[0].sets.findIndex(x => x.id === window.Repsmith.S.con.s)") == 4, "after logging the console moves to the next set")
    p.locator("#con button[data-a=con-close]").click(); p.wait_for_timeout(100)
    s3 = p.evaluate("() => window.Repsmith.S.active.items[0].sets[3]")
    ok(s3["done"] and s3["weight"] == "102.5" and s3["reps"] == "1" and s3["rpe"] == "8", f"set saved ({s3['weight']} x {s3['reps']} @{s3['rpe']})")
    card.locator("button[data-a=set-done]").nth(3).click(); p.wait_for_timeout(100)
    card.locator("button.fv[data-k=weight]").nth(3).click(); p.locator("#con button[data-a=con-step][data-k=weight][data-v='-2.5']").click(); p.locator("#con button[data-a=con-log]").click(); p.wait_for_timeout(200)
    ok(p.evaluate("() => window.Repsmith.S.active.items[0].sets[3].weight") == "100", "edited set saved (102,5 - 2,5 with the stepper)")
    # 6/7: persistence
    p.reload(); p.wait_for_timeout(1200)
    ok(p.evaluate("() => ['autoRest','showSug','showCues','showMedia'].every(k => window.Repsmith.S.settings[k] === false)") and p.locator(".ex-card .sug").count() == 0, "preferences survive a reload")
    ok(p.evaluate("() => window.Repsmith.S.active.items[0].sets[3].weight") == "100", "set values survive a reload")
    # settings sheet has the same block
    p.evaluate("() => window.Repsmith.A.settings()"); p.wait_for_timeout(150)
    p.evaluate("() => document.querySelectorAll('.sheet details').forEach(d => { d.open = true; })")
    ok("Widok treningu" in p.locator("#sheet").inner_text() and p.locator("#sheet .switch").count() == 4, "settings have the workout view section")
    p.locator("#sheet button[data-a=view-mode][data-v=advanced]").click(); p.wait_for_timeout(150)
    ok(p.evaluate("() => ['autoRest','showSug','showCues','showMedia'].every(k => window.Repsmith.S.settings[k] === true)"), "advanced preset turns them back on")
    p.locator("#sheet button[data-a=sheet-close]").first.click(); p.wait_for_timeout(150)
    # 9. layout on small screens and big text
    for W in (320, 360, 412):
        p.set_viewport_size({"width": W, "height": 760}); p.wait_for_timeout(150)
        bad = p.evaluate("""() => { const out = []; const vw = innerWidth;
          if (document.documentElement.scrollWidth > vw) out.push('hscroll');
          document.querySelectorAll('.set .fv, .check, .kind-btn').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.right > vw + .5) out.push('off ' + e.className); });
          document.querySelectorAll('.set').forEach(row => { const els = [...row.children].map(c => c.getBoundingClientRect()); for (let i = 1; i < els.length; i++) if (els[i].left < els[i-1].right - .5) out.push('overlap'); });
          document.querySelectorAll('.check, .set .fv').forEach(e => { const r = e.getBoundingClientRect(); if (r.height && (r.height < 40 || r.width < 36)) out.push('small ' + e.className + ' ' + Math.round(r.width)); });
          return out.slice(0, 5); }""")
        ok(not bad, f"{W}px: no horizontal scroll, nothing off screen or overlapping, targets >= 40x36 ({bad})")
    # 10. no system keyboard: the console sits at the bottom and the edited row stays above it
    p.set_viewport_size({"width": 360, "height": 640})
    p.locator(".ex-card").nth(1).locator("button.fv[data-k=reps]").first.click(); p.wait_for_timeout(700)
    rb = p.evaluate("() => { const r = document.querySelector('.set.edit').getBoundingClientRect(), c = document.getElementById('con').getBoundingClientRect(); return [r.bottom, c.top, document.activeElement.tagName]; }")
    ok(rb[0] <= rb[1] and rb[2] != "INPUT", f"edited set above the console, no text field focused ({rb})")
    b.close()
finally: srv.terminate()
print("ERRORS:", errs); print(f"{P} pass, {F} fail")
