import { defineConfig } from 'vite'
import webExtension from '@vite-preset/web-extension'

export default defineConfig({
  build: {
    rollupOptions: {
      input: ['src/importer.ts'],
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  plugins: [
    webExtension({
      manifest: {
        manifest_version: 3,
        name: '__MSG_appName__',
        version: '2.1.0',
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
            js: ['/src/content-script.ts'],
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
    }),
  ],
})
