# Repsmith – plan rozwoju

Autor: Adrian Drożdżyński

## v0.6.0 – zrobione
Na podstawie blueprintów Adriana: progresja, objętość, plany z kreatorem.

- **Kreator doboru planu**: 12 pytań, selektor zgodny z regułami blueprintu (zweryfikowany na 240 kombinacjach testowych i 8 przykładach). Wynik: plan główny, 2 warianty, przycinanie do czasu, blok dodatkowy 15/30 min, tryb oceny wysiłku, zamiany pod sprzęt i ograniczenia (plecy, bark, kolano, inne).
- **Biblioteka 25 planów**: Siła, Masa, Siła + masa, Start, Utrzymanie (2-5 dni, różne długości treningu).
- **Silnik progresji**: top set + backoff, liniowa, serie na RPE, minimalna dawka, podwójna progresja, serie na RIR. Podpowiedź ciężaru i powtórzeń na każdy trening z uzasadnieniem. e1RM z tabeli Tuchscherera.
- **Tryby wysiłku**: RIR/RPE, RPE max 8 (z sygnałem prędkości sztangi), ciężar z aplikacji (łatwo / zgodnie z planem / ciężko).
- **Seria kalibracyjna RPE** na bojach głównych, co najmniej raz na 6 tygodni.
- **Bloki i deload**: siła co 5. tydzień (ustawiane), blok masy 5 tygodni z narastaniem serii dla 2 partii, utrzymanie z przeglądem po 6 tygodniach.
- **Sygnały**: stagnacja, regres, zmęczenie, słabe samopoczucie, podejrzany rekord, puste serie. Dwa w tygodniu → propozycja deloadu (dla XL zejście planu niżej).
- **Objętość**: ciężkie serie z ostatnich 7 dni, strefy 4 / 10 / 20, ostrzeżenia o za dużej liczbie serii na jednym treningu, licznik serii w edytorze planu.

## v0.6.1 – zrobione
- Serie łączone (pary, trisety, giant sety): w planie i w trakcie treningu. Menu "Seria łączona…" albo przytrzymanie ćwiczenia, potem dotknięcie kolejnych. Przerwa dopiero po rundzie, czas treningu liczony bez przerw w środku.
- Poprawki układu: biblioteka planów (zawijanie tekstu), formularz serii kalibracyjnej.

## v0.6.2 – zrobione
- Edytor ćwiczenia w planie: powtórzenia jako Stałe / Zakres / AMRAP (dla ćwiczeń na czas i dystans: wartość albo zakres). Pola przyjmują tylko cyfry, z limitami; złe wartości blokują zapis z komunikatem.
- Intensywność: RPE, zakres RPE, % 1RM. 1RM wpisane ręcznie ma pierwszeństwo, inaczej najlepszy e1RM z 6 tygodni.
- Metoda progresji pilnuje zgodności: podwójna progresja wymaga zakresu, AMRAP i % 1RM przełączają na liniową.
- Silnik: zakres RPE liczony jako cel (nad górną granicą = za ciężko), w trybie "ciężar z aplikacji" dolny koniec zakresu. AMRAP: ciężar zostaje, zmieniasz go sam.
- Stare wpisy w planach naprawiane przy starcie aplikacji.

## v0.6.3 – zrobione
- Backoff: powtórzenia jako Jak top set / Stałe / Zakres.

## v0.6.4 – zrobione
- Nowy plan: najpierw wybór trybu. Prosty (serie, powtórzenia stałe lub zakres, przerwa, automatyczne podpowiedzi) albo zaawansowany (wszystko). Tryb zmienisz w menu planu, ustawienia zaawansowane zostają.

## v0.7.0 – zrobione
- Ekran Dziś bez planu: główny przycisk "Zacznij trening", ostatni trening z powtórzeniem, jedna karta o planach. Kreator i biblioteka żyją w Planach.
- Blokada wygaszania ekranu w trakcie treningu (Ustawienia: włącz/wyłącz).
- Przypomnienie o kopii zapasowej, trwały zapis danych w przeglądarce, data ostatniej kopii.
- Edycja, usuwanie i dodawanie serii w starych treningach.
- Kalkulator talerzy (kg i lb), ustawienia talerzy, gryfów i dostępnych ciężarów (hantle, kettle, maszyny, wyciągi). Sugestie ciężaru trafiają w to, co faktycznie masz.
- Kalendarz w Historii (miesiąc, statystyki, tygodnie z rzędu) i karta podsumowania do udostępnienia jako obraz.
- Wstęp przy pierwszym uruchomieniu, przycisk uwag (wymaga ustawienia FEEDBACK_EMAIL w app.js), testy w repozytorium (`tests/`, `sh tests/run.sh`).

## v0.8.0 – zrobione
- Cykl planu: powtarzany tydzień albo stała długość (2-24 tygodni). W stałej długości tydzień zalicza się po zrobieniu tylu treningów, ile dni ma plan; ręczne przesunięcie tygodnia.
- Deload per plan: brak, co N tygodni albo wybrane tygodnie; domyślnie serie -40%, ciężar -10%. Plany z kreatora zachowują swój deload (serie, bez cięcia ciężaru). Progresja po deloadzie liczy się od zwykłych tygodni.
- Edytor tygodni przy ćwiczeniu: serie, powtórzenia, %1RM albo RPE, backoff; generator fali; 0 serii = ćwiczenie pominięte w tygodniu. Podgląd tygodnia w planie.
- Trzy bloki siłowe w bibliotece (4, 8 i 12 tygodni, procenty 1RM), 12-tygodniowy kończy się testem 1RM i zapisem nowych maksów.
- "Skąd te liczby": objaśnienie liczenia serii, stref objętości i deloadu ze źródłami.

## Teraz: v0.8 – feedback od znajomych
Wysłać aplikację znajomym z siłowni, zebrać uwagi. Feedback może zmienić priorytety.

Do sprawdzenia w praktyce:
- czy progi sygnałów (5% regresu, 30% cięcia przy zmęczeniu) nie są za czułe,
- czy model czasu treningu (4,5 / 3,5 / 2,5 min na serię) zgadza się z realnymi treningami; docelowo zastąpić go zapisanymi czasami,
- czy podpowiedzi ciężaru dla hantli i maszyn pasują do realnych skoków ciężaru.

## v0.8.1 – zrobione
- iPhone: odstęp od notcha/wyspy i paska home (safe-area) na ekranach, w arkuszach i przy timerze przerwy.
- Dźwięk: odblokowanie audio przy pierwszym dotknięciu, tryb mediów na czas przerwy, głośniejsze odliczanie 3-2-1 i trzy tony na koniec, wybór głośności, przycisk Test dźwięku.

## v0.8.2 – zrobione
Poprawki po przeglądzie kodu.
- Zamiana ćwiczenia w trakcie treningu: zapisane serie zostają przy starym ćwiczeniu, reszta idzie do nowego, bez starej podpowiedzi ciężaru.
- Zakończenie lub odrzucenie treningu zatrzymuje timer i cichą pętlę audio. Timer przerwy dzwoni też poza ekranem treningu.
- Blok dodatkowy nie dubluje już ćwiczeń po zamianach.
- Service worker zapisuje tylko poprawne odpowiedzi i po 4 s bez sieci bierze kopię z pamięci.
- "Powtórz trening" zachowuje %1RM, serie łączone i tryb oceny wysiłku.
- Rekordy (PR) w późniejszych treningach przeliczają się po edycji lub usunięciu starego treningu.
- Import kopii sprawdza strukturę danych i schemat. Błąd zapisu w IndexedDB pokazuje ostrzeżenie.
- Mniejsze: dodanie serii po kalibracji, nazwa nowego dnia w planie.

## v0.9.0 – zrobione
- Dziennik biegów: przycisk "Zapisz bieg" na ekranie Dziś. Biegi są osobno od ćwiczeń, nie trafiają do biblioteki.
- Pola: nazwa, rodzaj (spokojny, długi), data (także wsteczna), dystans (km lub m, wynik zawsze w km z 2 miejscami), tempo, czas, tętno, ocena 1-10. Pola przyjmują tylko cyfry.
- Sprawdzanie zgodności: czas wpisany ręcznie musi pasować do dystansu i tempa, w przeciwnym razie błąd z dwoma szybkimi poprawkami (przelicz czas albo tempo).
- Historia: przełącznik Treningi | Biegi. Postęp: zakładka Biegi z dystansem tygodniowo, wykresami tempa i tętna, rekordami.
- Wcześniejsze treningi: data i czas trwania przy zakończeniu i edycji treningu, przycisk "Zapisz wcześniejszy trening" w Historii.
- Kopia zapasowa obejmuje biegi.
- Dalej: interwały i inne rodzaje biegów (model danych ma już pole rodzaju).

## v0.9.1 – zrobione
- Notatka do biegu (do 500 znaków), widoczna w historii biegów.

## v0.10.0 – zrobione
Spokojniejszy wygląd i momenty nagrody.
- Jeden akcent: pomarańcz tylko dla głównego przycisku, zaznaczenia nawigacji, wykonanej serii, rekordów i wykresów. Aktywne chipy i przełączniki są jasną powierzchnią, ocena treningu jest szara.
- Skala czcionek: 11 / 14 / 17 / 22 / 28 / 40 / 56 px. Duże litery tylko w nagłówkach i głównym przycisku.
- Dziś: nazwa dnia, tydzień jako kropki, lista ćwiczeń, jeden duży przycisk. "Pusty trening" i "Zapisz bieg" jako cichy rząd. Przypomnienie o kopii to wąska linia na dole.
- Trening: pusta notatka znika, dodatkowe akcje (metoda, kalibracja, talerze, zamiana, notatka) w menu "...". Karta rekordu (PR) pod nazwą ćwiczenia, różnica ciężaru względem ostatniego razu w podpowiedzi.
- Tryb skupienia (Ustawienia, domyślnie wyłączony): otwarte tylko bieżące ćwiczenie, po skończeniu przechodzi do następnego.
- Tryb spokojny (Ustawienia, domyślnie wyłączony): bez wibracji, animacji nagród i ekranu podsumowania.
- Po treningu ekran podsumowania: rekordy albo objętość z porównaniem do ostatniego razu, kreski tygodnia jak w logo, seria tygodni. Po biegu krótkie podsumowanie z tempem na tle średniej z 30 dni.
- Historia: jeden przełącznik (Treningi | Biegi), kalendarz i dodawanie jako ikony. Postęp: jeden duży wynik na ćwiczenie, rekordy, objętość i ostatnie rekordy zwinięte.
- Plan: akcje wiersza w menu "...", ustawienia planu i objętość zwinięte. Ustawienia w sekcjach.

## Później
- Szacowanie MEV/MRV z danych użytkownika (blueprint objętości, sekcja 6).
- Kalibracja jako korekta podpowiedzi RPE ("zwykle kończysz 1,5 powt. dalej").
- v0.7: runda feedbacku.
- Decyzja: Google Play (opakowanie PWA), konta, synchronizacja, płatne funkcje.
