const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
	const token = req.headers['authorization'];
	if(!token) return res.json({ error: true, message: 'No token provided'});

	jwt.verify(token, process.env.SECRET_KEY_APPLICATION, function(err, decoded) {
		if(err) return res.json({ error: true, message: 'Failed to authenticate token'});
		req.app.token = decoded;
		next();
	});
};