const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../Services/DBConnection");

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
  let email = req.body.email;
  let password = req.body.password;

  try {
    const values = [email];

    const sqlSelectRequest = "SELECT user_email FROM users WHERE user_email =?";
    const [result] = await pool.execute(sqlSelectRequest, values);

    if (result.length !== 0) {
      res.status(400).json({ error: "Invalid credentials" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sqlInsertRequest =
        "INSERT INTO users (first_name, last_name, email, password) VALUES(?, ?, ?, ?)";

      const insertVALUES = [first_name, last_name, email, hashedPassword];

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

    const sql = "SELECT * FROM users WHERE email=?";

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

module.exports = { register, login };
