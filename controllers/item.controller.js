const createError = require("http-errors");
const mongoose = require("mongoose");

const Room = require("../models/Room");

async function updatePosition(req, res, next) {
  const { id, position } = req.body;

  if (!(mongoose.Types.ObjectId.isValid(id))) {
    next(createError(404, "Not found"));
    return;
  }

  try {
    await Room.findOneAndUpdate(
      { "items._id": id },
      { $set: { "items.$[elem].position": position } },
      {
        arrayFilters: [{
          "elem._id": mongoose.Types.ObjectId(id),
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

// NOTE 관리자용
async function getItems(req, res, next) {
  if (!req.user) {
    next(createError(401, "Authorization is invalid"));
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

// NOTE 관리자용
async function insertItem(req, res, next) {
  const { _id } = req.user;

  try {
    const room = await Room.findOneAndUpdate(
      { ownerId: _id },
      {
        $push: {
          items: {
            _id: "60817a4063620b071bb7a455",
            position: [120, 24, 120],
          },
        },
      },
      { new: true },
    );

    res.json({
      ok: true,
      data: room,
    });
  } catch (err) {
    next(err);
  }
}

exports.getItems = getItems;
exports.updatePosition = updatePosition;
exports.insertItem = insertItem;
