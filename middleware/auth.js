// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Access Denied');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid Token');
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
