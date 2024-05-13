const express = require("express");
const cors = require("cors");
const app = express();
const { connect } = require("./Services/Connection");

app.use(express.json());
app.use(cors());

connect("mongodb://127.0.0.1:27017/", (error) => {
  if (error) {
    console.log("Failed to connect");
    process.exit(-1);
  } else {
    console.log("successfully connected");
  }
});

console.log("(🌸◕ワ◕)(⁄ ⁄◕⁄ω⁄◕⁄ ⁄✿)");
app.listen(3006);
