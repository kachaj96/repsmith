# Repsmith v0.13.2

Autor: Adrian Drożdżyński

Dziennik treningowy jako PWA. Działa offline, dane trzyma lokalnie na telefonie (IndexedDB), bez kont i serwera.

## Wdrożenie na GitHub Pages (ok. 10 minut, za darmo)

1. Załóż konto na github.com, jeśli go nie masz.
2. Kliknij **New repository**, nazwij je np. `repsmith`, ustaw **Public**, utwórz.
3. Na stronie repozytorium kliknij **uploading an existing file** i przeciągnij **całą zawartość** tego folderu (`index.html`, `app.js`, `plans.js`, `blocks.js`, `gear.js`, `coach.js`, `runs.js`, `bodymap.js`, `app.css`, `sw.js`, `manifest.webmanifest`, foldery `data` i `icons`). Zatwierdź **Commit changes**.
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

Ograniczenia iOS: brak wibracji na koniec przerwy, brak dźwięku przy zablokowanym ekranie i po zminimalizowaniu appki. Od v0.10.2 sygnał przerwy domyślnie nakłada się na muzykę z innych aplikacji (Spotify itp.) i jej nie zatrzymuje, ale przełącznik trybu cichego go wycisza. W Ustawieniach → Dźwięk możesz wybrać "Mimo trybu cichego": sygnał słychać zawsze, ale iPhone może zatrzymać muzykę na czas przerwy. Sprawdź przyciskiem **Test dźwięku**.

## Aktualizacja

Podmień zmienione pliki w repozytorium. Przy kolejnym otwarciu z internetem aplikacja pobierze nową wersję. Po każdej zmianie podbij `CACHE` w `sw.js` (np. `repsmith-v0.10.3`).

## Sprawdzenie wersji

Ustawienia → na dole numer wersji. Jeśli po aktualizacji widać starą: zamknij aplikację całkowicie (z listy ostatnich aplikacji) i otwórz ponownie z internetem.

## Aplikacja na Androida (APK), od v0.11.0

Ten sam kod jest też zwykłą aplikacją na Androida (Capacitor 8), identyfikator `dev.kachaj96.repsmith`. APK buduje CI (GitHub Actions) przy każdym pushu.

- **Dane nie przechodzą same z wersji w przeglądarce do APK** (to dwa osobne magazyny na telefonie). Przed przesiadką: w PWA Ustawienia → **Pobierz kopię (JSON)**, potem w APK Ustawienia → **Wczytaj kopię z pliku**.
- W APK kopia i obraz karty treningu zapisują się przez systemowe **Udostępnij** (Dysk, Pliki, mail). Service worker działa tylko w PWA.
- Podpis: klucz `repsmith-release.jks` (alias `repsmith`) trzymasz w menedżerze haseł. W repo są tylko sekrety Actions: `REPSMITH_KEYSTORE_BASE64`, `REPSMITH_KEYSTORE_PASSWORD`, `REPSMITH_KEY_ALIAS`, `REPSMITH_KEY_PASSWORD`. Bez nich CI buduje niepodpisany APK release. Zgubienie klucza oznacza, że kolejnej wersji nie da się zainstalować jako aktualizacji.
- Ikony: `NODE_PATH=<node_modules z playwright> node scripts/gen-icons.mjs` (PWA i Android, ta sama konstrukcja co Runsmith).
- Budowa lokalna: `npm ci && npm run cap:sync`, potem `android/gradlew assembleRelease` (wymaga Android SDK).

## Wygląd

Od v0.11.1 obie aplikacje wdrażają Smith Design System v1 (`smith-design-system-v1/`, ten sam katalog w repo Runsmith): wspólne tokeny z aliasami `--smith-*`, ta sama nawigacja z pigułką aktywnej zakładki, promienie, przyciski i ruch. Test `tests/unit/smith_test.js` pilnuje zgodności wartości, `tests/visual/shots.mjs` robi zrzuty ekranów przy 320-768 px.


Od v0.11.0 Repsmith jest w jednej rodzinie z Runsmith: ten sam kafel ikony i grubość linii, Manrope i Inter (pliki w `fonts/`, bez sieci), karty, sprężyste animacje i jasny lub ciemny motyw zgodnie z telefonem. Akcent: miedź w jasnym, morelowy w ciemnym.

## Zmiany w v0.13.2

- Karta do udostępnienia (Shareable card) w Smith Design System v1: nowe logo (miedziany kafel z kreskami, ta sama geometria co ikona), Manrope w tytułach i liczbach, miękkie kafle 22 px, etykiety bez wersalików, znacznik PR jako pigułka, lista ćwiczeń na jednej karcie z liniami podziału, kolory aktualnego motywu (jasny lub ciemny). Poprzednia wersja miała stare logo (cztery kreski z ukośną linią) i wersaliki.

## Zmiany w v0.13.1

- Wiersz serii: poprzednia seria jest pokazana w całości (ciężar×powtórzenia i RPE, bez ucinania do „97.5...”), a znacznik PR jest w osobnej linii pod nazwą serii i nie nakrywa kolumny „Previous”.

## Zmiany w v0.13.0

- Nowe logo z projektu graficznego: miedziany kafel, trzy pochylone kreski przecięte ukośną linią. Jedna geometria (`scripts/brand.mjs`) daje wszystkie pliki: `design/` (logo, monochromatyczne, sam znak, warstwy adaptacyjne), `icons/` (PWA, maskable, monochrome), ikony launchera Androida i znak w nagłówku aplikacji. `node scripts/gen-icons.mjs` odtwarza je wszystkie.
- Nowa animacja startu (`splash.js`, szczegóły w `docs/MOTION.md`): kafel, kreski pojawiające się po kolei, ukośna linia na końcu, nazwa, krótkie przytrzymanie logo i wygaszenie. Całość trwa ok. 1,9 s i **zawsze gra do końca** przed pokazaniem ekranu głównego, także gdy aplikacja wczyta się szybciej. Wolny start nie restartuje animacji (po 5 s pojawia się komunikat, po 12 s przycisk ponowienia), błąd startu nie zawiesza ekranu. Bez animacji przy `prefers-reduced-motion`. Gra tylko przy prawdziwym uruchomieniu, nie przy zmianie zakładki ani powrocie z tła.
- Android 12+: systemowy ekran startowy to tylko kolor tła (bez ikony), więc logo jest rysowane raz, bez błysku między systemowym a własnym ekranem.

## Zmiany w v0.12.0

- Biegi przeniesione do Runsmith: zniknęły z Historii, Postępu i ekranu Dziś. Zapisane wcześniej biegi zostają w danych i w kopii JSON (nic nie jest kasowane), tylko nie są pokazywane.
- Plan: **Pomiń trening** (plan przechodzi do następnego dnia, pominięcie liczy się do tygodnia bloku, nie trafia do historii, można je cofnąć) i **Podgląd planu** (wszystkie dni z ćwiczeniami na bieżący tydzień, następny dzień zaznaczony).
- Kalendarz w Historii zawsze dostępny (ikona w nagłówku), wygląd jak w Runsmith.
- Rodzina z Runsmith: wspólny zestaw ikon (`smith-design-system-v1/smith-icons.json`), nagłówek podekranu „wstecz + tytuł”, data pod tytułem, pola formularzy, przełączniki segmentowe w ustawieniach, wybór motywu (systemowy, jasny, ciemny), dialog potwierdzenia bez X z czerwoną akcją usuwania.

## Dane

- Wszystko zapisuje się na telefonie. Odinstalowanie aplikacji albo wyczyszczenie danych Chrome kasuje historię.
- Ustawienia → **Pobierz kopię (JSON)** zapisuje pełną kopię. **Wczytaj kopię z pliku** przywraca ją, także na innym telefonie.

## Struktura

- `data/exercises.json` – baza 159 ćwiczeń (nazwy PL/EN, wzorzec ruchu, mięśnie główne i pomocnicze, sprzęt, typ, jednostronne, sposób rejestracji).
- `app.js` – interfejs i logika dziennika, bez frameworków i bez kroku budowania.
- `plans.js` – biblioteka 25 planów, pytania kreatora, pakiety dodatkowe i zamiany (generowane z blueprintu planów).
- `blocks.js` – cztery bloki siłowe o stałej długości (4, 8 i 12 tygodni oraz "Bench + góra, 12 tyg.") z tabelami tygodniowymi.
- `coach.js` – selektor planu, budowanie planu, silnik progresji, objętość, sygnały, bloki i deload.
- `runs.js` – dziennik biegów: walidacja dystansu, tempa, czasu i tętna, statystyki tygodniowe i rekordy.
- `bodymap.js` – sylwetka mięśni z [react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter), licencja MIT, © 2022 ELABBASSI Hicham (pełna treść w `LICENSES.md`).
- Format kopii: `{ app: "repsmith", schema: 1, settings, templates, sessions, notes, customExercises, active, measurements, flags, calib, maxes, runs }`.
