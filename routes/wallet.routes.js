import express from "express";
import { getWallet, deposit ,withDraw} from "../controllers/wallet.controller.js";

const router = express.Router();

router.get("/:id", getWallet);
router.post("/deposit/:id", deposit);
router.post("/withDraw/:id", withDraw);
// router.put("/:id/:status", updateStatus);

export default router;
