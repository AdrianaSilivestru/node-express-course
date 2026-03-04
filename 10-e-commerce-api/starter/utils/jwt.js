const jwt = require("jsonwebtoken");

const oneDay = 24 * 60 * 60 * 1000;

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
    return token;
};

const isValidToken = ({ token }) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookiesToResponse = (res, tokenUser) => {
    const token = createJWT({ payload: tokenUser });
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
        signed: true
    })
}

module.exports = {
    createJWT,
    isValidToken,
    attachCookiesToResponse
};