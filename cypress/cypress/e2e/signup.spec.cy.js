describe('Signup', () => {});

it('Should create a new user', () => {
  cy.visit('');
  cy.get('.rightMenu > .mdc-button > .mdc-button__ripple').click();
  cy.get('p > a').click();
  cy.get(':nth-child(1) > .mdc-text-field__input').click();
  cy.get('.mdc-text-field--label-floating > .mdc-text-field__input').clear();
  cy.get('.mdc-text-field--label-floating > .mdc-text-field__input').type(
    'TestUser'
  );
  cy.get('.mdc-text-field--focused > .mdc-text-field__input').clear();
  cy.get('.mdc-text-field--focused > .mdc-text-field__input').type('Test123');
  cy.get('.svelte-fb1i2w > .mdc-button > .mdc-button__label').click();
  cy.get('.rightMenu > :nth-child(2)').click();
  cy.get(
    '.mdc-menu-surface--open > .mdc-deprecated-list > :nth-child(1) > .mdc-deprecated-list-item__text'
  ).click();
});
