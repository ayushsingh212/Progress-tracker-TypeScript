"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", user_controllers_1.registerUser);
router.post("/login", user_controllers_1.loginUser);
router.get("/refreshToken", user_controllers_1.refreshAccessToken);
// Protected routes (require authentication)
router.get("/getUser", auth_middlewares_1.verifyJWT, user_controllers_1.getCurrentUser);
router.put("/changePassword", auth_middlewares_1.verifyJWT, user_controllers_1.changeCurrentPassword);
router.put("/updateDetails", auth_middlewares_1.verifyJWT, user_controllers_1.updateDetails);
exports.default = router;
//# sourceMappingURL=user.routes.js.map