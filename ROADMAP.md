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

## Teraz: v0.6.x – feedback od znajomych
Wysłać aplikację znajomym z siłowni, zebrać uwagi. Feedback może zmienić priorytety.

Do sprawdzenia w praktyce:
- czy progi sygnałów (5% regresu, 30% cięcia przy zmęczeniu) nie są za czułe,
- czy model czasu treningu (4,5 / 3,5 / 2,5 min na serię) zgadza się z realnymi treningami; docelowo zastąpić go zapisanymi czasami,
- czy podpowiedzi ciężaru dla hantli i maszyn pasują do realnych skoków ciężaru.

## Później
- Szacowanie MEV/MRV z danych użytkownika (blueprint objętości, sekcja 6).
- Kalibracja jako korekta podpowiedzi RPE ("zwykle kończysz 1,5 powt. dalej").
- v0.7: runda feedbacku.
- Decyzja: Google Play (opakowanie PWA), konta, synchronizacja, płatne funkcje.
