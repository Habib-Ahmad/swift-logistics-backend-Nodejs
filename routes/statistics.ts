import express, { Router } from "express";
import validateToken from "../middleware/validateToken";
import { getAllStats } from "../controllers/statistics";

const router: Router = express.Router();

router.get("/getAll", validateToken, getAllStats);

export default router;
