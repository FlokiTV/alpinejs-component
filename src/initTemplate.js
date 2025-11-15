function runScriptsInOrder(scripts) {
  ;(function runScript(i) {
    if (i >= scripts.length) return

    const old = scripts[i]
    const js = document.createElement('script')

    for (let { name, value } of Array.from(old.attributes)) {
      js.setAttribute(name, value)
    }

    if (old.src) {
      js.async = false
      js.onload = () => runScript(i + 1)
      document.head.appendChild(js)
    } else {
      js.textContent = old.textContent
      document.head.appendChild(js)
      runScript(i + 1)
    }
  })(0)
}

export async function initTemplate(Alpine, templateName, shadowDom) {
  const htmlTemplate = document.getElementById(templateName)

  const scripts = Array.from(htmlTemplate.content.querySelectorAll('script'))
  scripts.forEach((s) => s.remove())
  runScriptsInOrder(scripts)

  const domParser = new DOMParser()

  const newComponent = domParser.parseFromString(
    htmlTemplate.innerHTML,
    'text/html'
  ).body.firstChild

  shadowDom.appendChild(newComponent)

  Alpine.initTree(shadowDom)
}

export async function initUrl(Alpine, urlName, shadowDom) {
  const htmlResponse = await fetch(urlName)
  const htmlTemplate = await htmlResponse.text()

  const domParser = new DOMParser()

  const newDocument = domParser.parseFromString(htmlTemplate, 'text/html')

  const scripts = Array.from(newDocument.querySelectorAll('script'))
  scripts.forEach((s) => s.remove())
  runScriptsInOrder(scripts)

  const newComponent = newDocument.body.firstChild

  shadowDom.appendChild(newComponent)

  Alpine.initTree(shadowDom)
}
