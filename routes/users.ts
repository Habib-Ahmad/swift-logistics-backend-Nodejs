import express, { Router } from "express";
import {
  getUserDetails,
  login,
  refreshToken,
  register,
} from "../controllers/users";
import validateToken from "../middleware/validateToken";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.get("/getCurrent", validateToken, getUserDetails);

export default router;
