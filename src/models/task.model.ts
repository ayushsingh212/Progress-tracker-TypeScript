import mongoose, { Document, Model, Schema } from "mongoose";

export enum TaskStatus {
  STARTED = "todo",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;  
  taskName: string;
  taskDetails: string;
  taskStatus: TaskStatus;
  dueDate: Date;
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
    dueDate: {
      type: Date,
      default: Date.now, 
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
