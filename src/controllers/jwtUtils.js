const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const generateToken = (payload) => {
    const options = {
        expiresIn : '8h', //Token expiration time
    }

    const token = jwt.sign(payload, secretKey, options);
    return token;
};

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = {
    generateToken,
    verifyToken,
}