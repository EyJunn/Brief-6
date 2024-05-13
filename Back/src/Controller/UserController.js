const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../Services/SqlConnection");
const express = require("express");
const path = require("path");
const multer = require("multer");
const app = express();
const uploadDirectory = path.join(__dirname, "../public/uploads");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const register = async (req, res) => {
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.email ||
    !req.body.password
  ) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let image = req.body.image;
  let email = req.body.email;
  let password = req.body.password;

  try {
    const values = [email];

    const sqlSelectRequest = "SELECT user_email FROM user WHERE user_email =?";
    const [result] = await pool.execute(sqlSelectRequest, values);

    if (result.length !== 0) {
      res.status(400).json({ error: "Invalid credentials" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sqlInsertRequest =
        "INSERT INTO user (user_email, user_image, user_last_name, user_first_name, user_password) VALUES(?, ?, ?, ?, ?)";

      const insertVALUES = [
        email,
        image,
        last_name,
        first_name,
        hashedPassword,
      ];

      const [rows] = await pool.execute(sqlInsertRequest, insertVALUES);

      if (rows.affectedRows > 0) {
        res.status(200).json({ success: "registration successful" });
        return;
      } else {
        res.status(500).json({ error: "registration failed" });
      }
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  let email = req.body.email;
  let password = req.body.password;

  try {
    const values = [email];

    const sql = "SELECT * FROM user WHERE user_email=?";

    const [result] = await pool.execute(sql, values);

    if (result.length === 0) {
      res.status(401).json({ error: "Invalid Credentials" });
    } else {
      await bcrypt.compare(
        password,
        result[0].password,
        function (err, bcryptresult) {
          if (err) {
            res.status(401).json({ error: "Not valid Credentials" });
            return;
          }

          const token = jwt.sign(
            {
              email: result[0].email,
              id: result[0].id,
              role: result[0].role,
            },
            process.env.MY_SECRET_KEY,
            { expiresIn: "20d" }
          );
          res.status(200).json({ jwt: token, role: result[0].role });
          return;
        }
      );
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "Server error" });
  }
};

const insertArticlePicture = async (req, res) => {
  let newFileName;
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      newFileName = `${file.fieldname}-${Date.now()}.jpg`;
      cb(null, newFileName);
    },
  });

  const maxSize = 3 * 1000 * 1000;

  let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);

      var extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mimetype && extname) {
        return cb(null, true);
      }

      cb(
        "Error: File upload only supports the " +
          "following filetypes - " +
          filetypes
      );
    },
  }).single("image");

  upload(req, res, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send({ newFileName: newFileName });
    }
  });
};
module.exports = { register, login };
