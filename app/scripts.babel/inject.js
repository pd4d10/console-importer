((window) => {
  const NORMAL = 'color: #00f'
  const ERROR = 'color: #c82828'
  const STRONG = 'color: #00f; font-weight: bold'

  // Add prefix to logs
  function log(message, ...colors) {
    console.log(`[$i]: ${message}`, ...colors)
  }

  function createBeforeLoad(url) {
    return () => log(`%c${url}%c is loading...`, STRONG, NORMAL)
  }

  function createOnLoad(url) {
    return () => log(`%c${url}%c is loaded.`, STRONG, NORMAL)
  }

  function createOnError(url) {
    return () => log(`%cFail to load %c${url}%c, is this URL correct?`, ERROR, STRONG, ERROR)
  }

  // Insert script tag
  function injectScript(url, onload, onerror) {
    const script = document.createElement('script')
    script.src = url
    script.onload = onload
    script.onerror = onerror
    document.body.appendChild(script)
  }

  // Insert link tag
  function injectStyle(url, onload, onerror) {
    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    link.onload = onload
    link.onerror = onerror
    document.head.appendChild(link)
  }

  function inject(
    url,
    beforeLoad = createBeforeLoad(url),
    onload = createOnLoad(url),
    onerror = createOnError(url),
  ) {
    beforeLoad()

    // Handle CSS
    if (/\.css$/.test(url)) {
      return injectStyle(url, onload, onerror)
    }

    // Handle JS
    return injectScript(url, onload, onerror)
  }

  // From cdnjs
  // https://cdnjs.com/
  function cdnjs(name) {
    log(`%cSearching for %c${name}%c, please be patient...`, NORMAL, STRONG, NORMAL)
    fetch(`https://api.cdnjs.com/libraries?search=${name}`)
      .then(res => res.json())
      .then(({ results }) => {
        if (results.length === 0) {
          log(`%cSorry, %c${name}%c not found, please try another keyword`, ERROR, STRONG, ERROR)
          return
        }

        const { name: exactName, latest: url } = results[0]
        if (name !== exactName) {
          log(`%c${name}%c not found, import %c${exactName}%c instead.`, STRONG, NORMAL, STRONG, NORMAL)
        }

        // log(`%c${exactName}%c is loading...`, STRONG, NORMAL)
        inject(url, createBeforeLoad(exactName), createOnLoad(exactName), createOnError(exactName))
      })
      .catch(() => {
        log('There appears to be some trouble with your network. If you think this is a bug, please report an issue:')
        log('https://github.com/pd4d10/import-from-console/issues')
      })
  }

  // From unpkg
  // https://unpkg.com
  function unpkg(name) {
    createBeforeLoad(name)()
    injectScript(`https://unpkg.com/${name}`, createOnLoad(name), createOnError(name))
  }

  // Entry
  function importer(originName) {
    if (typeof originName !== 'string') {
      throw new Error('$i\'s argument should be a string, please check it.')
    }

    // Trim string
    const name = originName.trim()

    // If it is a valid URL, inject it directly
    if (/^https?:\/\//.test(name)) {
      return inject(name)
    }

    // If version specified, try unpkg
    if (name.includes('@')) {
      return unpkg(name)
    }

    return cdnjs(name)
  }

  importer.cdnjs = cdnjs
  importer.unpkg = unpkg
  window.$i = importer // eslint-disable-line
})(window)
