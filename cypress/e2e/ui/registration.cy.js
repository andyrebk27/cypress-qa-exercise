/**
 * Test Case: Register User
 * Based on Automation Exercise's own documented Test Case #1.
 * https://automationexercise.com/test_cases (case 1)
 */
describe("UI - User Registration", () => {
  let user;

  before(() => {
    cy.generateTestUser().then((generatedUser) => {
      user = generatedUser;
    });
  });

  it("registers a new user successfully", () => {
    cy.visit("/");

    // Home page loaded
    cy.get(".features_items").should("be.visible");

    // Go to Signup / Login
    cy.get('a[href="/login"]').click();
    cy.url().should("include", "/login");
    cy.contains("New User Signup!").should("be.visible");

    // Step 1: name + email on the login page
    cy.get('input[data-qa="signup-name"]').type(user.name);
    cy.get('input[data-qa="signup-email"]').type(user.email);
    cy.get('button[data-qa="signup-button"]').click();

    // Step 2: full account information form
    cy.contains("ENTER ACCOUNT INFORMATION").should("be.visible");
    cy.fillAccountInformationForm(user);
    cy.get('button[data-qa="create-account"]').click();

    // Step 3: account created confirmation
    cy.get('h2[data-qa="account-created"]').should("be.visible").and("contain", "Account Created!");
    cy.get('a[data-qa="continue-button"]').click();

    // Step 4: logged in as the new user
    cy.contains(`Logged in as ${user.name}`).should("be.visible");

    // Cleanup: delete the account we just created so re-runs stay repeatable
    cy.get('a[href="/delete_account"]').click();
    cy.get('h2[data-qa="account-deleted"]').should("be.visible").and("contain", "Account Deleted!");
  });

  it("shows a validation error when signing up with an email that already exists", () => {
    // Re-uses the email from a fixed, known-existing account to check the
    // "already exists" path. This assumes at least one prior run has created
    // this account, or you can hardcode a known registered email here.
    const existingEmail = Cypress.env("existingUserEmail") || "existing.user@mailinator.com";

    cy.visit("/login");
    cy.get('input[data-qa="signup-name"]').type("Duplicate Test");
    cy.get('input[data-qa="signup-email"]').type(existingEmail);
    cy.get('button[data-qa="signup-button"]').click();

    cy.contains("Email Address already exist!").should("be.visible");
  });
});
