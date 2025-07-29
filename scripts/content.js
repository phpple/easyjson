chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.type) {
      case 'contentLoaded':
        sendResponse({supportJson: 'application/json' === document.contentType})
        break
      case 'scriptsLoaded':
        easyJson(document.body.innerText)
        break
    }
  }
);
