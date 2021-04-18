const router = require("express").Router();

const mailboxController = require("../controllers/mailbox.controller");

router.get("/", mailboxController.getMailbox);

module.exports = router;
