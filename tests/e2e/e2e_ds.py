"""0.19 design system: olive accent on at most 3 things, Barlow, 48 px touch targets, 4 nav tabs (Dziennik), exercise menu with
4 tools + More, add / remove a set right under the sets (with undo), the note label never clipped. Dark and light."""
import os as _os, subprocess, sys, time
from playwright.sync_api import sync_playwright
import _nosplash  # noqa: F401
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8791", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
P = F = 0; errs = []
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
SETUP = """() => { const R = window.Repsmith, S = R.S; const mk = (id, ex, n) => ({ id, exId: ex, scheme: 'straight', rest: 120, backoffPct: 90, sets: Array.from({ length: n }, (_, k) => ({ id: id + k, kind: 'work', side: null, weight: k ? '' : '100', reps: k ? '' : '5', rpe: k ? '' : '8', time: '', dist: '', done: k === 0, target: { reps: '5', rpe: 7, rpeMax: 8 } })) });
  S.notes['bench-press'] = { text: 'Łopatki ściągnięte, stopy pod kolanami, pauza na klatce, łokcie pod sztangą' };
  S.active = { id: 'w', name: 'Ciężki bench', templateId: null, startedAt: Date.now() - 600000, items: [mk('a', 'bench-press', 4), mk('b', 'lat-pulldown', 3)], effort: 'rir', notes: [] };
  S.view = 'workout'; R.render(); }"""
# visible controls smaller than 48 px (chips keep a 40 px face with an invisible 48 px hit area)
SMALL = """() => [...document.querySelectorAll('main button, main input, nav button, #con button, #sheet button')].filter(e => { const r = e.getBoundingClientRect(); if (!r.width || !r.height || getComputedStyle(e).visibility === 'hidden') return false;
  if (e.matches('.chip, .seg button, .chips.seg1 .chip, .toast-act, .ex-name, .linkish, .tag')) return false; return r.width < 47.5 || r.height < 47.5; }).map(e => (e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height))"""
# elements painted in the accent (text or fill), outside the sheet scrim
ACCENT = """() => { const probe = document.createElement('i'); probe.style.color = 'var(--accent)'; document.body.appendChild(probe); const acc = getComputedStyle(probe).color; probe.remove();
  const out = []; for (const e of document.querySelectorAll('main *')) { const r = e.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) continue; const cs = getComputedStyle(e), pb = getComputedStyle(e, '::before');
    if (cs.backgroundColor === acc || (pb.content !== 'none' && pb.backgroundColor === acc) || ([...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && cs.color === acc)) out.push(e.className || e.tagName); }
  return out; }"""
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch()
    for scheme in ["dark", "light"]:
      p = b.new_context(viewport={"width": 360, "height": 760}, locale="pl-PL", has_touch=True, color_scheme=scheme).new_page()
      p.on("pageerror", lambda e: errs.append(str(e)))
      p.goto("http://localhost:8791/index.html"); p.wait_for_selector("text=Dziś trening"); p.wait_for_timeout(300)
      fam = p.evaluate("() => getComputedStyle(document.body).fontFamily")
      ok(fam.startswith('"Barlow"') or fam.startswith("Barlow"), f"[{scheme}] body font is Barlow ({fam})")
      ok(p.evaluate("() => document.fonts.check('700 16px Barlow') && document.fonts.check('400 16px Barlow')"), f"[{scheme}] Barlow 400 and 700 are loaded from the app (no network)")
      acc = p.evaluate("() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()")
      ok(acc.upper() == ("#B7C98A" if scheme == "dark" else "#56692A"), f"[{scheme}] accent is olive ({acc})")
      # nav: four tabs, Dziennik holds workouts + strength + body
      tabs = p.locator("nav.nav button").all_inner_texts()
      ok([x.strip() for x in tabs] == ["Dziś", "Plany", "Dziennik", "Ćwiczenia"], f"[{scheme}] four nav tabs ({tabs})")
      ok(len(p.evaluate(SMALL)) == 0, f"[{scheme}] Today: no control under 48 px ({p.evaluate(SMALL)[:5]})")
      ok(len(p.evaluate(ACCENT)) <= 3, f"[{scheme}] Today: accent on at most 3 things ({p.evaluate(ACCENT)})")
      p.locator("nav button[data-tab=journal]").click(); p.wait_for_timeout(150)
      ok(p.locator("main h1").inner_text().strip() == "Dziennik" and p.locator("main button[data-a=jr-tab]").count() == 3, f"[{scheme}] Dziennik: one title, three tabs")
      p.locator("main button[data-a=jr-tab][data-v=strength]").click(); p.wait_for_timeout(150)
      ok(p.evaluate("() => window.Repsmith.S.view") == "progress" and p.locator("nav button[data-tab=journal].on").count() == 1, f"[{scheme}] Siła opens progress, the nav stays on Dziennik")
      p.locator("nav button[data-tab=today]").click(); p.wait_for_timeout(100)
      p.locator("nav button[data-tab=journal]").click(); p.wait_for_timeout(100)
      ok(p.evaluate("() => window.Repsmith.S.view") == "progress", f"[{scheme}] Dziennik reopens the last tab you used")
      # workout
      p.evaluate(SETUP); p.wait_for_timeout(250)
      small = p.evaluate(SMALL)
      ok(len(small) == 0, f"[{scheme}] workout: no control under 48 px ({small[:6]})")
      a = p.evaluate(ACCENT)
      ok(len(a) <= 3, f"[{scheme}] workout: accent on at most 3 things ({a})")
      ok(p.evaluate("() => getComputedStyle(document.querySelector('.ex-card')).boxShadow === 'none' && getComputedStyle(document.querySelector('.ex-card')).backgroundColor === 'rgba(0, 0, 0, 0)'"), f"[{scheme}] the exercise sits on the background, no card")
      ok(p.evaluate("() => { const c = document.querySelector('.set.done .check'); return getComputedStyle(c, '::before').backgroundColor === getComputedStyle(document.body).color; }"), f"[{scheme}] a done set has a neutral check (text colour, not the accent)")
      # the note label is shown in full
      lbl = p.locator(".fold.note-d .lbl").first
      ok(lbl.inner_text() == "Notatka" and p.evaluate("e => e.scrollWidth <= e.clientWidth + 0.5", lbl.element_handle()), f"[{scheme}] 'Notatka' is not clipped in the workout")
      # add / remove a set right under the sets
      card = p.locator(".ex-card").first
      ok(card.locator(".set-actions [data-a=add-set]").count() == 1 and card.locator(".set-actions [data-a=set-minus]").count() == 1, f"[{scheme}] + Seria and − Seria sit under the sets")
      card.locator("[data-a=add-set]").click(); p.wait_for_timeout(100)
      ok(p.evaluate("() => window.Repsmith.S.active.items[0].sets.length") == 5, f"[{scheme}] + Seria adds a set")
      card.locator("[data-a=set-minus]").click(); p.wait_for_timeout(100)
      ok(p.evaluate("() => window.Repsmith.S.active.items[0].sets.length") == 4, f"[{scheme}] − Seria removes the last open set")
      ok(p.locator("#toast:not([hidden]) [data-a=toast-undo]").count() == 1, f"[{scheme}] removal shows Cofnij")
      p.evaluate("() => { window.Repsmith.S.active.items[0].sets.slice(1).forEach(s => { s.done = true; s.weight = '90'; s.reps = '5'; }); window.Repsmith.S.col = { a: false }; window.Repsmith.render(); }")
      card.locator("[data-a=set-minus]").click(); p.wait_for_timeout(100)
      ok(p.evaluate("() => window.Repsmith.S.active.items[0].sets.length") == 3, f"[{scheme}] with every set done, − Seria removes the last one")
      p.locator("#toast [data-a=toast-undo]").click(); p.wait_for_timeout(100)
      ok(p.evaluate("() => window.Repsmith.S.active.items[0].sets.length === 4 && window.Repsmith.S.active.items[0].sets[3].weight === '90'"), f"[{scheme}] Cofnij brings the logged set back with its values")
      # exercise menu: 4 tools + Więcej
      card.locator("[data-a=item-menu]").click(); p.wait_for_timeout(200)
      tools = [x.split("\n")[0].strip() for x in p.locator("#sheet .tools4 button").all_inner_texts()]
      ok(tools == ["Notatka", "Zamień", "Przerwa", "Historia"], f"[{scheme}] menu: four tools ({tools})")
      clipped = p.evaluate("() => [...document.querySelectorAll('#sheet .tools4 span')].filter(e => e.scrollWidth > e.clientWidth + 0.5).map(e => e.textContent)")
      ok(not clipped, f"[{scheme}] menu tool labels in full ({clipped})")
      ok(p.locator("#sheet [data-v=delset]").count() == 0 and p.locator("#sheet [data-v=more]").count() == 1, f"[{scheme}] menu: the rest sits behind Więcej")
      p.locator("#sheet [data-v=more]").click(); p.wait_for_timeout(200)
      ok(p.locator("#sheet [data-v=view]").count() == 1 and p.locator("#sheet [data-v=del]").count() == 1, f"[{scheme}] Więcej lists view, superset, move and remove")
      ok(p.evaluate("() => getComputedStyle(document.querySelector('.sheet')).boxShadow !== 'none'"), f"[{scheme}] the sheet has the large shadow")
      p.keyboard.press("Escape"); p.evaluate("() => { window.Repsmith.S.sheet = null; window.Repsmith.render(); }")
      # console: neutral selection, accent only on Zapisz
      p.locator(".ex-card").nth(1).locator("button.fv[data-k=weight]").nth(1).evaluate("e => { e.scrollIntoView({ block: 'start' }); window.scrollBy(0, -72); }")
      p.locator(".ex-card").nth(1).locator("button.fv[data-k=weight]").nth(1).click(); p.wait_for_timeout(200)
      con_small = p.evaluate("() => [...document.querySelectorAll('#con button')].filter(e => { const r = e.getBoundingClientRect(); return r.width < 47.5 || r.height < 47.5; }).length")
      ok(con_small == 0, f"[{scheme}] console: every key at least 48 px")
      acc_con = p.evaluate("""() => { const probe = document.createElement('i'); probe.style.color = 'var(--accent)'; document.body.appendChild(probe); const acc = getComputedStyle(probe).color; probe.remove(); return [...document.querySelectorAll('#con *')].filter(e => getComputedStyle(e).backgroundColor === acc).map(e => e.dataset.a || e.className); }""")
      ok(acc_con == ["con-log"], f"[{scheme}] console: only Zapisz serię in the accent ({acc_con})")
      ok(p.evaluate("() => document.documentElement.scrollWidth <= innerWidth"), f"[{scheme}] no horizontal overflow")
      p.screenshot(path=f"/tmp/e2e_ds_{scheme}.png")
      p.context.close()
    ok(not errs, f"no page errors ({errs[:2]})")
    b.close()
finally:
  srv.terminate()
print(f"{P} pass, {F} fail"); sys.exit(1 if F else 0)
