import express from "express";
import {
  post,
  get,
  getById,
  updateRating,
  deleteById
} from "../controllers/demand.controller.js";

const router = express.Router();

router.post("/", post);
router.get("/", get);
router.get("/:id", getById);
router.delete("/:id", deleteById);
router.put("/:id/:rating", updateRating);

export default router;
