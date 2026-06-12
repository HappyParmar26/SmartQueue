jest.mock("../../../backend/src/models/office.model", () => ({
  findById: jest.fn(),
  findOne: jest.fn(),
}));

const axios = require("../../../backend/node_modules/axios");
axios.post = jest.fn();
const Office = require("../../../backend/src/models/office.model");
const app = require("../../../backend/src/app");
const { requestJson, startTestServer, stopTestServer } = require("../helpers/http");

describe("backend prediction HTTP routes", () => {
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

  const office = {
    _id: "office-1",
    office_type: "public",
    address: { city: "Rajkot" },
    hours: { open: 9, close: 17 },
  };

  it("rejects missing prediction input", async () => {
    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/predict/hour", {
      department: "billing",
    });

    expect(response.status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "office_id, department, and datetime are required",
    });
  });

  it("returns 404 when the office does not exist", async () => {
    Office.findById.mockResolvedValue(null);

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/predict/hour", {
      office_id: "office-missing",
      department: "billing",
      datetime: "2026-06-12T10:00:00Z",
    });

    expect(response.status).toBe(404);
    expect(json).toEqual({
      success: false,
      message: "Office not found",
    });
  });

  it("predicts hourly wait time", async () => {
    Office.findById.mockResolvedValue(office);
    axios.post.mockResolvedValue({ status: 200, data: { predicted_wait_time: 18 } });

    const { response, json } = await requestJson(baseUrl, "POST", "/api/v1/citizen/predict/hour", {
      office_id: "office-1",
      department: "billing",
      datetime: "2026-06-12T10:00:00Z",
    });

    expect(response.status).toBe(200);
    expect(json.predicted_wait_time).toBe(18);
  });

  it("predicts day wait time", async () => {
    Office.findById.mockResolvedValue(office);
    axios.post.mockResolvedValue({ status: 200, data: { predicted_wait_time: 30 } });

    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/predict/day", {
      office_id: "office-1",
      department: "billing",
      datetime: "2026-06-12T10:00:00Z",
    });

    expect(response.status).toBe(200);
    expect(json.predicted_wait_time).toBe(30);
  });

  it("returns a server error for the week prediction route bug", async () => {
    const { response, json } = await requestJson(baseUrl, "GET", "/api/v1/citizen/predict/week", {
      office_id: "office-1",
      department: "billing",
      datetime: "2026-06-12T10:00:00Z",
    });

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
  });
});

export {};