const router = require("express").Router();

const room = require("./room");
const user = require("./user");
const mailbox = require("./mailbox");

router.use("/room", room);
router.use("/user", user);
router.use("/mailbox", mailbox);

module.exports = router;
