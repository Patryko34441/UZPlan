
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


    basicWeek();
    groupCheckboxes(receviedContent);

    var checkboxes = [];
    var weekOffset = 0;
    var prevWeek = document.getElementById('previousWeek');
    var nextWeek = document.getElementById('nextWeek');
    var resetWeek = document.getElementById("resetDate")
    var showTimetable = document.getElementById("showTimetable");
    prevWeek.addEventListener('click', function (){
        weekOffset--;
        var currentweek = returnDatesInWeek(weekOffset)
        document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
        var zajecia = makeListOfWeek(weekOffset,receviedContent)
        renderTimetable(zajecia);
    })
    nextWeek.addEventListener('click', function () {
        weekOffset++;
        var currentweek = returnDatesInWeek(weekOffset)
        document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
        var zajecia = makeListOfWeek(weekOffset,receviedContent)
    })

    document.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
            checkboxes = getCheckedCheckboxes();
            sortBytime(fiterByCheckboxes(zajecia,checkboxes));
            console.log(sortBytime(fiterByCheckboxes(zajecia,checkboxes)) );
            renderTimetable(zajecia);
        }
    });

    resetWeek.addEventListener('click', function (){
        basicWeek()
        var zajecia = makeListOfWeek(0,receviedContent)
    })



    var zajecia = makeListOfWeek(weekOffset,receviedContent)




    //console.log(groupCheckboxes(receviedContent));
    //renderTimetable(zajecia);
    //console.log(receviedContent)
    //console.log(zajecia)


/*
    var table = document.getElementById("timetableContent");
    //var tableBody = table.getElementsByTagName("tbody");


        for (var i = 1; i < zajecia.length; i++) {
            var trElement = document.createElement("tr");
            var thElement = document.createElement("th");

            var divElement = document.createElement("div");
            divElement.className = "classesBox";

            var timeElement = document.createElement("p");
            timeElement.className = "classesTime";

            var dateElement = document.createElement("p");
            dateElement.className = "classesDate";

            var nameElement = document.createElement("p");
            nameElement.className = "classesName";

            var typeElement = document.createElement("p");
            typeElement.className = "classesType";


            var daySets = zajecia[i]

            for (var j = 0; j < daySets.length;j++){
                console.log(i,j);
                console.log(daySets.length);

                if ( j === 0 ){
                    dateElement.textContent = zajecia[i][j]
                }
                if( j === 3){
                    timeElement.textContent = zajecia[i][j];
                }
                if(j === 4){
                    timeElement.innerText += " - " + zajecia[i][j];
                }
                if( j === 5){
                    nameElement.textContent = zajecia[i][j];
                }
                if( j === 6){
                    typeElement.innerText = zajecia[i][j]
                }

            }
            divElement.appendChild(timeElement);
            divElement.appendChild(dateElement);
            divElement.appendChild(nameElement);
            divElement.appendChild(typeElement);
            thElement.appendChild(divElement);
            trElement.appendChild(thElement);
            table.appendChild(trElement);

        }


*/









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
function fiterByCheckboxes(content,checkboxesArray) {
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

function renderTimetable(content) {
    const daysMapping = { 'Pn': 1, 'Wt': 2, 'Śr': 3, 'Cz': 4, 'Pi': 5, 'So': 6, 'Ni': 7 };
    const timetableTable = document.getElementById('timetableContent');




    var timeSet = new Set();

    for (const entry of content) {
        const timeValue = entry[3];
        timeSet.add(timeValue);
    }

    timeSet = Array.from(timeSet);

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
                cell.innerText = timeSet[i];
            } else {
                // Dla reszty, wprowadzamy walidację
                if (matchingEntry) {
                    cell.innerText = matchingEntry[5];
                    // Usuwamy pasujący element, aby nie był brany pod uwagę w kolejnych iteracjach
                    content = content.filter(entry => entry !== matchingEntry);
                } else {
                    cell.innerText = '';
                }
            }
        }
    }

    /*
    //todo
    // na poczatku usuń całą tablicę
    const daysMapping = { 'Pn': 1, 'Wt': 2, 'Śr': 3, 'Cz': 4, 'Pt': 5, 'Sb': 6, 'Nd': 7 };
    const timetableTable = document.getElementById('timetableContent');

    var timeSet = new Set();

    for ( const entry of content){
        const timeValue = entry[3];
        timeSet.add(timeValue);
    }

    timeSet = Array.from(timeSet);

    //pętla idąca po godzinach
    for( var i= 0; i < timeSet.length; i++) {

        var row = timetableTable.insertRow(i+1)
        //petla idąca po dniach
        for (var j = 0; j < 7; j++) {
            //wpisywanie w pierwszą kolumnę po lewej wartości godziny pierwszych zajęć
            if (j == 0) {
                var cell = row.insertCell(j);
                cell.innerText = timeSet[i];
            }
            //dla reszty, musimy przeprowadzić walidację, tego czy należy wrzucić boxa, czy zostawić puste
            else{
                for( var k = 0; k < content.length; k++){
                          //jeżeli nie zgadza się godzina rozpoczęcia, lub nie zgadza się dzień słownie to
                        if(content[k][3] === timeSet[i] || daysMapping[content[k][1]] === j ){
                            var cell = row.insertCell(j);
                            cell.innerText = `pusty index ${j}`
                    }
                        else{
                            var cell = row.insertCell(j);
                            cell.innerText = content[k][5];

                        }

                }




            }

        }
    }

/*
    var row = timetableTable.insertRow(1);
    for ( var i = 0; i < 8; i++){
        var test = document.createElement("a")
        var cell = row.insertCell(i);
        test.innerText = `index ${i}`
        cell.appendChild(test)

    }

 */
}
