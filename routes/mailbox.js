const router = require("express").Router();

const roomControllers = require("../controllers/room.controller");

router.get("/", roomControllers.getRoom);

module.exports = router;
