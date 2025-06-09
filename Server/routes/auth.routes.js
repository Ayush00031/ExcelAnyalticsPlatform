import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controllers.js";
import auth from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);

export default router;
