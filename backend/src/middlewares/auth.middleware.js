const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');


async function authUser(req, res, next) {
    const token = req.cookies && req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
}

// export function as default and as named export for compatibility
module.exports = authUser;
module.exports.authUser = authUser;