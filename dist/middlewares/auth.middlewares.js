"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const user_model_1 = require("../models/user.model");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verifyJWT = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        throw new ApiError_1.ApiError(400, "Sorry the token has not been found");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await user_model_1.User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError_1.ApiError(400, "Sorry! No user exists");
    }
    req.user = user;
    next();
});
//# sourceMappingURL=auth.middlewares.js.map