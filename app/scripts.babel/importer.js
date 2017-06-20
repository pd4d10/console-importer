;(window => {
  const NORMAL = 'color: #000'
  const PREFIX = 'color: #00f'
  const ERROR = 'color: #f00'
  const STRONG = 'color: #00f; font-weight: bold'

  // Add prefix to logs
  function log(message, ...colors) {
    console.log(`%c[$i]: ${message}`, PREFIX, ...colors)
  }

  function logError(message, ...colors) {
    console.log(`%c[$i]: ${message}`, ERROR, ...colors)
  }

  function createBeforeLoad(name) {
    return () =>
      log(`%c${name}%c is loading, please be patient...`, STRONG, NORMAL)
  }

  function createOnLoad(name, url) {
    return () => {
      if (url) {
        log(`%c${name}%c(${url}) is loaded.`, STRONG, NORMAL)
      } else {
        log(`%c${name}%c is loaded.`, STRONG, NORMAL)
      }
    }
  }

  function createOnError(name, url) {
    return () => {
      if (url) {
        logError(
          `%cFail to load %c${name}%c, is this URL(${url}) correct?`,
          NORMAL,
          STRONG,
          NORMAL
        )
      } else {
        logError(
          `%cFail to load %c${name}%c, is this URL correct?`,
          NORMAL,
          STRONG,
          NORMAL
        )
      }
    }
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
    onerror = createOnError(url)
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
    log(
      `%cSearching for %c${name}%c, please be patient...`,
      NORMAL,
      STRONG,
      NORMAL
    )
    fetch(`https://api.cdnjs.com/libraries?search=${name}`)
      .then(res => res.json())
      .then(({ results }) => {
        if (results.length === 0) {
          logError(
            `%cSorry, %c${name}%c not found, please try another keyword.`,
            NORMAL,
            STRONG,
            NORMAL
          )
          return
        }

        const { name: exactName, latest: url } = results[0]
        if (name !== exactName) {
          log(
            `%c${name}%c not found, import %c${exactName}%c instead.`,
            STRONG,
            NORMAL,
            STRONG,
            NORMAL
          )
        }

        inject(
          url,
          createBeforeLoad(exactName),
          createOnLoad(exactName, url),
          createOnError(exactName, url)
        )
      })
      .catch(() => {
        logError(
          '%cThere appears to be some trouble with your network. If you think this is a bug, please report an issue:',
          NORMAL
        )
        logError('%chttps://github.com/pd4d10/console-importer/issues', NORMAL)
      })
  }

  // From unpkg
  // https://unpkg.com
  function unpkg(name) {
    createBeforeLoad(name)()
    const url = `https://unpkg.com/${name}`
    injectScript(url, createOnLoad(name, url), createOnError(name, url))
  }

  // Entry
  function importer(originName) {
    if (typeof originName !== 'string') {
      throw new Error('Argument should be a string, please check it.')
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

  // Do not output annoying ugly string of function content
  importer.toString = () => '$i'

  // Assign to console
  console.$i = importer

  // Do not break existing $i
  if (typeof window.$i === 'undefined') {
    window.$i = importer // eslint-disable-line
  } else {
    log('%c$i is already in use, please use `console.$i` instead', NORMAL)
  }
})(window)
