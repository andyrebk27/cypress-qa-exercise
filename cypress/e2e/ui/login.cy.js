/**
 * Test Case: Login User
 * Based on Automation Exercise's own documented Test Case #2 and #3.
 * https://automationexercise.com/test_cases (cases 2 and 3)
 *
 * A fresh account is created via the UI in `before()` so the login test has
 * a guaranteed-valid, non-colliding set of credentials to work with, and is
 * removed again in `after()` to keep the run repeatable.
 */
describe("UI - Login Flow", () => {
  let user;

  before(() => {
    cy.generateTestUser().then((generatedUser) => {
      user = generatedUser;

      cy.visit("/login");
      cy.get('input[data-qa="signup-name"]').type(user.name);
      cy.get('input[data-qa="signup-email"]').type(user.email);
      cy.get('button[data-qa="signup-button"]').click();

      cy.contains("ENTER ACCOUNT INFORMATION").should("be.visible");
      cy.fillAccountInformationForm(user);
      cy.get('button[data-qa="create-account"]').click();

      cy.get('a[data-qa="continue-button"]').click();
      cy.contains(`Logged in as ${user.name}`).should("be.visible");

      // Log back out so the login test starts from a logged-out state
      cy.get('a[href="/logout"]').click();
    });
  });

  after(() => {
    // Log in one more time just to clean up the account we created
    cy.visit("/login");
    cy.get('input[data-qa="login-email"]').type(user.email);
    cy.get('input[data-qa="login-password"]').type(user.password);
    cy.get('button[data-qa="login-button"]').click();
    cy.get('a[href="/delete_account"]').click();
  });

  beforeEach(() => {
    cy.visit("/login");
  });

  it("logs in successfully with a valid, registered email and password", () => {
    cy.contains("Login to your account").should("be.visible");

    cy.get('input[data-qa="login-email"]').type(user.email);
    cy.get('input[data-qa="login-password"]').type(user.password);
    cy.get('button[data-qa="login-button"]').click();

    cy.contains(`Logged in as ${user.name}`).should("be.visible");
    cy.get('a[href="/logout"]').should("be.visible");
  });

  it("shows an error message when the password is incorrect", () => {
    cy.get('input[data-qa="login-email"]').type(user.email);
    cy.get('input[data-qa="login-password"]').type("WrongPassword123!");
    cy.get('button[data-qa="login-button"]').click();

    cy.contains("Your email or password is incorrect!").should("be.visible");
  });

  it("shows an error message when the email is not registered", () => {
    cy.get('input[data-qa="login-email"]').type(`no-such-user-${Date.now()}@mailinator.com`);
    cy.get('input[data-qa="login-password"]').type("SomePassword123!");
    cy.get('button[data-qa="login-button"]').click();

    cy.contains("Your email or password is incorrect!").should("be.visible");
  });
});
