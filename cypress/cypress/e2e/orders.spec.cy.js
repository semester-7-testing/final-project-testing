import { generateTokenForCommonUser } from "../utils/generate-jwt-token";
import { USERS, SERVER_API_URL, INBOX_ACCOUNT } from "../../constants";

describe("view logged in user orders", () => {
  beforeEach(() => {
    cy.task("seedDb");
  });

  it("orders list should be visible", () => {
    cy.visit("");

    cy.getBySelector("login-button").click();

    cy.getBySelector("email-input").clear();
    cy.getBySelector("email-input").type(USERS.commonUser.email);

    cy.getBySelector("password-input").clear();
    cy.getBySelector("password-input").type(USERS.commonUser.password);

    cy.getBySelector("login-submit").click();

    cy.getBySelector("menu-account").click();
    cy.getBySelector("menu-account-my-orders").click();
    cy.getBySelector("orders-list").should("be.visible");
  });
});

describe("place an order", () => {
  const deliveryAddress = "Test address 1";

  beforeEach(() => {
    cy.task("inbox:deleteAllEmails", {
      inboxUser: INBOX_ACCOUNT.user,
      inboxPassword: INBOX_ACCOUNT.password,
    });
  });

  it("should be possible select item, checkout, pay and receive email", () => {
    cy.visit("");

    cy.getBySelector("card-details-button").first().click();

    cy.getBySelector("product-quantity-increment").click();
    cy.getBySelector("product-quantity-counter").should("have.text", "1");

    cy.getBySelector("product-quantity-increment").click();
    cy.getBySelector("product-quantity-counter").should("have.text", "2");

    cy.getBySelector("product-quantity-decrement").click();
    cy.getBySelector("product-quantity-counter").should("have.text", "1");

    cy.getBySelector("product-add-to-cart").click();

    cy.getBySelector("product-added-to-cart-snackbar").should("be.visible");

    cy.getBySelector("menu-cart").click();
    cy.getBySelector("menu-cart-checkout").click();

    cy.getBySelector("product-quantity-counter").should("have.text", "1");
    cy.getBySelector("checkout-subtotal").should(
      "have.text",
      "Subtotal: 230 €"
    );

    cy.getBySelector("product-quantity-increment").click();
    cy.getBySelector("product-quantity-counter").should("have.text", "2");
    cy.getBySelector("checkout-subtotal").should(
      "have.text",
      "Subtotal: 460 €"
    );

    cy.getBySelector("product-quantity-increment").click();
    cy.getBySelector("product-quantity-counter").should("have.text", "3");
    cy.getBySelector("checkout-subtotal").should(
      "have.text",
      "Subtotal: 690 €"
    );

    cy.getBySelector("checkout-delivery-address").click();
    cy.getBySelector("checkout-delivery-address").clear();
    cy.getBySelector("checkout-delivery-address").type(deliveryAddress);

    cy.getBySelector("checkout-email-address").click();
    cy.getBySelector("checkout-email-address").clear();
    cy.getBySelector("checkout-email-address").type(USERS.commonUser.email);
    // logic for stripe payment

    // cy.getBySelector("checkout-pay-button").click();

    // cy.getBySelector("payment-successful-title").should(
    //   "have.text",
    //   "Payment successful!"
    // );
    // cy.getBySelector("go-to-home-button").click();

    // cy.url().should("eq", `${Cypress.config().baseUrl}/`);

    // check the email has been received
  });
});
