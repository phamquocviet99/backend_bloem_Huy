import express from "express";
import {
  post,
  getByIdVendor,
  deleteById,
} from "../controllers/myCart.controller.js";

const router = express.Router();

router.post("/", post);
router.get("/:id", getByIdVendor);
router.delete("/:id", deleteById);

export default router;
