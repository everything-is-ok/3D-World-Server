const express = require("express");

const roomControllers = require("../controllers/room.controller");

const router = express.Router();

router.get("/", roomControllers.getRoom);

module.exports = router;
