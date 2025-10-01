import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateDetails,
} from "../controllers/user.controllers";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refreshToken", refreshAccessToken);

// Protected routes (require authentication)
router.get("/getUser", verifyJWT, getCurrentUser);
router.put("/changePassword", verifyJWT, changeCurrentPassword);
router.put("/updateDetails", verifyJWT, updateDetails);

export default router;
