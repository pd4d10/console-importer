console.log('\'Allo \'Allo! Content script');

function inject(name) {
  const CDN_JS = 'https://api.cdnjs.com/libraries?search='

  return fetch(`${CDN_JS}/${name}`)
    .then(res => res.json())
    .then(({ results }) => {
      const scriptSrc = results[0].latest

      const script = document.createElement('script')
      script.src = scriptSrc
      script.onload = () => console.log(`${name} loaded`)

      document.body.appendChild(script)
      console.log(`${name} loading...`)
    })
}

function createScript(content, onload) {
  const script = document.createElement('script')
  script.innerHTML = content
  script.onload = onload

  document.body.appendChild(script)
}

// window.$i = inject

createScript(`window.$i = ${inject.toString()}`, console.log)
