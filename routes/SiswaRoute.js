import express from "express";
import { getSiswa,findSiswa,addSiswa,deleteSiswa,updateSiswa } from "../controllers/siswaControllers.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js"

const router = express.Router();

router.get("/siswa", verifyUser, getSiswa);
router.get("/siswa/:id", verifyUser,adminOnly,findSiswa);
router.post("/siswa", verifyUser,addSiswa);
router.patch("/siswa/:id", verifyUser,adminOnly,updateSiswa);
router.delete("/siswa/:id",verifyUser,adminOnly, deleteSiswa);


export default router;