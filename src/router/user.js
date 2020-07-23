const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

const router = express.Router();

router.post("/users", async function (req, res) {
  const user = new User(req.body);
  try {
    const resp = await user.save();
    const token = await resp.generatAuthToken();
    res.status(200).send({ resp, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async function (req, res) {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (user === "unable to login") {
      res.send("please Sign in first");
    }
    const token = await user.generatAuthToken();
    res.send({ user: user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
