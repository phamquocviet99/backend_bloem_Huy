import express from "express";
import {
  get,
  post,
  getById,
  updateStatus,
  getByIdVendor,
  getByIdCustomer,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", post);
router.get("/:id", getById);
router.get("/", get);
router.get("/vendor/:id", getByIdVendor);
router.get("/customer/:id", getByIdCustomer);
router.put("/:id/:status", updateStatus);
// router.delete("/:id", deleteById);

export default router;
