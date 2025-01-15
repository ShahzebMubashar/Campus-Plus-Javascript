import express from "express";

import { login, register, logout } from "../controllers/authController.js";
import { checkAuthorisation } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", checkAuthorisation, logout);

export default router;
