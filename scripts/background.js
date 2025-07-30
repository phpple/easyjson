chrome.webNavigation.onDOMContentLoaded.addListener(async ({tabId, url}) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return;
  }
  chrome.scripting.executeScript({
    target: {tabId},
    files: [
      'scripts/content.js'
    ],
  }).then(async () => {
    const response = await chrome.tabs.sendMessage(tabId, {type: 'contentLoaded'})
    if (!response.supportJson) {
      return;
    }
    // Load Stylesheets
    chrome.scripting.insertCSS({
      target: {tabId},
      files: ['styles/jsonviewer.css']
    });
    // Load Javascripts
    chrome.scripting.executeScript({
      target: {tabId},
      files: [
        'scripts/third-part/big-number.js',
        'scripts/third-part/json-bigint.js',
        'scripts/third-part/json-path.js',
        'scripts/third-part/json-viewer.js',
        'scripts/easyjson.js'
      ],
    }).then(() => {
      chrome.tabs.sendMessage(tabId, {type: 'scriptsLoaded'})
    })
  })
})
