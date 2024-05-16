const express = require("express");
const {
  register,
  login,
  insertImage,
  getAllUser,
  activateEmail,
} = require("../UserController");
const { middleEmail, middleName } = require("../../Middlewares/middlewares");
const router = express.Router();

router.post("/register", middleEmail, middleName, register);
router.post("/login", middleEmail, login);
router.post("/imageUser", insertImage);
router.get("/getUsers", getAllUser);
router.patch("/valide/:token", activateEmail);

module.exports = router;
