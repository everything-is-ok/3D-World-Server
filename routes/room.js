const router = require("express").Router();

const roomControllers = require("../controllers/room.controller");
const deserialize = require("../middlewares/deserialize");

router.get("/", deserialize, roomControllers.getRoomByToken);

router.get("/:id", roomControllers.getRoomById);

module.exports = router;
