import express, { Router } from "express";
import validateToken from "../middleware/validateToken";
import {
  deleteOrder,
  getAllOrders,
  getOrderById,
  registerOrder,
  updateOrder,
} from "../controllers/orders";

const router: Router = express.Router();

router.post("/register", validateToken, registerOrder);
router.patch("/update/:id", validateToken, updateOrder);
router.delete("/delete/:id", validateToken, deleteOrder);
router.get("/getAll", validateToken, getAllOrders);
router.get("/getById/:id", validateToken, getOrderById);

export default router;
