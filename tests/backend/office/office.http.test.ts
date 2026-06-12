jest.mock("../../../backend/src/models/office.model", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("../../../backend/src/models/slot.model", () => ({
  find: jest.fn(),
}));

const OfficeModel = require("../../../backend/src/models/office.model");
const SlotModel = require("../../../backend/src/models/slot.model");
const app = require("../../../backend/src/app");
const { requestJson, startTestServer, stopTestServer } = require("../helpers/http");

describe("backend office HTTP routes", () => {
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

  it("creates an office", async () => {
    OfficeModel.findOne.mockResolvedValue(null);
    OfficeModel.create.mockResolvedValue({ _id: "office-1", office_name: "Main Office" });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/offices/create", {
      office_name: "Main Office",
      office_type: "public",
      address: { city: "Rajkot" },
      location: { lat: 1, lng: 2 },
      hours: { open: 9, close: 17 },
      open_days: ["Mon"],
      total_counters: 3,
      is_active: true,
    });

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.office_name).toBe("Main Office");
  });

  it("rejects duplicate office creation", async () => {
    OfficeModel.findOne.mockResolvedValue({ _id: "office-1" });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/offices/create", {
      office_name: "Main Office",
    });

    expect(response.status).toBe(409);
    expect(json).toEqual({
      success: false,
      message: "Office already exists",
    });
  });

  it("lists all offices", async () => {
    OfficeModel.find.mockResolvedValue([{ _id: "office-1" }, { _id: "office-2" }]);

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/offices");

    expect(response.status).toBe(200);
    expect(json.offices).toHaveLength(2);
  });

  it("returns a single office by id", async () => {
    OfficeModel.findById.mockResolvedValue({ _id: "office-1", office_name: "Main Office" });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/offices/office-1");

    expect(response.status).toBe(200);
    expect(json.office.office_name).toBe("Main Office");
  });

  it("returns 404 when an office is missing", async () => {
    OfficeModel.findById.mockResolvedValue(null);

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/offices/office-missing");

    expect(response.status).toBe(404);
    expect(json).toEqual({ message: "Office not found" });
  });

  it("returns slots for an office", async () => {
    SlotModel.find.mockResolvedValue([{ _id: "slot-1" }]);

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/offices/office-1/slots");

    expect(response.status).toBe(200);
    expect(json.slots).toHaveLength(1);
  });
});

export {};