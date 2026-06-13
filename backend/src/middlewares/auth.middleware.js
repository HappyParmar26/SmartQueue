const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');


async function authUser(req, res, next) {
    const token = req.cookies && req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id).lean();

        req.user = {
            ...decoded,
            role: user?.role || decoded.role || 'user',
            office_id: user?.office_id || decoded.office_id || null,
        };

        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
}

// export function as default and as named export for compatibility
module.exports = authUser;
module.exports.authUser = authUser;
