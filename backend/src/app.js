const express = require('express');
const officeRouter = require('./routes/office.routes');

const app = express();
app.use(express.json());

app.use("/api/v1/citizen/offices", officeRouter)

module.exports = app;
