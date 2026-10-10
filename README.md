# Repsmith v0.6.2

Autor: Adrian Drożdżyński

Dziennik treningowy jako PWA. Działa offline, dane trzyma lokalnie na telefonie (IndexedDB), bez kont i serwera.

## Wdrożenie na GitHub Pages (ok. 10 minut, za darmo)

1. Załóż konto na github.com, jeśli go nie masz.
2. Kliknij **New repository**, nazwij je np. `repsmith`, ustaw **Public**, utwórz.
3. Na stronie repozytorium kliknij **uploading an existing file** i przeciągnij **całą zawartość** tego folderu (`index.html`, `app.js`, `plans.js`, `coach.js`, `bodymap.js`, `app.css`, `sw.js`, `manifest.webmanifest`, foldery `data` i `icons`). Zatwierdź **Commit changes**.
4. Wejdź w **Settings → Pages**. W **Source** wybierz **Deploy from a branch**, branch `main`, folder `/ (root)`, **Save**.
5. Po 1–2 minutach aplikacja będzie pod adresem `https://<twoj-login>.github.io/repsmith/`.

## Instalacja na Androidzie

1. Otwórz ten adres w Chrome.
2. Menu (trzy kropki) → **Zainstaluj aplikację** albo **Dodaj do ekranu głównego**.
3. Repsmith pojawi się jak zwykła aplikacja, z ikoną, bez paska przeglądarki, działa bez internetu.

Ten sam link wysyłasz znajomym.

## Instalacja na iPhonie

1. Otwórz link w **Safari** (na iOS 16.4+ działa też Chrome).
2. Przycisk **Udostępnij** → **Dodaj do ekranu początkowego**.
3. Uruchamiaj zawsze z ikony na ekranie, nie z przeglądarki. Dane aplikacji z ikony nie są czyszczone automatycznie, dane strony otwieranej w Safari mogą zniknąć po kilku tygodniach nieużywania.

Ograniczenia iOS: brak wibracji na koniec przerwy, dźwięki timera nie grają przy wyciszonym telefonie (przełącznik z boku) ani przy zablokowanym ekranie.

## Aktualizacja

Podmień zmienione pliki w repozytorium. Przy kolejnym otwarciu z internetem aplikacja pobierze nową wersję. Po każdej zmianie podbij `CACHE` w `sw.js` (np. `repsmith-v0.6.3`).

## Sprawdzenie wersji

Ustawienia → na dole numer wersji. Jeśli po aktualizacji widać starą: zamknij aplikację całkowicie (z listy ostatnich aplikacji) i otwórz ponownie z internetem.

## Dane

- Wszystko zapisuje się na telefonie. Odinstalowanie aplikacji albo wyczyszczenie danych Chrome kasuje historię.
- Ustawienia → **Pobierz kopię (JSON)** zapisuje pełną kopię. **Wczytaj kopię z pliku** przywraca ją, także na innym telefonie.

## Struktura

- `data/exercises.json` – baza 159 ćwiczeń (nazwy PL/EN, wzorzec ruchu, mięśnie główne i pomocnicze, sprzęt, typ, jednostronne, sposób rejestracji).
- `app.js` – interfejs i logika dziennika, bez frameworków i bez kroku budowania.
- `plans.js` – biblioteka 25 planów, pytania kreatora, pakiety dodatkowe i zamiany (generowane z blueprintu planów).
- `coach.js` – selektor planu, budowanie planu, silnik progresji, objętość, sygnały, bloki i deload.
- `bodymap.js` – sylwetka mięśni z [react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter), licencja MIT, © 2022 ELABBASSI Hicham (pełna treść w `LICENSES.md`).
- Format kopii: `{ app: "repsmith", schema: 1, settings, templates, sessions, notes, customExercises, active, measurements, flags, calib }`.
