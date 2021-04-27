const mongoose = require("mongoose");

const Mailbox = require("./Mailbox");

// TODO 추후 rotation 안쓰면 삭제
const roomSchema = new mongoose.Schema({
  items: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      position: {
        type: Array,
        required: true,
      },
      rotation: {
        type: Array,
        default: [0, 0, 0],
      },
    },
  ],
  mailboxId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mailbox",
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

roomSchema.pre(/^save/, async function (next) {
  if (!this.mailboxId) {
    const mailbox = await Mailbox.create({});
    this.mailboxId = mailbox._id;
  }

  next();
});

module.exports = mongoose.model("Room", roomSchema);
