describe('Authentication', () => {
  before(() => {
    cy.clearDB();
  });

  it('Should create a new user', () => {
    const newUser = {
      name: 'TestUser',
      email: 'test123@example.com',
      password: 'password',
    };

    cy.visit('');

    cy.getBySelector('login-button').click();
    cy.get('p > a').click();

    cy.getBySelector('userName-input').click();
    cy.getBySelector('userName-input').clear();
    cy.getBySelector('userName-input').type(newUser.name);

    cy.getBySelector('email-input').click();
    cy.getBySelector('email-input').clear();
    cy.getBySelector('email-input').type(newUser.email);

    cy.getBySelector('password-input').click();
    cy.getBySelector('password-input').clear();
    cy.getBySelector('password-input').type(newUser.password);

    cy.getBySelector('signup-button').click();
    cy.getBySelector('userName-text').should('have.text', newUser.name);
    cy.getBySelector('menu-account').should('be.visible');
  });

  it('Should login and logout', () => {
    const loginUser = {
      email: 'test123@example.com',
      password: 'password',
      name: 'TestUser',
    };

    cy.visit('');

    cy.getBySelector('login-button').click();

    cy.getBySelector('email-input').click();
    cy.getBySelector('email-input').clear();
    cy.getBySelector('email-input').type(loginUser.email);

    cy.getBySelector('password-input').click();
    cy.getBySelector('password-input').clear();
    cy.getBySelector('password-input').type(loginUser.password);

    cy.getBySelector('login-submit').click();
    cy.getBySelector('userName-text').should('have.text', loginUser.name);
    cy.getBySelector('menu-account').should('be.visible');

    cy.getBySelector('menu-account').click();
    cy.getBySelector('menu-account-logout').click();

    cy.getBySelector('login-button').should('be.visible');
  });
});
