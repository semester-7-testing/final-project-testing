Cypress.Commands.addQuery(
  'getBySelector',
  function getBySel(selectorName, options = {}) {
    const getFn = cy.now('get', `[data-qa=${selectorName}]`, options);
    return () => getFn();
  }
);

Cypress.Commands.add('clearDB', () => {
  cy.task('clearDB');
});
