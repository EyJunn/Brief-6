const validator = require("validator");

const middleEmail = (req, res, next) => {
  const email = req.body.email;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "please send a email" });
  }
  req.isEmail = email;
  next();
};

const middleName = (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;

  if (!validator.isAlpha(first_name && last_name)) {
    return res.status(400).json({ msg: "Credentials not valid." });
  }

  req.isAlpha += first_name;
  req.isAlpha += last_name;
  next();
};

module.exports = { middleEmail, middleName };
