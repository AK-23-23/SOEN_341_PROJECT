import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false, // if you don't need a support file
    specPattern: 'react-app/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
