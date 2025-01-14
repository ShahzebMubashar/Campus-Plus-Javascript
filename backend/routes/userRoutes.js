const express = require("express");

const { viewUserInfo, editUserInfo } = require("../controllers/userController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", checkAuthorisation, viewUserInfo);
router.put("/profile", checkAuthorisation, editUserInfo);

module.exports = router;