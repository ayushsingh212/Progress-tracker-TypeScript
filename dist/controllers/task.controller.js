"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.getTaskStatus = exports.updateTaskStatus = exports.updateTask = exports.createTask = void 0;
const task_model_1 = require("../models/task.model");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const createTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId)
        throw new ApiError_1.ApiError(400, "Login first to create the task");
    console.log("Hello I am working");
    const { taskName, taskDetails, dueDate } = req.body;
    if ([taskName, taskDetails].some((field) => !field || field.trim() === "")) {
        throw new ApiError_1.ApiError(400, "Please provide all the fields");
    }
    const task = await task_model_1.Task.create({ userId, taskName, taskDetails, dueDate });
    return res
        .status(202)
        .json(new ApiResponse_1.ApiResponse(200, task, "The task has been created successfully"));
});
exports.createTask = createTask;
const updateTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const taskId = req.params.taskId;
    if (!taskId)
        throw new ApiError_1.ApiError(400, "Task Id is required");
    const { newTaskName, newTaskDetails, dueDate } = req.body;
    if (!newTaskName && !newTaskDetails && !dueDate) {
        throw new ApiError_1.ApiError(200, "There is nothing to update");
    }
    const task = await task_model_1.Task.findByIdAndUpdate(taskId, {
        $set: {
            taskName: newTaskName,
            taskDetails: newTaskDetails,
            dueDate
        },
    }, { new: true, runValidators: true });
    if (!task)
        throw new ApiError_1.ApiError(400, "No task exists");
    return res
        .status(202)
        .json(new ApiResponse_1.ApiResponse(202, task, "Task has been updated successfully"));
});
exports.updateTask = updateTask;
const updateTaskStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const taskId = req.params.taskId;
    if (!taskId)
        throw new ApiError_1.ApiError(400, "Task Id is required");
    const { taskStatus } = req.body;
    if (!taskStatus || taskStatus.trim() === "") {
        throw new ApiError_1.ApiError(400, "No status found for updation");
    }
    const task = await task_model_1.Task.findByIdAndUpdate(taskId, { $set: { taskStatus } }, { new: true });
    if (!task)
        throw new ApiError_1.ApiError(400, "No task exists");
    return res
        .status(202)
        .json(new ApiResponse_1.ApiResponse(202, task, "Task status updated successfully"));
});
exports.updateTaskStatus = updateTaskStatus;
const getTaskStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const taskId = req.params.taskId;
    if (!taskId)
        throw new ApiError_1.ApiError(400, "Task Id is required");
    const task = await task_model_1.Task.findById(taskId).lean();
    if (!task)
        throw new ApiError_1.ApiError(400, "Sorry no task has been found");
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, task.taskStatus, "Task status fetched successfully"));
});
exports.getTaskStatus = getTaskStatus;
const deleteTask = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { taskId } = req.params;
    const task = await task_model_1.Task.findByIdAndDelete(taskId);
    if (!task) {
        throw new ApiError_1.ApiError(400, "Task does not exist");
    }
    return res.status(202)
        .json(new ApiResponse_1.ApiResponse(202, {}, "Task deleted successfully"));
});
exports.deleteTask = deleteTask;
//# sourceMappingURL=task.controller.js.map