const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../Services/SqlConnection");
const express = require("express");
const path = require("path");
const multer = require("multer");
const { extractToken } = require("../Utils/Token");
const app = express();
const uploadDirectory = path.join(__dirname, "../public/uploads");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const { transporter } = require("../Services/mailer");

const register = async (req, res) => {
  if (
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.image ||
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
      console.log(insertVALUES);
      const [rows] = await pool.execute(sqlInsertRequest, insertVALUES);
      const activationToken = await bcrypt.hash(email, 10);
      let cleanToken = activationToken.replaceAll("/", "");
      if (rows.affectedRows > 0) {
        const info = await transporter.sendMail({
          from: `${process.env.SMTP_EMAIL}`,
          to: email,
          subject: "Email activation",
          text: "Activate your remail",
          html: `<p> You need to activate your email, to access our services, please click on this link :
                <a href="http://localhost:3006/user/activate/${cleanToken}">Activate your email</a>
          </p>`,
        });

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
      const hash = await bcrypt.compareSync(password, result[0].user_password);

      if (!hash) {
        res.status(401).json({ error: "Not valid Credentials" });
        return;
      } else {
        const token = jwt.sign(
          {
            email: result[0].user_email,
            id: result[0].user_id,
            role: result[0].role,
          },
          process.env.MY_SECRET_KEY,
          { expiresIn: "20d" }
        );
        res.status(200).json({ jwt: token, role: result[0].role });
        return;
      }
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ message: "Server error" });
  }
};

const insertImage = async (req, res) => {
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

//appelation du user par l'authdata
const getUser = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      response.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      try {
        const user_id = authData.id;
        const sql =
          "SELECT *, CONCAT('/uploads/', user_image) as avatar FROM user WHERE user_id = ?";

        const value = [user_id];

        const [rows] = await pool.execute(sql, value);
        res.json(rows);
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error Server" });
      }
    }
  });
};

const activateEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const sql = `SELECT FROM client WHERE token = ?`;
    const values = [token];
    const [result] = await pool.execute(sql, values);
    if (!result) {
      res.status(204).json({});
      return;
    }

    await pool.execute(
      `UPDATE client SET isActive = 1, token= NULL WHERE token = ?`,
      [token]
    );
    res.status(200).json({ result: "Validation" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getAllUser = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      response.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      try {
        const sql =
          "SELECT *, CONCAT('/uploads/', user_image) as avatar FROM user ";

        const [rows] = await pool.execute(sql);
        res.json(rows);
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error Server" });
      }
    }
  });
};

module.exports = {
  register,
  login,
  insertImage,
  getUser,
  activateEmail,
  getAllUser,
};
