
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.create({url: "headers.html?" + tab.id, type: "popup", width: 800, height: 600});
});
