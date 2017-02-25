((window) => {
  const NORMAL = 'color: blue'
  const STRONG = 'color: blue; font-weight: bold'

  // Add prefix to logs
  function log(...args) {
    const [message, ...colors] = args
    console.log(`%c[Injector]: ${message}`, NORMAL, ...colors)
  }

  function injectScript(src, onload, onerror) {
    const script = document.createElement('script')
    script.src = src
    script.onload = onload
    script.onerror = onerror
    document.body.appendChild(script)
  }

  function injectStyle(url, onload, onerror) {
    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    link.onload = onload
    link.onerror = onerror
    document.head.appendChild(link)
  }

  // Script onload
  function onLoad(name) {
    return () => log(`%c${name}%c is loaded.`, STRONG, NORMAL)
  }

  // From cdnjs
  // https://cdnjs.com/
  function cdnjs(name) {
    log(`%cSearching for %c${name}%c, please be patient...`, NORMAL, STRONG, NORMAL)
    fetch(`https://api.cdnjs.com/libraries?search=${name}`)
      .then(res => res.json())
      .then(({ results }) => {
        if (results.length === 0) {
          log(`%cSorry, %c${name}%c not found, please try another keyword`, NORMAL, STRONG, NORMAL)
          return
        }

        const { name: exactName, latest: scriptSrc } = results[0]
        if (name !== exactName) {
          log(`%c${name}%c not found, inject %c${exactName}%c for you.`, STRONG, NORMAL, STRONG, NORMAL)
        }

        log(`%c${exactName}%c is loading...`, STRONG, NORMAL)
        injectScript(scriptSrc, onLoad(exactName))
      })
      .catch(() => {
        log('There appears to be some trouble. If you think this is a bug, please report an issue:')
        log('https://github.com/pd4d10/inject/issues')
      })
  }

  // From unpkg
  // https://unpkg.com
  function unpkg(name) {
    log(`%c${name}%c is loading...`, STRONG, NORMAL)
    injectScript(`https://unpkg.com/${name}`, onLoad(name))
  }

  // Entry
  function importer(name) {
    // If it is a valid URL, inject it directly
    if (/^https?:\/\//.test(name)) {
      // Handle CSS
      if (/\.css$/.test(name)) {
        return injectStyle(name)
      }

      // Handle JS
      return injectScript(
        name,
        onLoad(name),
        () => log(`%cFailed to load %c${name}%c, is this script URL correct?`, NORMAL, STRONG, NORMAL),
      )
    }

    return cdnjs(name)
  }

  importer.cdnjs = cdnjs
  importer.unpkg = unpkg
  window.$i = importer // eslint-disable-line
})(window)
