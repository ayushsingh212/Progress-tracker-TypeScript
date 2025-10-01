import userRoutes from "./user.routes";
import taskRoutes from "./task.routes"
import { Router } from "express";

const router = Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes)

export default router;




