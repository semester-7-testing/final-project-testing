import { USERS } from "../../constants";

describe("create a new product", () => {
  const timeStamp = Date.now();
  const product = {
    name: `my product ${timeStamp}`,
    img: "img/img.sk",
    price: "60",
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

  it("should not let common user create a new product", () => {
    cy.visit("");

    cy.getBySelector("login-button").click();

    cy.getBySelector("email-input").clear();
    cy.getBySelector("email-input").type(USERS.commonUser.email);

    cy.getBySelector("password-input").clear();
    cy.getBySelector("password-input").type(USERS.commonUser.password);

    cy.getBySelector("login-submit").click();

    cy.getBySelector("menu-account").click();
    cy.getBySelector("menu-account-add-product").should("not.exist");

    cy.visit("/add-product");
    console.log(cy.url());
    cy.url().should("eq", "http://localhost:3000/"); // /add-product is not accessible for common user
  });
});

describe("filter products", () => {
  it("should filter products by name", () => {
    cy.visit("");

    const input = cy.getBySelector("product-search-input").get("input");
    input.clear();
    input.type("adidas");

    cy.getBySelector("product-search-submit").click();

    // check if all cards contain "adidas" in name
    cy.getBySelector("card-name").each(card => {
      expect(card.text().toLowerCase()).to.contain("adidas");
    });
  });

  it("should filter products by price in ascending order", () => {
    cy.visit("");

    cy.get('.price-order-button').first().click();
    cy.get('.asc-button').click();
    
    let last_price = 0;
    cy.getBySelector("card-price").each(card => {
      const price = Number.parseFloat(card.text().replace(" €", ""));
      expect(price).to.be.gte(last_price);
      last_price = price;
    });
  });

  it("should filter products by price in descending order", () => {
    cy.visit("");

    cy.get('.price-order-button').first().click();
    cy.get('.desc-button').click();
    
    let last_price = Number.POSITIVE_INFINITY;
    cy.getBySelector("card-price").each(card => {
      const price = Number.parseFloat(card.text().replace(" €", ""));
      expect(price).to.be.lte(last_price);
      last_price = price;
    });
  });
});
