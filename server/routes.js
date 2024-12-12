// Routes.js - Módulo de rutas
const express = require("express");
const router = express.Router();
const push = require("./push.js");

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

// NOTIFICATIONS

//  to store the subscription => to receive
//the subscription object & to store it in the db
router.post("/subscribe", function (req, res) {
  res.json("subscribe");
});
// to obtain the public key=> to send the public key to the clients
//so that it can be processed by the clients and the subscription can be sent to us.
router.get("/key", function (req, res) {
  const key = push.getKey();
  res.send(key);
});

// to send "push" notifications => to be able to send push notifications via postmann
// It is not normally handled as a service rest
//but is normally controlled from the server side.
router.post("/push", function (req, res) {
  res.json("push notification");
});

module.exports = router;
