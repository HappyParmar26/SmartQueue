jest.mock("../../../backend/src/services/queue.service", () => ({
  getOfficeQueueSnapshot: jest.fn(),
  getCitizenTokenLiveState: jest.fn(),
  getLocalDateKey: jest.fn(() => "2026-06-12"),
  createTokenRecord: jest.fn(),
  selectNextToken: jest.fn(),
  tokenToObject: jest.fn(),
  SKIP_HOLD_MINUTES: 15,
}));

jest.mock("../../../backend/src/realtime/socket", () => ({
  emitPublicDisplayUpdate: jest.fn(),
  emitOfficeQueueUpdate: jest.fn(),
  emitTokenUpdate: jest.fn(),
  emitCounterUpdate: jest.fn(),
}));

const queueService = require("../../../backend/src/services/queue.service");
const app = require("../../../backend/src/app");
const { requestJson, startTestServer, stopTestServer } = require("../helpers/http");

describe("backend public HTTP routes", () => {
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

  it("returns the public display snapshot", async () => {
    queueService.getOfficeQueueSnapshot.mockResolvedValue({
      summary: { waiting: 5 },
      tokens: [],
    });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/public/display/office-1");

    expect(response.status).toBe(200);
    expect(json.data.summary.waiting).toBe(5);
  });

  it("returns the live office snapshot", async () => {
    queueService.getOfficeQueueSnapshot.mockResolvedValue({
      summary: { waiting: 7 },
      tokens: [],
    });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/public/offices/office-1/live");

    expect(response.status).toBe(200);
    expect(json.data.summary.waiting).toBe(7);
  });
});

export {};