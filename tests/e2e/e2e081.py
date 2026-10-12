import os as _os, tempfile as _tf
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
import subprocess, sys, time
from playwright.sync_api import sync_playwright
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8781", "-d", _APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
errs = []; P = F = 0
def ok(c, m):
    global P, F
    if c: P += 1; print("PASS", m)
    else: F += 1; print("FAIL", m)
def click(p, s): p.locator(s).first.click(); p.wait_for_timeout(150)
STUB = """() => { window.__tones = []; window.__ctxState = 'suspended';
  class Osc { constructor(){ this.frequency = {value:0}; this.type=''; } connect(){ return this; } start(){ window.__tones.push(this.frequency.value); } stop(){} }
  class Gain { constructor(){ this.gain = {setValueAtTime(){}, exponentialRampToValueAtTime(){}}; } connect(){ return this; } }
  class Ctx { constructor(){ this.currentTime = 0; this.destination = {}; this.state = 'suspended'; window.__ctx = this; }
    resume(){ this.state = 'running'; window.__resumed = (window.__resumed||0)+1; return Promise.resolve(); }
    createOscillator(){ return new Osc(); } createGain(){ return new Gain(); }
    createBuffer(){ return {}; } createBufferSource(){ return { connect(){}, start(){ window.__unlock = true; } }; } }
  window.AudioContext = Ctx; window.webkitAudioContext = Ctx;
  window.__plays = 0; HTMLMediaElement.prototype.play = function(){ window.__plays++; this.__playing = true; return Promise.resolve(); };
  HTMLMediaElement.prototype.pause = function(){ this.__playing = false; };
  navigator.audioSession = { type: 'auto' }; }"""
try:
  with sync_playwright() as pw:
    b = pw.chromium.launch()
    ctx = b.new_context(viewport={"width": 402, "height": 874}, device_scale_factor=2, locale="pl-PL", has_touch=True)
    p = ctx.new_page()
    p.on("pageerror", lambda e: errs.append(str(e)))
    p.add_init_script("(" + STUB + ")()")
    p.goto("http://localhost:8781/index.html"); p.wait_for_selector("text=Dziś trening")
    # simulate iPhone safe areas
    p.add_style_tag(content=":root{--sat:62px;--sab:34px}")
    click(p, "button[data-a=intro-ok]")
    r = p.evaluate("() => document.querySelector('.topbar').getBoundingClientRect().top")
    ok(r >= 62, f"today topbar below the island: top={r}")
    p.screenshot(path=f"{_OUT}/81-today.png")
    # sheet respects the top inset
    click(p, "button[data-a=settings]")
    r = p.evaluate("() => document.querySelector('.sheet').getBoundingClientRect().top")
    ok(r >= 62, f"sheet below the island: top={r}")
    p.screenshot(path=f"{_OUT}/81-settings.png")
    # sound test button + unlock
    before = p.evaluate("() => window.__tones.length")
    click(p, "button[data-a=sound-test]")
    t = p.evaluate("() => window.__tones")
    ok(len(t) - before == 3, f"test sound plays 3 tones: {t}")
    ok(p.evaluate("() => window.__unlock === true"), "audio unlocked with silent buffer")
    ok(p.evaluate("() => navigator.audioSession.type") in ("playback", "auto"), "audioSession touched")
    click(p, "button[data-a=vol][data-v=low]"); ok(p.evaluate("() => window.Repsmith.S.settings.vol") == "low", "volume saved")
    click(p, "button[data-a=vol][data-v=high]")
    click(p, "button[data-a=sheet-close]")
    # workout: header + timer insets, silent loop, countdown ticks
    click(p, "button[data-a=start-free]"); p.wait_for_timeout(300)
    r = p.evaluate("() => document.querySelector('.wk-head').getBoundingClientRect().top")
    ok(r >= 62, f"workout header below the island: top={r}")
    p.evaluate("() => window.Repsmith.startTimer(7)"); p.wait_for_timeout(300)
    ok(p.evaluate("() => window.__plays") >= 1, "silent loop started with timer")
    ok(p.evaluate("() => navigator.audioSession.type") == "playback", "audioSession = playback while timer runs")
    r = p.evaluate("() => { const b = document.querySelector('.timer-inner').getBoundingClientRect(); return innerHeight - b.bottom; }")
    ok(r >= 34, f"timer clears the home bar: gap={r}")
    p.screenshot(path=f"{_OUT}/81-workout.png")
    p.evaluate("() => { window.__tones.length = 0; }")
    p.wait_for_timeout(7600)
    t = p.evaluate("() => window.__tones")
    ok(t.count(988) == 3 and t.count(660) == 2, f"countdown 5,4 soft + 3,2,1 high: {t}")
    ok(t[-3:] == [880, 1175, 1568], f"end signal 3 tones: {t[-3:]}")
    p.wait_for_timeout(4300)
    ok(p.evaluate("() => navigator.audioSession.type") == "auto", "audioSession released after the timer")
    # sound off = silence
    p.evaluate("() => { window.Repsmith.S.settings.sound = false; window.Repsmith.startTimer(2); window.__tones.length = 0; }"); p.wait_for_timeout(2600)
    ok(p.evaluate("() => window.__tones.length") == 0, "sound off stays silent")
    ok(not errs, f"no page errors {errs[:2]}")
    b.close()
finally:
  srv.terminate()
print(f"{P} pass, {F} fail")
