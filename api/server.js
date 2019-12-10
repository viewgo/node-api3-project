const express = require("express");
const helmet = require("helmet");

const postsRouter = require("../posts/postRouter");
const usersRouter = require("../users/userRouter");

const server = express();



//MIDDLEWARE

//custom middleware
function logger(req, res, next) {
  req.requestTime = new Date().toUTCString();
  console.log(`"${req.method} to ${req.originalUrl}" @ ${req.requestTime}`);

  next(); //allows continuation
}


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


server.use(helmet());
server.use(express.json());
server.use(logger);

//ENDPOINTS
server.use("/api/posts", helmet(), postsRouter);
server.use("/api/users", helmet(), usersRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? `${req.name}` : "World";

  res.send(`
    <h2>API</h2>
    <p>Hello ${nameInsert}</p>
    `);
});


server.get("/area51", helmet(), validatePost(), (req, res) => {
  res.send(req.headers);
});

module.exports = server;
