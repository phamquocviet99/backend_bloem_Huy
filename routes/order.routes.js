import express from "express";
import {
  post
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", post);
// router.get("/:id", getByIdVendor);
// router.delete("/:id", deleteById);

export default router;
