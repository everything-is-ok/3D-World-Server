const router = require("express").Router();

const roomControllers = require("../controllers/room.controller");
const deserialize = require("../middlewares/deserialize");

router.get("/", deserialize, roomControllers.getRoomByToken);

router.get("/:userId", roomControllers.getRoomByUserId);

module.exports = router;
