const validator = require("validator");

const middleEmail = (req, res, next) => {
  const email = req.body.email;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "please send a email" });
  }
  req.isEmail = email;
  next();
};

module.exports = { middleEmail };
