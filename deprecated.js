
//test dla funkcji isInDate

document.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        checkboxes = getCheckedCheckboxes();
        sortByTime(fiterByCheckboxes(zajecia,checkboxes));
        console.log(sortByTime(fiterByCheckboxes(zajecia,checkboxes)) );
        renderTimetable(sortByTime(fiterByCheckboxes(zajecia,checkboxes)) );
    }
});

for( var i = 1; i < 14; i++) {
    console.log(i);
    console.log(isInDate(content[i][0], currwek[0], currwek[6]), "Tutaj wynik");
}

//Koncepcja ze wstawieniem dodatkowej karty, may be usefull later

console.log("Załadowano plugin.")
function modifyPageContent() {
    var newListItem = document.createElement('li');
    newListItem.className = '';

// Tworzenie nowego elementu a
    var newLink = document.createElement('a');
    newLink.href = '#normal';
    newLink.setAttribute('role', 'tab');
    newLink.setAttribute('data-toggle', 'tab');
    newLink.setAttribute('aria-expanded', 'false');
    newLink.textContent = 'Normalny';

// Dodanie linka do elementu li
    newListItem.appendChild(newLink);

    var navTabs = document.querySelector('.nav.nav-tabs');
    if (navTabs) {
        navTabs.appendChild(newListItem);
    } else {
        console.error('Nie znaleziono elementu z klasą "nav nav-tabs".');
    }

}

window.addEventListener('load', modifyPageContent);

var liElement = document.querySelector('li a[href="#normal"]');


// Sprawdź, czy element jest aktywny
if (liElement && liElement.getAttribute('aria-expanded') === 'true') {

    console.log('Element jest aktywny.');
    }
else {
    console.log('Element nie jest aktywny.')
    }



//Przykład przycisku
document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('pluginbutton');
    link.addEventListener('click', function() {
        //displayWeek();
        returnDatesInWeek();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var getDatabutton = document.getElementById('getData');
    getDatabutton.addEventListener('click', function() {
        //displayWeek();
        renderSchedule(makeListOfWeek());
    });
})


