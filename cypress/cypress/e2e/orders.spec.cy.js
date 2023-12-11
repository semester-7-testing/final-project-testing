import { USERS, SERVER_API_URL } from '../../constants';

describe('view logged in user orders', () => {
  beforeEach(() => {
    cy.visit('');

    cy.getBySelector('login-button').click();

    cy.getBySelector('email-input').clear();
    cy.getBySelector('email-input').type(USERS.commonUser.email);

    cy.getBySelector('password-input').clear();
    cy.getBySelector('password-input').type(USERS.commonUser.password);

    cy.getBySelector('login-submit').click();

    cy.wait(1000);
    const token = sessionStorage.getItem('token');

    const requestBody = {
      userId: 'testUserId',
      products: [
        {
          productId: '123',
          quantity: 2,
        },
      ],
      deliveryAddress: 'testAddress',
      status: 'testStatus',
      email: USERS.commonUser.email,
    };

    cy.request({
      method: 'POST',
      url: `${SERVER_API_URL}/order`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: requestBody,
    }).then(() => {
      console.log('order created');
      return 0;
    });

    cy.wait(3000);
  });

  it('orders list should be visible', () => {
    cy.getBySelector('menu-account').click();
    cy.getBySelector('menu-account-my-orders').click();
    cy.getBySelector('orders-list').should('be.visible');
  });
});
