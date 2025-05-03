const express = require("express");
const { viewUserInfo, editUserInfo, currentCourses } = require("../controllers/userController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", checkAuthorisation, viewUserInfo);
router.put("/profile", checkAuthorisation, editUserInfo);
router.get("/current-courses", checkAuthorisation, currentCourses);

module.exports = router;
