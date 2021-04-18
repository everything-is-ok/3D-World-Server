const createError = require("http-errors");
const mongoose = require("mongoose");

const Room = require("../models/Room");

async function getRoomByToken(req, res, next) {
  if (!req.user) {
    next(createError(401, "authorization is invalid"));
    return;
  }

  const { roomId } = req.user;

  try {
    // NOTE: room === null인 case의 error handling이 필요한가?
    const room = await Room.findById(roomId).lean();

    res.json({ ok: true, data: room });
  } catch (err) {
    next(err);
  }
}

async function getRoomById(req, res, next) {
  const { id } = req.params;

  if (!(mongoose.Types.ObjectId.isValid(id))) {
    next(createError(400, "id of params is invalid"));
    return;
  }

  try {
    const room = await Room.findById(id).lean();

    if (!room) {
      next(createError(400, "id of params is invalid"));
      return;
    }

    res.json({ ok: true, data: room });
  } catch (err) {
    next(err);
  }
}

exports.getRoomByToken = getRoomByToken;
exports.getRoomById = getRoomById;
