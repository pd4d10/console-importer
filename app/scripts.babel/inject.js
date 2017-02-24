(function (window) {
  const NORMAL = 'color: blue'
  const STRONG = 'color: blue; font-weight: bold'

  // Add prefix to logs
  function log(...args) {
    const [message, ...colors] = args
    console.log(`%c[Injector]: ${message}`, NORMAL, ...colors)
  }

  // Inject script
  function injectScript(src, onload, onerror) {
    const script = document.createElement('script')
    script.src = src
    if (typeof onload === 'function') {
      script.onload = onload
    }
    if (typeof onerror === 'function') {
      script.onerror = onerror
    }
    document.body.appendChild(script)
  }

  function inject(name) {
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
        injectScript(scriptSrc, () => log(`%c${exactName}%c is loaded.`, STRONG, NORMAL))
      })
      .catch(err => {
        log('There appears to be some trouble. If you think this is a bug, please report an issue:')
        log('https://github.com/pd4d10/inject/issues')
      })
  }

  // From unpkg
  // https://unpkg.com
  function unpkg(name) {
    log(`%c${name}%c is loading...`, STRONG, NORMAL)
    injectScript(`https://unpkg.com/${name}`, () => log(`%c${name}%c is loaded.`, STRONG, NORMAL))
  }

  inject.unpkg = unpkg
  window.$i = inject
})(window)
