import express from "express";
import { getAllPembayaran,getPembayaranById,addPembayaran,updatePembayaran,deletePembayaran,midtrans, cekSudahBayar, belumBayar } from "../controllers/pembayaranController.js"
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();
// import multer from "multer";
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./public/images");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });
// const upload = multer({ storage: storage });


router.get("/pembayaran",verifyUser, getAllPembayaran);
router.get("/pembayaran/:id",verifyUser, getPembayaranById);
router.post("/pembayaran",verifyUser,addPembayaran);
router.patch("/pembayaran/:id",verifyUser,adminOnly, updatePembayaran);
router.delete("/pembayaran/:id",verifyUser,adminOnly, deletePembayaran);
router.post("/pembayaran/midtrans",verifyUser, midtrans);
router.get("/cekBayar/:id",verifyUser, cekSudahBayar);
router.get("/belumBayar/:id",verifyUser,adminOnly, belumBayar);
export default router