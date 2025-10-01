"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const task_controller_1 = require("../controllers/task.controller");
const router = (0, express_1.Router)();
// All routes are protected
router.use(auth_middlewares_1.verifyJWT);
// Task routes
router.post("/createTask", task_controller_1.createTask);
router.put("/updateTask/:taskId", task_controller_1.updateTask);
router.patch("/updateTaskStatus/:taskId", task_controller_1.updateTaskStatus);
router.get("/getTaskStatus/:taskId", task_controller_1.getTaskStatus);
exports.default = router;
//# sourceMappingURL=task.routes.js.map