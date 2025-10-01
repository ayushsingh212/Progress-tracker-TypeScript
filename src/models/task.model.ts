import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model"; 

export enum TaskStatus {
  STARTED = "started",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export interface ITask extends Document {
  userId: IUser["_id"]; 
  taskName: string;
  taskDetails: string;
  taskStatus: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}


const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskName: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    taskDetails: {
      type: String,
      required: [true, "Task details is required to let you know what to do!"],
    },
    taskStatus: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.STARTED,
    },
  },
  {
    timestamps: true,
  }
);


export const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);
