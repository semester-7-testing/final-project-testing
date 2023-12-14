import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

describe("checkout", () => {
  it.each([{ amount: 40 }, { amount: 80 }])(
    "should return new stripe client session when request body is valid",
    async (requestBody) => {
      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .post("/api/checkout")
        .send(requestBody);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.clientSecret).not.toBe(null);
    }
  );

  it.each([
    { amount: 39.99 },
    { amount: 39.98 },
    { amount: 0 },
    { amount: -15 },
    { amount: null },
    { amount: undefined },
    { amount: "" },
  ])(
    "should return bad request, if the request body is not valid",
    async (requestBody) => {
      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .post("/api/checkout")
        .send(requestBody);

      expect(response.statusCode).toBe(400);
    }
  );
});
