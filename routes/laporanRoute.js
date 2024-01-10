import express from "express";
import { hitung } from "../controllers/laporanController.js"
import { verifyUser, adminOnly } from "../middleware/AuthUser.js"

const router = express.Router();

router.get("/hitung", verifyUser, hitung);


export default router;