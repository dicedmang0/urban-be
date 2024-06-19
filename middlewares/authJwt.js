const jwt = require('jsonwebtoken');


exports.verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(400).send({ status: "Bad Request", message: 'No token provided.' });
  }

  jwt.verify(token, process.env.SECRET_KEY_APPLICATION, (err, decoded) => {
    if (err) {
      return res.status(500).send({ status: "Server Error", message: 'Failed to authenticate token or Token Expired.' });
    }

    req.userId = decoded.id;
    next();
  });
};