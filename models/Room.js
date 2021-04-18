const mongoose = require("mongoose");

const Mailbox = require("./Mailbox");

const roomSchema = new mongoose.Schema({
  items: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      position: {
        type: Array,
        default: [],
      },
      rotation: {
        type: Array,
        default: [],
      },
      isPlaced: {
        type: Boolean,
        default: false,
      },
    },
  ],
  mailBoxId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MailBox",
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "ownerId is required."],
  },
  ownerName: {
    type: String,
    required: [true, "ownerName is required."],
  },
}, {
  timestamps: true,
});

// eslint-disable-next-line prefer-arrow-callback
roomSchema.pre(/^save/, async function (next) {
  if (!this.mailBoxId) {
    const mailbox = await Mailbox.create({});
    this.mailBoxId = mailbox._id;
  }

  next();
});

module.exports = mongoose.model("Room", roomSchema);
