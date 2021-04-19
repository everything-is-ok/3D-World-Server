const router = require("express").Router();

const mailboxControllers = require("../controllers/mailbox.controller");
const deserialize = require("../middlewares/deserialize");

router.get("/", deserialize, mailboxControllers.getMailList);
router.delete("/", deserialize, mailboxControllers.deleteMailList);
// router.patch("/read", mailboxControllers.readMail);
router.post("/mail/:id", deserialize, mailboxControllers.postMail);
// router.delete("/mail/:id", mailboxControllers.deleteMail);

module.exports = router;
