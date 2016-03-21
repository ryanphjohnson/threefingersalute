function clickHandler() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "delete"});
    });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('TFS_Forget').addEventListener('click', clickHandler);
});