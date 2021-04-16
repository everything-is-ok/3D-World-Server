const express = require("express");

const room = require("./room");
const user = require("./user");
const mailbox = require("./mailbox");

const router = express.Router();

router.use("/room", room);
router.use("/user", user);
router.use("/mailbox", mailbox);

module.exports = router;
