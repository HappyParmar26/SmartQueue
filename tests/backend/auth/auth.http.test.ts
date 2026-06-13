jest.mock("../../../backend/src/models/user.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
}));

const userModel = require("../../../backend/src/models/user.model");
const bcryptjs = require("../../../backend/node_modules/bcryptjs");
const jwt = require("../../../backend/node_modules/jsonwebtoken");
bcryptjs.hash = jest.fn();
bcryptjs.compare = jest.fn();
jwt.sign = jest.fn();

const app = require("../../../backend/src/app");
const { requestJson, startTestServer, stopTestServer } = require("../helpers/http");

describe("backend auth HTTP routes", () => {
  let server: any;
  let baseUrl = "";

  beforeAll(async () => {
    ({ server, baseUrl } = await startTestServer(app));
  });

  afterAll(async () => {
    await stopTestServer(server);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects registration when required fields are missing", async () => {
    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/auth/register", {
      email: "test@example.com",
      phone: "9999999999",
    });

    expect(response.status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "Name, email, phone, and password are required",
    });
  });

  it("rejects registration when the password is too short", async () => {
    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/auth/register", {
      name: "Test User",
      email: "test@example.com",
      phone: "9999999999",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  });

  it("registers a new user and sets a cookie", async () => {
    userModel.findOne.mockResolvedValue(null);
    bcryptjs.hash.mockResolvedValue("hashed-password");
    userModel.create.mockResolvedValue({
      _id: "user-1",
      name: "Test User",
      phone: "9999999999",
      email: "test@example.com",
      role: "user",
      office_id: null,
    });
    jwt.sign.mockReturnValue("signed-token");

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/auth/register", {
      name: "Test User",
      email: "test@example.com",
      phone: "9999999999",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data).toEqual({
      id: "user-1",
      name: "Test User",
      phone: "9999999999",
      email: "test@example.com",
      role: "user",
    });
    expect(response.headers.get("set-cookie") ?? "").toContain("token=signed-token");
  });

  it("rejects login when the password is missing", async () => {
    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/auth/login", {
      email: "test@example.com",
      phone: "9999999999",
    });

    expect(response.status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "Password is required",
    });
  });

  it("rejects login with invalid credentials", async () => {
    const user = {
      _id: "user-1",
      name: "Test User",
      phone: "9999999999",
      email: "test@example.com",
      role: "user",
      office_id: null,
      password: "hashed-password",
      select: jest.fn().mockResolvedValue({
        _id: "user-1",
        name: "Test User",
        phone: "9999999999",
        email: "test@example.com",
        role: "user",
        office_id: null,
        password: "hashed-password",
      }),
    };

    userModel.findOne.mockReturnValue(user);
    bcryptjs.compare.mockResolvedValue(false);

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/auth/login", {
      email: "test@example.com",
      phone: "9999999999",
      password: "wrong-password",
    });

    expect(response.status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "Invalid password",
    });
  });

  it("logs in a valid user and sets a cookie", async () => {
    const user = {
      _id: "user-1",
      name: "Test User",
      phone: "9999999999",
      email: "test@example.com",
      role: "user",
      office_id: null,
      password: "hashed-password",
      select: jest.fn().mockResolvedValue({
        _id: "user-1",
        name: "Test User",
        phone: "9999999999",
        email: "test@example.com",
        role: "user",
        office_id: null,
        password: "hashed-password",
      }),
    };

    userModel.findOne.mockReturnValue(user);
    bcryptjs.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("signed-token");

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/auth/login", {
      email: "test@example.com",
      phone: "9999999999",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.email).toBe("test@example.com");
    expect(response.headers.get("set-cookie") ?? "").toContain("token=signed-token");
  });

  it("clears the token cookie on logout", async () => {
    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/auth/logout", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json).toEqual({
      success: true,
      message: "user logged out successfully",
    });
    expect(response.headers.get("set-cookie") ?? "").toContain("token=");
  });
});

export {};