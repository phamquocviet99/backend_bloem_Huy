import express from "express";
import {
  post,
  get,
  updateStatus,
} from "../controllers/feedBack.controller.js";

const router = express.Router();

router.post("/", post);
router.get("/", get);
router.put("/:id/:status", updateStatus);

export default router;
