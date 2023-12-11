import { USERS } from "../../constants";

describe("view logged in user orders", () => {
  it("passes", () => {
    cy.visit("");

    cy.getBySelector("login-button").click();

    cy.getBySelector("email-input").clear();
    cy.getBySelector("email-input").type(USERS.commonUser.email);

    cy.getBySelector("password-input").clear();
    cy.getBySelector("password-input").type(USERS.commonUser.password);

    cy.getBySelector("login-submit").click();
    cy.get(
      ':nth-child(1) > .card > .bottom > [data-qa="card-details-button"] > .mdc-button__label'
    ).click();

    cy.getBySelector("product-quantity-increment").click();
    cy.getBySelector("product-add-to-cart").click();
    cy.getBySelector("menu-account").click();
    cy.getBySelector("menu-account-my-orders").click();
    cy.getBySelector("orders-list").should("be.visible");
  });
});
