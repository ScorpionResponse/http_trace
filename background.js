
var debug_version = "1.0";

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.debugger.attach({tabId:tab.id}, debug_version, onAttach.bind(null, tab.id));
});

function onAttach(tabId) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }

  chrome.windows.create(
      {url: "headers.html?" + tabId, type: "popup", width: 800, height: 600});
}
