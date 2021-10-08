// @ts-check
const { defineConfig } = require('@norm/cli')

module.exports = defineConfig({
  mode: 'web-extension',
  manifest: {
    manifest_version: 3,
    name: '__MSG_appName__',
    version: '1.4.0',
    description: '__MSG_appDescription__',
    homepage_url: 'https://github.com/pd4d10/console-importer',
    icons: {
      128: 'images/icon.png',
    },
    default_locale: 'en',
    content_scripts: [
      {
        matches: ['<all_urls>'],
        all_frames: true,
        match_about_blank: true,
        js: ['/src/contentscript.js'],
        run_at: 'document_end',
      },
    ],
    web_accessible_resources: [
      {
        matches: ['<all_urls>'],
        resources: ['assets/*.js'],
      },
    ],
  },
  vite: {
    build: {
      rollupOptions: {
        input: ['src/importer.js'],
        output: {
          entryFileNames: 'assets/[name].js',
        },
      },
    },
  },
})
