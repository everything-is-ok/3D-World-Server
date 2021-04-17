const express = require("express");

const userController = require("../controllers/user.controller");

const router = express.Router();

// TODO: rename
router.get("/", userController.getUserByToken);
router.post("/", userController.postLogin);
router.delete("/", userController.deleteUser);

module.exports = router;
