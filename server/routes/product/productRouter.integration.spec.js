import request from "supertest";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

describe("product router", () => {
  const product = {
    name: "The best nike shoes",
    description: "You need to buy them!",
    price: 1,
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
      "description undefined",
      {
        name: "The best nike shoes",
        description: undefined,
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
      "iumgUrl undefined",
      {
        name: "The best nike shoes",
        description: "You need to buy them!",
        price: 1,
        imgUrl: undefined,
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

  // did not create a clean up function, as data in mongo gets flushed out in the docker on restart
});
