(function(globalWnd){
  const context = {
    globalData: null,
    currentData: null,
    path: null
  }
  const viewer = new JsonViewer({clickableUrls: false, bigNumbers: true});

  function showJson(content) {
    let newContent = null;
    try {
      newContent = json_parse()(content)
    } catch (e) {
      throw e;
    }

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

    context.globalData = newContent;
    viewer.render(newContent)

    window.addEventListener('message', event => {
      if (event.source != window) {
        return
      }
      searchPath(event.data.path);
    }, false)
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
