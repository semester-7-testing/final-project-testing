import { checkAdmin, checkAuth } from "./auth";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

describe("checkAuth middleware", () => {
  dotenv.config();
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next and attach user to req if token is present and valid", async () => {
    const user = { email: "test@test.sk", isAdmin: false };
    const token = JWT.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    req.header.mockReturnValue(`Bearer ${token}`);

    await checkAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });

  it.each([
    null,
    undefined,
    JWT.sign(
      { email: "test@test.sk", isAdmin: false },
      "not valid jwt secret",
      {
        expiresIn: "7d",
      }
    ),
    JWT.sign(
      { email: "test@test.sk", isAdmin: false },
      process.env.JWT_SECRET,
      {
        expiresIn: "-1s",
      }
    ),
  ])(
    "should return unauthorized if token is present but not valid",
    async (token) => {
      req.header.mockReturnValue(`Bearer ${token}`);
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await checkAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    }
  );

  it("should respond with unauthorized if token is not present", async () => {
    req.header.mockReturnValue(null);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    await checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe("checkAdmin middleware", () => {
  dotenv.config();
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next if user is admin", async () => {
    const user = { email: "test@test.sk", isAdmin: true };
    req.user = user;

    await checkAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it.each([{ email: "test@test.sk", isAdmin: false }, null, undefined])(
    "should respond with unauthorized if user is not admin",
    async (user) => {
      req.user = user;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await checkAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    }
  );
});
