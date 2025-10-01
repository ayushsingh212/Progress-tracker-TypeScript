import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import {
  createTask,
  getTaskStatus,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller";

const router = Router();

// All routes are protected
router.use(verifyJWT);

// Task routes
router.post("/createTask", createTask);
router.put("/updateTask/:taskId", updateTask);
router.patch("/updateTaskStatus/:taskId", updateTaskStatus);
router.get("/getTaskStatus/:taskId", getTaskStatus);

export default router;
