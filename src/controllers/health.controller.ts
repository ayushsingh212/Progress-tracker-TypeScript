import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";

 const checkHealth = asyncHandler(async (req: Request, res: Response) => {
  let dbStatus = "down";

  try {
    await mongoose.connection.db!.admin().ping();
    dbStatus = "up";
  } catch (err) {
    dbStatus = "down";
  }

  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

export default checkHealth;