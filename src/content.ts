// https://stackoverflow.com/questions/20499994/access-window-variable-from-content-script
import type { PlasmoContentScript } from 'plasmo'
import importer from 'url:./importer.ts'

export const config: PlasmoContentScript = {
  // matches: ['<all_urls>'],
  all_frames: true,
  match_about_blank: true,
  run_at: 'document_end',
}

const script = document.createElement('script')
script.src = importer
script.type = 'module'
document.body.appendChild(script)
document.body.removeChild(script)
