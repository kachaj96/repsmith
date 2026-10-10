import os as _os, tempfile as _tf
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
import subprocess, sys, time, os, json
from playwright.sync_api import sync_playwright
SH = _OUT; os.makedirs(SH, exist_ok=True)
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8769", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
errs = []; P = 0; F = 0
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
def click(p, s): p.locator(s).first.click(); p.wait_for_timeout(120)
def noov(p, m):
    r = p.evaluate("()=>[document.documentElement.scrollWidth,innerWidth, document.querySelector('.sheet') ? document.querySelector('.sheet').scrollWidth - document.querySelector('.sheet').clientWidth : 0]")
    ok(r[0] <= r[1] and r[2] <= 0, f"no horizontal overflow: {m} {r}")
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch()
    ctx = b.new_context(viewport={"width": 360, "height": 780}, device_scale_factor=2, locale="pl-PL", has_touch=True)
    p = ctx.new_page()
    p.on("pageerror", lambda e: errs.append(str(e))); p.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    p.goto("http://localhost:8769/index.html"); p.wait_for_selector("text=Dobierz plan")

    # --- normalization unit checks in page
    cases = p.evaluate("""() => { const R = window.Repsmith; const nt = (v, id) => R.normTarget(v, id || 'squat', 'DEF');
      return { a: nt('abc'), b: nt('8-12'), c: nt('12-8'), d: nt('8 - 12'), e: nt('5+'), f: nt('5 reps'), g: nt('0'), h: nt('200'), i: nt(''), j: nt('30-45', 'plank'), k: nt('45+', 'plank'), l: nt('8-8'), m: nt('8,5'), n: nt('6 do 8') }; }""")
    want = {"a": "DEF", "b": "8-12", "c": "8-12", "d": "8-12", "e": "5+", "f": "5", "g": "1", "h": "100", "i": "DEF", "j": "30-45", "k": "45", "l": "8", "m": "8-5", "n": "6-8"}
    want["m"] = "8"
    for k, v in want.items(): ok(cases[k] == v, f"normTarget {k}: {cases[k]!r} == {v!r}")

    # --- all 25 library plans: normalize + open/save in editor changes nothing
    rt = p.evaluate("""() => { const R = window.Repsmith; const C = R.C; const bad = [];
      for (const pl of R.CD.plans) { const tp = C.buildTemplate(pl, {}, { effort: 'rir' });
        for (const d of tp.days) for (const it of d.items) {
          const a = JSON.parse(JSON.stringify(it)); const ch = R.normItem(a); if (ch) bad.push(['norm', pl.id, it.exId, JSON.stringify(it), JSON.stringify(a)]);
          const sh = { type: 'item', item: JSON.parse(JSON.stringify(it)) }; R.initItemSheet(sh); const err = R.applyItemTargets(sh);
          if (err || JSON.stringify(sh.item) !== JSON.stringify(it)) bad.push(['sheet', pl.id, it.exId, err, JSON.stringify(it), JSON.stringify(sh.item)]);
        } }
      return { n: R.CD.plans.length, bad: bad.slice(0, 5), nb: bad.length }; }""")
    ok(rt["n"] == 28 and rt["nb"] == 0, f"28 library plans (25 + 3 blocks) round-trip unchanged: {rt}")

    # --- adopt HEAVY-3, open plan editor
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=nav][data-v=planlib]")
    click(p, "button[data-a=plib-open][data-v='HEAVY-3']"); click(p, "button[data-a=plib-use]")
    p.wait_for_selector("button[data-a=start-day]")
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=open-plan] >> nth=-1")
    first_meta = p.locator("button[data-a=edit-item] .meta").first.inner_text()
    click(p, "button[data-a=edit-item] >> nth=0")
    ok(p.locator(".seg button[data-a=tg-mode]").count() == 3 and p.locator(".seg button[data-a=ef-mode]").count() == 3, "squat: 3 rep modes and 3 intensity modes")
    p.screenshot(path=f"{SH}/01-item-p1.png", full_page=True); noov(p, "item sheet P1")
    # letters are rejected
    p.locator("#tg-lo").fill(""); p.locator("#tg-lo").type("a3b,5 x")
    ok(p.locator("#tg-lo").input_value() == "35", f"reps field keeps digits only: {p.locator('#tg-lo').input_value()!r}")
    p.locator("#it-warmups").fill(""); p.locator("#it-warmups").type("2a")
    ok(p.locator("#it-warmups").input_value() == "2", "warm-ups digits only")
    p.locator("#tg-lo").fill("3")
    # range on P1 allowed, wrong order rejected
    click(p, "button[data-a=tg-mode][data-v=range]")
    ok(p.locator("#tg-hi").count() == 1, "range shows from/to")
    p.locator("#tg-lo").fill("6"); p.locator("#tg-hi").fill("4"); click(p, "button[data-a=item-save]")
    ok("Górna granica" in p.locator(".sheet").inner_text(), "range 6-4 rejected with message")
    p.locator("#tg-hi").fill(""); click(p, "button[data-a=item-save]")
    ok("Wpisz liczbę" in p.locator(".sheet").inner_text(), "empty upper bound rejected")
    p.locator("#tg-lo").fill("150"); p.locator("#tg-hi").fill("160"); click(p, "button[data-a=item-save]")
    ok("1-100" in p.locator(".sheet").inner_text(), "reps above 100 rejected")
    # AMRAP on P1 -> method switches to P2
    click(p, "button[data-a=tg-mode][data-v=amrap]")
    ok(p.locator("button[data-a=item-method][data-v=P2].on").count() == 1, "AMRAP switches method to Liniowa (P2)")
    ok(p.locator("#tg-hi").count() == 0 and "Minimum" in p.locator(".sheet").inner_text(), "AMRAP shows minimum field")
    p.locator("#tg-lo").fill("5")
    # percent of 1RM
    click(p, "button[data-a=ef-mode][data-v=pct]")
    ok(p.locator("#ef-pct").input_value() == "75", "pct defaults to 75")
    ok("Brak 1RM" in p.locator(".sheet").inner_text(), "no 1RM yet shown")
    p.locator("#ef-pct").fill("120"); click(p, "button[data-a=item-save]")
    ok("od 30 do 100" in p.locator(".sheet").inner_text(), "pct 120 rejected")
    p.locator("#ef-pct").fill("80")
    click(p, "button[data-a=orm-open]")
    p.locator("#orm-kg").fill("0"); click(p, "button[data-a=orm-save]")
    ok("większy od 0" in p.locator(".sheet").inner_text(), "1RM 0 rejected")
    p.locator("#orm-kg").fill("150,5"); click(p, "button[data-a=orm-save]")
    t = p.locator(".sheet").inner_text()
    ok("150,5 kg (wpisane)" in t and "120 kg" in t, "back in item sheet, 1RM 150.5 -> 80% = 120 kg shown")
    ok(p.locator("#tg-lo").input_value() == "5" and p.locator("button[data-a=tg-mode][data-v=amrap].on").count() == 1, "target state kept after 1RM sheet")
    p.screenshot(path=f"{SH}/02-item-amrap-pct.png", full_page=True); noov(p, "item sheet AMRAP + pct")
    click(p, "button[data-a=item-save]")
    it0 = p.evaluate("() => { const tp = window.Repsmith.S.templates.at(-1); return tp.days[0].items[0]; }")
    ok(it0["reps"] == "5+" and it0["pct"] == 80 and it0["rpe"] is None and it0["method"] == "P2" and it0["scheme"] == "straight", f"saved: {it0['reps']} {it0.get('pct')} {it0['method']}")
    meta = p.locator("button[data-a=edit-item] .meta").first.inner_text()
    ok("5+" in meta and "@80%" in meta, f"plan row shows target: {meta}")

    # second item: RPE range
    click(p, "button[data-a=edit-item] >> nth=1")
    mth = p.locator("button[data-a=item-method].on").first.get_attribute("data-v")
    click(p, "button[data-a=ef-mode][data-v=rrange]")
    ok(p.locator("button[data-a=item-rpe][data-v=hi]").count() == 1, "RPE range shows from/to")
    click(p, "button[data-a=item-rpe][data-v=lo]"); click(p, "button[data-a=rpe-set][data-v='9']")
    click(p, "button[data-a=item-rpe][data-v=hi]"); click(p, "button[data-a=rpe-set][data-v='8']")
    click(p, "button[data-a=item-save]")
    ok("Zakres RPE" in p.locator(".sheet").inner_text(), "RPE range 9-8 rejected")
    click(p, "button[data-a=item-rpe][data-v=hi]"); click(p, "button[data-a=rpe-set][data-v='9.5']")
    click(p, "button[data-a=item-save]")
    it1 = p.evaluate("() => window.Repsmith.S.templates.at(-1).days[0].items[1]")
    ok(it1["rpe"] == 9 and it1["rpeMax"] == 9.5, f"saved RPE 9-9.5 ({mth}): {it1['rpe']}-{it1['rpeMax']}")
    # back to single RPE resets max
    click(p, "button[data-a=edit-item] >> nth=1"); click(p, "button[data-a=ef-mode][data-v=rpe]")
    click(p, "button[data-a=item-rpe][data-v=lo]"); click(p, "button[data-a=rpe-set][data-v='7']"); click(p, "button[data-a=item-save]")
    it1 = p.evaluate("() => window.Repsmith.S.templates.at(-1).days[0].items[1]")
    ok(it1["rpe"] == 7 and it1["rpeMax"] == 7, f"single RPE keeps rpeMax in sync: {it1['rpe']}/{it1['rpeMax']}")

    # H1 needs a range: choosing Double progression on a fixed item converts it
    click(p, "button[data-a=edit-item] >> nth=1")
    click(p, "button[data-a=tg-mode][data-v=fixed]"); p.locator("#tg-lo").fill("8")
    click(p, "button[data-a=item-method][data-v=H1]")
    ok(p.locator("button[data-a=tg-mode][data-v=range].on").count() == 1 and p.locator("#tg-hi").input_value() == "12", f"H1 converts fixed 8 -> range 8-12 ({p.locator('#tg-hi').input_value()})")
    ok(p.locator("button[data-a=ef-mode][data-v=pct]").count() == 1, "pct offered for barbell")
    click(p, "button[data-a=ef-mode][data-v=pct]")
    ok(p.locator("button[data-a=item-method][data-v=P2].on").count() == 1 and p.locator("button[data-a=tg-mode][data-v=fixed].on").count() == 1, "pct on H1 -> P2 and range -> fixed")
    click(p, "button[data-a=sheet-close]")

    # time-based exercise: time modes, no AMRAP, no pct
    p.evaluate("""() => { const R = window.Repsmith; const tp = R.S.templates.at(-1); const it = R.defaultItem('plank'); tp.days.at(-1).items.push(it); R.render(); }""")
    click(p, "button[data-a=edit-item] >> nth=-1")
    tx = p.locator(".sheet").inner_text()
    ok("Zakres czasu" in tx and p.locator("button[data-a=tg-mode][data-v=amrap]").count() == 0 and p.locator("button[data-a=ef-mode][data-v=pct]").count() == 0, "plank: time modes only, no AMRAP, no %1RM")
    click(p, "button[data-a=tg-mode][data-v=range]"); p.locator("#tg-lo").fill("30"); p.locator("#tg-hi").fill("700"); click(p, "button[data-a=item-save]")
    ok("1-600" in p.locator(".sheet").inner_text(), "time over 600 s rejected")
    p.locator("#tg-hi").fill("45"); click(p, "button[data-a=item-save]")
    ok(p.evaluate("() => window.Repsmith.S.templates.at(-1).days.at(-1).items.at(-1).reps") == "30-45", "plank 30-45 s saved")
    p.screenshot(path=f"{SH}/03-plan.png", full_page=True); noov(p, "plan view")

    # --- workout: pct load, AMRAP tag, RPE range placeholder
    p.evaluate("""() => { const R = window.Repsmith; const it = R.S.templates.at(-1).days[0].items[1]; it.method = 'P3'; it.reps = '5'; it.rpe = 7.5; it.rpeMax = 8.5; delete it.pct; R.persist('templates'); }""")
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=start-day]")
    if p.locator("button[data-a=ready-pick]").count(): click(p, "button[data-a=ready-pick][data-v='']")
    p.wait_for_selector(".ex-card")
    c0 = p.locator(".ex-card").first
    sug = c0.locator(".sug").inner_text()
    ok("120 kg × 5+" in sug and "80% z 1RM 150,5 kg" in sug, f"workout suggestion from %1RM: {sug}")
    ok(c0.locator(".set.is-top, .set").filter(has_text="AMRAP").count() == 3, "3 work sets tagged AMRAP")
    w0 = c0.locator(".set").filter(has_text="AMRAP").first
    ok(w0.locator("input[data-k=weight]").get_attribute("placeholder") == "120" and w0.locator("input[data-k=reps]").get_attribute("placeholder") == "5", "placeholders 120 kg / 5 reps (numeric, not 5+)")
    ok(c0.locator("button[data-a=orm-open]").inner_text().strip() == "1RM 150,5 kg", "1RM chip on workout card")
    c1 = p.locator(".ex-card").nth(1)
    rp = c1.locator(".set").filter(has_not_text="Rozgrz").first.locator("button.rpe-btn").inner_text()
    ok(rp == "7,5-8,5", f"RPE range placeholder: {rp!r}")
    p.screenshot(path=f"{SH}/04-workout.png", full_page=True); noov(p, "workout")
    # log AMRAP set by placeholder, check stored reps numeric
    w0.locator("button.check").click(); p.wait_for_timeout(150)
    s = p.evaluate("() => window.Repsmith.S.active.items[0].sets.find(x => x.done)")
    ok(s["weight"] == "120" and s["reps"] == "5", f"done set stored numeric: {s['weight']} x {s['reps']}")
    # change 1RM mid-workout -> suggestion updates
    click(p, "button[data-a=orm-open]"); p.locator("#orm-kg").fill("160"); click(p, "button[data-a=orm-save]")
    ok("128 kg" in p.locator(".ex-card").first.locator(".sug").inner_text() or "127,5 kg" in p.locator(".ex-card").first.locator(".sug").inner_text(), "1RM change updates suggestion: " + p.locator(".ex-card").first.locator(".sug").inner_text())
    click(p, "button[data-a=discard]"); click(p, "button[data-a=confirm-yes]")

    # --- backoff reps: same / fixed / range
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=open-plan] >> nth=-1")
    p.evaluate("""() => { const R = window.Repsmith; const it = R.S.templates.at(-1).days[0].items[0]; it.method = 'P1'; it.scheme = 'topback'; it.reps = '3'; it.rpe = 8; it.rpeMax = 8; delete it.pct; it.backoffReps = ''; R.persist('templates'); R.render(); }""")
    click(p, "button[data-a=edit-item] >> nth=0")
    ok(p.locator("button[data-a=bk-mode]").count() == 3 and p.locator("button[data-a=bk-mode][data-v=same].on").count() == 1, "backoff: same/fixed/range, default same")
    click(p, "button[data-a=bk-mode][data-v=range]")
    ok(p.locator("#tg-bklo").input_value() == "5" and p.locator("#tg-bkhi").input_value() == "8", f"backoff range defaults {p.locator('#tg-bklo').input_value()}-{p.locator('#tg-bkhi').input_value()}")
    p.locator("#tg-bklo").fill(""); p.locator("#tg-bklo").type("x6y")
    ok(p.locator("#tg-bklo").input_value() == "6", "backoff field digits only")
    p.locator("#tg-bkhi").fill("5"); click(p, "button[data-a=item-save]")
    ok("Górna granica" in p.locator(".sheet").inner_text(), "backoff 6-5 rejected")
    p.locator("#tg-bkhi").fill("8"); click(p, "button[data-a=item-save]")
    ok(p.evaluate("() => window.Repsmith.S.templates.at(-1).days[0].items[0].backoffReps") == "6-8", "backoff 6-8 saved")
    ok("2×6-8" in p.locator("button[data-a=edit-item] .meta").first.inner_text(), "plan row shows 2×6-8: " + p.locator("button[data-a=edit-item] .meta").first.inner_text())
    click(p, "button[data-a=edit-item] >> nth=0")
    ok(p.locator("button[data-a=bk-mode][data-v=range].on").count() == 1 and p.locator("#tg-bkhi").input_value() == "8", "backoff range reopens in range mode")
    p.screenshot(path=f"{SH}/06-backoff.png", full_page=True); noov(p, "backoff sheet")
    click(p, "button[data-a=bk-mode][data-v=fixed]"); p.locator("#tg-bklo").fill("10"); click(p, "button[data-a=item-save]")
    ok(p.evaluate("() => window.Repsmith.S.templates.at(-1).days[0].items[0].backoffReps") == "10", "backoff fixed 10")
    click(p, "button[data-a=edit-item] >> nth=0"); click(p, "button[data-a=bk-mode][data-v=same]"); click(p, "button[data-a=item-save]")
    ok(p.evaluate("() => window.Repsmith.S.templates.at(-1).days[0].items[0].backoffReps") == "", "backoff back to same as top set")
    p.evaluate("""() => { window.Repsmith.S.templates.at(-1).days[0].items[0].backoffReps = '6-8'; window.Repsmith.persist('templates'); }""")
    click(p, "button[data-a=nav][data-v=today]"); click(p, "button[data-a=start-day]")
    if p.locator("button[data-a=ready-pick]").count(): click(p, "button[data-a=ready-pick][data-v='']")
    p.wait_for_selector(".ex-card")
    bo = p.locator(".ex-card").first.locator(".set").filter(has_text="Backoff").first
    ok(bo.locator("input[data-k=reps]").get_attribute("placeholder") == "6", "workout backoff placeholder = lower end (6)")
    tr = p.evaluate("() => window.Repsmith.S.active.items[0].sets.find(x => x.kind === 'backoff').target.reps")
    ok(tr == "6-8", f"backoff target stored as range: {tr}")
    click(p, "button[data-a=discard]"); click(p, "button[data-a=confirm-yes]")

    # --- backup includes maxes; boot migration repairs garbage
    bk = p.evaluate("() => window.Repsmith.backupObj().maxes")
    ok(bk.get("squat", {}).get("kg") == 160, "backup contains 1RM")
    p.evaluate("""async () => { const R = window.Repsmith; const it = R.S.templates.at(-1).days[0].items[2]; it.reps = 'osiem do 12 x'; it.rpeMax = 3; it.sets = 'abc'; await R.persist('templates'); }""")
    p.reload(); p.wait_for_timeout(800)
    fixed = p.evaluate("() => { const it = window.Repsmith.S.templates.at(-1).days[0].items[2]; return [it.reps, it.sets, it.rpe, it.rpeMax]; }")
    ok(fixed[0] == "12" and fixed[1] == 3 and (fixed[3] is None or fixed[3] >= (fixed[2] or 0)), f"boot repairs garbage: {fixed}")

    # English labels
    p.evaluate("() => { window.Repsmith.S.settings.lang = 'en'; }")
    click(p, "button[data-a=nav][data-v=plans]"); click(p, "button[data-a=open-plan] >> nth=-1"); click(p, "button[data-a=edit-item] >> nth=0")
    ok("AMRAP / max" in p.locator(".sheet").inner_text() and "Intensity" in p.locator(".sheet").inner_text().title(), "english labels")
    p.screenshot(path=f"{SH}/05-en.png", full_page=True)
    b.close()
finally:
    srv.terminate()
real = [e for e in errs if 'ERR_TUNNEL' not in e and 'fonts' not in e]
print("ERRORS:", real); print(f"{P} pass, {F} fail")
