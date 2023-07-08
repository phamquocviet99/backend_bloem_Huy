import express from "express";
import {
  post,
  get,
  getById,
  updateRating,
  getByIdVendor,
  deleteById,
  postComment,
} from "../controllers/demand.controller.js";

const router = express.Router();

router.post("/", post);
router.get("/", get);
router.put("/comments/:id", postComment);
router.get("/:id", getById);
router.get("/vendor/:id", getByIdVendor);
router.delete("/:id", deleteById);
router.put("/:id/:rating", updateRating);

export default router;
