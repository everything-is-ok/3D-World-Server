const express = require("express");

const userController = require("../controllers/user.controller");

const router = express.Router();

// TODO: rename
router.post("/", userController.postLogin);
router.get("/", userController.getUserByToken);
router.delete("/", userController.deleteUser);

router.get("/:id", userController.getUserById);

module.exports = router;
