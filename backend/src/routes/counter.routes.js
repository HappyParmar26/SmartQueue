const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminOnly = require('../middlewares/admin.middleware');
const { createCounter } = require('../controllers/counter.controller');

const counterRouter = express.Router();

// Protect route: authenticated users first, then admin-only
counterRouter.post('/create', authMiddleware, adminOnly, createCounter);

module.exports = counterRouter;