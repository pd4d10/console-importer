(function (window) {
  const NORMAL = 'color: blue'
  const STRONG = 'color: blue; font-weight: bold'

  // Add prefix to logs
  function log(...args) {
    const [message, ...colors] = args
    console.log(`%c[Injector]: ${message}`, NORMAL, ...colors)
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

        const script = document.createElement('script')
        script.src = scriptSrc
        script.onload = () => log(`%c${exactName}%c loaded.`, STRONG, NORMAL)
        script.onerror = console.log
        document.body.appendChild(script)
        log(`%c${exactName}%c loading...`, STRONG, NORMAL)
      })
      .catch(err => {
        log('There appears to be some trouble. If you think this is a bug, please report an issue:')
        log('https://github.com/pd4d10/inject/issues')
      })
  }

  window.$i = inject
})(window)
