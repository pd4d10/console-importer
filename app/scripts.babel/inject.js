((window) => {
  const NORMAL = 'color: blue'
  const STRONG = 'color: blue; font-weight: bold'

  // Add prefix to logs
  function log(...args) {
    const [message, ...colors] = args
    console.log(`%c[import]: ${message}`, NORMAL, ...colors)
  }

  // Script onload
  function createOnLoad(url) {
    return () => log(`%c${url}%c is loaded.`, STRONG, NORMAL)
  }

  function createOnError(url) {
    return () => log(`%cFailed to load %c${url}%c, is this URL correct`, NORMAL, STRONG, NORMAL)
  }

  function injectScript(url) {
    const script = document.createElement('script')
    script.src = url
    script.onload = createOnLoad(url)
    script.onerror = createOnError(url)
    document.body.appendChild(script)
  }

  function injectStyle(url) {
    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    link.onload = createOnLoad(url)
    link.onerror = createOnError(url)
    document.head.appendChild(link)
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
          log(`%c${name}%c not found, import %c${exactName}%c for you.`, STRONG, NORMAL, STRONG, NORMAL)
        }

        log(`%c${exactName}%c is loading...`, STRONG, NORMAL)
        injectScript(scriptSrc, createOnLoad(exactName))
      })
      .catch(() => {
        log('There appears to be some trouble. If you think this is a bug, please report an issue:')
        log('https://github.com/pd4d10/import-from-console/issues')
      })
  }

  // From unpkg
  // https://unpkg.com
  function unpkg(name) {
    log(`%c${name}%c is loading...`, STRONG, NORMAL)
    injectScript(`https://unpkg.com/${name}`, createOnLoad(name))
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
        createOnLoad(name),
        createOnError(name),
      )
    }

    return cdnjs(name)
  }

  importer.cdnjs = cdnjs
  importer.unpkg = unpkg
  window.$i = importer // eslint-disable-line
})(window)
