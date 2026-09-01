/**
 * Part 2 — API tests for echo-serv.tbxnet.com QA endpoints.
 * Chosen endpoints: GET /v1/qa/test1 and GET /v1/qa/test2
 *
 * For each endpoint we validate: status code, response time, response body
 * (structure + content), and response headers — plus error handling, since
 * test2 is currently a real, reproducible failure (not a hypothetical one).
 *
 * test1 is the "happy path" endpoint (200, valid payload).
 * test2 is currently broken (500) — see bug_report_test2.docx and
 * results/api-findings.md. It's kept here as a documented regression test:
 * once the bug is fixed, this test will fail loudly, which is the signal to
 * rewrite it to assert the real success payload instead.
 */

const MAX_ACCEPTABLE_RESPONSE_TIME_MS = 3000; // per exercise requirements

describe("API - GET /v1/qa/test1", () => {
  it("responds with 200 within an acceptable time", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiBaseUrl")}/v1/qa/test1`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.duration).to.be.lessThan(MAX_ACCEPTABLE_RESPONSE_TIME_MS);
    });
  });

  it("returns the expected response body structure and content", () => {
    cy.request("GET", `${Cypress.env("apiBaseUrl")}/v1/qa/test1`).then((response) => {
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.all.keys("ok", "date");
      expect(response.body.ok).to.eq(true);

      // "date" must be a valid ISO 8601 timestamp, and reasonably "now"
      const returnedDate = new Date(response.body.date);
      expect(returnedDate.toString()).to.not.eq("Invalid Date");

      const diffMs = Math.abs(Date.now() - returnedDate.getTime());
      expect(diffMs).to.be.lessThan(5 * 60 * 1000); // within 5 minutes of "now"
    });
  });

  it("returns headers a client can rely on (content-type, content-length, date)", () => {
    cy.request("GET", `${Cypress.env("apiBaseUrl")}/v1/qa/test1`).then((response) => {
      expect(response.headers).to.have.property("content-type");
      expect(response.headers["content-type"]).to.include("application/json");

      // content-length should be present and match the actual body size
      expect(response.headers).to.have.property("content-length");
      const declaredLength = Number(response.headers["content-length"]);
      const actualLength = new TextEncoder().encode(JSON.stringify(response.body)).length;
      expect(declaredLength).to.be.closeTo(actualLength, 2); // small slack for whitespace differences

      expect(response.headers).to.have.property("date");
    });
  });

  it("returns a fresh timestamp on every call (not a cached/static value)", () => {
    cy.request("GET", `${Cypress.env("apiBaseUrl")}/v1/qa/test1`).then((first) => {
      cy.wait(1100); // ensure at least 1 full second passes
      cy.request("GET", `${Cypress.env("apiBaseUrl")}/v1/qa/test1`).then((second) => {
        expect(second.body.date).to.not.eq(first.body.date);
      });
    });
  });
});

describe("API - GET /v1/qa/test2", () => {
  // KNOWN BUG — documented in bug_report_test2.docx and results/api-findings.md.
  // As of this writing, this endpoint fails with a 500 Internal Server Error.
  // failOnStatusCode: false lets us assert on the error response instead of
  // Cypress auto-failing the test on a non-2xx status — this is the
  // "handle errors appropriately" requirement in practice.
  it("currently fails with a 500 (regression test for a known, reproducible bug)", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiBaseUrl")}/v1/qa/test2`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.duration).to.be.lessThan(MAX_ACCEPTABLE_RESPONSE_TIME_MS);
    });
  });

  it("still returns a structured, well-formed error body (not an empty/broken response)", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiBaseUrl")}/v1/qa/test2`,
      failOnStatusCode: false,
    }).then((response) => {
      // Even though this is a failure, a well-behaved API should still return
      // a predictable, parseable error shape — worth asserting on its own.
      expect(response.headers["content-type"]).to.include("application/json");
      expect(response.body).to.have.all.keys("code", "message", "details", "status");
      expect(response.body.code).to.eq("SYS-ERR");
      expect(response.body.status).to.eq(500);
    });
  });
});