jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}), { virtual: true });

jest.mock("../../../backend/src/models/user.model", () => ({
  findById: jest.fn(),
}));

jest.mock("../../../backend/src/models/token.model", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("../../../backend/src/services/queue.service", () => ({
  createTokenRecord: jest.fn(),
  getCitizenTokenLiveState: jest.fn(),
  getOfficeQueueSnapshot: jest.fn(),
  tokenToObject: jest.fn((value: any) => value),
  selectNextToken: jest.fn(),
  getLocalDateKey: jest.fn(() => "2026-06-12"),
  SKIP_HOLD_MINUTES: 15,
}));

jest.mock("../../../backend/src/realtime/socket", () => ({
  emitTokenUpdate: jest.fn(),
  emitOfficeQueueUpdate: jest.fn(),
  emitCounterUpdate: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const UserModel = require("../../../backend/src/models/user.model");
const TokenModel = require("../../../backend/src/models/token.model");
const queueService = require("../../../backend/src/services/queue.service");
const app = require("../../../backend/src/app");
const { requestJson, startTestServer, stopTestServer } = require("../helpers/http");

describe("backend citizen token HTTP routes", () => {
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

  function mockAuthUser() {
    jwt.verify.mockReturnValue({ id: "user-1", role: "user", office_id: null });
    UserModel.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ role: "user", office_id: null }) });
  }

  it("rejects requests without auth", async () => {
    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/tokens/book", {
      office_id: "office-1",
    });

    expect(response.status).toBe(401);
    expect(json).toEqual({ message: "token not provided" });
  });

  it("books a token for an authenticated citizen", async () => {
    mockAuthUser();
    queueService.createTokenRecord.mockResolvedValue({ _id: "token-1", office_id: "office-1" });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/tokens/book", {
      office_id: "office-1",
      service_id: "service-1",
      service_name: "Billing",
      slot_id: "slot-1",
      date: "2026-06-12",
      hour: 10,
      slot_time: "10:00",
    }, "token=fake-jwt");

    expect(response.status).toBe(201);
    expect(json.data._id).toBe("token-1");
  });

  it("rejects token booking when required fields are missing", async () => {
    mockAuthUser();

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/tokens/book", {
      office_id: "office-1",
      service_id: "service-1",
    }, "token=fake-jwt");

    expect(response.status).toBe(400);
    expect(json.message).toBe("All required fields must be provided");
  });

  it("lists a citizen's tokens", async () => {
    mockAuthUser();
    TokenModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: "token-1" }, { _id: "token-2" }]),
      }),
    });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/tokens", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.count).toBe(2);
  });

  it("returns a token by id", async () => {
    mockAuthUser();
    TokenModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: "token-1" }) });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/tokens/token-1", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.data._id).toBe("token-1");
  });

  it("returns 404 when a token is missing", async () => {
    mockAuthUser();
    TokenModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/tokens/missing", undefined, "token=fake-jwt");

    expect(response.status).toBe(404);
    expect(json.message).toBe("Token not found");
  });

  it("returns live token state", async () => {
    mockAuthUser();
    queueService.getCitizenTokenLiveState.mockResolvedValue({ position: 3 });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/tokens/token-1/live", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.data.position).toBe(3);
  });

  it("cancels a waiting token", async () => {
    mockAuthUser();
    const token = {
      _id: "token-1",
      citizen_id: "user-1",
      office_id: "office-1",
      booking: { date: "2026-06-12" },
      service: { service_id: "service-1" },
      status: "waiting",
      save: jest.fn().mockResolvedValue(null),
    };
    TokenModel.findOne.mockResolvedValue(token);

    const { response, json } = await requestJson(baseUrl, "DELETE", "/api/v1/citizen/tokens/token-1", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.message).toBe("Token cancelled successfully");
    expect(token.status).toBe("cancelled");
  });
});

export {};