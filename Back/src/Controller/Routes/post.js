const express = require("express");
const { addPost, getAllPost, deletePost, editPost } = require("../Post");
const Router = express.Router();

Router.post("/addPost", addPost);
Router.get("/getAllPost", getAllPost);
Router.delete("/deletePost", deletePost);
Router.patch("/editPost", editPost);

module.exports = Router;
