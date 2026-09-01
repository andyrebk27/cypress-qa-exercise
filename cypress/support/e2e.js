import "./commands";

// Automation Exercise occasionally injects ads/scripts that throw uncaught
// exceptions unrelated to our tests (e.g. third-party ad scripts). We don't
// want those to fail our assertions, so we swallow them here.
Cypress.on("uncaught:exception", () => {
  return false;
});
