import { USERS } from "../../constants";

describe("create a new product", () => {
  const timeStamp = Date.now();
  const product = {
    name: `my product ${timeStamp}`,
    img: "img/img.sk",
    price: "23",
    description: "this is the best description ever",
  };

  it("should let admin to log in and create a new product which should be visible on main page", () => {
    cy.visit("");

    cy.getBySelector("login-button").click();

    cy.getBySelector("email-input").clear();
    cy.getBySelector("email-input").type(USERS.adminUser.email);

    cy.getBySelector("password-input").clear();
    cy.getBySelector("password-input").type(USERS.adminUser.password);

    cy.getBySelector("login-submit").click();

    cy.getBySelector("menu-account").click();
    cy.getBySelector("menu-account-add-product").click();

    cy.getBySelector("product-name").clear("");
    cy.getBySelector("product-name").type(product.name);

    cy.getBySelector("product-img-url").clear("");
    cy.getBySelector("product-img-url").type(product.img);

    cy.getBySelector("product-price").clear("");
    cy.getBySelector("product-price").type(product.price);

    cy.getBySelector("product-description").clear("");
    cy.getBySelector("product-description").type(product.description);

    cy.getBySelector("add-product-submit").click();

    cy.getBySelector("add-product-success").should("be.visible");

    cy.getBySelector("menu-home").click();

    cy.getBySelector("product-search-input").clear("");
    cy.getBySelector("product-search-input").type(product.name);
    cy.getBySelector("product-search-submit").click();

    cy.getBySelector("card-name").should("have.text", product.name);
  });
});
