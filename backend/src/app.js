const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const officeRouter = require('./routes/office.routes');


const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/citizen/auth", authRouter)
app.use("/api/v1/citizen/offices", officeRouter)

module.exports = app;
