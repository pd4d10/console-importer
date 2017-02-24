// Append inject function to window
// https://stackoverflow.com/questions/20499994/access-window-variable-from-content-script
(() => {
  const script = document.createElement('script')
  script.src = chrome.extension.getURL('scripts/inject.js')
  document.body.appendChild(script)
})()
