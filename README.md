# Repsmith v0.1

Dziennik treningowy jako PWA. Działa offline, dane trzyma lokalnie na telefonie (IndexedDB), bez kont i serwera.

## Wdrożenie na GitHub Pages (ok. 10 minut, za darmo)

1. Załóż konto na github.com, jeśli go nie masz.
2. Kliknij **New repository**, nazwij je np. `repsmith`, ustaw **Public**, utwórz.
3. Na stronie repozytorium kliknij **uploading an existing file** i przeciągnij **całą zawartość** tego folderu (`index.html`, `app.js`, `app.css`, `sw.js`, `manifest.webmanifest`, foldery `data` i `icons`). Zatwierdź **Commit changes**.
4. Wejdź w **Settings → Pages**. W **Source** wybierz **Deploy from a branch**, branch `main`, folder `/ (root)`, **Save**.
5. Po 1–2 minutach aplikacja będzie pod adresem `https://<twoj-login>.github.io/repsmith/`.

## Instalacja na Androidzie

1. Otwórz ten adres w Chrome.
2. Menu (trzy kropki) → **Zainstaluj aplikację** albo **Dodaj do ekranu głównego**.
3. Repsmith pojawi się jak zwykła aplikacja, z ikoną, bez paska przeglądarki, działa bez internetu.

Ten sam link wysyłasz znajomym.

## Aktualizacja

Podmień zmienione pliki w repozytorium. Przy kolejnym otwarciu z internetem aplikacja pobierze nową wersję. Po każdej zmianie podbij `CACHE` w `sw.js` (np. `repsmith-v0.1.1`).

## Dane

- Wszystko zapisuje się na telefonie. Odinstalowanie aplikacji albo wyczyszczenie danych Chrome kasuje historię.
- Ustawienia → **Pobierz kopię (JSON)** zapisuje pełną kopię. **Wczytaj kopię z pliku** przywraca ją, także na innym telefonie.

## Struktura

- `data/exercises.json` – baza 156 ćwiczeń (nazwy PL/EN, wzorzec ruchu, mięśnie główne i pomocnicze, sprzęt, typ, jednostronne, sposób rejestracji).
- `app.js` – cała logika, bez frameworków i bez kroku budowania.
- Format kopii: `{ app: "repsmith", schema: 1, settings, templates, sessions, notes, customExercises, active }`.
