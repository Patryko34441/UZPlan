[PL](../documentation.md) / [EN](Docs/documentationEN.md)

## runExtension()

Wrapper dla całej logiki wtyczki. Zawiera w sobie deklaracje podstawowych zmiennych przekazywanych między pozostałymi funkcjami, pobranie odopowiednich elementów drzewa DOM, eventListenery, oraz wywołanie podstawowych funkcji tak, aby po otworzeniu okna, bazowo pokazywał się plan zajęć na aktualny tydzień. 

Zawartość tej funkcji można opisać pokolei jako :

- Przypisanie wszystkich zmiennych, pobranie checkboxów z localstorage przy użyciu [getCheckboxesFromLocalStorage](#getcheckboxesfromlocalstorage), pobranie tablicy zajęć z localstorage.
- Odfiltrowanie tablicy zajęć, do tych które są w aktualnym tygodniu, używając [makeListOfWeek](#makelistofweekoffset-array)
- Wyrenderowanie możliwych do zaznaczenia checkboxów przy użyciu [groupCheckboxes](#groupcheckboxesarray)
- Wyrenderowanie tablicy z aktualnym tygodniem używając [basicWeek](#basicweekarray)
- Dodanie eventListenera na przycisk odpowiedzialny za cofanie tygodnia. W jego obrębie odbywa się edycja wyświetlanego tygodnia, filtrowanie zajęć pod kątem zaznaczonych checkboxów używając [filterByCheckboxes](#filterbycheckboxesarray-checkboxesarray), następnie odbywa się sortowanie po czasie dzięki [sortByTime](#sortbytimearray), i na końcu render planu zajęć - [renderTimetable](#rendertimetablearray); 
- Dodanie eventListenera na przycisk odpowiedzialny za przejście do następnego tygodnia. Odbywa się analogicznie do wyżej wymienionego.
- Dodanie eventListenera na wszystkie checkboxy. W jego obrębie wywołane jest przypisanie zwrotki funkcji [getCheckedCheckboxes](#getcheckedcheckboxes) do zmiennej, a następnie aktualizowany jest local storage o nową wartość tej zmiennej. Kolejno wywoływane są funkcje odpowiedzialne za "obrobienie" danych i ich wyświetlenie, analogicznie do poprzednich eventlistenerów.
- Dodanie eventListenera na przycisk resetu tygodnia. Wywołuje funkcje analogiczne do przycisków poprzedniego, następnego tygodnia, z taką różnicą że wyświetla aktualny tydzień.

## renderTimetable(array)

Funkcja przyjmuje odpowiednio obrobioną tablicę, zawierającą tablice zajęć. Zawiera w sobie pobranie tablicy do której będą wpisywane zajęcia, oraz zmapowanie odpowiednich wartości tekstowych dni tygodnia ,na cyfry w celu późniejszego porównania. Kolejno, wywołuje ona funkcję [cleanTimetable](#cleantimetable), po czym rozpoczyna proces w którym pobierane są wartości godziny rozpoczęcia zajęć, i zakończenia ich, do osobnych tablic. Dodatkowym krokiem w tym procesie jest przeprowadzenie walidacji czy długość jednej tablicy jest równa drugiej, tak aby uniknąć problemów z wyświetlaniem. Finalnym elementem są zagnieżdżone pętle for, w których zewnętrzna iteruje po godzinach rozpoczęcia zajęć, a wewnętrzna po kolejnych dniach w tygodniu. W kolumnie o indeksie zero przypisywane są godziny trwania zajęć, a następnie dla pozostałych kolumn, sprawdzany jest warunek czy dzień oraz godzina się zgadzają. Jeżeli tak - generowany jest div, zawierający wszystkie informacje o danej lekcji, jeżeli nie, komórka tabeli pozostaje pusta.

## cleanTimetable()

Funkcja pobiera aktualnie wyświetlany plan zajęć, a następnie kasuje jego rzędy, oprócz rzędu o indeksie 0 zawierającego nazwy dni tygodni.


## returnDatesInWeek(offset*)

Funkcja odpowiada za zwrócenie listy dni które znajdują się w aktualnym tygodniu. Tydzień który  jest za zwracany można zmienić podając w wywołaniu opcjonalną wartość offset. Domyślnie inicjalizowana jest ona jako 0. Podanie wartości na minusie spowoduje zwrócenie dat wcześniejszych niż aktualny tydzień, zaś wartości dodatnie daty późniejsze niż aktualny tydzień.



## makeListOfWeek(offset*, array)

Funkcja zwraca zajęcia które odbywają się w określonym przez offset tygodniu. Domyślnie zwraca zajęcia odbywające się w aktualnym tygodniu.
Wywołuje [returnDatesInWeek](#returndatesinweekoffset) z podanym offsetem, po czym przy pomocy [isInDate](#isindatedatefromto) uzupełnia tablicę tylko tymi wynikami które przeszły weryfikację.


## isInDate(date,from,to)

Funkcja sprawdza czy podana data (date) znajduje się między dwoma pozostałymi (from, to).

## getCheckedCheckboxes()

Funkcja ta odpowiada za pobranie informacji o zaznaczonych checkboxach w obrębie wtyczki. Zwraca tablicę, która ma wypisane nazwy zaznaczonych checkboxów.

## filterByCheckboxes(array, checkboxesArray)

Funkcja ta filtruje tablicę zajęć, przez pryzmat wybranych przez użytkownika grup. CheckboxesArray jest tablicą otrzymaną w wyniku działania funkcji [getCheckedCheckboxes](#getcheckedcheckboxes)

## getCheckboxesFromLocalStorage()

Funkcja ta pobiera zaznaczone checkboxy z Local Storage. W wypadku braku odpowiedniego obiektu, zwraca pustą tablicę. 

## tickCheckboxesFromLocalStorage()

Funkcja ta pobiera checkboxy z Local Storage, a następnie nadaje odpowiadającym im elementom HTML status checked = true.

## groupCheckboxes(array)

Funkcja ta wyciąga informację o możliwych do wybrania grupach z przekazanej tablicy zajęć. Ponadto, tworzy odpowiednie elementy HTML oraz wstawia je w okno wtyczki.

Jedynym wyjątkiem, są zajęcia które są przeznaczone dla Całej grupy tj. wykłady, których oznaczenie w pobranej tablicy zajęć istnieje jako ' ' - biały znak. W takim przypadku ich wartość zamieniana jest na 'Cała grupa' co ma znaczenie przy korzystaniu z innych funkcji dotyczących checkboxów.

## sortByTime(array)

Funkcja która sortuje tablicę po kolumnie "godzinaRozpoczecia". Pomocniczo wywołuje funkcję [convertToMinutes](#converttominutestime) Zwraca posortowaną tablicę.

## convertToMinutes(time)

Funkcja ta konwertuje czas z danej typu string w formacie "hh:mm" do formatu int. Ułatwia to operację porównywania czasu wykorzystywaną przy [sortByTime](#sortbytimearray). Pobiera wartość zmiennej time, następnie dokonuje podziału na dwie części - godzin, i minut. Następnie mnoży ilość godzin razy 60, i dodaje część minutową, przy tym rzutując obydwie wartości na typ Int. Przykładowo dla wywołania time = "01:21", zwracana jest liczba 81.

## basicWeek(array)

Funkcja ta odpowiada za wyświetlenie aktualnego tygodnia odrazu po otworzeniu okna wtyczki. Wywołuje pokolei :
- [tickCheckboxesFromLocalStorage](#tickcheckboxesfromlocalstorage)
- [cleanTimeTable](#cleantimetable)
- [filterByCheckboxes](#filterbycheckboxesarray-checkboxesarray) z użyciem podanej tablicy - array, oraz wywołania [getCheckboxesFromLocalStorage](#getcheckboxesfromlocalstorage). Zwrotka z tej funkcji następnie nadpisuje array.
- [sortByTime](#sortbytimearray)
- [renderTimetable](#rendertimetablearray)
- używając querySelectora ustawia odpowiednią wartość w divie z datą.
