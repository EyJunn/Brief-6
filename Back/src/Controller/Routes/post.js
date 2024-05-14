const express = require("express");
const {
  addPost,
  getAllPost,
  deletePost,
  updatePost,
} = require("../PostController");
const Router = express.Router();

Router.post("/addPost", addPost);
Router.get("/getAllPost", getAllPost);
Router.delete("/deletePost/:id", deletePost);
Router.patch("/editPost/:id", updatePost);

module.exports = Router;
