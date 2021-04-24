const router = require("express").Router();

const room = require("./room");
const user = require("./user");
const mailbox = require("./mailbox");
const item = require("./item");

router.use("/room", room);
router.use("/user", user);
router.use("/mailbox", mailbox);
router.use("/item", item);

module.exports = router;
