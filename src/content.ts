// https://stackoverflow.com/questions/20499994/access-window-variable-from-content-script
import importer from 'url:./importer.ts'

const script = document.createElement('script')
script.src = importer
script.type = 'module'
document.body.appendChild(script)
document.body.removeChild(script)
