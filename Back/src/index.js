const express = require("express");
const cors = require("cors");
const { connect } = require("./Services/NoSqlConnection");
const app = express();
const userRouter = require("./Controller/Routes/user");

require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

connect(process.env.MY_MONGODB, (error) => {
  if (error) {
    console.log("Failed to connect");
    process.exit(-1);
  } else {
    console.log("successfully connected");
  }
});

//MongoDB
app.listen(3009);
console.log("No no don't touch me there, that is my no no square");

//SQL
app.listen(process.env.PORT, () => {
  console.log("(🌸◕ワ◕)(⁄ ⁄◕⁄ω⁄◕⁄ ⁄✿)");
});
