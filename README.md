
[PL](/readme.md) / [EN](Docs/readmeEN.md)

# UZPlan

UZPlan jest wtyczką, która w znacznym stopniu ułatwia odczytywanie planu zajęć który udostępniany jest dla studentów wszystkich kierunków pod linkiem plan.uz.zgora.pl. Domyślny sposób przedstawienia planu w formie listy, uznałem za niezbyt czytelny, więc postanowiłem zrobić własną implementację bazującą na danych wyświetlanych użytkownikowi.

Wtyczka jest w trakcie rozwoju - ergo jako twórca nie biorę odpowiedzialności za ewentualną możliwość błędnego wyświetlania się zajęć.

Jeżeli znalazłeś błąd - skontaktuj się ze mną!
e-mail : patryko344@o2.pl

# Spis treści
- [UZPlan](#uzplan)
- [Spis treści](#spis-treści)
- [Użytkowanie](#użytkowanie)
- [Jak zainstalować](#jak-zainstalować)
- [Opis działania](#opis-działania)
- [Lista funkcji](#lista-funkcji)


# Użytkowanie
Wtyczka po instalacji jest gotowa do działania. Nie wymaga żadnej dodatkowej konfiguracji. Przy pierwszym uruchomieniu należy wejść na stronę z planem konkretnej grupy, a następnie należy otworzyć okienko wtyczki. Użytkownik powinien teraz wybrać grupy do których został przydzielony, używając checkboxów. Informacje o zajęciach, i o wybranych grupach są aktualizowane przy każdorazowym wejściu na stronę planu zajęć. W przypadku uruchomienia wtyczki bez internetu, bądź będąc na innej stronie, wyświetlony zostanie plan bazujący na ostatnim odwiedzonym planie zajęć. 

Konstrukcja okienka rozszerzenia składa się z trzech warstw, od góry : 
- Zestaw przycisków do obsługi wtyczki, które odpowiadają za zmianę wyświetlanego tygodnia, oraz powrót do aktualnego.
- Zestaw checkboxów do ustawienia grup studenta.
- Wygenerowana tabela z zajęciami.


# Jak zainstalować
Domyślnym sposobem instalacji jest pobranie wtyczki przy pomocy stron takich jak :
- Chrome web store
- Opera addons
- Microsoft Edge addons

Jednakże, wtyczka może zostać zainstalowana z pominięciem oficjalnych sklepów. Przykładowo dla przeglądarki Opera :
1. W menu rozszerzeń, zaznacz Tryb programisty w prawym górnym rogu
2. Pobierz wtyczkę, wypakuj zawartość archiwum zip do folderu
3. Wciśnij przycisk "Załaduj rozpakowane"
4. Wybierz folder z rozpakowaną zawartością, i potwierdź.



# Opis działania

Wtyczka używa mechanizmu Content Script, aby pobrać zawartość tabeli ze strony uczelni. Przy pomocy standardowych funkcji wykonywanych na drzewie DOM, zawartość tabeli przekształcana jest z formy elementów HTML-a do tablicy tablic. Pojedynczy wpis w takiej tablicy zawiera wszystkie wyświetlane użytkownikowi dane, w kolejności : 
```
["data","dzienTygodnia","grupa","godzinaRozpoczęcia","godzinaZakonczenia","rodzajZajęć","prowadzący","sala"]
```
Tak zagregowane dane, wysyłane są przy użyciu chrome.runtime API do javascriptu okna wtyczki, które przy każdym otworzeniu okienka wysyła prośbę o otrzymanie w/w danych. 

W momencie gdy wtyczka otrzyma zestaw, przystępuje do aktualizacji zawartości Local Storage o nową wersję zestawu, a następnie wykonywane są wszystkie funkcje mające na celu wyświetlenie zawartości planu.

W przypadku gdy wtyczka nie uzyska zestawu, odwołuje się do ostatniej zapisanej kopii w Local Storage i to na niej bazuje wyświetlanie planu.

# Lista funkcji

Lista funkcji dostępna jest pod tym [linkiem](Docs/documentation.md)

