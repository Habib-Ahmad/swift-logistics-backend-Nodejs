import express, { Router } from "express";
import validateToken from "../middleware/validateToken";
import {
  deleteVehicle,
  getAllVehicles,
  getVehicleById,
  registerVehicle,
  updateVehicle,
} from "../controllers/vehicles";

const router: Router = express.Router();

router.post("/register", validateToken, registerVehicle);
router.patch("/update/:id", validateToken, updateVehicle);
router.delete("/delete/:id", validateToken, deleteVehicle);
router.get("/getAll", validateToken, getAllVehicles);
router.get("/getById/:id", validateToken, getVehicleById);

export default router;
