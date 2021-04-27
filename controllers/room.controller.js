const mongoose = require("mongoose");

const Room = require("../models/Room");
const { createLoginError, createNotFoundError } = require("../utils/errors");

async function getRoomByToken(req, res, next) {
  if (!req.user) {
    next(createLoginError("Unauthorized user"));
    return;
  }

  console.log(req.user);
  const { roomId } = req.user;

  try {
    const room = await Room.findById(roomId).lean();

    res.json({ ok: true, data: room });
  } catch (err) {
    console.log("💥 getRoomByToken");
    next(err);
  }
}

async function getRoomByUserId(req, res, next) {
  const { userId } = req.params;

  if (!(mongoose.Types.ObjectId.isValid(userId))) {
    next(createNotFoundError());
    return;
  }

  try {
    const room = await Room.findOne({ ownerId: userId }).lean();

    if (!room) {
      next(createNotFoundError());
      return;
    }

    res.json({ ok: true, data: room });
  } catch (err) {
    console.log("💥 getRoomByUserId");
    next(err);
  }
}

exports.getRoomByToken = getRoomByToken;
exports.getRoomByUserId = getRoomByUserId;
