const express = require("express");
const { register, login, insertArticlePicture } = require("../UserController");
const { middleEmail } = require("../../Middlewares/middlewares");
const router = express.Router();

router.post("/register", middleEmail, register);
router.post("/login", middleEmail, login);
router.post("/imageUser", insertArticlePicture);

module.exports = router;
