import request from "supertest";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

describe("product router [POST]", () => {
  const product = {
    name: "The best nike shoes",
    description: "You need to buy them!",
    price: 40,
    imgUrl: "test://test.sk",
  };

  it("should create a product and return 201 status", async () => {
    const user = { email: "test@test.sk", isAdmin: true };
    const token = JWT.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    )
      .post("/api/products")
      .send(product)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      errors: [],
      data: null,
    });
  });

  it("should prevent product creation if not admin", async () => {
    const user = { email: "test@test.sk", isAdmin: false };
    const token = JWT.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    )
      .post("/api/products")
      .send(product)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
  });

  it("should prevent product creation if not authenticated", async () => {
    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    ).post("/api/products").send(product);

    expect(response.statusCode).toBe(403);
  });

  // did not create a clean up function, as data in mongo gets flushed out in the docker on restart
});

describe("product router validations [POST]", () => {
  it.each([
    [
      "name undefined",
      {
        name: undefined,
        description: "You need to buy them!",
        price: 1,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "name null",
      {
        name: null,
        description: "You need to buy them!",
        price: 1,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "name empty string",
      {
        name: "",
        description: "You need to buy them!",
        price: 1,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "name too short",
      {
        name: "a",
        description: "You need to buy them!",
        price: 1,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "description undefined",
      {
        name: "The best nike shoes",
        description: undefined,
        price: 1,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "description null",
      {
        name: "The best nike shoes",
        description: null,
        price: 1,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "description empty string",
      {
        name: "The best nike shoes",
        description: "",
        price: 1,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "price undefined",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: undefined,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "price null",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: null,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "price empty string",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: "",
        imgUrl: "test://test.sk",
      },
    ],
    [
      "price under 40",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: 39.99,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "price under 40",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: 15,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "price under 40",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: 0,
        imgUrl: "test://test.sk",
      },
    ],
    [
      "iumgUrl undefined",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: 1,
        imgUrl: undefined,
      },
    ],
    [
      "iumgUrl null",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: 1,
        imgUrl: null,
      },
    ],
    [
      "iumgUrl empty string",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: 1,
        imgUrl: "",
      },
    ],
    [
      "price NaN",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: "2c",
        imgUrl: "test://test.sk",
      },
    ],
  ])(
    `should prevent product creation if request body is invalid format - case: %s`,
    async (testCase, product) => {
      const user = { email: "test@test.sk", isAdmin: true };
      const token = JWT.sign(user, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .post("/api/products")
        .send(product)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(400);
    }
  );
});

describe("product router [GET]", () => {
  it("should return a list of products", async () => {
    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    ).get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("products");
    expect(response.body.data.products).toBeInstanceOf(Array);
    expect(response.body.data.products.length).toBe(12); // default limit
    expect(response.body.data.totalCount).toBeGreaterThan(0);
  });

  it("should sort products by price in ascending order", async () => {
    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    ).get("/api/products?priceOrder=ASC"); // must be uppercase

    const { products } = response.body.data;
    expect(products.length).toBeGreaterThan(1); // at least 2 products

    // check if products are sorted by price in ascending order
    let last_price = Number.POSITIVE_INFINITY;
    let product;
    while (product = products.pop()) {
      expect(product.price).toBeLessThanOrEqual(last_price);
      last_price = product.price;
    }
  });

  it("should sort products by price in descending order", async () => {
    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    ).get("/api/products?priceOrder=DESC"); // must be uppercase

    const { products } = response.body.data;
    expect(products.length).toBeGreaterThan(1); // at least 2 products

    // check if products are sorted by price in descending order
    let last_price = 0;
    let product;
    while (product = products.pop()) {
      expect(product.price).toBeGreaterThanOrEqual(last_price);
      last_price = product.price;
    }
  });

  it("should return a list of products matching search text", async () => {
    const adidasResponse = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    ).get("/api/products?searchText=adidas");


    const { products } = adidasResponse.body.data;
    expect(products.length).toBeGreaterThan(0);
    
    // check if products match search text
    for (const product of products) {
      expect(product.name.toLowerCase()).toContain("adidas");
    }
  });

  it("should return an empty list of products if no match", async () => {
    const emptyResponse = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    ).get("/api/products?searchText=schwarzeneggerShoesWithLaces");

    expect(emptyResponse.body.data.products.length).toBe(0);
  });

  it.each([
    [
      "limit: invalid upper bound",
      {q: 'limit=-1'}
    ],
    [
      "limit: invalid upper bound",
      {q: 'limit=-2'}
    ],
    [
      "limit: invalid upper bound",
      {q: 'limit=-3'}
    ],
    [
      "limit: invalid value",
      {q: 'limit=-9999'}
    ],
    [
      "limit: NaN value",
      {q: 'limit=BobJohnson'}
    ],
    [
      "page: invalid upper bound",
      {q: 'page=0'}
    ],
    [
      "page: invalid upper bound",
      {q: 'page=-1'}
    ],
    [
      "page: invalid upper bound",
      {q: 'page=-2'}
    ],
    [
      "page: invalid value",
      {q: 'page=-9999'}
    ],
    [
      "page: NaN value",
      {q: 'page=BobJohnson'}
    ],
    [
      "priceOrder: invalid value",
      {q: 'priceOrder=asc'}
    ],
    [
      "priceOrder: invalid value",
      {q: 'priceOrder=desc'}
    ],
    [
      "priceOrder: invalid value",
      {q: 'priceOrder=BobJohnson'}
    ],
  ])("should return 400 if query params are invalid. case: %s", async (_, params) => {
    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    ).get(`/api/products?${params.q}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});