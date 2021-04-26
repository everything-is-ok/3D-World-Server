const createError = require("http-errors");
const mongoose = require("mongoose");

const Mailbox = require("../models/Mailbox");
const Room = require("../models/Room");

async function getMailList(req, res, next) {
  if (!req.user) {
    next(createError(401, "Authorization is invalid"));
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

async function postMail(req, res, next) {
  const { _id: sender } = req.user;
  const { content } = req.body;
  const { id } = req.params;

  if (!(mongoose.Types.ObjectId.isValid(id))) {
    next(createError(404, "Not found"));
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

async function readMail(req, res, next) {
  const { mailId } = req.body;

  if (!(mongoose.Types.ObjectId.isValid(mailId))) {
    next(createError(400, "id of params is invalid"));
    return;
  }

  try {
    const mailbox = await Mailbox.findOneAndUpdate(
      { "mails._id": mailId },
      { $set: { "mails.$[elem].status": "READ" } },
      {
        arrayFilters: [{
          "elem._id": mongoose.Types.ObjectId(mailId),
        }],
        new: true,
      },
    );

    res.json({
      ok: true,
      data: mailbox,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteMail(req, res, next) {
  const { id } = req.params;

  if (!(mongoose.Types.ObjectId.isValid(id))) {
    next(createError(400, "id of params is invalid"));
    return;
  }

  try {
    const deleteResult = await Mailbox.updateOne(
      { "mails._id": id },
      { $pull: { mails: { _id: id } } },
    );

    if (!deleteResult.nModified) {
      next(createError(403, "bad request"));
    }

    res.json({
      ok: true,
      data: id,
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

exports.getMailList = getMailList;
exports.postMail = postMail;
exports.readMail = readMail;
exports.deleteMail = deleteMail;
exports.deleteMailList = deleteMailList;
