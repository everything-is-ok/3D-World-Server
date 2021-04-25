const router = require("express").Router();

const itemControllers = require("../controllers/item.controller");
const deserialize = require("../middlewares/deserialize");

router.post("/", deserialize, itemControllers.insertItem);
router.get("/", deserialize, itemControllers.getItems);
router.patch("/", deserialize, itemControllers.updatePosition);

module.exports = router;
