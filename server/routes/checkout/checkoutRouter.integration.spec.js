import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

describe("checkout", () => {
  it("should return new stripe client session when request body is valid", async () => {
    const requestBody = {
      amount: 1000,
    };

    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    )
      .post("/api/checkout")
      .send(requestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.clientSecret).not.toBe(null);
  });

  it("should return bad request, if the request body is not valid", async () => {
    const requestBody = {};

    const response = await request(
      `http://localhost:${process.env.SERVER_PORT}`
    )
      .post("/api/checkout")
      .send(requestBody);

    expect(response.statusCode).toBe(400);
  });
});
