import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateDetails,
} from "../controllers/user.controllers";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router = Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",verifyJWT,logoutUser)
router.get("/refreshToken", refreshAccessToken);

router.get("/getUser", verifyJWT, getCurrentUser);
router.put("/changePassword", verifyJWT, changeCurrentPassword);
router.put("/updateDetails", verifyJWT, updateDetails);

export default router;
