
/*
///Web scrapping danych do wtyczki

var table = document.getElementById("details");
var rows = table.getElementsByTagName("tr");
var content = [];

for (var i = 0; i < rows.length; i++) {
    var day = [];
    var dataColumns = rows[i].getElementsByTagName("td");

    for (var j = 0; j < dataColumns.length; j++) {
        if (dataColumns[j].textContent.trim() !== '') {
            day.push(dataColumns[j].textContent);
        }
        else{
            day.push("Cała grupa");
        }

    }
    content.push(day);
}

console.log(content)
chrome.runtime.sendMessage({action: 'sendTableDataToBackground', data: content});


*/


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'collectData') {

        var table = document.getElementById("details");
        var rows = table.getElementsByTagName("tr");
        var content = [];

        for (var i = 0; i < rows.length; i++) {
            var day = [];
            var dataColumns = rows[i].getElementsByTagName("td");

            for (var j = 0; j < dataColumns.length; j++) {
                if (dataColumns[j].textContent.trim() !== '') {
                    day.push(dataColumns[j].textContent);
                }
                else{
                    day.push("Cała grupa");
                }

            }
            content.push(day);
        }

        sendResponse(content);
    }
});