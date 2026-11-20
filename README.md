# Repsmith v0.18.1

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

## Zmiany w v0.18.1

- Serie mają tylko numery (1, 2, 3…, przy ćwiczeniach jednostronnych 1L/1P). Bez nazw typu top set, back-off czy rozgrzewka: co robisz w danej serii, wynika z celu w wierszu (powtórzenia, RPE) i z linii celu na kaflu, np. „Cel 1×1 @7 · 2×5 @7”. Rozgrzewki są wyszarzone.
- Konsola serii ma trzy zakładki: kg, powtórzenia i RPE. Dotknięcie RPE otwiera tę samą konsolę na zakładce RPE (siatka 6–10 z opisem, ile powtórzeń w zapasie), dotknięcie kg albo powtórzeń wraca do klawiatury. Wcześniej z klawiatury nie dało się przejść na RPE, a RPE otwierało inny widok.

## Zmiany w v0.18.0

Nowy ekran treningu (kierunek A z konsolą serii z kierunku C, prototyp w `design/redesign-2026/`).
- Stały pasek u góry: przerwa (start ręczny albo odliczanie, gdy trwa), kalkulator talerzy dla ćwiczeń ze sztangą, czas treningu, Zakończ. Pod nim nazwa treningu, liczba zapisanych serii i pasek postępu.
- Kafel ćwiczenia: nazwa, partia i sprzęt, cel (np. 6–8 powt. · RPE 9–10) raz na kafel. Ukończone ćwiczenie zwija się do jednej linii (liczba serii i najlepsza seria), strzałką rozwijasz je z powrotem. Historia, notatka, przerwa, zamiana, widok treningu i usuwanie ostatniej serii są w menu ⋯.
- Tabela serii: numer serii (R1 rozgrzewka, Top, B1 back-off, 1L/1P przy ćwiczeniach jednostronnych), poprzedni wynik, kg, powtórzenia, RPE i ✓. Bez systemowej klawiatury: ✓ zapisuje to, co widać w wierszu.
- Konsola serii na dole ekranu po dotknięciu wiersza: kg i powtórzenia z −/+ (krok z ustawień, 1 powt.), dotknięcie liczby otwiera klawiaturę numeryczną, RPE jednym dotknięciem, „Jak ostatnio”, „Zapisz serię”. Po zapisie konsola przechodzi do następnej serii (w superserii do partnera z tej samej rundy). Działa też dla ćwiczeń na czas, z dystansem, z masą ciała (także z odciążeniem) i z oceną Łatwo/Zgodnie z planem/Ciężko.

## Zmiany w v0.17.0

- Widok treningu: tryb Prosty albo Zaawansowany i cztery przełączniki: przerwa startuje sama, podpowiedzi ciężaru, wskazówki i opisy, zdjęcia i wideo w treningu. Tryb to gotowy zestaw przełączników, każdy można potem zmienić osobno (wtedy widać „Własne ustawienia”). Ustawienie jest w Ustawieniach (Widok treningu) i pod ikoną suwaków w nagłówku treningu. Dotychczasowi użytkownicy zostają w trybie Zaawansowanym, czyli bez zmian.
- Wyłączona automatyczna przerwa: pod seriami jest przycisk z czasem przerwy, który ją uruchamia. Czas przerwy zmienisz w menu ćwiczenia.
- Wyłączone podpowiedzi: w polach jest poprzedni wynik, bez wyliczonego ciężaru.
- Kafel ćwiczenia: jedna linia nagłówka (numer, partia, sprzęt, metoda), nazwa bez łamania słów, wskazówki i notatka zwinięte do jednej linii.
- Wiersz serii: poprzedni wynik pod nazwą serii (np. 92,5×5 @8, bez RPE: @–), szersze pola kg, powtórzeń i RPE, aktualna seria wyróżniona ramką. Poprzedni wynik bierze tylko zatwierdzone serie.
- Przy otwartej klawiaturze edytowana seria przesuwa się na środek widocznego ekranu.
- Lista planów pokazuje treningi w tygodniu i długość cyklu. Sylwetka w bibliotece ćwiczeń jest mniejsza, lista zaczyna się wyżej.

## Zmiany w v0.16.0

- Biblioteka ćwiczeń: zdjęcia, notatka i linki widać w karcie ćwiczenia, tam też je dodajesz i edytujesz. Ćwiczenia z mediami mają ikonkę na liście.
- Udostępnianie planu: menu planu, Udostępnij plan. Powstaje plik JSON z dniami, ćwiczeniami, seriami i ustawieniami cyklu, opcjonalnie ze zdjęciami ćwiczeń. Bez treningów, wyników, maksów i notatek. Druga osoba wczytuje go przez Wczytaj kopię z pliku: plan dochodzi jako nowy i aktywny, jej dane zostają. Własne ćwiczenia z planu przechodzą razem z nim. W planie fali baza (WB) nie jest przekazywana, druga osoba podaje swoje 1RM albo e1RM.

## Zmiany w v0.15.0

- Bardziej kompaktowy tekst: tytuł dnia 28 px, nazwy ćwiczeń 15 px, opisy 13 px, niższe wiersze. Na ekranie Dziś opis serii jest pod nazwą, więc długi opis (np. w planie fali) nie łamie już nazwy ćwiczenia w środku słowa.
- Zdjęcia i wideo przy ćwiczeniu: w treningu miniatura i nazwa ćwiczenia otwierają podgląd (zdjęcia do powiększenia, notatka, linki do wideo). Do 4 zdjęć z galerii albo aparatu i do 4 linków (YouTube z czasem startu albo inny adres https) na ćwiczenie. Media są przypięte do ćwiczenia, widać je w każdym planie.
- Zdjęcia zapisują się w telefonie i w kopii zapasowej JSON. Wideo otwiera się poza aplikacją i wymaga internetu.
- Import paczki zdjęć (plik JSON z `"kind": "media-pack"`) przez zwykły przycisk importu kopii. Dodaje zdjęcia, nic nie kasuje.
- Nowe ćwiczenie: ściąganie z góry na maszynie (Machine Lat Pulldown).

## Zmiany w v0.14.0

- Nowy plan w bibliotece: **Bench Priority (HARDSET), fala 4 tyg.** (Pn, Śr, Pt, cykl stałej długości powtarzany bez końca). Oparty na metodzie HARDSET, program specjalistyczny dla osoby z priorytetem wyciskania leżąc. Wyciskanie ma układ fali (singiel i back-offy w poniedziałek, wyciskanie z pauzą w środę, objętość i seria kontrolna AMRAP w piątek tygodnia 3), reszta to zwykłe akcesoria Repsmith (35 serii).
- Przy starcie planu podajesz zaliczone 1RM albo e1RM. Z tego powstaje baza fali (WB), nie rekord życiowy. Kilogramy w sesji to zakresy z bazy, w polu wpisujesz od dolnej wartości, a RPE wygrywa z procentem. Baza trzymana jest w planie, nie w maksach.
- Po tygodniu 4 aplikacja pyta, czy zaczynasz kolejny cykl z nową bazą, i proponuje ją według reguł 1-6 (baza nigdy sama nie spada). Możesz wpisać własną bazę, krok bazy (domyślnie 2,5 kg) i procent serii kontrolnej.
- Nowe ćwiczenie: wiosłowanie z podparciem klatki na maszynie.
- Parametry fali, serii kontrolnej i kroku bazy to hipotezy programu do sprawdzenia w praktyce. Etap 1 nie ma jeszcze korekt w trakcie cyklu, arkusza porównywalności serii kontrolnej ani modułu zawodów i testu 1RM.

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
