const mongoose = require("mongoose");
const createError = require("http-errors");

const Mailbox = require("../models/Mailbox");
const Room = require("../models/Room");

async function getMailList(req, res, next) {
  if (!req.user) {
    next(createError(401, "authorization is invalid"));
    return;
  }

  const { _id } = req.user;

  try {
    const mailboxList = await Room.findOne({ ownerId: _id })
      .populate("mailboxId");

    res.json({
      ok: true,
      data: mailboxList,
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function postMail(req, res, next) {
  const { _id: sender } = req.user;
  const { content } = req.body;
  const { id } = req.params;

  if (!(mongoose.Types.ObjectId.isValid(id))) {
    next(createError(400, "id of params is invalid"));
    return;
  }

  try {
    const addEmail = { $push: { mails: { content, sender } } };
    const mailbox = await Mailbox.findByIdAndUpdate(id, addEmail, { new: true });

    if (!mailbox) {
      next(createError(401, "bad request"));
      return;
    }

    res.json({
      ok: true,
      data: mailbox,
    });
  } catch (err) {
    next(err);
  }
}

exports.getMailList = getMailList;
exports.postMail = postMail;
