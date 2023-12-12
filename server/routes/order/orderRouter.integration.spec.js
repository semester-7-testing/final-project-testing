import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

describe("order router", () => {
  // TODO: finish  this test, you might need to create products with the object ids so you can reference them here
  // further more test that email is email is being called
  // in cypress test also that you will reveive an email and also test that a wrong payment or not enough found will resolvei in a problem on frontend
  // in cypress also add the check for the email

  //   it("should create an order and return 201 status", async () => {

  //     const response = await request(
  //       `http://localhost:${process.env.SERVER_PORT}`
  //     )
  //       .post("/api/products")
  //       .send(product)
  //       .set("Authorization", `Bearer ${token}`);

  //     expect(response.statusCode).toBe(201);
  //     expect(response.body).toEqual({
  //       errors: [],
  //       data: null,
  //     });
  //   });

  it.each([
    [
      "products undefined",
      {
        userId: null,
        products: undefined,
        deliveryAddress: "Test address 6",
        email: "test@test.sk",
      },
    ],
    [
      "products null",
      {
        userId: null,
        products: null,
        deliveryAddress: "Test address 6",
        email: "test@test.sk",
      },
    ],
    [
      "products empty string",
      {
        userId: null,
        products: "",
        deliveryAddress: "Test address 6",
        email: "test@test.sk",
      },
    ],
    [
      "delivery address undefined",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: undefined,
        email: "test@test.sk",
      },
    ],
    [
      "delivery address null",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: null,
        email: "test@test.sk",
      },
    ],
    [
      "delivery address empty string",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "",
        email: "test@test.sk",
      },
    ],
    [
      "email undefined",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "Test address 6",
        email: undefined,
      },
    ],
    [
      "email null",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "Test address 6",
        email: null,
      },
    ],
    [
      "email empty string",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "Test address 6",
        email: "",
      },
    ],
  ])(
    `should prevent order creation if request body is invalid format - case: %s`,
    async (testCase, order) => {
      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .post("/api/order")
        .send(order);

      expect(response.statusCode).toBe(400);
    }
  );

  // did not create a clean up function, as data in mongo gets flushed out in the docker on restart
});
