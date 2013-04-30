
var tabId = parseInt(window.location.search.substring(1));

window.addEventListener("load", function() {
  chrome.debugger.sendCommand({tabId:tabId}, "Network.enable");
  chrome.debugger.onEvent.addListener(onEvent);
});

window.addEventListener("unload", function() {
  chrome.debugger.detach({tabId:tabId});
});

function onEvent(debuggeeId, message, params) {
  if (tabId != debuggeeId.tabId) {
    return;
  }

  if (message == "Network.requestWillBeSent") {
    var requestDiv = $('div.address[id="req-' + params.requestId + '"]');
    if (requestDiv.length == 0) {
      var requestDiv = $('<div>').addClass("address").attr("id", "req-" + params.requestId);
      $('<div>').addClass("url").text(params.request.url).appendTo(requestDiv);
    }

    if (params.redirectResponse) {
      appendResponse(params.requestId, params.redirectResponse);
    }

    $('<div>').addClass("request").text("\n" + params.request.method + " " +
        parseURL(params.request.url).path + " HTTP/1.1").appendTo(requestDiv);

    if (params.request.method === 'POST') {
      $('<div>').addClass("post").text("\n" + params.request.postData).appendTo(requestDiv);
    }

    $("#container").append(requestDiv);
  } else if (message == "Network.responseReceived") {
    appendResponse(params.requestId, params.response);
  }
}

function appendResponse(requestId, response) {
  var requestDiv = $('div.address[id="req-' + requestId + '"]');
  requestDiv.children().last().append(formatHeaders(response.requestHeaders));

  $('<div>').addClass("response").text("\nHTTP/1.1 " + response.status + " " +
          response.statusText).appendTo(requestDiv);
  requestDiv.children().last().append(formatHeaders(response.headers));
}

function formatHeaders(headers) {
  var text = "";
  for (name in headers)
    text += name + ": " + headers[name] + "\n";
  var div = $('<div>').addClass("headers").text(text);
  return div;
}

function parseURL(url) {
  var result = {};
  var match = url.match(
      /^([^:]+):\/\/([^\/:]*)(?::([\d]+))?(?:(\/[^#]*)(?:#(.*))?)?$/i);
  if (!match)
    return result;
  result.scheme = match[1].toLowerCase();
  result.host = match[2];
  result.port = match[3];
  result.path = match[4] || "/";
  result.fragment = match[5];
  return result;
}
