(function(globalWnd){
  const context = {
    globalData: null,
    currentData: null,
    path: null
  }
  const viewer = new JSONViewer({clickableUrls: false, bigNumbers: true});

  function showJson(content) {
    // remove all children
    for (let i = document.body.children.length - 1; i >= 0; i--) {
      document.body.removeChild(document.body.children[i])
    }
    let form = document.createElement('form')
    form.addEventListener('submit', (e) => {
      window.postMessage({path: form.path.value})
      return false
    }, false)
    form.action = 'javascript:void(0);'

    const input = document.createElement('input')
    input.placeholder = 'Input JSON path'
    input.id = 'json-pather'
    input.name = 'path'
    form.appendChild(input)
    document.body.appendChild(form)

    const pre = document.createElement('pre')
    pre.id = 'json-renderer'
    document.body.appendChild(pre)

    const newContent = json_parse()(content)
    context.globalData = newContent;
    viewer.render(newContent)

    insertCss()

    window.addEventListener('message', event => {
      if (event.source != window) {
        return
      }
      searchPath(event.data.path);
    }, false)
  }

  function insertCss() {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.rel = 'stylesheet'
    style.innerHTML = `*{margin: 0; padding:0; font-size: 16px; font-family: "Consolas", "Arial", "Monaco", "Osaka", "serif"; background-color: #272822; color: #fff}
body {overflow-y: scroll; overflow-x: hidden;}
pre{white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; display: block;}
#json-pather {border:solid 0 #7bdcfe;margin:1em;padding:0.5em;font-size:12px;min-width:20em;}
#json-renderer {padding: 1em 2em;}
ul.json-dict, ol.json-array {list-style-type: none; margin: 0 0 0 1px; border-left: 1px dotted #666; padding-left: 2em;}
.json-key {color: #7bdcfe;}
.json-value {color: #ce9178;}
.json-literal {color: #b5cea8;}
a.json-toggle {position: relative; color: inherit; text-decoration: none; cursor: pointer;}
a.json-toggle:focus {outline: none;}
a.json-toggle:before {font-size: 1.1em; color: #666; content: "\\25BC"; position: absolute; display: inline-block; width: 1em; text-align: center; line-height: 1em; left: -1.2em;}
a.json-toggle:hover:before {color: #aaa;}
a.json-toggle.collapsed:before {content: "\\25B6";}
a.json-placeholder {color: #aaa; padding: 0 1em; text-decoration: none; cursor: pointer;}
a.json-placeholder:hover {text-decoration: underline;}
.hidden {display: none;}
`
    document.body.appendChild(style)
  }

  function searchPath(path) {
    if (!path || !context.globalData) {
      viewer.render(context.globalData)
      return false
    }
    JSONPath.JSONPath({
      path: path,
      json: context.globalData,
      callback: (result) => {
        context.currentData = result
        context.path = path
        viewer.render(result)
      },
      otherTypeCallback: () => {
        console.log(arguments)
      }
    })
    return false;
  }

  globalWnd.easyJson = showJson;
})(window);
