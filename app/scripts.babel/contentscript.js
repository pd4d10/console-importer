console.log('\'Allo \'Allo! Content script');

function inject(name) {
  const CDN_JS = 'https://api.cdnjs.com/libraries?search='

  fetch(`${CDN_JS}/${name}`)
    .then(res => res.json())
    .then(({ results }) => {
      if (results.length === 0) {
        console.log(`Sorry, ${name} not found`)
      }

      const { name: exactName, latest: scriptSrc } = results[0]

      if (name !== exactName) {
        console.log(`${name} not found, inject ${exactName} for you.`)
      }

      const script = document.createElement('script')
      script.src = scriptSrc
      script.onload = () => console.log(`${exactName} loaded`)

      document.body.appendChild(script)
      console.log(`${exactName} loading...`)
    })
}

function createScript(content, onload) {
  const script = document.createElement('script')
  script.innerHTML = content
  script.onload = onload

  document.body.appendChild(script)
}

createScript(`window.$i = ${inject.toString()}`, console.log)
