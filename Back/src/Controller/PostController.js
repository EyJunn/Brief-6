const { ObjectId } = require("bson");
const { Post } = require("../Models/Post");
const client = require("../Services/NoSqlConnection");
const { extractToken } = require("../Utils/Token");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function addPost(req, res) {
  const token = await extractToken(req);

  jwt.verify(token, process.env.MY_SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      if (!req.body.title || !req.body.description) {
        res.status(400).send("Missing fields");
        return;
      }

      try {
        let newPost = new Post(
          req.body.title,
          req.body.image,
          req.body.description,
          new Date(),
          authData.id
        );
        let result = await client
          .db("brief_6")
          .collection("Post")
          .insertOne(newPost);
        res.status(200).json(result);
      } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
      }
    }
  });
}

async function getAllPost(req, res) {
  try {
    let apiCall = client.db("Brief_6").collection("Post").find();

    let listings = await apiCall.toArray();

    res.status(200).json(listings);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function deletePost(req, res) {
  const token = await extractToken(request);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      response.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      if (!req.params.id) {
        res.status(400).send("Id Obligatoire");
      }

      let id = new ObjectId(req.params.id);

      let apiCall = await client
        .db("Brief_6")
        .collection("Post")
        .deleteOne({ _id: id });

      let response = await apiCall;

      if (response.deletedCount === 1) {
        res.status(200).json({ msg: "Suppression réussie" });
      } else {
        res.status(204).json({ msg: "Pas d'annonce pour ce post" });
      }
    }
  });
}

async function editPost(req, res) {
  const token = await extractToken(req);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      let image = req.body.image;
      let description = req.body.description;
      let title = req.body.title;

      // if (!image || !description) {
      //   res.status(400).json({ msg: "Missing Fields" });
      // }

      try {
        let apiRes = await client
          .db("Brief_6")
          .collection("Post")
          .updateOne(
            {
              id: authData.id,
            },
            {
              $set: {
                title: title,
                description: description,
                image: image,
              },
            }
          );
        if (apiRes.modifiedCount === 1) {
          res.status(200).json({ msg: "Update successful" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Update failed" });
      }
    }
  });
}

module.exports = { addPost, deletePost, getAllPost, editPost };
