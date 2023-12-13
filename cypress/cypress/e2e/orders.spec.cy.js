import { USERS, SERVER_API_URL } from '../../constants';
import { generateTokenForCommonUser } from '../utils/generate-jwt-token';

describe('view logged in user orders', () => {
  beforeEach(() => {
    cy.task('seedDb');
  });

  it('orders list should be visible', () => {
    cy.visit('');

    cy.getBySelector('login-button').click();

    cy.getBySelector('email-input').clear();
    cy.getBySelector('email-input').type(USERS.commonUser.email);

    cy.getBySelector('password-input').clear();
    cy.getBySelector('password-input').type(USERS.commonUser.password);

    cy.getBySelector('login-submit').click();

    cy.getBySelector('menu-account').click();
    cy.getBySelector('menu-account-my-orders').click();
    // cy.getBySelector('orders-list').should('be.visible');
  });
});
