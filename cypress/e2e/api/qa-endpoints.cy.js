/**
 * API tests for echo-serv.tbxnet.com QA endpoints.
 * Chosen endpoints: GET /v1/qa/test1 and GET /v1/qa/test2
 *
 * test1 is the "happy path" endpoint (200, valid payload).
 * test2 is currently broken (500) — see bug_report_test2.docx. It's kept
 * here as a documented regression test: it should start failing loudly
 * the day the endpoint is fixed, which is the signal to update this test
 * to assert the real success payload instead.
 */

const MAX_ACCEPTABLE_RESPONSE_TIME_MS = 2000;

describe("API - GET /v1/qa/test1", () => {
  it("responds with 200 and a well-formed payload within an acceptable time", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiBaseUrl")}/v1/qa/test1`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.duration).to.be.lessThan(MAX_ACCEPTABLE_RESPONSE_TIME_MS);

      expect(response.headers).to.have.property("content-type");
      expect(response.headers["content-type"]).to.include("application/json");

      expect(response.body).to.have.property("ok", true);
      expect(response.body).to.have.property("date");

      // "date" must be a valid ISO 8601 timestamp, and reasonably "now"
      const returnedDate = new Date(response.body.date);
      expect(returnedDate.toString()).to.not.eq("Invalid Date");

      const diffMs = Math.abs(Date.now() - returnedDate.getTime());
      expect(diffMs).to.be.lessThan(5 * 60 * 1000); // within 5 minutes of "now"
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
  // KNOWN BUG — documented in bug_report_test2.docx.
  // As of this writing, this endpoint fails with a 500 Internal Server
  // Error instead of returning a successful payload. This test intentionally
  // asserts the *current, broken* behavior so the suite stays green; once the
  // bug is fixed, this test will fail and must be rewritten to assert the
  // real success response (mirroring the test1 assertions above).
  it("currently fails with a 500 Internal Server Error (regression test for known bug)", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiBaseUrl")}/v1/qa/test2`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      expect(response.duration).to.be.lessThan(MAX_ACCEPTABLE_RESPONSE_TIME_MS);
    });
  });
});
