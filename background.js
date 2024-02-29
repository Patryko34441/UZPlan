chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request,"Background");
    // Tutaj możesz obsługiwać dane przekazane z content.js
});