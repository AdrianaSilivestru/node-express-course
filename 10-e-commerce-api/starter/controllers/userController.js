const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { NotFoundError, BadRequestError, UnauthenticatedError } = require("../errors");
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require("../utils");
const mongoose = require("mongoose");

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: "user", }).select("-password");
    res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select("-password");

    if (!user) {
        throw new NotFoundError("User not found");
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new BadRequestError("Please provide both name and email");
    }
    const user = await User.findOne({ _id: req.user.userId });
    user.email = email;
    user.name = name;
    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse(res, tokenUser);
    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new BadRequestError("Please provide old password and new password");
    }

    const user = await User.findById(req.user.userId);
    const isOldPassMatch = user.comparePassword(oldPassword);
    if (!isOldPassMatch) {
        throw new UnauthenticatedError("Provided old password is incorrect");
    }

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
};

// const updateUser = async (req, res) => {
//     const { name, email } = req.body;
//     if (!name || !email) {
//         throw new BadRequestError("Please provide both name and email");
//     }
//     const user = await User.findOneAndUpdate({ _id: req.user.userId }, { name, email }, { new: true, runValidators: true });
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse(res, tokenUser);
//     res.status(StatusCodes.OK).json({ user: tokenUser });
// };