import express, { Router } from "express";
import validateToken from "../middleware/validateToken";
import {
  deleteShipment,
  getAllShipments,
  getShipmentById,
  registerShipment,
  updateShipment,
} from "../controllers/shipments";

const router: Router = express.Router();

router.post("/register", validateToken, registerShipment);
router.patch("/update/:id", validateToken, updateShipment);
router.delete("/delete/:id", validateToken, deleteShipment);
router.get("/getAll", validateToken, getAllShipments);
router.get("/getById/:id", validateToken, getShipmentById);

export default router;
