jest.mock("../../../backend/src/models/observation.model", () => ({
  findOneAndUpdate: jest.fn(),
}));

jest.mock("../../../backend/src/models/office.model", () => ({
  findById: jest.fn(),
}));

jest.mock("../../../backend/src/models/slot.model", () => ({
  updateOne: jest.fn(),
}));

const ObservationModel = require("../../../backend/src/models/observation.model");
const OfficeModel = require("../../../backend/src/models/office.model");
const SlotModel = require("../../../backend/src/models/slot.model");
const app = require("../../../backend/src/app");
const { requestJson, startTestServer, stopTestServer } = require("../helpers/http");

describe("backend internal HTTP routes", () => {
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

  it("generates slots for an office", async () => {
    OfficeModel.findById.mockResolvedValue({
      _id: "office-1",
      total_counters: 3,
      hours: { open: 9, close: 11 },
    });
    SlotModel.updateOne.mockResolvedValue({ upsertedCount: 1 });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/internal/slots/generate", {
      office_id: "office-1",
      date: "2026-06-12",
    });

    expect(response.status).toBe(200);
  });

  it("syncs valid observations and skips invalid entries", async () => {
    ObservationModel.findOneAndUpdate.mockResolvedValue({ _id: "observation-1" });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/internal/observations/sync", [
      {
        office_id: "office-1",
        observed_date: "2026-06-12",
        observed_hour: 10,
        actuals: { waiting: 12 },
      },
      {
        observed_date: "2026-06-12",
      },
    ]);

    expect(response.status).toBe(200);
    expect(json.count).toBe(1);
  });
});

export {};