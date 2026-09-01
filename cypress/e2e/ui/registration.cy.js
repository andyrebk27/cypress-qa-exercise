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
 
  after(() => {
    // Clean up once both tests are done: log back in as the user we
    // created and delete the account, so re-running this spec doesn't
    // collide with "email already exists" on the next run.
    cy.visit("/login");
    cy.get('input[data-qa="login-email"]').type(user.email);
    cy.get('input[data-qa="login-password"]').type(user.password);
    cy.get('button[data-qa="login-button"]').click();
    cy.get('a[href="/delete_account"]').click();
    cy.get('h2[data-qa="account-deleted"]').should("be.visible");
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
 
    // Step 2: full account information form.
    // Extra timeout here: the redirect to /signup occasionally takes a
    // bit longer than the default, especially on the very first page
    // load of the run (ad scripts on the page can add delay).
    cy.url({ timeout: 15000 }).should("include", "/signup");
    cy.contains("Enter Account Information", { timeout: 15000 }).should("be.visible");
 
    cy.fillAccountInformationForm(user);
    cy.get('button[data-qa="create-account"]').click();
 
    // Step 3: account created confirmation
    cy.get('h2[data-qa="account-created"]').should("be.visible").and("contain", "Account Created!");
    cy.get('a[data-qa="continue-button"]').click();
 
    // Step 4: logged in as the new user
    cy.contains(`Logged in as ${user.name}`).should("be.visible");
 
    // Log back out; the after() hook logs back in later to clean up.
    cy.get('a[href="/logout"]').click();
  });
 
  it("shows a validation error when signing up again with the same (now registered) email", () => {
    // Reuses the exact email the previous test just registered, so this
    // is guaranteed to actually be a duplicate — no assumptions needed.
    cy.visit("/login");
    cy.get('input[data-qa="signup-name"]').type("Duplicate Test");
    cy.get('input[data-qa="signup-email"]').type(user.email);
    cy.get('button[data-qa="signup-button"]').click();
 
    cy.contains("Email Address already exist!").should("be.visible");
  });
});