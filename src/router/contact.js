const express = require("express");
const Contact = require("../models/contact");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/contacts", auth, async function (req, res) {
  const contact = new Contact({
    ...req.body,
    owner: req.user._id,
  });
  try {
    const result = await contact.save();
    res.status(200).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/contacts", auth, async function (req, res) {
  try {
    await req.user
      .populate({
        path: "contacts",
      })
      .execPopulate();
    res.status(200).send(req.user.contacts);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/contacts/:id", auth, async function (req, res) {
  const _id = req.params.id;
  try {
    const result = await Contact.findOne({ _id, owner: req.user.id });
    if (!result) {
      res.status(404).send();
    }
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/contacts/:id", auth, async function (req, res) {
  const updates = Object.keys(req.body);
  const allowdUpdates = ["name", "number"];
  const isValidUpdate = updates.every((update) => {
    return allowdUpdates.includes(update);
  });
  if (!isValidUpdate) {
    res.status(400).send({ error: "Invalid updates !!" });
  }
  try {
    const result = await Contact.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!result) {
      res.status(404).send();
    }
    updates.forEach((update) => {
      result[update] = req.body[update];
    });
    await result.save();

    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/contacts/:id", auth, async function (req, res) {
  try {
    const result = await Contact.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!result) {
      res.status(404).send();
    }
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
