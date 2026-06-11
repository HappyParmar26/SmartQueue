const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const officeRouter = require('./routes/office.routes');
const predictRouter = require('./routes/predict.route');
const departmentRouter = require('./routes/department.route');
const tokenRouter = require('./routes/token.routes');
const counterRouter = require('./routes/counter.routes');
const adminRouter = require('./routes/admin.routes');
const publicRouter = require('./routes/public.routes');
const internalRouter = require('./routes/internal.routes');

const app = express();
app.use(cookieParser());
app.use(express.json());

// Mount routes with /api/v1 prefix
app.use("/api/v1/citizen/auth", authRouter);
app.use("/api/v1/citizen/offices", officeRouter);
app.use("/api/v1/citizen/predict", predictRouter);
app.use("/api/v1/citizen/tokens", tokenRouter);
app.use("/api/v1/admin/departments", departmentRouter);
app.use("/api/v1/admin/counters", counterRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/public", publicRouter);
app.use("/api/v1/internal", internalRouter);

module.exports = app;
