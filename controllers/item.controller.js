const createError = require("http-errors");
const mongoose = require("mongoose");

const Room = require("../models/Room");

// TODO 관리자용이라 추후 삭제가능
async function getItems(req, res, next) {
  if (!req.user) {
    next(createError(401, "authorization is invalid"));
    return;
  }

  const { _id } = req.user;

  try {
    const items = await Room.findOne({ ownerId: _id }, "items").lean()
      .populate("items");

    res.json({
      ok: true,
      data: items,
    });
  } catch (err) {
    next(err);
  }
}

async function updatePosition(req, res, next) {
  const { id, position } = req.body;

  if (!(mongoose.Types.ObjectId.isValid(id))) {
    next(createError(400, "id of params is invalid"));
    return;
  }

  try {
    await Room.findOneAndUpdate(
      { "items._id": id },
      { $set: { "items.$[elem].position": position } },
      {
        arrayFilters: [{
          "elem._id": new mongoose.Types.ObjectId(id),
        }],
        new: true,
      },
    );

    res.json({
      ok: true,
      data: { id, position },
    });
  } catch (err) {
    next(err);
  }
}

// NOTE 샘플 저장용
async function insertItem(req, res, next) {
  const { _id } = req.user;

  try {
    await Room.findOneAndUpdate(
      { ownerId: _id },
      {
        $push: {
          items: {
            _id: "60817a4063620b071bb7a455",
            position: [7 * 40, 24, 2 * 40],
          },
        },
      },
      { new: true },
    );
  } catch (err) {
    next(err);
  }
}

exports.getItems = getItems;
exports.updatePosition = updatePosition;
exports.insertItem = insertItem;
