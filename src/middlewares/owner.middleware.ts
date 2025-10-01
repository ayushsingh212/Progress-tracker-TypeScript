import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Task } from "../models/task.model";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/user.model"; 
import mongoose from "mongoose";

// Extend Express Request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

export const verifyOwner = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized: No user found in request");
    }

    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(taskId);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (task.userId.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to perform this");
    }

    next();
  }
);
