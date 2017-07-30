import tiza from 'tiza'

const PREFIX_TEXT = '[$i]: '
const prefix = tiza.color('blue').text
const strong = tiza.color('blue').bold().text
const error = tiza.color('red').text
const log = (...args) => tiza.log(prefix(PREFIX_TEXT), ...args)
const logError = (...args) => tiza.log(error(PREFIX_TEXT), ...args)

function createBeforeLoad(name) {
  return () => log(strong(name), ' is loading, please be patient...')
}

function createOnLoad(name, url) {
  return () => {
    const urlText = url ? `(${url})` : ''
    log(strong(name), `${urlText} is loaded.`)
  }
}

function createOnError(name, url) {
  return () => {
    const urlText = url ? `(${strong(url)})` : ''
    logError(
      'Fail to load ',
      strong(name),
      ', is this URL(',
      urlText,
      ' correct?'
    )
  }
}

// Try to remove referrer for security
// https://imququ.com/post/referrer-policy.html
// https://www.w3.org/TR/referrer-policy/
function addNoReferrerMeta() {
  const originMeta = document.querySelector('meta[name=referrer]')

  if (originMeta) {
    // If there is already a referrer policy meta tag, save origin content
    // and then change it, call `remove` to restore it
    const content = originMeta.content
    originMeta.content = 'no-referrer'
    return function remove() {
      originMeta.content = content
    }
  } else {
    // Else, create a new one, call `remove` to delete it
    const meta = document.createElement('meta')
    meta.name = 'referrer'
    meta.content = 'no-referrer'
    document.head.appendChild(meta)
    return function remove() {
      // Removing meta tag directly not work, should set it to default first
      meta.content = 'no-referrer-when-downgrade'
      document.head.removeChild(meta)
    }
  }
}

// Insert script tag
function injectScript(url, onload, onerror) {
  const remove = addNoReferrerMeta()
  const script = document.createElement('script')
  script.src = url
  script.onload = onload
  script.onerror = onerror
  document.body.appendChild(script)
  remove()
  document.body.removeChild(script)
}

// Insert link tag
function injectStyle(url, onload, onerror) {
  const remove = addNoReferrerMeta()
  const link = document.createElement('link')
  link.href = url
  link.rel = 'stylesheet'
  link.onload = onload
  link.onerror = onerror
  document.head.appendChild(link)
  remove()
  document.head.removeChild(link)
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
  log('Searching for ', strong(name), ', please be patient...')
  fetch(`https://api.cdnjs.com/libraries?search=${name}`, {
    referrerPolicy: 'no-referrer',
  })
    .then(res => res.json())
    .then(({ results }) => {
      if (results.length === 0) {
        logError(
          'Sorry, ',
          strong(name),
          ' not found, please try another keyword.'
        )
        return
      }

      const { name: exactName, latest: url } = results[0]
      if (name !== exactName) {
        log(strong(name), ' not found, import ', strong(exactName), ' instead.')
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
        'There appears to be some trouble with your network. If you think this is a bug, please report an issue:'
      )
      logError('https://github.com/pd4d10/console-importer/issues')
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
  if (name.indexOf('@') !== -1) {
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
  window.$i = importer
} else {
  log('$i is already in use, please use `console.$i` instead')
}

// For unit test
export default importer
