"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = __importDefault(require("./user.routes"));
const task_routes_1 = __importDefault(require("./task.routes"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use("/user", user_routes_1.default);
router.use("/task", task_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map