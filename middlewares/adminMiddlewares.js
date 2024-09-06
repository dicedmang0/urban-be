const jwt = require('jsonwebtoken');


exports.adminVerify = async (req, res, next) => {
  const admin = req.user;

  if (!admin || admin?.role !== 'superadmin') {
    return res.status(403).json({
        status: false,
        message: 'Role Forbidden!'
    })
  }

  next()
};