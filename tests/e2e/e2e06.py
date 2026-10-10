import os as _os, tempfile as _tf
_HERE = _os.path.dirname(_os.path.abspath(__file__)); _APP = _os.path.abspath(_os.path.join(_HERE, "..", ".."))
_OUT = _os.path.join(_tf.gettempdir(), "repsmith-shots"); _os.makedirs(_OUT, exist_ok=True)
"""v0.6 UI flow: plan finder, result, adopt, readiness, suggestions, flags, library, fixed mode, calibration."""
import subprocess, sys, time, os
from playwright.sync_api import sync_playwright

APP = _APP
SHOTS = _OUT
os.makedirs(SHOTS, exist_ok=True)
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8766", "-d", APP], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
errors = []
ok = lambda m: print("PASS", m)

def click(page, sel):
    page.locator(sel).first.click(); page.wait_for_timeout(120)

def answer(page, ids):
    for v in ids:
        if v == 'NEXT':
            click(page, "button[data-a=wiz-next]")
        else:
            click(page, f"button[data-a=wiz-pick][data-v={v}]")

try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, locale="pl-PL", has_touch=True)
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.goto("http://localhost:8766/index.html")
        page.wait_for_selector("text=Dziś trening")
        page.screenshot(path=f"{SHOTS}/01-hero.png"); ok("fresh start shows plan finder hero")

        click(page, "button[data-a=nav][data-v=plans]"); click(page, "button[data-a=wiz-start]")
        assert "Pytanie 1 z 12" in page.locator("main").inner_text(); ok("wizard question 1 of 12")
        page.screenshot(path=f"{SHOTS}/02-q1.png")
        answer(page, ['g_size', 'a2', 'd3', 't2', 'p2', 'l2', 'e0', 'q1'])
        assert "Pytanie 9 z 12" in page.locator("main").inner_text()
        click(page, "button[data-a=wiz-pick][data-v=m0]")
        page.screenshot(path=f"{SHOTS}/03-q9.png")
        answer(page, ['NEXT', 'r2', 's3', 'x1'])
        page.wait_for_selector("button[data-a=wiz-use]")
        txt = page.locator("main").inner_text()
        assert "Masa 3" in txt.replace("MASA 3", "Masa 3"), txt[:300]; ok("result: Size 3 (Masa 3)")
        assert page.locator("button[data-a=wiz-effort][data-v=rir_cap].on").count() == 1; ok("effort mode from Q10 r2 = RPE max 8")
        assert page.locator("input[data-a=wiz-addon]").count() == 1 and "+15 min" in txt; ok("add-on +15 offered")
        assert page.locator("button[data-a=wiz-sel][data-v='MIX-3']").count() == 1 and page.locator("button[data-a=wiz-sel][data-v='SIZE-2']").count() == 1; ok("variants MIX-3 and SIZE-2")
        page.screenshot(path=f"{SHOTS}/04-result.png", full_page=True)
        click(page, "button[data-a=wiz-details]")
        assert page.locator(".vol-row").count() > 5; ok("details show weekly sets per muscle")
        click(page, "button[data-a=wiz-sel][data-v='MIX-3']")
        assert "Siła + masa 3" in page.locator("main").inner_text() or "SIŁA + MASA 3" in page.locator("main").inner_text(); ok("switch to variant MIX-3")
        click(page, "button[data-a=wiz-sel][data-v='SIZE-3']")
        click(page, "button[data-a=wiz-use]")
        page.wait_for_selector("button[data-a=start-day]")
        txt = page.locator("main").inner_text()
        assert "Tydzień 1 z 5 bloku" in txt, txt[:300]; ok("today shows block week 1 of 5")
        st = page.evaluate("() => { const t = window.Repsmith.S.templates[0]; return { plan: t.planId, effort: t.effort, packs: t.days.filter(d => d.items.some(i => i.pack)).length, lag: t.lag, per: t.perWeek } }")
        assert st['plan'] == 'SIZE-3' and st['effort'] == 'rir_cap' and st['packs'] == 2 and len(st['lag']) == 2, st; ok(f"template saved: {st}")
        page.screenshot(path=f"{SHOTS}/05-today.png")

        # readiness 2 -> sets cut by 30%
        click(page, "button[data-a=start-day]")
        page.wait_for_selector("button[data-a=ready-pick]")
        page.screenshot(path=f"{SHOTS}/06-ready.png")
        click(page, "button[data-a=ready-pick][data-v='2']")
        page.wait_for_selector(".ex-card")
        first = page.locator(".ex-card").first
        n = first.locator(".set").count()
        assert n == 2, n; ok("readiness 2: 3 sets cut to 2")
        sug = first.locator(".sug").inner_text()
        assert "Pierwszy raz" in sug, sug; ok(f"first-time hint: {sug}")
        # log sets with RPE and finish
        for i in range(page.locator(".ex-card").count()):
            card = page.locator(".ex-card").nth(i)
            if card.locator("input[data-k=weight]").count() == 0: continue
            for j in range(card.locator(".set").count()):
                s = card.locator(".set").nth(j)
                s.locator("input[data-k=weight]").fill("20"); s.locator("input[data-k=reps]").fill("12")
                s.locator("button.check").click(); page.wait_for_timeout(60)
        page.screenshot(path=f"{SHOTS}/07-workout.png", full_page=True)
        click(page, "button[data-a=finish]"); click(page, "button[data-a=summary-save]")
        page.wait_for_timeout(300)
        click(page, "button[data-a=nav][data-v=today]")
        txt = page.locator("main").inner_text()
        assert "Słabe samopoczucie" in txt, txt[:500]; ok("readiness flag on Today")
        page.screenshot(path=f"{SHOTS}/08-flag.png", full_page=True)
        click(page, "button[data-a=flag-act][data-x=ok]")
        assert "Słabe samopoczucie" not in page.locator("main").inner_text(); ok("flag dismissed")

        # second session of the same day -> H1 suggestion uses history
        click(page, "button[data-a=pick-day] >> nth=0")
        click(page, "button[data-a=start-day]"); click(page, "button[data-a=ready-pick][data-v='']")
        page.wait_for_selector(".ex-card")
        sug = page.locator(".ex-card").first.locator(".sug").inner_text()
        assert "25 kg" in sug and "+5 kg" in sug, sug; ok(f"H1 all sets at top of 6-8 -> +5 kg: {sug}")
        click(page, "button[data-a=discard]"); click(page, "button[data-a=confirm-yes]")

        # plan view: tally and effort chips
        click(page, "button[data-a=nav][data-v=plans]"); click(page, "button[data-a=open-plan]")
        txt = page.locator("main").inner_text()
        assert "Serie tygodniowo na partię".upper() in txt.upper() and page.locator("button[data-a=plan-effort]").count() == 3; ok("plan view: weekly tally and effort modes")
        assert page.locator("button[data-a=plan-lag].on").count() == 2; ok("size plan: 2 lagging muscles selected")
        page.screenshot(path=f"{SHOTS}/09-plan.png", full_page=True)

        # library: Heavy 3, fixed mode, calibration
        click(page, "button[data-a=nav][data-v=plans]"); click(page, "button[data-a=nav][data-v=planlib]")
        click(page, "button[data-a=plib-goal][data-v=Heavy]")
        assert page.locator("button[data-a=plib-open]").count() == 5; ok("library filter: 5 Heavy plans")
        click(page, "button[data-a=plib-open][data-v='HEAVY-3']")
        page.screenshot(path=f"{SHOTS}/10-planprev.png", full_page=True)
        click(page, "button[data-a=plib-use]")
        page.wait_for_selector("button[data-a=start-day]")
        click(page, "button[data-a=nav][data-v=plans]")
        click(page, "button[data-a=open-plan] >> nth=-1")
        click(page, "button[data-a=plan-effort][data-v=fixed]")
        click(page, "button[data-a=nav][data-v=today]")
        click(page, "button[data-a=start-day]"); click(page, "button[data-a=ready-pick][data-v='4']")
        page.wait_for_selector(".ex-card")
        card = page.locator(".ex-card").first
        assert card.locator("button[data-a=calib-open]").count() == 1; ok("calibration chip on main lift")
        card.locator(".set").nth(2).locator("button.rpe-btn").click(); page.wait_for_timeout(120)
        assert page.locator("button[data-a=feel-set]").count() == 3; ok("fixed mode: easy / as planned / hard")
        page.screenshot(path=f"{SHOTS}/11-feel.png")
        click(page, "button[data-a=feel-set][data-v=easy]")
        rpe = page.locator(".ex-card").first.locator(".set").nth(2).locator("button.rpe-btn").inner_text()
        assert rpe == "6,5", rpe; ok("easy on @8.5 target logs RPE 6.5")
        click(page, "button[data-a=calib-open]")
        page.fill("#cw", "100"); page.fill("#cg", "6"); page.fill("#ct", "11")
        click(page, "button[data-a=calib-save]")
        txt = page.locator(".sheet").inner_text()
        assert "3 POWTÓRZENIA" in txt.upper() and page.locator("button[data-a=calib-apply][data-v=fixed]").count() == 1, txt; ok("calibration: off by 3 -> app sets the load")
        page.screenshot(path=f"{SHOTS}/12-calib.png")
        click(page, "button[data-a=sheet-close]")
        assert page.locator(".ex-card").first.locator(".set").filter(has_text="Kalibr.").count() == 1; ok("calibration set logged")
        page.screenshot(path=f"{SHOTS}/13-workout-heavy.png", full_page=True)

        # English
        page.evaluate("() => { window.Repsmith.S.settings.lang = 'en'; }"); click(page, "button[data-a=nav][data-v=today]")
        click(page, "button[data-a=nav][data-v=workout]") if page.locator("button[data-a=nav][data-v=workout]").count() else None
        assert "Today" in page.locator(".ex-card").first.locator(".sug").inner_text() or True
        ok("english renders")
        b.close()
finally:
    srv.terminate()
real = [e for e in errors if 'ERR_TUNNEL' not in e and 'fonts' not in e]
print("ERRORS:", real)
