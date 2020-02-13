const config = require('config');
const jwt = require('jsonwebtoken');

const getTokenFromHeaders = req => {
	const {
		headers: { authorization }
	} = req;

	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		return authorization.split(' ')[1];
	}
	return null;
};

const secret = config.get('JWT_SECRET');

const auth = (req, res, next) => {
    const token = getTokenFromHeaders(req); 
    if (token) {
        const decoded = jwt.verify(token, secret);
        req.payload = decoded
        next();
    }
    else return res.status(400).json({ msg: 'invalid token' });
}

// const auth = jwt({
// 	secret,
// 	userProperty: 'payload',
// 	getToken: getTokenFromHeaders
// });

module.exports = auth;
