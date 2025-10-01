import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import {
  createTask,
  deleteTask,
  getTaskStatus,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller";
import { verifyOwner } from "../middlewares/owner.middleware";

const router = Router();

router.use(verifyJWT);

router.post("/createTask", createTask);
router.put("/updateTask/:taskId", verifyOwner, updateTask);
router.patch("/updateTaskStatus/:taskId",verifyOwner ,updateTaskStatus);
router.get("/getTaskStatus/:taskId",verifyOwner, getTaskStatus);
router.delete("/deleteTask/:taskId",verifyOwner,deleteTask)
export default router;
