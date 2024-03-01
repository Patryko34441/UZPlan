
var receviedContent = []
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'collectData'}, function(response) {
        if(!response){
            console.log("Response was generated based on localStorage")
            receviedContent = JSON.parse(localStorage.getItem("timetable"));
            runExtension(receviedContent)
        }
        else{
            console.log("Response was generated based on page")
            localStorage.setItem("timetable", JSON.stringify(response));
            runExtension(response);
        }
    });
});


//Funkcja sprawdzająca czy data jest między dwoma innymi
function isInDate(date,from,to){
    var dateObj = new  Date(date);
    var fromObj = new Date(from);
    var toObj = new Date(to);

    return dateObj >= fromObj && dateObj <= toObj;
}

function runExtension(receviedContent){

    var checkboxes = getCheckboxesFromLocalStorage();
    var weekOffset = 0;
    var prevWeek = document.getElementById('previousWeek');
    var nextWeek = document.getElementById('nextWeek');
    var resetWeek = document.getElementById("resetDate")
    receviedContent = JSON.parse(localStorage.getItem("timetable"));
    var zajecia = makeListOfWeek(weekOffset,receviedContent)

    groupCheckboxes(receviedContent);
    basicWeek(zajecia);

    prevWeek.addEventListener('click', function (){
        weekOffset--;
        var currentweek = returnDatesInWeek(weekOffset)
        document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
        var zajecia = makeListOfWeek(weekOffset,receviedContent)
        //console.log(zajecia);

        zajecia = filterByCheckboxes(zajecia,checkboxes)
        zajecia = sortByTime(zajecia);
        renderTimetable(zajecia);
    })
    nextWeek.addEventListener('click', function () {
        weekOffset++;
        var currentweek = returnDatesInWeek(weekOffset)
        document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
        var zajecia = makeListOfWeek(weekOffset,receviedContent)
        zajecia = filterByCheckboxes(zajecia,checkboxes)
        zajecia = sortByTime(zajecia);
        renderTimetable(zajecia);
    })

    document.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
            checkboxes = getCheckedCheckboxes();
            localStorage.setItem("checkboxes", JSON.stringify(checkboxes));
            zajecia = makeListOfWeek(weekOffset,receviedContent)
            zajecia = filterByCheckboxes(zajecia,checkboxes);
            zajecia = sortByTime(zajecia);
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
        zajecia = sortByTime(zajecia);
        renderTimetable(zajecia);
    })
    

}

//Funkcja do powrotu do aktualnego tygodnia
function basicWeek(zajecia){
    tickCheckboxesFromLocalStorage()
    cleanTimeTable()
    zajecia = filterByCheckboxes(zajecia,getCheckboxesFromLocalStorage());
    zajecia = sortByTime(zajecia);
    renderTimetable(zajecia);
    var currentweek = returnDatesInWeek(0)
    document.querySelector('#presentDate').innerText = "od "+ currentweek[0]+ " do " + currentweek[6];
}

function returnDatesInWeek(offset) {
    offset = offset || 0 ;

    var today = new Date();

    var daysFromMonday = today.getDay() === 0 ? 6 : today.getDay() - 1;
    today.setDate(today.getDate() - daysFromMonday + (offset * 7));

    var datesList = [];
    for (var i = 0; i < 7; i++) {
        var currentDate = new Date(today);
        var formattedDate = currentDate.toISOString().slice(0,10);

        datesList.push(formattedDate);

        today.setDate(today.getDate() + 1);
    }

    return datesList
}

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

function makeListOfWeek (offset,receviedContent){
    offset = offset || 0;
    let currentWeek = returnDatesInWeek(offset);
    const weekClasses = [];
    for(let i = 1; i < receviedContent.length; i++) {
        if(isInDate(receviedContent[i][0], currentWeek[0], currentWeek[6]) === true){
            weekClasses.push(receviedContent[i]);
        }

    }
    return weekClasses;
}

function filterByCheckboxes(content,checkboxesArray) {
    return content.filter(array => checkboxesArray.includes(array[2]))
}

function convertToMinutes(time) {
    var parts = time.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function sortByTime(content){

    function compareTimes(a, b) {
        var timeA = convertToMinutes(a[3]);
        var timeB = convertToMinutes(b[3]);
        return timeA - timeB;
    }
    content.sort(compareTimes);
    return content
}

function getCheckedCheckboxes() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value)
}

function cleanTimeTable(){
    const timetableTable = document.getElementById('timetableContent');
    while (timetableTable.rows.length > 1) {
        timetableTable.deleteRow(1);
    }
}

function renderTimetable(content,timeSets) {
    const daysMapping = {'Po': 1, 'Wt': 2, 'Śr': 3, 'Cz': 4, 'Pi': 5, 'So': 6, 'Ni': 7};
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

    if (timeSet.length !== timeSet2.length) {
        const lastElementTimeSet2 = Array.from(timeSet2).pop();
        timeSet2.push(lastElementTimeSet2);
    }


    for (var i = 0; i < timeSet.length; i++) {
        var row = timetableTable.insertRow(i + 1);


        for (var j = 0; j < 8; j++) {
            var matchingEntries = content.filter(entry =>
                entry[3] === timeSet[i] && daysMapping[entry[1]] === j
            );

            var cell = row.insertCell(j);

            if (j === 0) {
                cell.className = 'hoursCell';
                cell.innerText = `${timeSet[i]} \n-\n ${timeSet2[i]}`;
            } else {
                if (matchingEntries.length > 0) {
                    for (const matchingEntry of matchingEntries) {
                        var divElement = document.createElement("div");
                        divElement.className = "classesBox";

                        var divTopElement = document.createElement("div");
                        divTopElement.className = "dateRoomBox";

                        var hoursElement = document.createElement("p");
                        hoursElement.className = "classesHours";
                        hoursElement.innerText = `${timeSet[i]} - ${timeSet2[i]}`;

                        var dateElement = document.createElement("p");
                        dateElement.className = "classesDate";
                        dateElement.innerText = matchingEntry[0]

                        var roomElement = document.createElement("p");
                        roomElement.className = "classesRoom";
                        roomElement.innerText = matchingEntry[8];

                        var nameElement = document.createElement("p");
                        nameElement.className = "classesName";
                        nameElement.innerText = matchingEntry[5];

                        var teacherElement = document.createElement("p");
                        teacherElement.className = "teacherName";
                        teacherElement.innerText = matchingEntry[7];

                        var typeElement = document.createElement("p");
                        typeElement.className = "classesType";
                        typeElement.innerText = `${matchingEntry[6]}, Gr. ${matchingEntry[2]} `;

                        divTopElement.appendChild(dateElement);
                        divTopElement.appendChild(roomElement);
                        divElement.appendChild(divTopElement);

                        divElement.appendChild(hoursElement);
                        divElement.appendChild(nameElement);
                        divElement.appendChild(typeElement);

                        cell.appendChild(divElement);
                    }
                } else {
                    cell.innerText = '';
                }
            }
        }
    }
}

function getCheckboxesFromLocalStorage(){
    return JSON.parse(localStorage.getItem("checkboxes")) || [];
}

function tickCheckboxesFromLocalStorage() {
    var localstorageCheckboxes = JSON.parse(localStorage.getItem("checkboxes")) || [];
    for( entry of localstorageCheckboxes ){
        var checkbox = document.getElementById(`checkbox-${entry}`);
        if(checkbox){
            checkbox.checked = true;

        }

    }
}