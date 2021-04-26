const mongoose = require("mongoose");
const Item = require("../models/Item");

const Room = require("../models/Room");
const itemData = require("../models/mockItem.json");
const {
  createRequestError,
  createAuthenticationError,
} = require("../utils/errors");

async function updatePosition(req, res, next) {
  const { id, position } = req.body;

  if (!(mongoose.Types.ObjectId.isValid(id))) {
    next(createRequestError());
    return;
  }

  try {
    await Room.findOneAndUpdate(
      { "items._id": id },
      { $set: { "items.$.position": position } },
      { new: true },
    );

    res.json({
      ok: true,
      data: { id, position },
    });
  } catch (err) {
    console.log("💥 updatePosition");
    next(err);
  }
}

// NOTE 관리자용
async function getItems(req, res, next) {
  if (!req.user) {
    next(createAuthenticationError());
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
    console.log("💥 getItems");
    next(err);
  }
}

// NOTE 관리자용
async function insertItem(req, res, next) {
  try {
    for (let i = 0; i < itemData.length; i++) {
      await Item.create(itemData[i]);
    }

    const itemList = await Item.find({}).lean();

    res.json({
      ok: true,
      data: itemList,
    });
  } catch (err) {
    console.log("💥 insertItem");
    next(err);
  }
}
// async function insertItem(req, res, next) {
//   if (!req.user) {
//     next(createAuthenticationError());
//     return;
//   }

//   const { _id } = req.user;

//   try {
//     const room = await Room.findOneAndUpdate(
//       { ownerId: _id },
//       {
//         $push: {
//           items: {
//             _id: "60817a4063620b071bb7a455",
//             position: [120, 24, 120],
//           },
//         },
//       },
//       { new: true },
//     );

//     res.json({
//       ok: true,
//       data: room,
//     });
//   } catch (err) {
//     console.log("💥 insertItem");
//     next(err);
//   }
// }

exports.getItems = getItems;
exports.updatePosition = updatePosition;
exports.insertItem = insertItem;
