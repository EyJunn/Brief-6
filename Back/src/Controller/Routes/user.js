const express = require("express");
const { register, login, insertImage } = require("../UserController");
const { middleEmail, middleName } = require("../../Middlewares/middlewares");
const router = express.Router();

router.post("/register", middleEmail, middleName, register);
router.post("/login", middleEmail, login);
router.post("/imageUser", insertImage);

module.exports = router;
