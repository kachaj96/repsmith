import os as _os, subprocess, sys, time, json
from playwright.sync_api import sync_playwright
import _nosplash  # noqa: F401
_APP = _os.path.abspath(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", ".."))
SHOTS = _os.environ.get("SHOTS")
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8779", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
P = F = 0; errs = []
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
# a tiny media pack built here (2 exercises, one generated 8x8 PNG), the real pack is not in the repo
PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEklEQVR4nGNgYGD4z0AEYBxVSFUAAG8VAQHT8U7OAAAAAElFTkSuQmCC"
pack = {"app": "repsmith", "kind": "media-pack", "version": 1, "media": {
  "machine-chest-supported-row": {"imgs": [{"id": "pack-a", "src": PNG}], "links": [], "cap": ""},
  "hack-squat": {"imgs": [{"id": "pack-b", "src": PNG}], "links": [], "cap": ""},
  "no-such-exercise": {"imgs": [{"id": "pack-c", "src": PNG}], "links": [], "cap": ""}}}
tmp = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "_pack_tmp.json"); open(tmp, "w").write(json.dumps(pack))
pngf = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "_img_tmp.png")
import base64; open(pngf, "wb").write(base64.b64decode(PNG.split(",")[1]))
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch()
    for W in (360, 412):
      p = b.new_context(viewport={"width": W, "height": 800}, locale="en-US", color_scheme="dark", has_touch=True, device_scale_factor=1).new_page()
      p.on("pageerror", lambda e: errs.append(str(e)))
      p.goto("http://localhost:8779/index.html"); p.wait_for_selector("text=Today")
      p.evaluate("() => { window.Repsmith.S.templates = []; window.Repsmith.A['plib-use']({ dataset: { v: 'BENCH-PRIO-W4' } }); }")
      p.wait_for_selector("#wv-kg"); p.fill("#wv-kg", "120"); p.locator("button[data-a=wave-start-save]").click(); p.wait_for_timeout(400)
      # import the pack through the normal backup import
      def imp():
          p.locator("button[data-a=settings]").first.click(); p.wait_for_timeout(200)
          p.evaluate("() => document.querySelectorAll('.sheet details').forEach(d => { d.open = true; })")
          p.set_input_files("#importfile", tmp); p.wait_for_timeout(400)
      imp()
      txt = p.locator(".sheet, #sheet").first.inner_text()
      ok("2 photos" in txt.replace(" ", " ") and "2 exercises" in txt, f"{W}: pack asks to add 2 photos to 2 exercises (unknown exercise skipped)")
      p.locator("button[data-a=confirm-yes]").click(); p.wait_for_timeout(400)
      ok(p.evaluate("() => Object.keys(window.Repsmith.S.media).sort().join(',')") == "hack-squat,machine-chest-supported-row", f"{W}: media saved for both exercises")
      ok(p.evaluate("() => window.Repsmith.S.sessions.length === 0 && window.Repsmith.S.templates.length === 1"), f"{W}: pack does not touch workouts or plans")
      imp(); p.locator("button[data-a=confirm-yes]").click(); p.wait_for_timeout(300)
      ok(p.evaluate("() => window.Repsmith.S.media['hack-squat'].imgs.length") == 1, f"{W}: importing the same pack twice adds nothing")
      p.evaluate("() => window.Repsmith.render()"); p.wait_for_timeout(300)
      ok(p.locator(".row.two .nm svg").count() == 2, f"{W}: Today marks the 2 exercises with photos")
      ok(p.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"), f"{W}: Today no horizontal overflow")
      ok(p.evaluate("() => [...document.querySelectorAll('.row.two .name')].every(n => n.getBoundingClientRect().height < 30)"), f"{W}: exercise names on Today fit on one line")
      if SHOTS: p.screenshot(path=f"{SHOTS}/today-{W}.png", full_page=True)
      p.locator("button[data-a=start-day]").click(); p.wait_for_timeout(400)
      if p.locator('button[data-a=ready-pick][data-v="4"]').count(): p.locator('button[data-a=ready-pick][data-v="4"]').click(); p.wait_for_timeout(400)
      ok(p.locator(".ex-thumb img").count() == 2, f"{W}: 2 thumbnails in the workout")
      ok(p.locator(".ex-thumb.empty").count() == 3, f"{W}: empty add tiles for the others")
      ok(p.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"), f"{W}: workout no horizontal overflow")
      if SHOTS: p.screenshot(path=f"{SHOTS}/workout-{W}.png")
      p.locator("button.ex-name[data-v=machine-chest-supported-row]").click(); p.wait_for_timeout(300)
      ok(p.locator(".media-strip img").count() == 1, f"{W}: tapping the name opens the preview with the photo")
      if SHOTS: p.screenshot(path=f"{SHOTS}/sheet-{W}.png")
      p.locator(".media-strip button").first.click(); p.wait_for_timeout(200)
      ok(p.locator(".media-zoom img").count() == 1, f"{W}: tapping the photo opens full screen")
      p.locator(".media-zoom").click(); p.wait_for_timeout(100); ok(p.locator(".media-zoom").count() == 0, f"{W}: tap closes full screen")
      p.locator("#sheet button[data-a=media-edit]").click(); p.wait_for_timeout(200)
      p.fill("#media-url", "youtube.com/watch?v=abc"); p.locator("button[data-a=media-add-link]").click(); p.wait_for_timeout(150)
      ok(p.locator("[role=alert]").count() >= 1, f"{W}: link without https is rejected")
      p.fill("#media-url", "https://www.youtube.com/watch?v=abc"); p.fill("#media-t", "0:42"); p.fill("#media-title", "Technique"); p.locator("button[data-a=media-add-link]").click(); p.wait_for_timeout(200)
      ok(p.evaluate("() => { const l = window.Repsmith.S.media['machine-chest-supported-row'].links[0]; return l && l.t === 42 && l.title === 'Technique'; }"), f"{W}: link saved with start 0:42")
      p.set_input_files("#media-file", [pngf, pngf]); p.wait_for_timeout(800)
      ok(p.evaluate("() => window.Repsmith.S.media['machine-chest-supported-row'].imgs.length") == 3, f"{W}: two photos added from files (3 in total)")
      ok(p.evaluate("() => window.Repsmith.S.media['machine-chest-supported-row'].imgs[2].src.startsWith('data:image/jpeg')"), f"{W}: added photo stored as JPEG")
      p.fill("#media-cap", "Seat 4"); p.locator("button[data-a=media-done]").click(); p.wait_for_timeout(300)
      href = p.locator("a.media-link").first.get_attribute("href") or ""
      ok("t=42s" in href and p.locator("a.media-link").first.get_attribute("target") == "_blank", f"{W}: link opens outside with the start time ({href})")
      ok("Seat 4" in p.locator(".sheet, #sheet").first.inner_text(), f"{W}: photo note shown")
      ok(p.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"), f"{W}: sheet no horizontal overflow")
      if SHOTS: p.screenshot(path=f"{SHOTS}/sheet2-{W}.png")
      p.locator("#sheet button[data-a=media-edit]").click(); p.wait_for_timeout(200)
      if SHOTS: p.screenshot(path=f"{SHOTS}/edit-{W}.png", full_page=True)
      p.locator("#sheet button[data-a=media-del-img]").first.click(); p.wait_for_timeout(150)
      p.locator("#sheet button[data-a=sheet-close]").first.click(); p.wait_for_timeout(150)
      ok(p.evaluate("() => window.Repsmith.S.media['machine-chest-supported-row'].imgs.length") == 3 and p.locator("#media-url").count() == 1, f"{W}: cancel keeps the photo and returns to editing")
      p.locator("#sheet button[data-a=media-del-img]").first.click(); p.wait_for_timeout(150); p.locator("button[data-a=confirm-yes]").click(); p.wait_for_timeout(300)
      ok(p.evaluate("() => window.Repsmith.S.media['machine-chest-supported-row'].imgs.length") == 2, f"{W}: confirmed delete removes one photo")
      ok(p.evaluate("() => { const o = window.Repsmith.backupObj(); return o.media && o.media['machine-chest-supported-row'].imgs.length === 2; }"), f"{W}: backup contains the photos")
      p.reload(); p.wait_for_timeout(1200)
      ok(p.evaluate("() => (window.Repsmith.S.media['hack-squat'] || {imgs:[]}).imgs.length") == 1, f"{W}: photos survive a reload (IndexedDB)")
      p.context.close()
    b.close()
finally:
  srv.terminate()
  for f in (tmp, pngf):
    try: _os.remove(f)
    except Exception: pass
print("ERRORS:", errs); print(f"{P} pass, {F} fail")
