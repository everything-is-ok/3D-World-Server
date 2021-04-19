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
    const mailboxData = await Room.findOne({ ownerId: _id }, "mailboxId")
      .populate("mailboxId");

    res.json({
      ok: true,
      data: mailboxData.mailboxId,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteMailList(req, res, next) {
  if (!req.user) {
    next(createError(401, "authorization is invalid"));
    return;
  }

  const { _id } = req.user;
  try {
    const mailboxData = await Room.findOne({ ownerId: _id }, "mailboxId");
    const { mailboxId } = mailboxData;

    const initializeMails = { $set: { mails: [] } };
    const deleteMailResult = await Mailbox.findByIdAndUpdate(
      mailboxId,
      initializeMails,
      { new: true },
    );

    if (!deleteMailResult) {
      next(createError(403, "bad request"));
      return;
    }

    res.json({
      ok: true,
      data: deleteMailResult,
    });
  } catch (err) {
    next(err);
  }
}

// async function readMail(req, res, next) {

// }

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
      next(createError(403, "bad request"));
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
exports.deleteMailList = deleteMailList;
// exports.readMail = readMail;
exports.postMail = postMail;
