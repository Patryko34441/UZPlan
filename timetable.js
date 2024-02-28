
//przekazanie DOM-a z strony do popupu
var receviedContent = []
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'sendArrayToPopup') {
        receviedContent = request.data;

        // Tutaj możesz wykorzystać odebrane tablicę
      // console.log('Odebrano tablicę z content scripta:', content);
       localStorage.setItem("timetable", JSON.stringify(receviedContent));
    }
});



document.addEventListener("DOMContentLoaded", function() {

    const receviedContent = JSON.parse(localStorage.getItem("timetable"));
    var zajecia = makeListOfWeek(weekOffset,receviedContent)
    basicWeek();
    groupCheckboxes(receviedContent);
    var checkboxes = [];
    var weekOffset = 0;
    var prevWeek = document.getElementById('previousWeek');
    var nextWeek = document.getElementById('nextWeek');
    var resetWeek = document.getElementById("resetDate")


    prevWeek.addEventListener('click', function (){
        weekOffset--;
        var currentweek = returnDatesInWeek(weekOffset)
        document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
        var zajecia = makeListOfWeek(weekOffset,receviedContent)
        zajecia = filterByCheckboxes(zajecia,checkboxes)
        zajecia = sortBytime(zajecia);
        renderTimetable(zajecia);
    })
    nextWeek.addEventListener('click', function () {
        weekOffset++;
        var currentweek = returnDatesInWeek(weekOffset)
        document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
        var zajecia = makeListOfWeek(weekOffset,receviedContent)
        zajecia = filterByCheckboxes(zajecia,checkboxes)
        zajecia = sortBytime(zajecia);
        renderTimetable(zajecia);
    })

    document.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
            checkboxes = getCheckedCheckboxes();
            localStorage.setItem("checkboxes", JSON.stringify(checkboxes));
            zajecia = makeListOfWeek(0,receviedContent)
            zajecia = filterByCheckboxes(zajecia,checkboxes);
            zajecia = sortBytime(zajecia);
            renderTimetable(zajecia);

        }
    });

    resetWeek.addEventListener('click', function (){
        weekOffset=0;
        cleanTimeTable();
        var currentweek = returnDatesInWeek(0)
        document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
        var zajecia = makeListOfWeek(0,receviedContent)
        zajecia = filterByCheckboxes(zajecia,checkboxes)
        zajecia = sortBytime(zajecia);
        renderTimetable(zajecia);
    })





})




//Funkcja do powrotu do aktualnego tygodnia
function basicWeek(){
    var currentweek = returnDatesInWeek(0)
    document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
}


//Funkcja sprawdzająca czy data jest między dwoma innymi
function isInDate(date,from,to){
    var dateObj = new  Date(date);
    var fromObj = new Date(from);
    var toObj = new Date(to);

    return dateObj >= fromObj && dateObj <= toObj;
}


//Funkcja zwracająca listę dni w danym tygodniu
function returnDatesInWeek(offset) {
    offset = offset || 0 ;
    // Pobierz wartość z inputu
    //var weekNumber = parseInt(document.getElementById("weekNumber").value);
    //var weekNumber = 0
    // Pobierz aktualną datę
    var today = new Date();

    // Ustal, ile dni minęło od ostatniego poniedziałku
    var daysFromMonday = today.getDay() === 0 ? 6 : today.getDay() - 1;
    // Odejmij od aktualnej daty liczbę dni odpowiadającą dniom od ostatniego poniedziałku, aby uzyskać początkową datę tygodnia
    today.setDate(today.getDate() - daysFromMonday + (offset * 7));

    // Utwórz listę
    var datesList = [];
    // Iteruj przez dni tygodnia i dodawaj daty do listy
    for (var i = 0; i < 7; i++) {
        var currentDate = new Date(today);
        // Formatuj datę jako "rrrr-mm-dd"
        var formattedDate = currentDate.toISOString().slice(0,10);

        // Dodaj element listy do listy
        datesList.push(formattedDate);

        // Przejdź do następnego dnia
        today.setDate(today.getDate() + 1);
    }

    return datesList
}


//Funkcja tworzaca i wyświetlająca checkboxy grup
function groupCheckboxes (data){
    const uniqueValues = new Set();

    for (const row of data) {
        if (row.length > 2) {
            const trimmedValue = row[2].trim();
            uniqueValues.add(trimmedValue);
        }
    }
    const sortedUniqueValues = new Set([...uniqueValues].sort());

    const checkboxesContainer = document.getElementById('groupSelector');

    sortedUniqueValues.forEach(value => {
        const displayValue = value.trim() !== ' ' ? value : 'Cała grupa';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${displayValue}`;
        checkbox.value = displayValue;

        const label = document.createElement('label');
        label.htmlFor = `checkbox-${displayValue}`;
        label.appendChild(document.createTextNode(displayValue));

        checkboxesContainer.appendChild(checkbox);
        checkboxesContainer.appendChild(label);
        checkboxesContainer.appendChild(document.createElement('br'));
    });
}


//funkcja "okraja" listę zajęć na te w aktualnym tygodniu
// przyjmuje offset czyli liczbę -inf inf która przesuwa który tydzień
// i przyjmuje receviedContent czyli dane zescrappowane z plan.uz.zgora.pl
function makeListOfWeek (offset,receviedContent){
    offset = offset || 0;
    let currentWeek = returnDatesInWeek(offset);
    const weekClasses = [];
    for(let i = 1; i < receviedContent.length; i++) {
        if(isInDate(receviedContent[i][0], currentWeek[0], currentWeek[6]) === true){
            //console.log(isInDate(receviedContent[i][0], currentWeek[0], currentWeek[6]) === true);
            weekClasses.push(receviedContent[i]);
        }

    }
    return weekClasses;
}


//Funkcja która odfiltrowuje tylko te zajęcia dla wybranych przez użytkownika grup
function filterByCheckboxes(content,checkboxesArray) {
    return content.filter(array => checkboxesArray.includes(array[2]))
}


//Konwersja stringowego znacznika godziny do wartości minutowej,
//żeby ją porównać przy sortowaniu. Pomocnicza funkcja do sortByTime, pewnie można
//z niej nie korzystać ale XD dajmy se spokoj.
function convertToMinutes(time) {
    var parts = time.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}


//funkcja odpowiada za sortowanie po godzinie rozpoczęcia
//ma przyjmować okrojoną wersję planu dla konkretnego tygodnia z wybraną grupą
function sortBytime(content){

    function compareTimes(a, b) {
        var timeA = convertToMinutes(a[3]);
        var timeB = convertToMinutes(b[3]);
        //console.log(timeA - timeB);
        return timeA - timeB;
    }

    // Sortowanie tablicy list
    content.sort(compareTimes);

    // Wynik to posortowana tablica
    return content
}


//Funkcja która sprawdza stan wygenerowanych dynamicznie checkboxów
function getCheckedCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    // Przekazanie zaznaczonych wartości do innej funkcji
    return Array.from(checkboxes).map(checkbox => checkbox.value)
}


//funkcja odpowiada za wygenerowanie planu zajęć

function cleanTimeTable(){
    const timetableTable = document.getElementById('timetableContent');
    while (timetableTable.rows.length > 1) {
        timetableTable.deleteRow(1);
    }
}


function renderTimetable(content,timeSets) {
    //console.log(content);
    const daysMapping = { 'Po': 1, 'Wt': 2, 'Śr': 3, 'Cz': 4, 'Pi': 5, 'So': 6, 'Ni': 7 };
    const timetableTable = document.getElementById('timetableContent');

    cleanTimeTable();


    var timeSet = new Set();
    var timeSet2 = new Set();

    for (const entry of content) {
        const timeValue = entry[3];
        const timeValue2 = entry[4];
        timeSet.add(timeValue);
        timeSet2.add(timeValue2);
    }

    timeSet = Array.from(timeSet);
    timeSet2 = Array.from(timeSet2);

    // Pętla idąca po godzinach
    for (var i = 0; i < timeSet.length; i++) {
        var row = timetableTable.insertRow(i + 1);

        // Pętla idąca po dniach
        for (var j = 0; j < 7; j++) {
            var matchingEntry = content.find(entry =>
                entry[3] === timeSet[i] && daysMapping[entry[1]] === j
            );

            var cell = row.insertCell(j);

            if (j === 0) {
                // Wpisywanie w pierwszą kolumnę po lewej wartości godziny pierwszych zajęć
                cell.innerText = `${timeSet[i]} - ${timeSet2[i]}`;
            } else {
                // Dla reszty, wprowadzamy walidację
                if (matchingEntry) {

                    var divElement = document.createElement("div");
                    divElement.className = "classesBox";

                    var dateElement = document.createElement("p");
                    dateElement.className = "classesDate";
                    dateElement.innerText = matchingEntry[0]

                    var nameElement = document.createElement("p");
                    nameElement.className = "classesName";
                    nameElement.innerText = matchingEntry[5];

                    var typeElement = document.createElement("p");
                    typeElement.className = "classesType";
                    typeElement.innerText = `${matchingEntry[6]}, ${matchingEntry[2]}`;



                    divElement.appendChild(dateElement);
                    divElement.appendChild(nameElement);
                    divElement.appendChild(typeElement);

                    cell.appendChild(divElement);
                    // Usuwamy pasujący element, aby nie był brany pod uwagę w kolejnych iteracjach
                    content = content.filter(entry => entry !== matchingEntry);
                } else {
                    cell.innerText = '';
                }
            }
        }
    }

}

