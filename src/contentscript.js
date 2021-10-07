// https://stackoverflow.com/questions/20499994/access-window-variable-from-content-script
;(() => {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('scripts/importer.js')
  document.body.appendChild(script)
  document.body.removeChild(script)
})()
