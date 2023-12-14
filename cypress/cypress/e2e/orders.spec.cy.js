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
  beforeEach(() => {
    cy.task("inbox:deleteAllEmails", {
      inboxUser: INBOX_ACCOUNT.user,
      inboxPassword: INBOX_ACCOUNT.password,
    });
  });

  it.only("should be possible select item, checkout, pay and receive email", () => {
    cy.visit("");
    //TODO: improvce selectors
    cy.get(
      ':nth-child(1) > .card > .bottom > [data-qa="card-details-button"] > .mdc-button__label'
    ).click();
    cy.get(
      '[data-qa="product-quantity-increment"] > .mdc-button__ripple'
    ).click();
    cy.get(".counter > .s--Mi8SbyC3Uev").should("have.text", "1");
    cy.get(
      '[data-qa="product-quantity-increment"] > .mdc-button__ripple'
    ).click();
    cy.get(".counter > .s--Mi8SbyC3Uev").should("have.text", "2");
    cy.get('.counter > [style=""] > .mdc-button__ripple').click();
    cy.get(".counter > .s--Mi8SbyC3Uev").should("have.text", "1");
    cy.get('[data-qa="product-add-to-cart"] > .mdc-button__label').click();
    cy.get(
      ":nth-child(25) > .mdc-snackbar__surface > .mdc-snackbar__label"
    ).should("be.visible");
    cy.get('[data-qa="menu-cart"]').click();
    cy.get(
      '[data-qa="menu-cart-checkout"] > .mdc-deprecated-list-item__text'
    ).click();
    cy.get(".counter > .s-SzyDekJzKA9V").should("have.text", "1");
    cy.get(".subtotal").should("have.text", "Subtotal: 230 €");
    cy.get(":nth-child(3) > .mdc-button__ripple").click();
    cy.get(".counter > .s-SzyDekJzKA9V").should("have.text", "2");
    cy.get(".subtotal").should("have.text", "Subtotal: 460 €");
    cy.get(
      '[style="--mdc-ripple-fg-size: 38px; --mdc-ripple-fg-scale: 2.1955326053353494; --mdc-ripple-fg-translate-start: 20.3143310546875px, 5.2624359130859375px; --mdc-ripple-fg-translate-end: 13px, -1px;"] > .mdc-button__ripple'
    ).click();
    cy.get(".counter > .s-SzyDekJzKA9V").should("have.text", "3");
    cy.get(".subtotal").should("have.text", "Subtotal: 690 €");
    cy.get(
      '[data-qa="checkout-delivery-address"] > .mdc-text-field__input'
    ).clear("T");
    cy.get(
      '[data-qa="checkout-delivery-address"] > .mdc-text-field__input'
    ).type("Test address 4");
    cy.get('[data-qa="checkout-email-address"] > .mdc-text-field__input').clear(
      "t"
    );
    cy.get('[data-qa="checkout-email-address"] > .mdc-text-field__input').type(
      "this@eemail.sk"
    );
    cy.get("form.s-SzyDekJzKA9V > .mdc-button > .mdc-button__ripple").click();
    cy.get(".title").should("have.text", "Payment successful!");
    cy.get(".wrapper > .mdc-button > .mdc-button__ripple").click();
    // TODO: check the email has been received
  });

  it("should throw error if credit card is invalid", () => {
    cy.visit("");
  });

  it("should throw error if the payment has not been processed", () => {
    cy.visit("");
  });
});
