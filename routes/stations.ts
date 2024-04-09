import express, { Router } from "express";
import validateToken from "../middleware/validateToken";
import {
  registerStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../controllers/stations";

const router: Router = express.Router();

router.post("/register", validateToken, registerStation);
router.get("/getAll", validateToken, getAllStations);
router.get("/getById/:id", validateToken, getStationById);
router.patch("/update/:id", validateToken, updateStation);
router.delete("/delete/:id", validateToken, deleteStation);

export default router;
