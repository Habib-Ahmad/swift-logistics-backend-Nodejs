import express, { Router } from "express";
import validateToken from "../middleware/validateToken";
import {
  deleteShipmentInstance,
  getAllShipmentInstances,
  getShipmentInstanceById,
  registerShipmentInstance,
  updateShipmentInstance,
} from "../controllers/shipmentInstances";

const router: Router = express.Router();

router.post("/register", validateToken, registerShipmentInstance);
router.patch("/update/:id", validateToken, updateShipmentInstance);
router.delete("/delete/:id", validateToken, deleteShipmentInstance);
router.get("/getAll", validateToken, getAllShipmentInstances);
router.get("/getById/:id", validateToken, getShipmentInstanceById);

export default router;
