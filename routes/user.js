const router = require("express").Router();

const userController = require("../controllers/user.controller");
const deserialize = require("../middlewares/deserialize");

// TODO: rename
router.post("/", userController.postLogin);
router.get("/", deserialize, userController.getUserByToken);
router.patch("/", deserialize, userController.updateUser);
router.delete("/", deserialize, userController.deleteUser);

router.get("/:id", userController.getUserById);
router.get("/random", userController.getRandomUserIds);

module.exports = router;
