const express = require("express");
const users = require("./userDb");
const posts = require("../posts/postDb");

const router = express.Router();

router.use(express.json());

router.post("/", validateUser, (req, res) => {
  users.insert(req.body).then(user => {
    res.status(201).json(user);
  });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const newBody = { ...req.body, user_id: req.params.id };

  posts.insert(newBody).then(post => {
    res.status(201).json(post);
  });
});

router.get("/", (req, res) => {
  users
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("error on GET /users", err);
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  users.getById(req.params.id).then(user => {
    res.status(200).json(user);
  });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  users.getUserPosts(req.params.id).then(posts => {
    res.status(200).json(posts);
  });
});

router.delete("/:id", validateUserId, (req, res) => {
  users.remove(req.params.id).then(response => {
    res.status(200).json({ message: "User deleted successfully" });
  });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  users.update(req.params.id, req.body).then(post => {
    res.status(200).json(post);
  });
});

//custom middleware

function validateUserId(req, res, next) {
  users
    .getById(req.params.id)
    .then(user => {
      console.log(user);
      if (user) {
        next();
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(`error on GET /users/:id`, err);
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
}

function validateUser(req, res, next) {
  if (!Object.keys(req.body).length > 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    console.log(req.body.name);
    next();
  }
}

function validatePost(req, res, next) {
  if (!Object.keys(req.body).length > 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    console.log(req.body.text);
    next();
  }
}

module.exports = router;
