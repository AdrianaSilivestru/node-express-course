const CustomErr = require("../errors");
const { isValidToken } = require("../utils");

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomErr.UnauthenticatedError("Auth Invalid");
    }

    try {
        const { name, userId, role } = isValidToken({ token });
        req.user = { name, userId, role }
        next();
    } catch (err) {
        throw new CustomErr.UnauthenticatedError("Auth Invalid");
    }
};

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomErr.UnauthorizedError("Unauthorized to access this route");
        }
        next();
    }
};

module.exports = {
    authenticateUser,
    authorizePermissions
};