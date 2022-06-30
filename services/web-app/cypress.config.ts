import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://127.0.0.1:3000',
  },
})
