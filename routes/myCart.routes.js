import express from "express";
import {
  post,
  getByIdVendor,
  deleteById,
  get
} from "../controllers/myCart.controller.js";

const router = express.Router();

router.post("/", post);
router.get("/", get);
router.get("/:id", getByIdVendor);
router.delete("/:id", deleteById);

export default router;
