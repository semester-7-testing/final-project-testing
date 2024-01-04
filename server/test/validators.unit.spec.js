import request from "supertest";
import express from "express";
import authRouter from "../routes/auth/authRouter.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use(authRouter);

const mockUser = {
  email: "user@example.com",
  password: "password",
  name: "user",
  isAdmin: false,
};

jest.mock("../routes/functions.js", () => ({
  respondWithUser: jest.fn((res) => {
    return res.status(201).json(mockUser);
  }),
}));

jest.mock("../models/user.js", () => ({
  findOne: jest.fn(() => Promise.resolve(null)),
  create: jest.fn(() => Promise.resolve(mockUser)),
}));

jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

describe("Validators ", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  // boundary value tests
  // PARTITIONING
  it("on signup it should return message error if the name is less than 2 letters", async () => {
    // ARRANGE
    const postData = {
      name: "a",
      email: "test@gmail.com",
      password: "test1234",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.body.errors[0].msg).toBe(
      "The name should be between 2-15 characters long"
    );
    expect(response.statusCode).toBe(400);
  });

  it("on signup it should pass if the name is 2 letters", async () => {
    // ARRANGE
    const postData = {
      name: "te",
      email: "test@gmail.com",
      password: "test1234",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on signup it should pass if the name is 3 letters", async () => {
    // ARRANGE
    const postData = {
      name: "tes",
      email: "test@gmail.com",
      password: "test1234",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on signup it should pass if the name is 14 letters", async () => {
    // ARRANGE
    const postData = {
      name: "test1234567890",
      email: "test@gmail.com",
      password: "test1234",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on signup it should pass if the name is 15 chars", async () => {
    // ARRANGE
    const postData = {
      name: "test12345678901",
      email: "test@gmail.com",
      password: "test1234",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on signup it should return an error if the name is 16 chars", async () => {
    // ARRANGE
    const postData = {
      name: "test123456789012",
      email: "test@gmail.com",
      password: "test1234",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.body.errors[0].msg).toBe(
      "The name should be between 2-15 characters long"
    );
    expect(response.statusCode).toBe(400);
  });

  it("on signup it should return an error if the email is not valid", async () => {
    // ARRANGE
    const postData = {
      name: "test123",
      email: "test.gmail.com",
      password: "test1234",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.body.errors[0].msg).toBe("The email is invalid");
    expect(response.statusCode).toBe(400);
  });

  // PARTITIONING
  it("on signup it should return message error if the password is less than 5 chars", async () => {
    // ARRANGE
    const postData = {
      name: "test123",
      email: "test@gmail.com",
      password: "test",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.body.errors[0].msg).toBe(
      "The password should be between 5-20 characters long"
    );
    expect(response.statusCode).toBe(400);
  });

  it("on signup it should pass if the password is 5 chars", async () => {
    // ARRANGE
    const postData = {
      name: "te",
      email: "test@gmail.com",
      password: "test1",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on signup it should pass if the password is 6 chars", async () => {
    // ARRANGE
    const postData = {
      name: "tes",
      email: "test@gmail.com",
      password: "test12",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on signup it should pass if the password is 19 letters", async () => {
    // ARRANGE
    const postData = {
      name: "test1234567890",
      email: "test@gmail.com",
      password: "testPassword1234567",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on signup it should pass if the password is 20 chars", async () => {
    // ARRANGE
    const postData = {
      name: "test12345678901",
      email: "test@gmail.com",
      password: "testPassword12345678",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on signup it should return an error if the password is 21 chars", async () => {
    // ARRANGE
    const postData = {
      name: "test1234",
      email: "test@gmail.com",
      password: "testPassword123456789",
    };

    // ACT
    const response = await request(app)
      .post("/signup")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.body.errors[0].msg).toBe(
      "The password should be between 5-20 characters long"
    );
    expect(response.statusCode).toBe(400);
  });

  it("on login it should return message error if the password is less than 5 chars", async () => {
    // ARRANGE
    const postData = {
      name: "test123",
      email: "test@gmail.com",
      password: "test",
    };

    // ACT
    const response = await request(app)
      .post("/login")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.body.errors[0].msg).toBe(
      "The password should be between 5-20 characters long"
    );
    expect(response.statusCode).toBe(400);
  });

  it("on login it should pass if the password is 5 chars", async () => {
    // ARRANGE
    const postData = {
      name: "te",
      email: "test@gmail.com",
      password: "test1",
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    // ACT
    const response = await request(app)
      .post("/login")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on login it should pass if the password is 6 chars", async () => {
    // ARRANGE
    const postData = {
      name: "tes",
      email: "test@gmail.com",
      password: "test12",
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    // ACT
    const response = await request(app)
      .post("/login")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on login it should pass if the password is 19 letters", async () => {
    // ARRANGE
    const postData = {
      name: "test1234567890",
      email: "test@gmail.com",
      password: "testPassword1234567",
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    // ACT
    const response = await request(app)
      .post("/login")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on login it should pass if the password is 20 chars", async () => {
    // ARRANGE
    const postData = {
      name: "test12345678901",
      email: "test@gmail.com",
      password: "testPassword12345678",
    };

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    // ACT
    const response = await request(app)
      .post("/login")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.statusCode).toBe(201);
  });

  it("on login it should return an error if the password is 21 chars", async () => {
    // ARRANGE
    const postData = {
      name: "test1234",
      email: "test@gmail.com",
      password: "testPassword123456789",
    };

    // ACT
    const response = await request(app)
      .post("/login")
      .send(postData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    // ASSERT
    expect(response.body.errors[0].msg).toBe(
      "The password should be between 5-20 characters long"
    );
    expect(response.statusCode).toBe(400);
  });
});
