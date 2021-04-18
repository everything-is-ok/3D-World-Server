const express = require("express");

const userController = require("../controllers/user.controller");

const router = express.Router();
router.get("/", userController.getUser);

// TODO: rename
router.post("/", userController.postLogin);

module.exports = router;
