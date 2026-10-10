import os as _os, tempfile as _tf
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
import subprocess,sys,time
from playwright.sync_api import sync_playwright
SH=_OUT
srv=subprocess.Popen([sys.executable,"-m","http.server","8768","-d",_APP],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
errs=[];ok=lambda m:print("PASS",m)
def click(p,s): p.locator(s).first.click(); p.wait_for_timeout(120)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(); ctx=b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,locale="pl-PL",has_touch=True); p=ctx.new_page()
    p.on("pageerror",lambda e:errs.append(str(e))); p.on("console",lambda m:errs.append(m.text) if m.type=="error" else None)
    p.goto("http://localhost:8768/index.html"); p.wait_for_selector("text=Dobierz plan")
    click(p,"button[data-a=nav][data-v=plans]"); click(p,"button[data-a=nav][data-v=planlib]")
    click(p,"button[data-a=plib-open]"); click(p,"button[data-a=plib-use]"); p.wait_for_selector("button[data-a=start-day]")
    # plan editor: link first two via menu
    click(p,"button[data-a=nav][data-v=plans]"); click(p,"button[data-a=open-plan]")
    click(p,"button[data-a=item-link] >> nth=0"); click(p,"button[data-a=menu-pick][data-v=lnk]")
    assert p.locator(".row.grp").count()==2 and "A1" in p.locator("main").inner_text(); ok("plan: linked via menu, A1/A2")
    # long press third item
    box=p.locator("button[data-lp]").nth(2).bounding_box()
    p.mouse.move(box["x"]+40,box["y"]+10); p.mouse.down(); p.wait_for_timeout(700); p.mouse.up(); p.wait_for_timeout(200)
    assert p.locator(".link-bar").count()==1; ok("plan: long press enters link mode")
    print("toggles",p.locator("button[data-a=link-toggle]").count()); click(p,"button[data-a=link-toggle] >> nth=3" if p.locator("button[data-a=link-toggle]").count()>3 else "button[data-a=link-toggle] >> nth=1"); p.screenshot(path=SH+"/ss1.png")
    click(p,"button[data-a=link-go]")
    print("groups:",p.evaluate("()=>window.Repsmith.S.templates.at(-1).days[0].items.map(i=>i.group?i.group.slice(0,3):'-')"))
    r=p.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]"); assert r[0]<=r[1]; ok("plan no h-overflow")
    p.screenshot(path=SH+"/ss2.png",full_page=True)
    # workout
    click(p,"button[data-a=nav][data-v=today]"); click(p,"button[data-a=start-day]")
    if p.locator("button[data-a=ready-pick]").count(): click(p,"button[data-a=ready-pick][data-v='']")
    p.wait_for_selector(".ex-card")
    n=p.locator(".ex-card.grp").count(); print("grouped cards",n); assert n>=2; ok("workout shows grouped cards")
    p.screenshot(path=SH+"/ss3.png")
    c0=p.locator(".ex-card").nth(0); c1=p.locator(".ex-card").nth(1)
    c0.locator("button.check").first.click(); p.wait_for_timeout(150)
    assert not p.evaluate("()=>!!window.Repsmith.S.timer"); ok("no timer after A1")
    c1=p.locator(".ex-card").nth(1)
    # complete: fill reps if empty
    c1.locator("button.check").first.click(); p.wait_for_timeout(150)
    print("timer after A2:",p.evaluate("()=>!!window.Repsmith.S.timer"))
    p.locator(".ex-card").nth(2).locator("button.check").first.click(); p.wait_for_timeout(150)
    assert p.evaluate("()=>!!window.Repsmith.S.timer"); ok("timer only after last exercise of round")
    # workout menu unlink
    click(p,"button[data-a=item-menu] >> nth=0"); click(p,"button[data-a=menu-pick][data-v=grp]"); click(p,"button[data-a=menu-pick][data-v=unl]")
    print("after unlink grouped:",p.locator(".ex-card.grp").count())
    r=p.evaluate("()=>[document.documentElement.scrollWidth,innerWidth]"); assert r[0]<=r[1]
    # calibration sheet
    if p.locator("button[data-a=calib-open]").count():
        click(p,"button[data-a=calib-open]"); p.screenshot(path=SH+"/ss4.png")
    b.close()
finally: srv.terminate()
print("ERRORS",[e for e in errs if 'ERR_TUNNEL' not in e and 'fonts' not in e])
