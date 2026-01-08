// middleware/auth.js

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Neautentificat' });
  }
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Neautentificat' });
    }

    const user = req.session.user;
    if (user.role !== role) {
      return res.status(403).json({ message: 'Acces interzis' });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
