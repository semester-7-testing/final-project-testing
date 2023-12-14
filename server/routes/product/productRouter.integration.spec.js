import request from "supertest";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

describe("product router", () => {
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
  // did not create a clean up function, as data in mongo gets flushed out in the docker on restart
});

describe("product router validations", () => {
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
