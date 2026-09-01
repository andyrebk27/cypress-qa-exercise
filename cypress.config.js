const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://automationexercise.com",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    env: {
      apiBaseUrl: "https://echo-serv.tbxnet.com",
    },
    setupNodeEvents(on, config) {
      // no plugins needed for this exercise
      return config;
    },
  },
});
