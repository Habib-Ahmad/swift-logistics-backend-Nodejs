import express, { Router } from "express";
import validateToken from "../middleware/validateToken";
import {
  deleteDriver,
  getAllDrivers,
  getDriverById,
  registerDriver,
  updateDriver,
} from "../controllers/drivers";

const router: Router = express.Router();

router.post("/register", validateToken, registerDriver);
router.patch("/update/:id", validateToken, updateDriver);
router.delete("/delete/:id", validateToken, deleteDriver);
router.get("/getAll", validateToken, getAllDrivers);
router.get("/getById/:id", validateToken, getDriverById);

export default router;
