const router = require("express").Router();

const roomControllers = require("../controllers/room.controller");
const deserialize = require("../middlewares/deserialize");

router.get("/", deserialize, roomControllers.getRoomByToken);

router.get("/:userId", roomControllers.getRoomByUserId);
// TODO: 사용하지 않는다면 추후 삭제
// router.get("/:id", roomControllers.getRoomById);

module.exports = router;
