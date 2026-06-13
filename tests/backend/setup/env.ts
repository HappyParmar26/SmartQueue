process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.PREDICTION_SERVICE_URL = process.env.PREDICTION_SERVICE_URL || "http://prediction.test";