# Repsmith tests

- `unit/` engine, plan cycles, plan selector and gear tests, plain node, no dependencies.
- `e2e/` Playwright (Python) scripts, each starts its own static server and drives the app in a 360 px phone viewport.
- `sh tests/run.sh` runs everything. Screenshots go to the system temp folder (`repsmith-shots`).

Lines starting with FAIL are real failures. `ERR_TUNNEL_CONNECTION_FAILED` in the console list only means the sandbox could not load web fonts.

- `unit/version_test.js`: jedna wersja w app.js, sw.js i README, wszystko ładowane jest w SHELL, brak zewnętrznych adresów.
- `e2e/e2e093.py`: błąd zapisu, kopia bezpieczeństwa przed importem, cofnięcie, kopia z nowszego schematu, kolejność na ekranie Dziś, Historia, rozmiar tekstu i kontrast pól.
