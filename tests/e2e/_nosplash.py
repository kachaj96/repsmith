"""The start animation plays on a real launch only, and the app tests open the app many times. Importing this module makes every
context start as a reload inside a session (sessionStorage flag), so the app is usable at once. e2e_splash.py does not import it."""
from playwright.sync_api import Browser, BrowserContext

_new_page = BrowserContext.new_page
def _ctx_new_page(self, *a, **k):
    if not getattr(self, "_nosplash", False):
        self.add_init_script("try { sessionStorage.setItem('smith.splash', 'played'); } catch (e) {}")
        self._nosplash = True
    return _new_page(self, *a, **k)
BrowserContext.new_page = _ctx_new_page

_browser_new_page = Browser.new_page
def _browser_new_page(self, **k):
    return self.new_context(**k).new_page()
Browser.new_page = _browser_new_page
