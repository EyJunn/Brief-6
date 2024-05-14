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
    let apiCall = client.db("brief_6").collection("Post").find();

    let listings = await apiCall.toArray();

    res.status(200).json(listings);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

async function deletePost(req, res) {
  const token = await extractToken(req);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      response.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      if (!req.params.id) {
        res.status(400).send("Id required");
      }

      let id = new ObjectId(req.params.id);

      let apiCall = await client
        .db("brief_6")
        .collection("Post")
        .deleteOne({ _id: id });

      let response = await apiCall;

      if (response.deletedCount === 1) {
        res.status(200).json({ msg: "Suppression réussie" });
      } else {
        res.status(303).json({ msg: "Pas d'annonce pour ce post" });
      }
    }
  });
}

const updatePost = async (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.image) {
    response.status(400).json({ error: "Some fields are missing" });
  }
  let id = new ObjectId(req.params.id);

  let event = await client.db("brief_6").collection("Post").find({ _id: id });

  if (!event) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    let apiRes = await client
      .db("brief_6")
      .collection("Post")
      .updateOne(
        { _id: id },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
          },
        }
      );
    if (apiRes.modifiedCount === 1) {
      res.status(200).json({ msg: "Update successful" });
    } else {
      res.status(303).json({ msg: "Bah alors qu'est-ce que tu fais là ?" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = { addPost, deletePost, getAllPost, updatePost };
