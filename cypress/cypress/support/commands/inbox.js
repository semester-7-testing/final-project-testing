import { recurse } from "cypress-recurse";

Cypress.Commands.add("getLastEmail", (inboxUser, inboxPassword) => {
  const timeoutInMs = 30_000;
  const retryInMs = 5_000;

  return recurse(
    () => cy.task("inbox:getLastEmail", { inboxUser, inboxPassword }),
    Cypress._.isObject, // keeps retrying until the task returns an object
    {
      timeout: timeoutInMs,
      delay: retryInMs,
    }
  ).then((result) => {
    return result;
  });
});

Cypress.Commands.add("displayHtml", (html) => {
  cy.document().then((document) => {
    document.documentElement.innerHTML = html;
  });
});
