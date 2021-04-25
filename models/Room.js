const mongoose = require("mongoose");

const Mailbox = require("./Mailbox");

// TODO 추후 rotation, isPlaced 안쓰면 삭제
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
