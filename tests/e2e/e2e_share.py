import os as _os, subprocess, sys, time, json
from playwright.sync_api import sync_playwright
import _nosplash  # noqa: F401
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8781", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
P = F = 0; errs = []
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEklEQVR4nGNgYGD4z0AEYBxVSFUAAG8VAQHT8U7OAAAAAElFTkSuQmCC"
HERE = _os.path.dirname(_os.path.abspath(__file__)); planf = _os.path.join(HERE, "_plan_tmp.json")
def settings_import(p, f):
    p.locator("button[data-a=settings]").first.click(); p.wait_for_timeout(200)
    p.evaluate("() => document.querySelectorAll('.sheet details').forEach(d => { d.open = true; })")
    p.set_input_files("#importfile", f); p.wait_for_timeout(400)
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch()
    p = b.new_context(viewport={"width": 360, "height": 800}, locale="en-US", color_scheme="dark", has_touch=True, accept_downloads=True).new_page()
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.goto("http://localhost:8781/index.html"); p.wait_for_selector("text=Today")
    # exercise library: add a link to an exercise without media
    p.evaluate("() => { window.Repsmith.S.media = {}; window.Repsmith.A['ex-detail']({ dataset: { v: 'hack-squat' } }); }"); p.wait_for_timeout(200)
    ok(p.locator("#sheet button[data-a=media-edit]").inner_text().strip() == "Add a photo or video", "library detail offers adding media")
    p.locator("#sheet button[data-a=media-edit]").click(); p.wait_for_timeout(200)
    p.fill("#media-url", "https://youtu.be/xyz?t=75"); p.locator("button[data-a=media-add-link]").click(); p.wait_for_timeout(200)
    p.locator("button[data-a=media-done]").click(); p.wait_for_timeout(300)
    ok(p.locator("#sheet a.media-link").count() == 1 and "from 1:15" in p.locator("#sheet").inner_text(), "back in the library detail with the link (start 1:15 from ?t=75)")
    p.evaluate("() => { const R = window.Repsmith; R.S.media['hack-squat'].imgs = [{ id: 'i1', src: '%s' }]; R.render(); }" % PNG)
    p.locator("#sheet button[data-a=sheet-close]").first.click(); p.wait_for_timeout(200)
    p.evaluate("() => { window.Repsmith.S.view = 'library'; window.Repsmith.render(); }"); p.wait_for_timeout(300)
    ok(p.locator("#liblist button[data-v=hack-squat] .nm svg").count() == 1, "library list marks the exercise with media")
    ok(p.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"), "library no horizontal overflow")
    # a plan with a wave base and a custom exercise, then share it
    p.evaluate("() => { const R = window.Repsmith; R.S.view = 'today'; R.S.templates = []; R.S.customExercises = [{ id: 'custom-x1', name_pl: 'Moje ćwiczenie', name_en: 'My exercise', pattern: 'HPUSH', primary: ['CHEST'], secondary: [], equipment: 'MACH', type: 'compound', unilateral: false, logging: 'W' }]; R.render(); R.A['plib-use']({ dataset: { v: 'BENCH-PRIO-W4' } }); }")
    p.wait_for_selector("#wv-kg"); p.fill("#wv-kg", "120"); p.locator("button[data-a=wave-start-save]").click(); p.wait_for_timeout(400)
    p.evaluate("() => { const R = window.Repsmith, tp = R.S.templates[0]; tp.days[0].items.push({ id: 'zz', exId: 'custom-x1', scheme: 'straight', sets: 2, reps: '8-12', rpe: 8, rpeMax: 9, rest: 90 }); R.persist('templates'); R.S.sessions = [{ id: 's1', templateId: tp.id, startedAt: Date.now(), endedAt: Date.now(), items: [] }]; R.S.viewArg = tp.id; R.A['plan-menu'](); }")
    p.wait_for_timeout(200); p.locator("#sheet button", has_text="Share plan").click(); p.wait_for_timeout(200)
    txt = p.locator("#sheet").inner_text()
    ok("photos: 1" in txt and "File size" in txt, "share sheet shows photo count and size")
    with p.expect_download() as dl: p.locator("button[data-a=plan-share-go]").click()
    d = dl.value; d.save_as(planf); ok(d.suggested_filename.startswith("repsmith-plan-bench-priority"), f"file name {d.suggested_filename}")
    o = json.load(open(planf))
    ok(o["kind"] == "plan" and "wb" not in o["plan"]["wave"] and "hist" not in o["plan"]["wave"], "export: kind plan, without the personal wave base")
    ok("sessions" not in o and "id" not in o["plan"] and "start" not in o["plan"]["cycle"], "export: no workouts, no plan id, no cycle start")
    ok([e["id"] for e in o["customExercises"]] == ["custom-x1"] and "hack-squat" in o["media"], "export: the custom exercise and the media of plan exercises")
    # second phone: fresh storage
    q = b.new_context(viewport={"width": 360, "height": 800}, locale="pl-PL", has_touch=True).new_page()
    q.on("pageerror", lambda e: errs.append(str(e)))
    q.goto("http://localhost:8781/index.html"); q.wait_for_selector("text=Dziś trening")
    settings_import(q, planf)
    ok("Dodać plan" in q.locator("#sheet").inner_text() and "zdjęcia ćwiczeń (1)" in q.locator("#sheet").inner_text(), "import asks to add the plan with 1 photo")
    q.locator("button[data-a=confirm-yes]").click(); q.wait_for_selector("#wv-kg")
    ok(True, "wave plan asks the other person for their own base")
    q.fill("#wv-kg", "60"); q.locator("button[data-a=wave-start-save]").click(); q.wait_for_timeout(500)
    r = q.evaluate("() => { const S = window.Repsmith.S, tp = S.templates[0]; return { n: S.templates.length, wb: tp.wave.wb, act: S.settings.activeTemplateId === tp.id, items: tp.days.map(d => d.items.length), cust: S.customExercises.map(e => e.id), sess: S.sessions.length, media: !!(S.media['hack-squat'] && S.media['hack-squat'].imgs.length), start: tp.cycle.start > Date.now() - 60000 }; }")
    ok(r["n"] == 1 and r["wb"] == 60 and r["act"], f"plan added and active with WB 60 ({r})")
    ok(r["items"] == [6, 6, 6] and r["cust"] == ["custom-x1"], "all items incl. the custom exercise")
    ok(r["sess"] == 0 and r["media"] and r["start"], "no workouts copied, photo added, cycle starts now")
    ok(q.locator("text=Wyciskanie sztangi").count() >= 1 or "Ciężki bench" in q.locator("main").inner_text(), "Today shows the imported plan")
    b.close()
finally:
  srv.terminate()
  try: _os.remove(planf)
  except Exception: pass
print("ERRORS:", errs); print(f"{P} pass, {F} fail")
