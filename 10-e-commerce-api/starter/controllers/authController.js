const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const User = require("../models/User");

const register = async (req, res) => {
    const { email, name, password } = req.body;
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
        throw new BadRequestError("Email already exists");
    }
    const user = await User.create({ name, email, password });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse(res, tokenUser);

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Provide both email and password");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Wrong email");
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new UnauthenticatedError("Wrong password");
    }

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse(res, tokenUser);
    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

module.exports = {
    register,
    login,
    logout
};