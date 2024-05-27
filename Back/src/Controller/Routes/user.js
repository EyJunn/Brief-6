const express = require("express");
const {
  register,
  login,
  insertImage,
  getUser,
  activateEmail,
  getAllUser,
  follow,
  getUserByFN,
  getUserByEmail,
} = require("../UserController");
const { middleEmail, middleName } = require("../../Middlewares/middlewares");
const router = express.Router();

router.post("/register", middleEmail, middleName, register);
router.post("/login", middleEmail, login);
router.post("/imageUser", insertImage);
router.get("/getUser", getUser);
router.patch("/valide/:token", activateEmail);
router.get("/getAllUser", getAllUser);
router.post("/follow/:id", follow);
router.get("/getUserByName/:first_name", getUserByFN);
router.get("/getUserByEmail/:email", getUserByEmail);

module.exports = router;
