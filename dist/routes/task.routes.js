"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const task_controller_1 = require("../controllers/task.controller");
const owner_middleware_1 = require("../middlewares/owner.middleware");
const router = (0, express_1.Router)();
router.use(auth_middlewares_1.verifyJWT);
router.post("/createTask", task_controller_1.createTask);
router.put("/updateTask/:taskId", owner_middleware_1.verifyOwner, task_controller_1.updateTask);
router.patch("/updateTaskStatus/:taskId", owner_middleware_1.verifyOwner, task_controller_1.updateTaskStatus);
router.get("/getTaskStatus/:taskId", owner_middleware_1.verifyOwner, task_controller_1.getTaskStatus);
router.delete("/deleteTask/:taskId", owner_middleware_1.verifyOwner, task_controller_1.deleteTask);
exports.default = router;
//# sourceMappingURL=task.routes.js.map