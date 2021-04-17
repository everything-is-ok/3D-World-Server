const mongoose = require("mongoose");

// TODO: add schema

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
    required: [true, "mailBoxId is required."],
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

module.exports = mongoose.model("Room", roomSchema);
