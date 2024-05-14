const { ObjectId } = require("bson");
const { Post } = require("../Models/Post");
const client = require("../Services/SqlConnection");
const { extractToken } = require("../Utils/Token");

async function addPost(request, response) {
  const token = await extractToken(request);

  jwt.verify(token, process.env.My_Secret_Key, async (err, authData) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized" });
      return;
    } else {
      if (!request.body.title || !request.body.description) {
        response.status(400).send("Missing fields");
        return;
      }

      try {
        let newPost = new Post(
          request.body.image,
          request.body.description,
          request.body.price,
          new Date(),
          request.body.userId
        );
        let result = await client
          .db("brief_6")
          .collection("Post")
          .insertOne(newPost);
        response.status(200).json(result);
      } catch (e) {
        console.log(e);
        response.status(500).json({ error: e });
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

async function editPost(req, res) {
  let image = req.body.image;
  let description = req.body.description;

  if (!image || !description) {
    res.status(400).json({ msg: "Missing Fields" });
  }

  try {
    let apiRes = await client
      .db("Brief_6")
      .collection("Post")
      .updateOne(
        {
          _id: id,
        },
        {
          $set: {
            image: image,
            description: description,
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

module.exports = { addPost, deletePost, getAllPost, editPost };
