import os as _os, tempfile as _tf
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
import subprocess,sys,time
from playwright.sync_api import sync_playwright
srv=subprocess.Popen([sys.executable,"-m","http.server","8767","-d",_APP],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch()
    for w in (360,390):
      pg=b.new_context(viewport={"width":w,"height":800},locale="pl-PL",has_touch=True).new_page()
      pg.goto("http://localhost:8767/index.html");pg.wait_for_selector("text=Dobierz plan")
      pg.evaluate("()=>window.Repsmith.go?window.Repsmith.go('planlib'):0")
      pg.locator("button[data-a=nav][data-v=plans]").first.click() if pg.locator("button[data-a=nav][data-v=plans]").count() else None
      pg.locator("button[data-a=nav][data-v=planlib]").first.click();pg.wait_for_selector("button[data-a=plib-open]")
      r=pg.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]");print(w,"planlib",r,"OK" if r[0]<=r[1] else "OVERFLOW")
      pg.screenshot(path=_OUT + f"/ovf{w}.png")
      pg.locator("button[data-a=plib-open]").first.click();pg.wait_for_timeout(200)
      r=pg.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]");print(w,"planprev",r,"OK" if r[0]<=r[1] else "OVERFLOW")
    b.close()
finally: srv.terminate()
