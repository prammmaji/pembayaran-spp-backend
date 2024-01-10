import express from "express";
import { getTagihan,createTagihan,getTagihanById,updateTagihan,deleteTagihan,getTagihanAktif } from "../controllers/tagihanConttollers.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js"

const router = express.Router();

router.get("/tagihan/all", verifyUser,adminOnly, getTagihan);
router.get("/tagihan/aktif", verifyUser,getTagihanAktif);
router.get("/tagihan/:id", verifyUser,getTagihanById);
router.post("/tagihan", verifyUser,adminOnly,createTagihan);
router.patch("/tagihan/:id", verifyUser,adminOnly,updateTagihan);
router.delete("/tagihan/:id",verifyUser,adminOnly, deleteTagihan);


export default router;