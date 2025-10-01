"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDetails = exports.changeCurrentPassword = exports.getCurrentUser = exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const constants_1 = require("../constants");
const user_model_1 = require("../models/user.model");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessAndRefreshToken = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
};
const registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        throw new ApiError_1.ApiError(400, "Invalid email format");
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw new ApiError_1.ApiError(400, "Password must be at least 8 characters long and include at least one letter, one number, and one special character (@, $, !, %, *, ?, &).");
    }
    const isExistingUser = await user_model_1.User.findOne({ email });
    if (isExistingUser) {
        throw new ApiError_1.ApiError(409, "User with this email already exists");
    }
    const user = await user_model_1.User.create({ fullName, email, password });
    const userSafe = await user_model_1.User.findById(user._id).select("-password -refreshToken");
    return res
        .status(201)
        .json(new ApiResponse_1.ApiResponse(201, userSafe, "User registered successfully"));
});
exports.registerUser = registerUser;
// Login user
const loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!/\S+@\S+\.\S+/.test(email)) {
        throw new ApiError_1.ApiError(400, "Invalid email format");
    }
    if (!password || password.trim() === "") {
        throw new ApiError_1.ApiError(400, "The password is a necessary field");
    }
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(400, "The user does not exist, please register first");
    }
    const passwordCorrect = await user.isPasswordCorrect(password);
    if (!passwordCorrect) {
        throw new ApiError_1.ApiError(401, "Incorrect password! Please try again");
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id.toString());
    const userSafe = await user_model_1.User.findById(user._id).select("-password -refreshToken");
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, constants_1.options)
        .cookie("accessToken", accessToken, constants_1.options)
        .json(new ApiResponse_1.ApiResponse(200, userSafe, "Login successful"));
});
exports.loginUser = loginUser;
// Logout user
const logoutUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId)
        throw new ApiError_1.ApiError(401, "User not authenticated");
    await user_model_1.User.findByIdAndUpdate(userId, { refreshToken: undefined });
    return res
        .status(202)
        .clearCookie("accessToken", constants_1.options)
        .clearCookie("refreshToken", constants_1.options)
        .json(new ApiResponse_1.ApiResponse(200, {}, "User logged out successfully"));
});
exports.logoutUser = logoutUser;
// Refresh access token
const refreshAccessToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token)
        throw new ApiError_1.ApiError(400, "Refresh token missing");
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new ApiError_1.ApiError(401, "Refresh token expired");
        }
        throw new ApiError_1.ApiError(401, "Invalid refresh token");
    }
    const user = await user_model_1.User.findById(decoded._id);
    if (!user)
        throw new ApiError_1.ApiError(404, "User not found");
    if (user.refreshToken !== token) {
        throw new ApiError_1.ApiError(403, "Refresh token mismatch");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString());
    return res
        .status(200)
        .cookie("accessToken", accessToken, constants_1.options)
        .cookie("refreshToken", refreshToken, constants_1.options)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Token refreshed"));
});
exports.refreshAccessToken = refreshAccessToken;
const getCurrentUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId)
        throw new ApiError_1.ApiError(401, "User not authenticated");
    const user = await user_model_1.User.findById(userId).select("-password -refreshToken");
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user, "User fetched successfully"));
});
exports.getCurrentUser = getCurrentUser;
const changeCurrentPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const id = req.user?._id;
    if (!id)
        throw new ApiError_1.ApiError(401, "User not authenticated");
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
        throw new ApiError_1.ApiError(400, "Password must be at least 8 characters long and include at least one letter, one number, and one special character (@, $, !, %, *, ?, &).");
    }
    if (newPassword !== confirmNewPassword)
        throw new ApiError_1.ApiError(400, "The entered passwords are not matching");
    const user = await user_model_1.User.findById(id);
    if (!user)
        throw new ApiError_1.ApiError(401, "User not found");
    const correct = await user.isPasswordCorrect(oldPassword);
    if (!correct) {
        throw new ApiError_1.ApiError(400, "Old password is incorrect! Please try again");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(202)
        .json(new ApiResponse_1.ApiResponse(200, {}, "Password has been changed successfully"));
});
exports.changeCurrentPassword = changeCurrentPassword;
const updateDetails = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { newName } = req.body;
    if (!newName || newName.trim() === "") {
        throw new ApiError_1.ApiError(400, "The new name cannot be empty");
    }
    const user = await user_model_1.User.findByIdAndUpdate(req.user?._id, { $set: { fullName: newName } }, { new: true, runValidators: true }).select("-password -refreshToken");
    if (!user)
        throw new ApiError_1.ApiError(400, "User does not exist");
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, user, "The name has been updated successfully"));
});
exports.updateDetails = updateDetails;
//# sourceMappingURL=user.controllers.js.map