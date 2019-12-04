const express = require('express');
const helmet = require("helmet");

const postsRouter = require('../posts/postRouter');

const server = express();

//MIDDLEWARE

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`)

  next(); //allows continuation
}

function gatekeeper(req, res, next) {
  console.log(`${req.headers}`)

  if (req.headers.password === "mellon") {
    next();
  } else {
    res.status(401).json({ error: "Wrong password" })
  }
}

const checkRole = (role) => {
  return function(req,res,next){
    if(role && role === req.headers.role){
    next();
  }else{
    res.status(403).json({error: "wrong role"})
  }
  }
  
}

server.use(helmet());
server.use(express.json());
server.use(logger);

//ENDPOINTS
server.use('/api/posts', helmet(), postsRouter);

server.get('/', (req, res) => {
  const nameInsert = req.name ? `${req.name}` : "World";

  res.send(`
    <h2>API</h2>
    <p>Hello ${nameInsert}</p>
    `);
});

server.get("/echo", (req, res) => {
  res.send(req.headers);
});

server.get("/area51", helmet(), gatekeeper, checkRole("agent"), (req, res) => {
  res.send(req.headers);
})






module.exports = server;