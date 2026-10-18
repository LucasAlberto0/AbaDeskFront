import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 10000,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',
    supportFile: 'cypress/support/e2e.js',
  },
});
