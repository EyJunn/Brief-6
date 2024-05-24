const express = require("express");
const {
  register,
  login,
  insertImage,
  getUser,
  activateEmail,
  getUserById,
} = require("../UserController");
const { middleEmail, middleName } = require("../../Middlewares/middlewares");
const router = express.Router();

router.post("/register", middleEmail, middleName, register);
router.post("/login", middleEmail, login);
router.post("/imageUser", insertImage);
router.get("/getUser", getUser);
router.patch("/valide/:token", activateEmail);
router.get("/getUserById/:id", getUserById);

module.exports = router;
