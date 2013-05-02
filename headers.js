
var tabId = parseInt(window.location.search.substring(1));

callback = function(details) {
    handleEvent(details);
};

filters = { urls: ["<all_urls>"], tabId: tabId }

chrome.webRequest.onBeforeRequest.addListener(callback, filters, ['requestBody']);
chrome.webRequest.onSendHeaders.addListener(callback, filters, ['requestHeaders']);
chrome.webRequest.onBeforeRedirect.addListener(callback, filters, ['responseHeaders']);
chrome.webRequest.onCompleted.addListener(callback, filters, ['responseHeaders']);
chrome.webRequest.onErrorOccurred.addListener(callback, filters);

function handleEvent(details) {
    //$("#container").append("<!-- DEBUG: " + JSON.stringify(details) + "--> \n");
    var addressDiv = $('div.address[id="req-' + details.requestId + '"]');
    if (addressDiv.length == 0) {
        var addressDiv = $('<div>').addClass("address").attr("id", "req-" + details.requestId);
        $("#container").append(addressDiv);
        $('<div>').addClass("url").text(details.url).appendTo(addressDiv);
    }

    if (details.requestHeaders) {
        $('<div>').addClass("request").text('\n' + details.method + ' ' + details.url).appendTo(addressDiv);
        addressDiv.children().last().append(formatHeaders(details.requestHeaders));
    } else if (details.redirectUrl) {
        $('<div>').addClass("redirect").text('\n' + details.statusLine + "\n Redirect to: " + details.redirectUrl).appendTo(addressDiv);
        addressDiv.children().last().append(formatHeaders(details.responseHeaders));
    } else if (details.responseHeaders) {
        $('<div>').addClass("response").text('\n' + details.statusLine).appendTo(addressDiv);
        addressDiv.children().last().append(formatHeaders(details.responseHeaders));
    }

    if (details.requestBody) {
        addressDiv.children().last().append(formatPost(details.requestBody.formData));
    }
}

function formatPost(postData) {
    var text = "";
    for (name in postData) {
        text += name + ": " + postData[name] + "\n";
    }
    var div = $('<div>').addClass("post").text(text);
    return div;
}

function formatHeaders(headers) {
    var text = "";
    for (i in headers) {
        text += headers[i].name + ": " + headers[i].value + "\n";
    }
    var div = $('<div>').addClass("headers").text(text);
    return div;
}
