window.$i = function inject(name) {
  function log(message) {
    console.log(`%c[Injector]: ${message}`, 'color: blue')
  }

  fetch(`https://api.cdnjs.com/libraries?search=${name}`)
    .then(res => res.json())
    .then(({ results }) => {
      if (results.length === 0) {
        log(`Sorry, ${name} not found`)
        return
      }

      const { name: exactName, latest: scriptSrc } = results[0]

      if (name !== exactName) {
        log(`${name} not found, inject ${exactName} for you.`)
      }

      const script = document.createElement('script')
      script.src = scriptSrc
      script.onload = () => log(`${exactName} loaded`)

      document.body.appendChild(script)
      log(`${exactName} loading...`)
    })
    .catch(err => {
      log('There appears to be some trouble. Please report an issue:')
      log('https://github.com/pd4d10/inject/issues')
    })
}
