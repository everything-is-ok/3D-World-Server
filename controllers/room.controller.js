const createError = require("http-errors");

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

exports.getRoomByToken = getRoomByToken;
