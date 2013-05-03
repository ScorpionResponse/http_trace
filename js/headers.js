
var tabId = parseInt(window.location.search.substring(1));
var filters = { urls: ["<all_urls>"], tabId: tabId }

function addListeners() {
    chrome.webRequest.onBeforeRequest.addListener(handleEvent, filters, ['requestBody']);
    chrome.webRequest.onSendHeaders.addListener(handleEvent, filters, ['requestHeaders']);
    chrome.webRequest.onBeforeRedirect.addListener(handleEvent, filters, ['responseHeaders']);
    chrome.webRequest.onCompleted.addListener(handleEvent, filters, ['responseHeaders']);
    chrome.webRequest.onErrorOccurred.addListener(handleEvent, filters);
}

function removeListeners() {
    chrome.webRequest.onBeforeRequest.removeListener(handleEvent);
    chrome.webRequest.onSendHeaders.removeListener(handleEvent);
    chrome.webRequest.onBeforeRedirect.removeListener(handleEvent);
    chrome.webRequest.onCompleted.removeListener(handleEvent);
    chrome.webRequest.onErrorOccurred.removeListener(handleEvent);
}

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

// Controls

$(function() {
    addListeners();
    $('button#clear').click(clearContent);
    $('button#close').click(closeWindow);
    $('button#pause').click(pauseCapture);
});

function clearContent() {
    $('#container').empty();
}

function closeWindow() {
    window.close();
}

function pauseCapture() {
    removeListeners();
    resumeButton = $('<button>').attr('id', 'resume').text("Resume").button();
    $('button#pause').replaceWith(resumeButton);
    $('button#resume').click(resumeCapture);
}

function resumeCapture() {
    addListeners();
    pauseButton = $('<button>').attr('id', 'pause').text("Pause").button();
    $('button#resume').replaceWith(pauseButton);
    $('button#pause').click(pauseCapture);
}
