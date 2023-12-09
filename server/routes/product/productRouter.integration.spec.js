import request from "supertest";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

describe("product router", () => {
  const productData = {
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
      .send(productData)
      .set("Content-Type", "application/json")
      .set("Content-Length", JSON.stringify(productData).length)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      errors: [],
      data: null,
    });
  });

  it("should prevent create a product if not admin", async () => {
    const user = { email: "test@test.sk", isAdmin: false };
    const token = JWT.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    )
      .post("/api/products")
      .send(productData)
      .set("Content-Type", "application/json")
      .set("Content-Length", JSON.stringify(productData).length)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
  });

  // did not create a clean up function, as data in mongo gets flushed out in the docker on restart
});
