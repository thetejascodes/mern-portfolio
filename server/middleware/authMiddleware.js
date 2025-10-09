const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  // Check cookie first (httpOnly cookie), then Authorization header
  let token = null;
  if (req.cookies && req.cookies[process.env.COOKIE_NAME || 'token']) {
    token = req.cookies[process.env.COOKIE_NAME || 'token'];
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};
