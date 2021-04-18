const router = require("express").Router();

const userController = require("../controllers/user.controller");

// TODO: rename
router.post("/", userController.postLogin);
router.get("/", userController.getUserByToken);
router.delete("/", userController.deleteUser);

router.get("/:id", userController.getUserById);

module.exports = router;
