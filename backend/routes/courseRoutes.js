import express from "express";
import cors from "cors";

import {
  getCourses,
  rateCourse,
  reviewCourse,
} from "../controllers/courseController.js";
import { checkAuthorisation } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(cors());

router.get("/", getCourses);
router.post("/Rate-Course", checkAuthorisation, rateCourse);
router.post("/Review-Course", checkAuthorisation, reviewCourse);

export default router;
