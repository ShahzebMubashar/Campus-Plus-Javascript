import express from "express";

import { viewUserInfo, editUserInfo } from "../controllers/userController.js";
import { checkAuthorisation } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", checkAuthorisation, viewUserInfo);
router.put("/profile", checkAuthorisation, editUserInfo);

export default router;
