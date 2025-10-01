"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOwner = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const task_model_1 = require("../models/task.model");
const ApiError_1 = require("../utils/ApiError");
const mongoose_1 = __importDefault(require("mongoose"));
exports.verifyOwner = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError_1.ApiError(401, "Unauthorized: No user found in request");
    }
    const { taskId } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(taskId)) {
        throw new ApiError_1.ApiError(400, "Invalid task ID");
    }
    const task = await task_model_1.Task.findById(taskId);
    if (!task) {
        throw new ApiError_1.ApiError(404, "Task not found");
    }
    if (task.userId.toString() !== userId.toString()) {
        throw new ApiError_1.ApiError(403, "You are not authorized to perform this");
    }
    next();
});
//# sourceMappingURL=owner.middleware.js.map