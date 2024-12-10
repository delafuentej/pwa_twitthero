// Routes.js - Módulo de rutas
var express = require("express");
var router = express.Router();

const messages = [
  {
    _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    user: "batgirl",
    message: "Hi! It is very cold today!!",
  },
  {
    _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    user: "batman",
    message: "We're going to have to warm up by beating each other up !!",
  },
  {
    _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    user: "superman",
    message:
      "Shit! And my heating is broken! Plus I'm having the side effects of the kryptonite.!!",
  },
  {
    _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    user: "hulk",
    message: "I finally have a lucky day! This is my favorite sport!!!",
  },
  {
    _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    user: "wolverine",
    message:
      "I just feel like lying on the couch with a blanket in this weather!!",
  },
  {
    _id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    user: "wonder-woman",
    message: "Do you need company, Wolverine??",
  },
];

//GET MESSAGES
router.get("/", function (req, res) {
  res.json(messages);
});
//POST MESSAGES
router.post("/", function (req, res) {
  const message = {
    message: req.body.message,
    user: req.body.user,
  };
  messages.push(message);
  console.log(messages);
  res.json({ ok: true, message });
});

module.exports = router;
