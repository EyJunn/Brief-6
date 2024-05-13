const express = require("express");
const { register, login } = require("../UserController");
const { middleEmail } = require("../../Middlewares/middlewares");
const router = express.Router();

router.post("/register", middleEmail, register);
router.post("/login", middleEmail, login);

module.exports = router;
