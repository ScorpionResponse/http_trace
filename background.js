
callback = function(details) {
    do_alert(details);
};

filters = { urls: ["<all_urls>"]}

chrome.browserAction.onClicked.addListener(function(tab) {
  alert("clicked");
  chrome.webRequest.onSendHeaders.addListener(callback, filters);
  chrome.windows.create({url: "headers.html?" + tab.id, type: "popup", width: 800, height: 600});
});
