import request from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../../models/product.js";
import Order from "../../models/order.js";

dotenv.config();

describe("order router", () => {
  let productDoc;

  const seedDb = async () => {
    productDoc = await Product.create({
      name: "The best nike shoes",
      description: "You need to buy them!",
      price: 1,
      imgUrl: "test://test.sk",
    });
  };

  beforeAll(() => {
    mongoose.set("strictQuery", true).connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await seedDb();
  });

  afterEach(async () => {
    await Product.deleteOne({ _id: productDoc._id });
    await Order.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create an order and return 201 status", async () => {
    const order = {
      userId: null,
      products: [{ productId: productDoc._id, quantity: 1 }],
      deliveryAddress: "Test address 6",
      email: "test@test.sk",
    };

    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    )
      .post("/api/order")
      .send(order);

    expect(response.statusCode).toBe(201);
    expect(response.body.data.order._id).toEqual(expect.any(String));
  });
});

describe("order router validations", () => {
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
      "delivery address legth less than 5",
      {
        userId: "1234",
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "1234",
        email: "test@test.sk",
      },
    ],
    [
      "delivery address legth less than 5 with empty spaces",
      {
        userId: "1234",
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "1234 ",
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
    [
      "invalid email format",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "Test address 6",
        email: "em@",
      },
    ],
    [
      "invalid email format",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "Test address 6",
        email: "em@a",
      },
    ],
    [
      "invalid email format",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "Test address 6",
        email: "@a.sk",
      },
    ],
    [
      "invalid email format",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "Test address 6",
        email: "aa.sk",
      },
    ],
    [
      "invalid email format",
      {
        userId: null,
        products: [{ productId: "123", quantity: 1 }],
        deliveryAddress: "Test address 6",
        email: "@",
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
});
