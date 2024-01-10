import express from "express";
import { me, Login, Logout} from "../controllers/authController.js";

const router = express.Router();

router.get("/me", me);
router.post("/login", Login);
router.delete("/logout", Logout);


export default router;