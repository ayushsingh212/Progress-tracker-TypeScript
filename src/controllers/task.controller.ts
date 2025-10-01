import { Request, Response } from "express";
import { Task, ITask, TaskStatus } from "../models/task.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { IUser } from "../models/user.model";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(400, "Login first to create the task");
   console.log("Hello I am working");
  const { taskName, taskDetails } = req.body as {
    taskName: string;
    taskDetails: string;
  };

  if ([taskName, taskDetails].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Please provide all the fields");
  }

  const task = await Task.create({ userId, taskName, taskDetails });

  return res
    .status(202)
    .json(new ApiResponse<ITask>(200, task, "The task has been created successfully"));
});

const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  if (!taskId) throw new ApiError(400, "Task Id is required");

  const { newTaskName, newTaskDetails } = req.body as {
    newTaskName?: string;
    newTaskDetails?: string;
  };

  if (!newTaskName && !newTaskDetails) {
    throw new ApiError(200, "There is nothing to update");
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        taskName: newTaskName,
        taskDetails: newTaskDetails,
      },
    },
    { new: true, runValidators: true }
  );

  if (!task) throw new ApiError(400, "No task exists");

  return res
    .status(202)
    .json(new ApiResponse<ITask>(202, task, "Task has been updated successfully"));
});

const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  if (!taskId) throw new ApiError(400, "Task Id is required");

  const { taskStatus } = req.body as { taskStatus: TaskStatus };

  if (!taskStatus || taskStatus.trim() === "") {
    throw new ApiError(400, "No status found for updation");
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    { $set: { taskStatus } },
    { new: true }
  );

  if (!task) throw new ApiError(400, "No task exists");

  return res
    .status(202)
    .json(new ApiResponse<ITask>(202, task, "Task status updated successfully"));
});

const getTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  if (!taskId) throw new ApiError(400, "Task Id is required");

  const task = await Task.findById(taskId).lean<ITask>();
  if (!task) throw new ApiError(400, "Sorry no task has been found");

  return res
    .status(200)
    .json(
      new ApiResponse<TaskStatus>(
        200,
        task.taskStatus,
        "Task status fetched successfully"
      )
    );
});

export { createTask, updateTask, updateTaskStatus, getTaskStatus };
