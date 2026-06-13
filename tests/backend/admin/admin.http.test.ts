jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}), { virtual: true });

jest.mock("../../../backend/src/models/user.model", () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../../../backend/src/models/token.model", () => ({
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../../../backend/src/models/counter.model", () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
}));

jest.mock("../../../backend/src/models/slot.model", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  updateOne: jest.fn(),
}));

jest.mock("../../../backend/src/models/office.model", () => ({
  findById: jest.fn(),
}));

jest.mock("../../../backend/src/models/observation.model", () => ({
  findOneAndUpdate: jest.fn(),
}));

jest.mock("../../../backend/src/services/queue.service", () => ({
  getOfficeQueueSnapshot: jest.fn(),
  getCitizenTokenLiveState: jest.fn(),
  createTokenRecord: jest.fn(),
  selectNextToken: jest.fn(),
  tokenToObject: jest.fn((value: any) => value),
  getLocalDateKey: jest.fn(() => "2026-06-12"),
  SKIP_HOLD_MINUTES: 15,
}));

jest.mock("../../../backend/src/realtime/socket", () => ({
  emitOfficeQueueUpdate: jest.fn(),
  emitTokenUpdate: jest.fn(),
  emitCounterUpdate: jest.fn(),
  emitPublicDisplayUpdate: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const UserModel = require("../../../backend/src/models/user.model");
const TokenModel = require("../../../backend/src/models/token.model");
const CounterModel = require("../../../backend/src/models/counter.model");
const SlotModel = require("../../../backend/src/models/slot.model");
const OfficeModel = require("../../../backend/src/models/office.model");
const ObservationModel = require("../../../backend/src/models/observation.model");
const queueService = require("../../../backend/src/services/queue.service");
const app = require("../../../backend/src/app");
const { requestJson, startTestServer, stopTestServer } = require("../helpers/http");

describe("backend admin HTTP routes", () => {
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

  function mockAdminAuth() {
    jwt.verify.mockReturnValue({ id: "admin-1", role: "admin", office_id: "office-1" });
    UserModel.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ role: "admin", office_id: "office-1" }) });
  }

  it("rejects unauthenticated admin requests", async () => {
    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/admin/dashboard");

    expect(response.status).toBe(401);
    expect(json.message).toBe("token not provided");
  });

  it("rejects non-admin users", async () => {
    jwt.verify.mockReturnValue({ id: "user-1", role: "user" });
    UserModel.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ role: "user" }) });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/admin/dashboard", undefined, "token=fake-jwt");

    expect(response.status).toBe(403);
    expect(json.message).toBe("Forbidden: admin only");
  });

  it("returns admin dashboard data", async () => {
    mockAdminAuth();
    queueService.getOfficeQueueSnapshot.mockResolvedValue({ summary: { waiting: 4 } });
    TokenModel.countDocuments.mockResolvedValueOnce(4).mockResolvedValueOnce(1).mockResolvedValueOnce(2).mockResolvedValueOnce(1);

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/admin/dashboard?office_id=office-1", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.data.totals.waiting).toBe(4);
  });

  it("returns queue data", async () => {
    mockAdminAuth();
    queueService.getOfficeQueueSnapshot.mockResolvedValue({ summary: { waiting: 2 } });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/admin/queue?office_id=office-1", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.data.summary.waiting).toBe(2);
  });

  it("calls the next token", async () => {
    mockAdminAuth();
    queueService.selectNextToken.mockResolvedValue({ token: { _id: "token-1", save: jest.fn(), status: "waiting" } });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/admin/queue/call-next", {
      office_id: "office-1",
    }, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.message).toBe("Next token called successfully");
  });

  it("creates a walk-in token", async () => {
    mockAdminAuth();
    OfficeModel.findById.mockResolvedValue({ _id: "office-1", total_counters: 2 });
    CounterModel.findOne.mockResolvedValue({ _id: "counter-1", counter_number: 1, service_id: "service-1", save: jest.fn() });
    UserModel.findOne.mockResolvedValue({ _id: "citizen-1" });
    SlotModel.findById.mockResolvedValue(null);
    SlotModel.findOneAndUpdate = jest.fn().mockResolvedValue({ _id: "slot-1" });
    queueService.createTokenRecord.mockResolvedValue({ _id: "token-1", booking: { date: "2026-06-12" } });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/admin/tokens/walkin", {
      office_id: "office-1",
      name: "Walk In",
      phone: "9999999999",
      service_id: "service-1",
      service_name: "Billing",
    }, "token=fake-jwt");

    expect(response.status).toBe(201);
    expect(json.message).toBe("Walk-in token created successfully");
  });

  it("returns admin analytics", async () => {
    mockAdminAuth();
    TokenModel.countDocuments.mockResolvedValue(1);

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/admin/analytics?office_id=office-1", undefined, "token=fake-jwt");

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
  });

  it("returns AI insights", async () => {
    mockAdminAuth();
    queueService.getOfficeQueueSnapshot.mockResolvedValue({ summary: { waiting: 20 } });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/admin/ai-insights?office_id=office-1", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
  });

  it("returns slots for an office", async () => {
    mockAdminAuth();
    SlotModel.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([{ _id: "slot-1" }]) }) });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/admin/slots?office_id=office-1", undefined, "token=fake-jwt");

    expect(response.status).toBe(200);
    expect(json.data).toHaveLength(1);
  });

  it("updates a slot", async () => {
    mockAdminAuth();
    const slot = { _id: "slot-1", save: jest.fn().mockResolvedValue(null) };
    SlotModel.findById.mockResolvedValue(slot);

    const { response, json } = await requestJson(baseUrl, "PATCH", "/api/v1/admin/slots/slot-1", { status: "booked" }, "token=fake-jwt");

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
  });

  it("generates slots", async () => {
    mockAdminAuth();
    OfficeModel.findById.mockResolvedValue({ _id: "office-1", total_counters: 2, hours: { open: 9, close: 11 } });
    SlotModel.updateOne.mockResolvedValue({ upsertedCount: 1 });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/internal/slots/generate", {
      office_id: "office-1",
      date: "2026-06-12",
    });

    expect(response.status).toBe(200);
  });

  it("syncs observations", async () => {
    ObservationModel.findOneAndUpdate.mockResolvedValue({ _id: "observation-1" });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/internal/observations/sync", {
      office_id: "office-1",
      observed_date: "2026-06-12",
      observed_hour: 10,
      actuals: { waiting: 12 },
    });

    expect(response.status).toBe(200);
    expect(json.count).toBe(1);
  });
});

export {};