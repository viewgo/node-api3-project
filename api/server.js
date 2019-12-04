const express = require("express");
const helmet = require("helmet");

const postsRouter = require("../posts/postRouter");

const server = express();

//MIDDLEWARE

//custom middleware
function logger(req, res, next) {
  req.requestTime = new Date().toUTCString();
  console.log(`"${req.method} to ${req.originalUrl}" @ ${req.requestTime}`);

  next(); //allows continuation
}

const validateUserId = id => {
  return function(req, res, next) {
    if (id && id === req.headers.id) {
      req.user = id;
      console.log(req.user);
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  };
};

const validateUser = () => {
  return function(req, res, next) {
    if (!Object.keys(req.body).length > 0) {
      res.status(400).json({ message: "missing user data" });
    } else if (!req.body.name) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      console.log(req.body.name);
      next();
    }
  };
};

const validatePost = () => {
  return function(req, res, next) {
    if (!Object.keys(req.body).length > 0) {
      res.status(400).json({ message: "missing post data" });
    } else if (!req.body.text) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      console.log(req.body.text);
      next();
    }
  };
};

// function gatekeeper(req, res, next) {
//   console.log(`${req.headers}`);

//   if (req.headers.password === "mellon") {
//     next();
//   } else {
//     res.status(401).json({ error: "Wrong password" });
//   }
// }

// const checkRole = role => {
//   return function(req, res, next) {
//     if (role && role === req.headers.role) {
//       next();
//     } else {
//       res.status(403).json({ error: "wrong role" });
//     }
//   };
// };

server.use(helmet());
server.use(express.json());
server.use(logger);

//ENDPOINTS
server.use("/api/posts", helmet(), postsRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? `${req.name}` : "World";

  res.send(`
    <h2>API</h2>
    <p>Hello ${nameInsert}</p>
    `);
});

server.get("/echo", (req, res) => {
  res.send(req.headers);
});

server.get("/area51", helmet(), validatePost(), (req, res) => {
  res.send(req.headers);
});

module.exports = server;
