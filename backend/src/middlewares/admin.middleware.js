// Middleware to ensure the authenticated user is an admin
async function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin only' });
  }

  return next();
}

module.exports = adminOnly;
module.exports.adminOnly = adminOnly;
