const express = require("express");

const { login, register, logout } = require("../controllers/authController");
const { checkAuthorisation } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", checkAuthorisation, logout);
// router.get('/', async(request, response)=>{
//     response.status(200).send("Hi there");
// })
module.exports = router;
