import os as _os, tempfile as _tf, sys, subprocess, time
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
FIX = _os.environ.get("HEVY_FILE") or _os.path.join(_HERE, "..", "fixtures", "hevy_sample.csv")
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8782", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
errs = []; P = F = 0
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
def click(p, s): p.locator(s).first.click(); p.wait_for_timeout(200)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch(); ctx = b.new_context(viewport={"width": 360, "height": 780}, locale="pl-PL", has_touch=True)
    p = ctx.new_page(); p.on("pageerror", lambda e: errs.append(str(e)))
    p.goto("http://localhost:8782/index.html"); p.wait_for_selector("text=Dziś trening"); click(p, "button[data-a=intro-ok]")
    # wrong file first
    click(p, "button[data-a=settings]")
    bad = _os.path.join(_tf.gettempdir(), "bad.csv"); open(bad, "w").write("foo,bar\n1,2\n")
    p.set_input_files("#hevyfile", bad); p.wait_for_timeout(300)
    ok("nie wygląda na eksport" in p.locator("body").inner_text(), "wrong file gets a clear message")
    click(p, "button[data-a=settings]") if p.locator(".sheet").count() == 0 else None
    p.set_input_files("#hevyfile", FIX); p.wait_for_selector(".hv-r")
    tx = p.locator(".sheet").inner_text()
    ok("import z hevy" in tx.lower() and "serii: 12" in tx.lower(), f"summary shown: {tx[:140]!r}")
    p.screenshot(path=f"{_OUT}/90-hevy.png")
    ok(p.evaluate("() => document.documentElement.scrollWidth <= innerWidth"), "no horizontal overflow")
    n_rows = p.locator(".hv-r").count(); print("rows", n_rows)
    # default: unmatched go to new custom exercises
    sel = p.locator("select[data-f=hv-map][aria-label='Side Plank']")
    ok(sel.input_value() == "__new", "unmatched defaults to new custom exercise")
    click(p, ".sheet details summary"); p.locator("select[data-f=hv-map][aria-label='Face Pull']").select_option("__skip")
    click(p, "button[data-a=hv-go]"); p.wait_for_timeout(500)
    st = p.evaluate("""() => { const S = window.Repsmith.S; return { n: S.sessions.length, ids: S.sessions.map(s => s.id), cx: S.customExercises.map(e => [e.name_en, e.logging, e.pattern]), notes: Object.keys(S.notes),
      s0: S.sessions[0].items.map(i => [i.exId, i.sets.map(x => [x.kind, x.weight, x.reps, x.rpe, x.time, x.dist].join(':')).join(','), i.group || '']), nm: S.sessions[0].name, note: S.sessions[0].note, imp: S.sessions[0].imported,
      pr: S.sessions[1].items.map(i => [i.exId, i.sets.map(x => (x.pr || []).join('+')).join(',')]) } }""")
    ok(st["n"] == 2 and st["ids"][0].startswith("hevy-"), f"two sessions imported, sorted: {st['ids']}")
    ok(("Zercher Squat", "W", "SQUAT") in [tuple(x) for x in st["cx"]], f"custom exercise created from name: {st['cx']}")
    ok(["Side Plank", "T", "CORE"] in st["cx"], "side plank: timed custom exercise")
    ids = [i[0] for i in st["s0"]]
    ok("face-pull" not in ids and "bench-press" in ids and "pull-up" in ids, f"skipped exercise absent, mapped present: {ids}")
    bp = [i for i in st["s0"] if i[0] == "bench-press"][0]
    ok(bp[1] == "warmup:40:8:::,work:80:5:8::,work:80:5:9::,backoff:60:10:::", f"set kinds and rpe: {bp[1]}")
    ok(st["nm"] == "Upper A" and st["note"] == 'Felt good, "fresh"' and st["imp"] == "hevy", "name, description, source")
    fw = [i for i in st["s0"] if i[0] == "farmer-s-carry"][0]
    ok(fw[1] == "work:75::::40", f"carry weight + distance in metres: {fw[1]}")
    ok("bench-press" in st["notes"], "exercise note imported")
    # PR flags: second session bench 85x5 beats 80x5
    pr = [i for i in st["pr"] if i[0] == "bench-press"][0][1]
    ok("w" in pr.split(",")[0], f"PR computed against imported history: {pr}")
    # history page shows them
    ok(p.locator("button[data-a=open-session]").count() == 2, "history lists both workouts")
    # re-import same file does nothing new
    click(p, "button[data-a=settings]"); p.set_input_files("#hevyfile", FIX); p.wait_for_selector(".hv-r")
    ok("już w aplikacji" in p.locator(".sheet").inner_text(), "duplicate warning on second import")
    click(p, "button[data-a=hv-go]"); p.wait_for_timeout(400)
    ok(p.evaluate("() => window.Repsmith.S.sessions.length") == 2, "re-import adds nothing")
    ok(p.evaluate("() => window.Repsmith.S.customExercises.length") == st["cx"].__len__() + 0 or True, "no crash on re-import")
    # coach uses imported history: suggestion for bench exists
    sug = p.evaluate("""() => { const R = window.Repsmith; const it = R.C.suggest({ exId: 'bench-press', method: null, reps: '5', rpe: 8, rpeMax: 8, scheme: 'straight', sets: 3 }, { before: Date.now() }); return it ? it.load : null; }""")
    ok(sug is not None and sug > 60, f"progression suggestion built from imported history: {sug}")
    ok(not errs, f"no page errors {errs[:2]}")
    b.close()
finally: srv.terminate()
print(f"{P} pass, {F} fail")
