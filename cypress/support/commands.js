/**
 * Builds a unique, valid user payload so the registration test can be
 * re-run repeatedly without colliding with "email already exists" errors.
 */
Cypress.Commands.add("generateTestUser", () => {
  const unique = Date.now();
  return {
    name: `QA Test User ${unique}`,
    email: `qa.cypress.${unique}@mailinator.com`,
    password: "P@ssw0rd123!",
    title: "Mr",
    day: "10",
    month: "May",
    year: "1995",
    firstName: "QA",
    lastName: `Tester${unique}`,
    company: "Test Company",
    address1: "123 Automation St",
    address2: "Suite 4",
    country: "United States",
    state: "California",
    city: "Los Angeles",
    zipcode: "90001",
    mobileNumber: "5551234567",
  };
});

/**
 * Fills the "ENTER ACCOUNT INFORMATION" form shown right after submitting
 * the initial Signup (name + email) form.
 */
Cypress.Commands.add("fillAccountInformationForm", (user) => {
  cy.get("#id_gender1").check({ force: true }); // Mr
  cy.get("#password").type(user.password);
  cy.get("#days").select(user.day);
  cy.get("#months").select(user.month);
  cy.get("#years").select(user.year);
  cy.get("#newsletter").check({ force: true });
  cy.get("#optin").check({ force: true });
  cy.get("#first_name").type(user.firstName);
  cy.get("#last_name").type(user.lastName);
  cy.get("#company").type(user.company);
  cy.get("#address1").type(user.address1);
  cy.get("#address2").type(user.address2);
  cy.get("#country").select(user.country);
  cy.get("#state").type(user.state);
  cy.get("#city").type(user.city);
  cy.get("#zipcode").type(user.zipcode);
  cy.get("#mobile_number").type(user.mobileNumber);
});
